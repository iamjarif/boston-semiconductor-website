import {
  fetchAllPostSlugs,
  fetchPostBySlug,
  fetchPosts,
  fetchPostsCount,
  fetchRecentPostsExcluding,
  fetchRelatedPosts,
} from "@/lib/cms";
import { estimateReadingTime } from "@/lib/blog-utils";
import type {
  BlogCategory,
  BlogListResult,
  BlogPost,
  GetBlogPostsOptions,
} from "@/types/blog";

const DEFAULT_PAGE_SIZE = 10;

function normalizePost(raw: {
  slug: string;
  title: string;
  category: BlogPost["category"];
  excerpt: string;
  publishedAt: string;
  coverImage?: { asset?: { url: string }; alt?: string };
  body?: BlogPost["body"];
}): BlogPost {
  const body = raw.body ?? [];

  return {
    slug: raw.slug,
    title: raw.title,
    category: raw.category,
    excerpt: raw.excerpt,
    publishedAt: raw.publishedAt,
    body,
    readingTimeMinutes: body.length > 0 ? estimateReadingTime(body) : undefined,
    coverImage: raw.coverImage?.asset?.url
      ? {
          url: raw.coverImage.asset.url,
          alt: raw.coverImage.alt ?? raw.title,
        }
      : undefined,
  };
}

/** Fetch paginated blog posts sorted by date (newest first). */
export async function getBlogPosts(
  options: GetBlogPostsOptions = {},
): Promise<BlogListResult> {
  const page = Math.max(1, options.page ?? 1);
  const pageSize = options.pageSize ?? DEFAULT_PAGE_SIZE;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const [rawPosts, total] = await Promise.all([
    fetchPosts(start, end),
    fetchPostsCount(),
  ]);

  return {
    posts: rawPosts.map(normalizePost),
    total,
    page,
    pageSize,
  };
}

/** Fetch a single blog post by slug. Returns null if not found. */
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const raw = await fetchPostBySlug(slug);
  if (!raw) return null;
  return normalizePost(raw);
}

/** Fetch related posts, backfilling with recent posts if same-category results are sparse. */
export async function getRelatedPosts(
  slug: string,
  category: BlogCategory,
  limit = 3,
): Promise<BlogPost[]> {
  const related = await fetchRelatedPosts(slug, category, limit);

  if (related.length >= limit) {
    return related.map(normalizePost);
  }

  const backfillLimit = limit - related.length;
  const relatedSlugs = new Set(related.map((post) => post.slug));
  const backfill = await fetchRecentPostsExcluding(slug, limit + backfillLimit);

  const combined = [
    ...related,
    ...backfill.filter((post) => !relatedSlugs.has(post.slug)),
  ];

  return combined.slice(0, limit).map(normalizePost);
}

/** Fetch all post slugs for generateStaticParams. */
export async function getAllPostSlugs(): Promise<string[]> {
  const slugs = await fetchAllPostSlugs();
  return slugs.map((s) => s.slug);
}
