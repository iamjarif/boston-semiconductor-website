import { NextResponse } from "next/server";

import { checkRateLimit } from "@/lib/security/rate-limit";
import {
  getClientIp,
  isHoneypotTripped,
  methodNotAllowedResponse,
  rateLimitedResponse,
} from "@/lib/security/request";

const FORM_RATE_LIMIT = 5;
const FORM_RATE_WINDOW_MS = 15 * 60 * 1000;

export function rejectNonPostMethods(method: string): NextResponse | null {
  if (method !== "POST") {
    return methodNotAllowedResponse();
  }
  return null;
}

export function enforceFormRateLimit(
  request: Request,
  scope: "contact" | "newsletter",
): NextResponse | null {
  const ip = getClientIp(request);
  const result = checkRateLimit(
    `${scope}:${ip}`,
    FORM_RATE_LIMIT,
    FORM_RATE_WINDOW_MS,
  );

  if (!result.ok) {
    return rateLimitedResponse(result.retryAfterSeconds ?? 60);
  }

  return null;
}

export function honeypotAcceptedResponse(): NextResponse {
  return NextResponse.json({ ok: true });
}

export { isHoneypotTripped };
