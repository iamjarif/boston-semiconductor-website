"use server";

import { getBlogPosts } from "@/lib/blog";
import type { BlogListResult } from "@/types/blog";

export async function loadMoreBlogPosts(
  page: number,
  pageSize: number,
): Promise<BlogListResult> {
  return getBlogPosts({ page, pageSize });
}
