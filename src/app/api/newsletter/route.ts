import { NextResponse } from "next/server";

import {
  enforceFormRateLimit,
  honeypotAcceptedResponse,
  isHoneypotTripped,
} from "@/lib/security/api-route";
import { methodNotAllowedResponse } from "@/lib/security/request";
import { newsletterFormSchema } from "@/lib/security/validation";
import { subscribeNewsletterSubscriber } from "@/lib/newsletter/subscribers";

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

    // Store the subscriber in Sanity only. No admin notification email is sent.
    const result = await subscribeNewsletterSubscriber(email);

    if (!result.ok) {
      if (result.reason === "not_configured") {
        return NextResponse.json(
          { error: "Newsletter service is not configured." },
          { status: 500 },
        );
      }

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
