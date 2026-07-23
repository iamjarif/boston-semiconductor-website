import { NextResponse } from "next/server";
import { Resend } from "resend";

import {
  enforceFormRateLimit,
  honeypotAcceptedResponse,
  isHoneypotTripped,
} from "@/lib/security/api-route";
import { methodNotAllowedResponse } from "@/lib/security/request";
import {
  contactFormSchema,
  sanitizeEmailHeader,
} from "@/lib/security/validation";
import { buildContactInquiryEmailHtml } from "@/lib/email/contact-inquiry-template";

const FROM_ADDRESS =
  "Boston Semiconductor Website <noreply@mail.bostonsemiconductor.com>";

function parseRecipients(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);
}

export async function GET() {
  return methodNotAllowedResponse();
}

export async function POST(request: Request) {
  const rateLimitResponse = enforceFormRateLimit(request, "contact");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body: unknown = await request.json();
    const parsed = contactFormSchema.safeParse(body);

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]?.message ?? "Invalid request.";
      return NextResponse.json({ error: firstIssue }, { status: 400 });
    }

    const { name, email, company, projectDescription, website } = parsed.data;

    if (isHoneypotTripped(website)) {
      return honeypotAcceptedResponse();
    }

    const apiKey = process.env.RESEND_API_KEY;
    const recipients = parseRecipients(process.env.CONTACT_FORM_TO_EMAIL);

    if (!apiKey || recipients.length === 0) {
      return NextResponse.json(
        { error: "Email service is not configured." },
        { status: 500 },
      );
    }

    const safeName = sanitizeEmailHeader(name);
    const safeCompany = company ? sanitizeEmailHeader(company) : undefined;

    const subject = safeCompany
      ? `New Project Inquiry: ${safeCompany} — ${safeName}`
      : `New Project Inquiry from ${safeName}`;

    const submittedAt = new Date();
    const html = buildContactInquiryEmailHtml({
      name,
      email,
      company: company || undefined,
      projectDescription,
      submittedAt,
    });

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: recipients,
      replyTo: email,
      subject,
      html,
      text: [
        "New Project Inquiry",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Company: ${company || "—"}`,
        "",
        "Project Description:",
        projectDescription,
        "",
        `Submitted on ${submittedAt.toISOString()}`,
      ].join("\n"),
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send message." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
