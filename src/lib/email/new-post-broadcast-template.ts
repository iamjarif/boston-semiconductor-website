export interface NewPostBroadcastEmailParams {
  title: string;
  excerpt: string;
  postUrl: string;
}

const SIGNAL_GREEN = "#18cb96";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function buildNewPostBroadcastEmailHtml(
  params: NewPostBroadcastEmailParams,
): string {
  const title = escapeHtml(params.title.trim());
  const excerpt = escapeHtml(params.excerpt.trim());
  const postUrl = escapeHtml(params.postUrl.trim());

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
  <style>
    @media (prefers-color-scheme: dark) {
      .email-body { background-color: #0a0a0a !important; }
      .email-card { background-color: #151515 !important; border-color: #2a2a2a !important; }
      .email-heading { color: #ffffff !important; }
      .email-excerpt { color: #a3a3a3 !important; }
      .email-footer { color: #6b6b6b !important; border-color: #2a2a2a !important; }
    }
  </style>
</head>
<body class="email-body" style="margin: 0; padding: 24px 16px; background-color: #f7f8f8; font-family: 'Inter', Arial, Helvetica, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; margin: 0 auto;">
    <tr>
      <td>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="email-card" style="background-color: #ffffff; border: 1px solid #e5e5e5; border-top: 4px solid ${SIGNAL_GREEN}; border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="padding: 32px 32px 8px 32px;">
              <p style="margin: 0 0 8px 0; font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 12px; line-height: 1.4; color: ${SIGNAL_GREEN};">
                // New Article
              </p>
              <h1 class="email-heading" style="margin: 0; font-family: 'Space Grotesk', Arial, Helvetica, sans-serif; font-size: 28px; font-weight: 700; line-height: 1.25; color: #0a0a0a;">
                ${title}
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 16px 32px 8px 32px;">
              <p class="email-excerpt" style="margin: 0; font-family: 'Inter', Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #6b6b6b;">
                ${excerpt}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 32px 8px 32px;">
              <a href="${postUrl}" style="display: inline-block; border-radius: 8px; background: linear-gradient(180deg, ${SIGNAL_GREEN} 0%, #0e8462 100%); color: #0a0a0a; font-family: 'Inter', Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 600; line-height: 1; padding: 14px 20px; text-decoration: none;">
                Read article
              </a>
            </td>
          </tr>
          <tr>
            <td class="email-footer" style="padding: 24px 32px 32px 32px; border-top: 1px solid #e5e5e5; font-family: 'Inter', Arial, Helvetica, sans-serif; font-size: 12px; line-height: 1.5; color: #6b6b6b;">
              You received this because you subscribed to Boston Semiconductor blog updates.
              <br /><br />
              <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color: #6b6b6b;">Unsubscribe</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
