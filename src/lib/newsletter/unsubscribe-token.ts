import { createHmac, timingSafeEqual } from "node:crypto";

import { getSiteUrl } from "@/lib/email/resend-config";

function getUnsubscribeSecret(): string | undefined {
  return process.env.NEWSLETTER_UNSUBSCRIBE_SECRET ?? process.env.SANITY_WEBHOOK_SECRET;
}

export function createUnsubscribeToken(email: string): string | null {
  const secret = getUnsubscribeSecret();
  if (!secret) return null;

  return createHmac("sha256", secret)
    .update(email.trim().toLowerCase())
    .digest("base64url");
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  const expected = createUnsubscribeToken(email);
  if (!expected) return false;

  try {
    const expectedBuffer = Buffer.from(expected);
    const tokenBuffer = Buffer.from(token);
    if (expectedBuffer.length !== tokenBuffer.length) return false;
    return timingSafeEqual(expectedBuffer, tokenBuffer);
  } catch {
    return false;
  }
}

export function buildUnsubscribeUrl(email: string): string | null {
  const token = createUnsubscribeToken(email);
  if (!token) return null;

  const params = new URLSearchParams({
    email: email.trim().toLowerCase(),
    token,
  });

  return `${getSiteUrl()}/api/newsletter/unsubscribe?${params.toString()}`;
}
