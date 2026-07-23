import { NextResponse } from "next/server";
import { Resend } from "resend";

import { buildContactInquiryEmailHtml } from "@/lib/email/contact-inquiry-template";

interface ContactPayload {
  name?: string;
  email?: string;
  company?: string;
  projectDescription?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FROM_ADDRESS =
  "Boston Semiconductor Website <noreply@mail.bostonsemiconductor.com>";

function parseRecipients(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload;
    const name = body.name?.trim() ?? "";
    const email = body.email?.trim() ?? "";
    const company = body.company?.trim() ?? "";
    const projectDescription = body.projectDescription?.trim() ?? "";

    if (!name) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    if (!projectDescription) {
      return NextResponse.json(
        { error: "Project description is required." },
        { status: 400 },
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const recipients = parseRecipients(process.env.CONTACT_FORM_TO_EMAIL);

    if (!apiKey || recipients.length === 0) {
      return NextResponse.json(
        { error: "Email service is not configured." },
        { status: 500 },
      );
    }

    const subject = company
      ? `New Project Inquiry: ${company} — ${name}`
      : `New Project Inquiry from ${name}`;

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
