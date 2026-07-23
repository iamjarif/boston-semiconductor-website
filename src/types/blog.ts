import type { PortableTextBlock } from "@portabletext/types";

export const blogCategories = [
  "Industry Insights",
  "Company News",
  "Technology",
  "Engineering",
] as const;

export type BlogCategory = (typeof blogCategories)[number];

export interface BlogImage {
  url: string;
  alt: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  category: BlogCategory;
  excerpt: string;
  publishedAt: string;
  coverImage?: BlogImage;
  body: PortableTextBlock[];
  readingTimeMinutes?: number;
}

export interface BlogListResult {
  posts: BlogPost[];
  total: number;
  page: number;
  pageSize: number;
}

export interface GetBlogPostsOptions {
  page?: number;
  pageSize?: number;
}
