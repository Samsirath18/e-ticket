import crypto from "crypto";

function getRequestToken(req: Request) {
  const authorization = req.headers.get("authorization");

  if (authorization?.startsWith("Bearer ")) {
    return authorization.slice("Bearer ".length).trim();
  }

  return req.headers.get("x-api-token")?.trim() ?? null;
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export function isAuthorizedRequest(
  req: Request,
  envNames: string[],
  { allowWithoutTokenInDev = false }: { allowWithoutTokenInDev?: boolean } = {}
) {
  const expectedToken = envNames
    .map((envName) => process.env[envName]?.trim())
    .find(Boolean);

  if (!expectedToken) {
    return allowWithoutTokenInDev && process.env.NODE_ENV !== "production";
  }

  const requestToken = getRequestToken(req);

  if (!requestToken) {
    return false;
  }

  return safeEqual(requestToken, expectedToken);
}
