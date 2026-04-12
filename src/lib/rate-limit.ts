type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const globalStore = globalThis as typeof globalThis & {
  rateLimitStore?: Map<string, RateLimitEntry>;
};

const store = globalStore.rateLimitStore ?? new Map<string, RateLimitEntry>();

if (!globalStore.rateLimitStore) {
  globalStore.rateLimitStore = store;
}

function getClientIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for");

  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }

  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

export function checkRateLimit(
  req: Request,
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
) {
  const now = Date.now();
  const clientIp = getClientIp(req);
  const bucketKey = `${key}:${clientIp}`;
  const current = store.get(bucketKey);

  if (!current || current.resetAt <= now) {
    store.set(bucketKey, {
      count: 1,
      resetAt: now + windowMs,
    });

    return {
      success: true as const,
      remaining: limit - 1,
      resetAt: now + windowMs,
    };
  }

  if (current.count >= limit) {
    return {
      success: false as const,
      remaining: 0,
      resetAt: current.resetAt,
    };
  }

  current.count += 1;
  store.set(bucketKey, current);

  return {
    success: true as const,
    remaining: Math.max(limit - current.count, 0),
    resetAt: current.resetAt,
  };
}
