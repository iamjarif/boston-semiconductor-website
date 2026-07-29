import { buildBrandedEmailHtml, escapeHtml } from "@/lib/email/email-shared";

export interface NewPostBroadcastEmailParams {
  title: string;
  excerpt: string;
  postUrl: string;
  unsubscribeUrl: string;
}

export function buildNewPostBroadcastEmailHtml(
  params: NewPostBroadcastEmailParams,
): string {
  return buildBrandedEmailHtml({
    eyebrow: "// New Article",
    heading: params.title.trim(),
    bodyHtml: `<p style="margin: 0;">${escapeHtml(params.excerpt.trim())}</p>`,
    cta: {
      label: "Read article",
      href: params.postUrl.trim(),
    },
    footerNote:
      "You received this because you subscribed to Boston Semiconductor blog updates.",
    unsubscribeUrl: params.unsubscribeUrl,
  });
}
