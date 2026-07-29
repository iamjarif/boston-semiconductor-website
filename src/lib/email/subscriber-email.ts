import { EMAIL_REGEX } from "@/lib/email/resend-config";

/** Domains Resend rejects for production sends (RFC 2606 / test domains). */
const BLOCKED_BROADCAST_DOMAINS = new Set([
  "example.com",
  "example.org",
  "example.net",
  "test.com",
  "invalid",
  "localhost",
]);

export interface SkippedBroadcastRecipient {
  email: string;
  reason: string;
}

export function getBroadcastSkipReason(email: string): string | null {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return "empty email";
  if (!EMAIL_REGEX.test(normalized)) return "invalid email format";

  const domain = normalized.split("@")[1];
  if (!domain) return "missing domain";
  if (BLOCKED_BROADCAST_DOMAINS.has(domain)) {
    return `blocked domain (${domain})`;
  }

  return null;
}

export function filterBroadcastRecipientEmails(emails: string[]): {
  deliverable: string[];
  skipped: SkippedBroadcastRecipient[];
} {
  const deliverable: string[] = [];
  const skipped: SkippedBroadcastRecipient[] = [];
  const seen = new Set<string>();

  for (const raw of emails) {
    const normalized = raw.trim().toLowerCase();
    const skipReason = getBroadcastSkipReason(normalized);
    if (skipReason) {
      skipped.push({ email: raw, reason: skipReason });
      continue;
    }
    if (seen.has(normalized)) {
      skipped.push({ email: raw, reason: "duplicate" });
      continue;
    }
    seen.add(normalized);
    deliverable.push(normalized);
  }

  return { deliverable, skipped };
}
