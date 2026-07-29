import { NextResponse, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { Resend } from "resend";

import { sendSubscriberBroadcast } from "@/lib/email/send-subscriber-batch";
import { getSiteUrl } from "@/lib/email/resend-config";
import {
  activeSubscribersQuery,
  fetchActiveNewsletterSubscribers,
} from "@/lib/newsletter/subscribers";
import { revalidateBlogContent } from "@/lib/sanity/revalidate-blog";
import { methodNotAllowedResponse } from "@/lib/security/request";
import { getSanityWriteClient } from "@/lib/sanity/write-client";

interface SanityPostDocument {
  _type?: string;
  _id?: string;
  title?: string;
  slug?: string | { current?: string };
  excerpt?: string;
  notificationSentAt?: string;
}

interface SanityWebhookPayload extends SanityPostDocument {
  result?: SanityPostDocument;
}

function resolveSlug(
  slug: SanityPostDocument["slug"],
): string | undefined {
  if (typeof slug === "string") return slug;
  return slug?.current;
}

function extractPostDocument(
  body: SanityWebhookPayload,
): SanityPostDocument | null {
  const doc = body.result ?? body;
  if (doc._type !== "post" || !doc._id) return null;
  if (doc._id.startsWith("drafts.")) return null;
  return doc;
}

export async function GET() {
  return methodNotAllowedResponse();
}

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.SANITY_WEBHOOK_SECRET;
    if (!secret) {
      console.error("SANITY_WEBHOOK_SECRET is not configured.");
      return NextResponse.json(
        { error: "Service unavailable." },
        { status: 503 },
      );
    }

    const { isValidSignature, body } = await parseBody<SanityWebhookPayload>(
      request,
      secret,
    );

    if (!isValidSignature) {
      return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
    }

    if (!body) {
      return NextResponse.json({ error: "Empty webhook body." }, { status: 400 });
    }

    const post = extractPostDocument(body);
    if (!post) {
      return NextResponse.json({ ok: true, skipped: "not_a_published_post" });
    }

    const slug = resolveSlug(post.slug);
    const title = post.title?.trim();
    const excerpt = post.excerpt?.trim();

    const revalidated = revalidateBlogContent(slug);

    if (post.notificationSentAt) {
      return NextResponse.json({
        ok: true,
        revalidated,
        skipped: "already_notified",
      });
    }

    if (!title || !slug || !excerpt) {
      return NextResponse.json(
        {
          error: "Post is missing title, slug, or excerpt.",
          revalidated,
        },
        { status: 400 },
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error: "Email service is not configured.",
          revalidated,
        },
        { status: 500 },
      );
    }

    const subscriberRows = await fetchActiveNewsletterSubscribers();
    const subscriberEmails = subscriberRows
      .map((row) => row.email?.trim().toLowerCase())
      .filter((email): email is string => Boolean(email));

    console.info("[sanity-webhook] active subscriber lookup", {
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
      query: activeSubscribersQuery.trim(),
      rawCount: subscriberRows.length,
      rawResult: subscriberRows,
      emailCount: subscriberEmails.length,
    });

    if (subscriberEmails.length === 0) {
      return NextResponse.json({
        ok: true,
        revalidated,
        skipped: "no_subscribers",
      });
    }

    const postUrl = `${getSiteUrl()}/blog/${slug}`;
    const resend = new Resend(apiKey);

    const sendResult = await sendSubscriberBroadcast(resend, {
      title,
      excerpt,
      postUrl,
      subscriberEmails,
      idempotencyPrefix: `blog-post/${slug}`,
    });

    if (!sendResult.ok) {
      console.error("Subscriber broadcast error:", sendResult.error);
      return NextResponse.json(
        {
          error: "Failed to send subscriber notification.",
          revalidated,
        },
        { status: 500 },
      );
    }

    const writeClient = getSanityWriteClient();
    if (writeClient) {
      await writeClient
        .patch(post._id!)
        .set({ notificationSentAt: new Date().toISOString() })
        .commit();
    } else {
      console.warn(
        "SANITY_API_WRITE_TOKEN is not set — notificationSentAt was not recorded.",
      );
    }

    return NextResponse.json({
      ok: true,
      revalidated,
      notified: true,
      slug,
      recipientCount: subscriberEmails.length,
    });
  } catch (error) {
    console.error("Sanity webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed." },
      { status: 500 },
    );
  }
}
