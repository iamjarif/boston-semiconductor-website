import { Resend } from "resend";

import { buildNewPostBroadcastEmailHtml } from "@/lib/email/new-post-broadcast-template";
import { RESEND_FROM_ADDRESS } from "@/lib/email/resend-config";
import { filterBroadcastRecipientEmails } from "@/lib/email/subscriber-email";
import { buildUnsubscribeUrl } from "@/lib/newsletter/unsubscribe-token";

const BATCH_SIZE = 100;

export interface SubscriberBroadcastParams {
  title: string;
  excerpt: string;
  postUrl: string;
  subscriberEmails: string[];
  idempotencyPrefix: string;
}

export interface SubscriberBroadcastResult {
  sentCount: number;
  skippedRecipients: Array<{ email: string; reason: string }>;
}

export async function sendSubscriberBroadcast(
  resend: Resend,
  params: SubscriberBroadcastParams,
): Promise<
  | ({ ok: true } & SubscriberBroadcastResult)
  | ({ ok: false; error: unknown } & Partial<SubscriberBroadcastResult>)
> {
  const { title, excerpt, postUrl, subscriberEmails, idempotencyPrefix } = params;
  const subject = `New article: ${title}`;

  const { deliverable, skipped } = filterBroadcastRecipientEmails(subscriberEmails);

  if (skipped.length > 0) {
    console.warn("[subscriber-broadcast] skipped non-deliverable recipients", {
      skippedCount: skipped.length,
      skipped,
    });
  }

  if (deliverable.length === 0) {
    return {
      ok: false,
      error: {
        name: "no_deliverable_recipients",
        message: "No deliverable subscriber emails after validation.",
      },
      sentCount: 0,
      skippedRecipients: skipped,
    };
  }

  for (let index = 0; index < deliverable.length; index += BATCH_SIZE) {
    const chunk = deliverable.slice(index, index + BATCH_SIZE);
    const batchPayload = chunk.map((email) => {
      const unsubscribeUrl = buildUnsubscribeUrl(email) ?? `${postUrl}#newsletter`;
      const html = buildNewPostBroadcastEmailHtml({
        title,
        excerpt,
        postUrl,
        unsubscribeUrl,
      });

      return {
        from: RESEND_FROM_ADDRESS,
        to: [email],
        subject,
        html,
        text: `${title}\n\n${excerpt}\n\nRead article: ${postUrl}\n\nUnsubscribe: ${unsubscribeUrl}`,
        headers: {
          "List-Unsubscribe": `<${unsubscribeUrl}>`,
        },
      };
    });

    const { error } = await resend.batch.send(batchPayload, {
      idempotencyKey: `${idempotencyPrefix}/chunk-${index / BATCH_SIZE}`,
    });
    if (error) {
      return { ok: false, error, sentCount: 0, skippedRecipients: skipped };
    }
  }

  return { ok: true, sentCount: deliverable.length, skippedRecipients: skipped };
}
