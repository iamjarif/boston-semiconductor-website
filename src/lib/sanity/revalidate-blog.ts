import { revalidatePath, revalidateTag } from "next/cache";

import { SANITY_POSTS_TAG, sanityPostTag } from "@/lib/sanity/cache-tags";

export interface RevalidationCallResult {
  target: string;
  type?: "layout" | "page";
  ok: boolean;
  error?: string;
}

export interface RevalidateBlogContentResult {
  slug: string | null;
  paths: RevalidationCallResult[];
  tags: RevalidationCallResult[];
}

function runRevalidateTag(tag: string): RevalidationCallResult {
  try {
    revalidateTag(tag, { expire: 0 });
    return { target: tag, ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { target: tag, ok: false, error: message };
  }
}

function runRevalidatePath(
  path: string,
  type?: "layout" | "page",
): RevalidationCallResult {
  try {
    if (type) {
      revalidatePath(path, type);
    } else {
      revalidatePath(path);
    }
    return { target: path, type, ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { target: path, type, ok: false, error: message };
  }
}

/** Invalidate cached blog data and prerendered routes after Sanity publishes, updates, or deletes a post. */
export function revalidateBlogContent(slug?: string): RevalidateBlogContentResult {
  const tags: RevalidationCallResult[] = [runRevalidateTag(SANITY_POSTS_TAG)];
  const paths: RevalidationCallResult[] = [
    runRevalidatePath("/", "layout"),
    runRevalidatePath("/blog", "layout"),
    runRevalidatePath("/"),
    runRevalidatePath("/blog"),
  ];

  if (slug) {
    tags.push(runRevalidateTag(sanityPostTag(slug)));
    paths.push(runRevalidatePath(`/blog/${slug}`));
  }

  return {
    slug: slug ?? null,
    paths,
    tags,
  };
}
