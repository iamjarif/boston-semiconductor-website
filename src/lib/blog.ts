import {
  fetchAllPostSlugs,
  fetchPostBySlug,
  fetchPosts,
  fetchPostsCount,
} from "@/lib/cms";
import type {
  BlogListResult,
  BlogPost,
  GetBlogPostsOptions,
} from "@/types/blog";

const DEFAULT_PAGE_SIZE = 10;

function normalizePost(raw: {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  coverImage?: { asset?: { url: string }; alt?: string };
  body?: BlogPost["body"];
}): BlogPost {
  return {
    slug: raw.slug,
    title: raw.title,
    excerpt: raw.excerpt,
    publishedAt: raw.publishedAt,
    body: raw.body ?? [],
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

/** Fetch all post slugs for generateStaticParams. */
export async function getAllPostSlugs(): Promise<string[]> {
  const slugs = await fetchAllPostSlugs();
  return slugs.map((s) => s.slug);
}
