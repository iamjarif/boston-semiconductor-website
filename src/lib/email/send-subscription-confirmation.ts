import { Resend } from "resend";

import { RESEND_FROM_ADDRESS } from "@/lib/email/resend-config";
import {
  buildSubscriptionConfirmationEmailHtml,
  buildSubscriptionConfirmationEmailText,
  SUBSCRIPTION_CONFIRMATION_SUBJECT,
} from "@/lib/email/subscription-confirmation-template";
import { buildUnsubscribeUrl } from "@/lib/newsletter/unsubscribe-token";

export async function sendSubscriptionConfirmationEmail(
  email: string,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error(
      "Subscription confirmation email skipped: RESEND_API_KEY is not configured.",
    );
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const unsubscribeUrl = buildUnsubscribeUrl(normalizedEmail);

  if (!unsubscribeUrl) {
    console.error(
      "Subscription confirmation email skipped: unsubscribe URL could not be generated.",
    );
    return;
  }

  const resend = new Resend(apiKey);
  const emailParams = { unsubscribeUrl };

  const { error } = await resend.emails.send({
    from: RESEND_FROM_ADDRESS,
    to: [normalizedEmail],
    subject: SUBSCRIPTION_CONFIRMATION_SUBJECT,
    html: buildSubscriptionConfirmationEmailHtml(emailParams),
    text: buildSubscriptionConfirmationEmailText(emailParams),
    headers: {
      "List-Unsubscribe": `<${unsubscribeUrl}>`,
    },
  });

  if (error) {
    console.error("Subscription confirmation email failed:", error);
  }
}
