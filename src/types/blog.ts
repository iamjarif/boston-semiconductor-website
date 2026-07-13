import type { PortableTextBlock } from "@portabletext/types";

export interface BlogImage {
  url: string;
  alt: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  coverImage?: BlogImage;
  body: PortableTextBlock[];
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
