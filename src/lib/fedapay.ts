import crypto from "crypto";

const DEFAULT_TOLERANCE_SECONDS = 300;

type FedaPayRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
};

// À ajouter en haut de votre fichier
type FedaPayResponseWrapper<K extends string, T> = {
  [P in K]: T;
};

type FedaPayTransactionPayload = {
  description: string;
  amount: number;
  callback_url?: string;
  currency: {
    iso: string;
  };
  customer: {
    firstname: string;
    lastname: string;
    email: string;
    phone_number: {
      number: string;
      country: string;
    };
  };
  custom_metadata: Record<string, unknown>;
};

type FedaPayTransactionResponse = {
  id: number | string;
  status: string;
};

type FedaPayPaymentLinkResponse = {
  token: string;
  url: string;
};

function getFedaPayApiKey() {
  const apiKey = process.env.FEDA_API_SECRET_KEY || process.env.FEDAPAY_API_KEY;

  if (!apiKey) {
    throw new Error("FEDA_API_SECRET_KEY is not configured.");
  }

  return apiKey.trim();
}

function getFedaPayEnvironment() {
  const environment = (
    process.env.FEDA_ENVIRONMENT || process.env.FEDAPAY_ENV || "sandbox"
  )
    .trim()
    .toLowerCase();

  return environment === "live" ? "live" : "sandbox";
}

function getFedaPayBaseUrl() {
  return getFedaPayEnvironment() === "live"
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
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  // 1. On récupère le JSON une seule fois
  const data = await response.json();
  
  // 2. Debug (utile pour voir la structure "v1/transaction")
  console.log("DEBUG FEDAPAY RESPONSE:", JSON.stringify(data, null, 2));

  // 3. Gestion des erreurs
  if (!response.ok) {
    // Si ce n'est pas OK, on utilise les données déjà extraites pour le message d'erreur
    const errorMessage = data.message || JSON.stringify(data);

    if (response.status === 401) {
      throw new Error(
        `FedaPay authentication failed (${response.status}): Check keys/env. ${errorMessage}`
      );
    }

    throw new Error(
      `FedaPay API request failed (${response.status}): ${errorMessage}`
    );
  }

  // 4. On retourne les données
  return data as T;
}

export async function createFedaPayTransaction(payload: FedaPayTransactionPayload) {
  const data = await fedapayRequest<FedaPayResponseWrapper<"v1/transaction", FedaPayTransactionResponse>>("/transactions", {
    method: "POST",
    body: payload,
  });

  // Extraction de la transaction depuis la clé "v1/transaction"
  const transaction = data["v1/transaction"];

  // Maintenant transaction.id existera (ici ce serait 432454)
  if (!transaction || !transaction.id) {
    throw new Error(
      `FedaPay did not return a valid transaction id: ${JSON.stringify(data)}`
    );
  }

  return transaction as FedaPayTransactionResponse;
}
export async function createFedaPayPaymentLink(transactionId: string | number) {
  return fedapayRequest<FedaPayPaymentLinkResponse>(
    `/transactions/${transactionId}/token`,
    {
      method: "POST",
    }
  );
}

export function buildConfirmationUrl() {
  const appUrl = process.env.APP_URL;

  if (!appUrl) {
    return undefined;
  }

  return new URL("/confirmation", appUrl).toString();
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
  const webhookSecret = process.env.FEDAPAY_WEBHOOK_SECRET;

  if (!webhookSecret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("FEDAPAY_WEBHOOK_SECRET is required in production.");
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
