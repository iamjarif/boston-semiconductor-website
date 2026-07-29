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

  // Tag-based invalidation (webhook) and time-based ISR are mutually exclusive on
  // fetch caches — page-level `export const revalidate` remains the ISR fallback.
  return {
    next: {
      revalidate: false,
      tags,
    },
  } as const;
}
