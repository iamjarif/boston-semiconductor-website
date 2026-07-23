"use client";

import { useState, useTransition } from "react";

import { loadMoreBlogPosts } from "@/app/blog/actions";
import { BlogCard } from "@/components/ui/BlogCard";
import { Button } from "@/components/ui/Button";
import { formatBlogDate } from "@/lib/blog-utils";
import type { BlogPost } from "@/types/blog";

const PLACEHOLDER_IMAGE = "/images/blog/placeholder.png";

interface BlogListingGridProps {
  initialPosts: BlogPost[];
  initialPage: number;
  pageSize: number;
  total: number;
}

export function BlogListingGrid({
  initialPosts,
  initialPage,
  pageSize,
  total,
}: BlogListingGridProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [page, setPage] = useState(initialPage);
  const [isPending, startTransition] = useTransition();

  const hasMore = posts.length < total;

  function handleLoadMore() {
    startTransition(async () => {
      const nextPage = page + 1;
      const result = await loadMoreBlogPosts(nextPage, pageSize);
      const existingSlugs = new Set(posts.map((post) => post.slug));
      const newPosts = result.posts.filter((post) => !existingSlugs.has(post.slug));

      setPosts((current) => [...current, ...newPosts]);
      setPage(nextPage);
    });
  }

  return (
    <div className="flex w-full flex-col items-center gap-12">
      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard
            key={post.slug}
            title={post.title}
            excerpt={post.excerpt}
            category={post.category}
            date={formatBlogDate(post.publishedAt)}
            imageSrc={post.coverImage?.url ?? PLACEHOLDER_IMAGE}
            imageAlt={post.coverImage?.alt ?? post.title}
            href={`/blog/${post.slug}`}
          />
        ))}
      </div>

      {hasMore ? (
        <Button
          variant="outline"
          size="l"
          onClick={handleLoadMore}
          disabled={isPending}
        >
          {isPending ? "Loading…" : "Load more"}
        </Button>
      ) : null}
    </div>
  );
}
