import { NextResponse } from "next/server";

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}

export function methodNotAllowedResponse(): NextResponse {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}

export function rateLimitedResponse(retryAfterSeconds: number): NextResponse {
  return NextResponse.json(
    { error: "Too many requests. Please try again later." },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfterSeconds) },
    },
  );
}

export function isHoneypotTripped(value: string | undefined): boolean {
  return Boolean(value?.trim());
}
