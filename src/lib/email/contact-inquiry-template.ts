export interface ContactInquiryEmailParams {
  name: string;
  email: string;
  company?: string;
  projectDescription: string;
  submittedAt: Date;
}

const SIGNAL_GREEN = "#00E67A";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatSubmittedAt(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

function renderField(label: string, value: string): string {
  return `
    <tr>
      <td style="padding: 0 0 16px 0;">
        <p style="margin: 0 0 4px 0; font-family: 'Inter', Arial, Helvetica, sans-serif; font-size: 12px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: #6b6b6b;">
          ${escapeHtml(label)}
        </p>
        <p style="margin: 0; font-family: 'Inter', Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.5; color: #0a0a0a;">
          ${escapeHtml(value)}
        </p>
      </td>
    </tr>
  `;
}

export function buildContactInquiryEmailHtml(
  params: ContactInquiryEmailParams,
): string {
  const name = params.name.trim();
  const email = params.email.trim();
  const company = params.company?.trim() || "—";
  const projectDescription = params.projectDescription.trim();
  const timestamp = formatSubmittedAt(params.submittedAt);

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
      .email-label { color: #a3a3a3 !important; }
      .email-value { color: #f7f8f8 !important; }
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
              <h1 class="email-heading" style="margin: 0; font-family: 'Space Grotesk', Arial, Helvetica, sans-serif; font-size: 24px; font-weight: 700; line-height: 1.3; color: #0a0a0a;">
                New Project Inquiry
              </h1>
              <p style="margin: 8px 0 0 0; font-family: 'Inter', Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.5; color: #6b6b6b;">
                A visitor submitted the contact form on bostonsemiconductor.com
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 32px 8px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${renderField("Name", name)}
                ${renderField("Email", email)}
                ${renderField("Company", company)}
                ${renderField("Project Description", projectDescription)}
              </table>
            </td>
          </tr>
          <tr>
            <td class="email-footer" style="padding: 16px 32px 32px 32px; border-top: 1px solid #e5e5e5; font-family: 'Inter', Arial, Helvetica, sans-serif; font-size: 12px; line-height: 1.5; color: #6b6b6b;">
              Submitted on ${escapeHtml(timestamp)}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
