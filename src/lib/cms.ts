import type { PortableTextBlock } from "@portabletext/types";

import { getSanityClient, isSanityConfigured } from "@/lib/sanity/client";
import {
  postBySlugQuery,
  postSlugsQuery,
  postsCountQuery,
  postsQuery,
} from "@/lib/sanity/queries";

interface SanityPostRaw {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  coverImage?: {
    asset?: { url: string };
    alt?: string;
  };
  body?: PortableTextBlock[];
}

/** CMS abstraction layer — delegates to Sanity today, swap-friendly for future CMS changes. */
export async function fetchPosts(
  start: number,
  end: number,
): Promise<SanityPostRaw[]> {
  if (!isSanityConfigured()) return [];

  const client = getSanityClient();
  if (!client) return [];

  return client.fetch<SanityPostRaw[]>(postsQuery, { start, end });
}

export async function fetchPostsCount(): Promise<number> {
  if (!isSanityConfigured()) return 0;

  const client = getSanityClient();
  if (!client) return 0;

  return client.fetch<number>(postsCountQuery);
}

export async function fetchPostBySlug(
  slug: string,
): Promise<SanityPostRaw | null> {
  if (!isSanityConfigured()) return null;

  const client = getSanityClient();
  if (!client) return null;

  return client.fetch<SanityPostRaw | null>(postBySlugQuery, { slug });
}

export async function fetchAllPostSlugs(): Promise<{ slug: string }[]> {
  if (!isSanityConfigured()) return [];

  const client = getSanityClient();
  if (!client) return [];

  return client.fetch<{ slug: string }[]>(postSlugsQuery);
}
