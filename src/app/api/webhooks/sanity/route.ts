import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { parseBody } from "next-sanity/webhook";
import { Resend } from "resend";

import { buildNewPostBroadcastEmailHtml } from "@/lib/email/new-post-broadcast-template";
import {
  getSiteUrl,
  RESEND_FROM_ADDRESS,
} from "@/lib/email/resend-config";
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

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.SANITY_WEBHOOK_SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: "SANITY_WEBHOOK_SECRET is not configured." },
        { status: 500 },
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

    if (slug) {
      revalidatePath("/blog");
      revalidatePath(`/blog/${slug}`);
    }

    if (post.notificationSentAt) {
      return NextResponse.json({ ok: true, skipped: "already_notified" });
    }

    if (!title || !slug || !excerpt) {
      return NextResponse.json(
        { error: "Post is missing title, slug, or excerpt." },
        { status: 400 },
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const segmentId = process.env.RESEND_SEGMENT_ID;

    if (!apiKey || !segmentId) {
      return NextResponse.json(
        { error: "Resend broadcast is not configured." },
        { status: 500 },
      );
    }

    const postUrl = `${getSiteUrl()}/blog/${slug}`;
    const html = buildNewPostBroadcastEmailHtml({ title, excerpt, postUrl });
    const resend = new Resend(apiKey);

    const { error: broadcastError } = await resend.broadcasts.create({
      name: `Blog: ${title}`,
      segmentId,
      from: RESEND_FROM_ADDRESS,
      subject: `New article: ${title}`,
      previewText: excerpt,
      html,
      send: true,
    });

    if (broadcastError) {
      console.error("Resend broadcast error:", broadcastError);
      return NextResponse.json(
        { error: "Failed to send subscriber notification." },
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
      notified: true,
      slug,
    });
  } catch (error) {
    console.error("Sanity webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed." },
      { status: 500 },
    );
  }
}
