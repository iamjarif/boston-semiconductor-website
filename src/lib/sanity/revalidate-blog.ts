import { revalidatePath, revalidateTag } from "next/cache";

import { SANITY_POSTS_TAG, sanityPostTag } from "@/lib/sanity/cache-tags";

export interface RevalidateBlogContentResult {
  paths: string[];
  tags: string[];
}

/** Invalidate cached blog data and prerendered routes after Sanity publishes or updates a post. */
export function revalidateBlogContent(slug?: string): RevalidateBlogContentResult {
  const paths = ["/", "/blog"];
  const tags = [SANITY_POSTS_TAG];

  revalidateTag(SANITY_POSTS_TAG, { expire: 0 });

  if (slug) {
    tags.push(sanityPostTag(slug));
    revalidateTag(sanityPostTag(slug), { expire: 0 });
    paths.push(`/blog/${slug}`);
    revalidatePath(`/blog/${slug}`);
  }

  revalidatePath("/blog");
  revalidatePath("/");

  return { paths, tags };
}
