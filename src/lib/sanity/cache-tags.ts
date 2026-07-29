/** Shared Sanity data cache tag for all blog queries. */
export const SANITY_POSTS_TAG = "sanity:posts";

export function sanityPostTag(slug: string): string {
  return `sanity:post:${slug}`;
}

/** Fallback TTL if the Sanity webhook is missed (24 hours). */
export const SANITY_FETCH_REVALIDATE_SECONDS = 86_400;

export function getSanityFetchOptions(slug?: string) {
  const tags = slug
    ? [SANITY_POSTS_TAG, sanityPostTag(slug)]
    : [SANITY_POSTS_TAG];

  return {
    next: {
      revalidate: SANITY_FETCH_REVALIDATE_SECONDS,
      tags,
    },
  } as const;
}
