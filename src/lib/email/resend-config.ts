export const RESEND_FROM_ADDRESS =
  "Boston Semiconductor Website <noreply@mail.bostonsemiconductor.com>";

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseRecipients(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);
}

export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://www.bostonsemiconductor.com"
  );
}
