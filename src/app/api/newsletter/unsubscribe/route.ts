import { NextResponse, type NextRequest } from "next/server";

import { methodNotAllowedResponse } from "@/lib/security/request";
import { unsubscribeNewsletterSubscriber } from "@/lib/newsletter/subscribers";
import { verifyUnsubscribeToken } from "@/lib/newsletter/unsubscribe-token";

function renderUnsubscribePage(message: string): Response {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Newsletter unsubscribe</title>
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      background: #f7f8f8;
      color: #0a0a0a;
      font-family: Inter, Arial, Helvetica, sans-serif;
    }
    main {
      max-width: 28rem;
      padding: 2rem;
      background: #ffffff;
      border: 1px solid #e5e5e5;
      border-radius: 0.5rem;
      text-align: center;
    }
    p { margin: 0; line-height: 1.6; }
  </style>
</head>
<body>
  <main>
    <p>${message}</p>
  </main>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export async function POST() {
  return methodNotAllowedResponse();
}

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email")?.trim().toLowerCase();
  const token = request.nextUrl.searchParams.get("token")?.trim();

  if (!email || !token || !verifyUnsubscribeToken(email, token)) {
    return renderUnsubscribePage(
      "This unsubscribe link is invalid or has expired.",
    );
  }

  const unsubscribed = await unsubscribeNewsletterSubscriber(email);

  if (!unsubscribed) {
    return renderUnsubscribePage(
      "We could not update your subscription right now. Please try again later.",
    );
  }

  return renderUnsubscribePage(
    "You have been unsubscribed from Boston Semiconductor blog updates.",
  );
}
