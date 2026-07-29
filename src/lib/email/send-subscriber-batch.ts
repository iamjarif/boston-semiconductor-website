import { Resend } from "resend";

import { buildNewPostBroadcastEmailHtml } from "@/lib/email/new-post-broadcast-template";
import { RESEND_FROM_ADDRESS } from "@/lib/email/resend-config";
import { buildUnsubscribeUrl } from "@/lib/newsletter/unsubscribe-token";

const BATCH_SIZE = 100;

export interface SubscriberBroadcastParams {
  title: string;
  excerpt: string;
  postUrl: string;
  subscriberEmails: string[];
  idempotencyPrefix: string;
}

export async function sendSubscriberBroadcast(
  resend: Resend,
  params: SubscriberBroadcastParams,
): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { title, excerpt, postUrl, subscriberEmails, idempotencyPrefix } = params;
  const subject = `New article: ${title}`;

  for (let index = 0; index < subscriberEmails.length; index += BATCH_SIZE) {
    const chunk = subscriberEmails.slice(index, index + BATCH_SIZE);
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
      return { ok: false, error };
    }
  }

  return { ok: true };
}
