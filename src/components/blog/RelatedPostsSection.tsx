import { BlogCard } from "@/components/ui/BlogCard";
import { formatBlogDate } from "@/lib/blog-utils";
import type { BlogPost } from "@/types/blog";

const PLACEHOLDER_IMAGE = "/images/blog/placeholder.png";

interface RelatedPostsSectionProps {
  posts: BlogPost[];
}

export function RelatedPostsSection({ posts }: RelatedPostsSectionProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="border-border-default border-t pt-16">
      <div className="flex w-full flex-col items-center gap-16">
        <div className="flex w-full flex-col items-center gap-3 text-center">
          <p className="text-mono-lg text-brand-primary">Related</p>
          <h2 className="bg-gradient-to-b from-text-primary to-neutral-800 bg-clip-text text-h2 text-transparent">
            More Insights.
          </h2>
        </div>

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
      </div>
    </section>
  );
}
