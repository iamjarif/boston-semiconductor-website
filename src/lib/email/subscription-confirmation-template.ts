import { buildBrandedEmailHtml } from "@/lib/email/email-shared";
import { getSiteUrl } from "@/lib/email/resend-config";

export interface SubscriptionConfirmationEmailParams {
  unsubscribeUrl: string;
}

export function buildSubscriptionConfirmationEmailHtml(
  params: SubscriptionConfirmationEmailParams,
): string {
  const blogUrl = `${getSiteUrl()}/blog`;

  return buildBrandedEmailHtml({
    eyebrow: "// Newsletter",
    heading: "You're on the list",
    bodyHtml: `<p style="margin: 0 0 16px 0;">Thanks for subscribing to Boston Semiconductor updates.</p>
<p style="margin: 0;">We'll email you when we publish new engineering insights, tapeout updates, and technical articles from our team.</p>`,
    cta: {
      label: "Browse the blog",
      href: blogUrl,
    },
    footerNote:
      "You received this because you subscribed to Boston Semiconductor blog updates.",
    unsubscribeUrl: params.unsubscribeUrl,
  });
}

export function buildSubscriptionConfirmationEmailText(
  params: SubscriptionConfirmationEmailParams,
): string {
  const blogUrl = `${getSiteUrl()}/blog`;

  return [
    "You're subscribed to Boston Semiconductor updates",
    "",
    "Thanks for subscribing. We'll email you when we publish new engineering insights, tapeout updates, and technical articles from our team.",
    "",
    `Browse the blog: ${blogUrl}`,
    "",
    `Unsubscribe: ${params.unsubscribeUrl}`,
  ].join("\n");
}

export const SUBSCRIPTION_CONFIRMATION_SUBJECT =
  "You're subscribed to Boston Semiconductor updates";
