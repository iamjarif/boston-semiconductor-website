import { NextResponse, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { Resend } from "resend";

import { sendSubscriberBroadcast } from "@/lib/email/send-subscriber-batch";
import { getSiteUrl } from "@/lib/email/resend-config";
import {
  activeSubscribersQuery,
} from "@/lib/newsletter/subscribers";
import { revalidateBlogContent } from "@/lib/sanity/revalidate-blog";
import { methodNotAllowedResponse } from "@/lib/security/request";
import { getSanityWriteClient } from "@/lib/sanity/write-client";

type SanityWebhookOperation = "create" | "update" | "delete";

interface SanityPostDocument {
  operation?: SanityWebhookOperation;
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

function resolveOperation(
  request: NextRequest,
  body: SanityWebhookPayload,
): SanityWebhookOperation {
  const headerOperation = request.headers.get("sanity-operation");
  if (
    headerOperation === "create" ||
    headerOperation === "update" ||
    headerOperation === "delete"
  ) {
    return headerOperation;
  }

  const bodyOperation = body.operation ?? body.result?.operation;
  if (
    bodyOperation === "create" ||
    bodyOperation === "update" ||
    bodyOperation === "delete"
  ) {
    return bodyOperation;
  }

  return "update";
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

    const operation = resolveOperation(request, body);
    const post = extractPostDocument(body);
    if (!post) {
      return NextResponse.json({ ok: true, skipped: "not_a_published_post" });
    }

    const slug = resolveSlug(post.slug);
    const revalidated = revalidateBlogContent(slug);

    console.info("[sanity-webhook] cache revalidation", {
      operation,
      postId: post._id,
      slug,
      fetchTagsUsedByPages: slug
        ? ["sanity:posts", `sanity:post:${slug}`]
        : ["sanity:posts"],
      revalidated,
      pathSummary: revalidated.paths.map((entry) => ({
        path: entry.target,
        type: entry.type ?? "default",
        ok: entry.ok,
        error: entry.error ?? null,
      })),
      tagSummary: revalidated.tags.map((entry) => ({
        tag: entry.target,
        ok: entry.ok,
        error: entry.error ?? null,
      })),
    });

    if (operation === "delete") {
      return NextResponse.json({
        ok: true,
        operation,
        revalidated,
        skipped: "delete_revalidation_only",
      });
    }

    const title = post.title?.trim();
    const excerpt = post.excerpt?.trim();

    if (post.notificationSentAt) {
      return NextResponse.json({
        ok: true,
        operation,
        revalidated,
        skipped: "already_notified",
      });
    }

    if (!title || !slug || !excerpt) {
      return NextResponse.json(
        {
          error: "Post is missing title, slug, or excerpt.",
          operation,
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
          operation,
          revalidated,
        },
        { status: 500 },
      );
    }

    const writeTokenConfigured = Boolean(process.env.SANITY_API_WRITE_TOKEN);
    const readTokenConfigured = Boolean(process.env.SANITY_API_READ_TOKEN);
    const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? null;
    const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
    const writeClient = getSanityWriteClient();

    console.info("[sanity-webhook] subscriber query runtime config", {
      sanityProjectId,
      sanityDataset,
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-01-01",
      client: "getSanityWriteClient",
      useCdn: false,
      writeTokenConfigured,
      readTokenConfigured,
      writeClientAvailable: Boolean(writeClient),
      query: activeSubscribersQuery.trim(),
    });

    const subscriberRows = writeClient
      ? await writeClient.fetch<Array<{ email?: string }>>(activeSubscribersQuery)
      : [];
    const subscriberEmails = subscriberRows
      .map((row) => row.email?.trim().toLowerCase())
      .filter((email): email is string => Boolean(email));

    console.info("[sanity-webhook] active subscriber lookup result", {
      sanityProjectId,
      sanityDataset,
      rawCount: subscriberRows.length,
      emailCount: subscriberEmails.length,
      rawResult: subscriberRows,
      skippedBecauseWriteClientMissing: !writeClient,
    });

    if (subscriberEmails.length === 0) {
      return NextResponse.json({
        ok: true,
        operation,
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
      console.error(
        "Subscriber broadcast error:",
        JSON.stringify(sendResult.error, null, 2),
      );
      if (sendResult.skippedRecipients?.length) {
        console.warn("[sanity-webhook] skipped recipients during broadcast", {
          skipped: sendResult.skippedRecipients,
        });
      }
      return NextResponse.json(
        {
          error: "Failed to send subscriber notification.",
          operation,
          revalidated,
        },
        { status: 500 },
      );
    }

    if (sendResult.skippedRecipients.length > 0) {
      console.warn("[sanity-webhook] broadcast sent with skipped recipients", {
        sentCount: sendResult.sentCount,
        skipped: sendResult.skippedRecipients,
      });
    }

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
      operation,
      revalidated,
      notified: true,
      slug,
      recipientCount: sendResult.sentCount,
      skippedRecipientCount: sendResult.skippedRecipients.length,
    });
  } catch (error) {
    console.error("Sanity webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed." },
      { status: 500 },
    );
  }
}
