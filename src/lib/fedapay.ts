import crypto from "crypto";

const DEFAULT_TOLERANCE_SECONDS = 300;
const DEFAULT_CURRENCY_ISO = "XOF";

type JsonRecord = Record<string, unknown>;

type FedaPayRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
};

export type FedaPayTransactionPayload = {
  description: string;
  amount: number;
  callback_url?: string;
  currency: {
    iso: string;
  };
  customer: {
    id?: string | number;
    firstname?: string;
    lastname?: string;
    email?: string;
    phone_number?: {
      number: string;
      country: string;
    };
  };
  custom_metadata?: Record<string, unknown>;
};

export type NormalizedFedaPayTransaction = {
  id: string;
  status: string;
  amount?: number;
  currencyIso?: string;
  raw: unknown;
};

export type FedaPayPaymentLink = {
  token?: string;
  url: string;
  raw: unknown;
};

export class FedaPayApiError extends Error {
  status: number;
  body: string;

  constructor(status: number, body: string) {
    super(`FedaPay API request failed (${status}): ${body}`);
    this.name = "FedaPayApiError";
    this.status = status;
    this.body = body;
  }
}

function getFedaPayApiKey() {
  const apiKey =
    process.env.FEDA_API_SECRET_KEY?.trim() ||
    process.env.FEDA_SECRET_KEY?.trim() ||
    process.env.FEDAPAY_API_KEY?.trim() ||
    process.env.FEDAPAY_SECRET_KEY?.trim() ||
    process.env.FEDAPAY_PRIVATE_KEY?.trim();

  if (!apiKey) {
    throw new Error(
      "FedaPay secret key is not configured. Use FEDA_API_SECRET_KEY or one of the legacy FEDAPAY_* variables."
    );
  }

  return apiKey;
}

function getFedaPayEnv() {
  const value =
    process.env.FEDA_ENVIRONMENT?.trim().toLowerCase() ||
    process.env.FEDAPAY_ENV?.trim().toLowerCase();

  if (!value || value === "sandbox" || value === "test") {
    return "sandbox";
  }

  if (value === "live" || value === "prod" || value === "production") {
    return "live";
  }

  return "sandbox";
}

export function getFedaPayCurrencyIso() {
  const value =
    process.env.FEDA_CURRENCY_ISO?.trim() ||
    process.env.FEDAPAY_CURRENCY_ISO?.trim();

  if (!value) {
    return DEFAULT_CURRENCY_ISO;
  }

  return value.toUpperCase();
}

function getFedaPayBaseUrl() {
  return getFedaPayEnv() === "live"
    ? "https://api.fedapay.com/v1"
    : "https://sandbox-api.fedapay.com/v1";
}

async function fedapayRequest<T>(
  path: string,
  options: FedaPayRequestOptions = {}
) {
  const response = await fetch(`${getFedaPayBaseUrl()}${path}`, {
    method: options.method ?? "GET",
    headers: {
      Authorization: `Bearer ${getFedaPayApiKey()}`,
      "Content-Type": "application/json",
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new FedaPayApiError(response.status, errorText);
  }

  return (await response.json()) as T;
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function findRecordWithKeys(
  payload: unknown,
  keys: string[]
): JsonRecord | null {
  const queue: unknown[] = [payload];
  const seen = new Set<JsonRecord>();

  while (queue.length > 0) {
    const current = queue.shift();

    if (!isRecord(current) || seen.has(current)) {
      continue;
    }

    seen.add(current);

    if (keys.every((key) => key in current)) {
      return current;
    }

    for (const value of Object.values(current)) {
      if (isRecord(value)) {
        queue.push(value);
      }

      if (Array.isArray(value)) {
        queue.push(...value);
      }
    }
  }

  return null;
}

function getStringField(record: JsonRecord, field: string) {
  const value = record[field];

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  return undefined;
}

function getNumberField(record: JsonRecord, field: string) {
  const value = record[field];
  return typeof value === "number" ? value : undefined;
}

function getCurrencyIso(value: unknown) {
  if (typeof value === "string") {
    return value.toUpperCase();
  }

  if (!isRecord(value)) {
    return undefined;
  }

  const iso = getStringField(value, "iso");
  return iso?.toUpperCase();
}

function normalizeTransactionResponse(
  payload: unknown,
  fallbackId?: string | number
): NormalizedFedaPayTransaction {
  const record =
    findRecordWithKeys(payload, ["id", "status"]) ??
    findRecordWithKeys(payload, ["id"]);

  if (!record) {
    throw new Error("Unexpected FedaPay transaction response format.");
  }

  const id = getStringField(record, "id") ?? String(fallbackId ?? "");

  if (!id) {
    throw new Error("Missing transaction ID in FedaPay response.");
  }

  return {
    id,
    status: getStringField(record, "status")?.toLowerCase() ?? "unknown",
    amount: getNumberField(record, "amount"),
    currencyIso: getCurrencyIso(record.currency),
    raw: payload,
  };
}

function normalizePaymentLinkResponse(payload: unknown): FedaPayPaymentLink {
  const record =
    findRecordWithKeys(payload, ["url", "token"]) ??
    findRecordWithKeys(payload, ["url"]);

  const url = record ? getStringField(record, "url") : undefined;

  if (!url) {
    throw new Error("Unexpected FedaPay payment link response format.");
  }

  return {
    token: record ? getStringField(record, "token") : undefined,
    url,
    raw: payload,
  };
}

export async function createFedaPayTransaction(
  payload: FedaPayTransactionPayload
) {
  const response = await fedapayRequest<unknown>("/transactions", {
    method: "POST",
    body: payload,
  });

  return normalizeTransactionResponse(response);
}

export async function createFedaPayPaymentLink(transactionId: string | number) {
  const response = await fedapayRequest<unknown>(
    `/transactions/${transactionId}/token`,
    {
      method: "POST",
    }
  );

  return normalizePaymentLinkResponse(response);
}

export async function getFedaPayTransaction(transactionId: string | number) {
  const response = await fedapayRequest<unknown>(`/transactions/${transactionId}`);
  return normalizeTransactionResponse(response, transactionId);
}

function withProtocol(value: string) {
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function getBaseUrl(value?: string) {
  if (!value) {
    return undefined;
  }

  try {
    const url = new URL(withProtocol(value.trim()));
    return url.origin;
  } catch {
    return undefined;
  }
}

function isLocalhostUrl(value: string) {
  const hostname = new URL(value).hostname;
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

export function buildConfirmationUrl(requestUrl?: string) {
  const candidates = [
    process.env.APP_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    requestUrl,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ];

  const baseUrl = candidates
    .map(getBaseUrl)
    .find((candidate) => {
      if (!candidate) {
        return false;
      }

      return process.env.NODE_ENV !== "production" || !isLocalhostUrl(candidate);
    });

  if (!baseUrl) {
    return undefined;
  }

  return new URL("/confirmation", baseUrl).toString();
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function computeWebhookSignature(payload: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(payload, "utf8").digest("hex");
}

function parseWebhookSignature(signature: string) {
  return signature.split(",").reduce(
    (accumulator, part) => {
      const [key, value] = part.split("=");

      if (key === "t") {
        accumulator.timestamp = Number(value);
      }

      if (key === "s" && value) {
        accumulator.signatures.push(value);
      }

      return accumulator;
    },
    {
      timestamp: -1,
      signatures: [] as string[],
    }
  );
}

export function verifyWebhookPayload(rawBody: string, signature: string | null) {
  const webhookSecret =
    process.env.FEDA_WEBHOOK_SECRET || process.env.FEDAPAY_WEBHOOK_SECRET;

  if (!webhookSecret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "FEDA_WEBHOOK_SECRET or FEDAPAY_WEBHOOK_SECRET is required in production."
      );
    }

    if (!signature) {
      throw new Error("Missing FedaPay webhook signature header.");
    }

    return JSON.parse(rawBody);
  }

  if (!signature) {
    throw new Error("Missing FedaPay webhook signature header.");
  }

  const parsedHeader = parseWebhookSignature(signature);

  if (parsedHeader.timestamp === -1 || parsedHeader.signatures.length === 0) {
    throw new Error("Invalid FedaPay signature header.");
  }

  const signedPayload = `${parsedHeader.timestamp}.${rawBody}`;
  const expectedSignature = computeWebhookSignature(signedPayload, webhookSecret);
  const nowInSeconds = Math.floor(Date.now() / 1000);

  if (nowInSeconds - parsedHeader.timestamp > DEFAULT_TOLERANCE_SECONDS) {
    throw new Error("Expired FedaPay webhook signature.");
  }

  const isValid = parsedHeader.signatures.some((candidate) =>
    safeEqual(candidate, expectedSignature)
  );

  if (!isValid) {
    throw new Error("Invalid FedaPay webhook signature.");
  }

  return JSON.parse(rawBody);
}
