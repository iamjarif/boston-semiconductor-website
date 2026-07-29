import { createHash } from "node:crypto";

import { getSanityWriteClient } from "@/lib/sanity/write-client";

/** GROQ used by the Sanity webhook to decide whether to send blog notifications. */
export const activeSubscribersQuery = `
  *[_type == "newsletterSubscriber" && !defined(unsubscribedAt)] {
    email
  }
`;

export function getSubscriberDocumentId(email: string): string {
  const normalized = email.trim().toLowerCase();
  const hash = createHash("sha256").update(normalized).digest("hex").slice(0, 24);
  return `newsletterSubscriber.${hash}`;
}

export async function subscribeNewsletterSubscriber(
  email: string,
): Promise<{ ok: true } | { ok: false; reason: "not_configured" | "write_failed" }> {
  const writeClient = getSanityWriteClient();
  if (!writeClient) {
    return { ok: false, reason: "not_configured" };
  }

  const normalized = email.trim().toLowerCase();
  const now = new Date().toISOString();

  try {
    await writeClient.createOrReplace({
      _type: "newsletterSubscriber",
      _id: getSubscriberDocumentId(normalized),
      email: normalized,
      subscribedAt: now,
      unsubscribedAt: null,
    });
    return { ok: true };
  } catch (error) {
    console.error("Failed to store newsletter subscriber:", error);
    return { ok: false, reason: "write_failed" };
  }
}

export async function fetchActiveNewsletterSubscribers(): Promise<
  Array<{ email?: string }>
> {
  // Subscriber documents are not publicly readable; use the authenticated write client.
  const client = getSanityWriteClient();
  if (!client) return [];

  return client.fetch<Array<{ email?: string }>>(activeSubscribersQuery);
}

export async function listActiveNewsletterSubscriberEmails(): Promise<string[]> {
  const rows = await fetchActiveNewsletterSubscribers();
  return rows
    .map((row) => row.email?.trim().toLowerCase())
    .filter((email): email is string => Boolean(email));
}

export async function unsubscribeNewsletterSubscriber(
  email: string,
): Promise<boolean> {
  const writeClient = getSanityWriteClient();
  if (!writeClient) return false;

  const normalized = email.trim().toLowerCase();

  try {
    await writeClient
      .patch(getSubscriberDocumentId(normalized))
      .set({ unsubscribedAt: new Date().toISOString() })
      .commit({ visibility: "async" });
    return true;
  } catch (error) {
    console.error("Failed to unsubscribe newsletter subscriber:", error);
    return false;
  }
}
