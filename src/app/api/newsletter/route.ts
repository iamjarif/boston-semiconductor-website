import { NextResponse } from "next/server";
import { Resend } from "resend";

import {
  enforceFormRateLimit,
  honeypotAcceptedResponse,
  isHoneypotTripped,
} from "@/lib/security/api-route";
import { methodNotAllowedResponse } from "@/lib/security/request";
import { newsletterFormSchema } from "@/lib/security/validation";

function isExistingContactError(message: string | undefined): boolean {
  if (!message) return false;
  const normalized = message.toLowerCase();
  return normalized.includes("already") || normalized.includes("exist");
}

export async function GET() {
  return methodNotAllowedResponse();
}

export async function POST(request: Request) {
  const rateLimitResponse = enforceFormRateLimit(request, "newsletter");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body: unknown = await request.json();
    const parsed = newsletterFormSchema.safeParse(body);

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]?.message ?? "Invalid request.";
      return NextResponse.json({ error: firstIssue }, { status: 400 });
    }

    const { email, website } = parsed.data;

    if (isHoneypotTripped(website)) {
      return honeypotAcceptedResponse();
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
