import { NextResponse } from "next/server";
import { Resend } from "resend";

import { EMAIL_REGEX } from "@/lib/email/resend-config";

interface NewsletterPayload {
  email?: string;
}

function isExistingContactError(message: string | undefined): boolean {
  if (!message) return false;
  const normalized = message.toLowerCase();
  return normalized.includes("already") || normalized.includes("exist");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as NewsletterPayload;
    const email = body.email?.trim() ?? "";

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const segmentId = process.env.RESEND_SEGMENT_ID;

    if (!apiKey || !segmentId) {
      return NextResponse.json(
        { error: "Email service is not configured." },
        { status: 500 },
      );
    }

    const resend = new Resend(apiKey);

    const { error: contactError } = await resend.contacts.create({
      email,
      unsubscribed: false,
      segments: [{ id: segmentId }],
    });

    if (contactError && !isExistingContactError(contactError.message)) {
      console.error("Resend contact error:", contactError);
      return NextResponse.json(
        { error: "Failed to subscribe. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
