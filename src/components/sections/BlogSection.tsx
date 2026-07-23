import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

import { BlogCard } from "@/components/ui/BlogCard";
import { Button } from "@/components/ui/Button";
import {
  SectionReveal,
  SectionRevealGroup,
  SectionRevealItem,
} from "@/components/ui/SectionReveal";
import { formatBlogDate } from "@/lib/blog-utils";
import { getBlogPosts } from "@/lib/blog";

const HOMEPAGE_POST_COUNT = 3;
const PLACEHOLDER_IMAGE = "/images/blog/placeholder.png";

export async function BlogSection() {
  const { posts } = await getBlogPosts({
    page: 1,
    pageSize: HOMEPAGE_POST_COUNT,
  });

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col items-center gap-16 bg-bg-base px-4 py-24 lg:py-[140px]">
      <SectionReveal className="flex w-full max-w-[1316px] flex-col items-center gap-16">
        <SectionRevealItem className="flex w-full flex-col items-center gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-1 flex-col items-center gap-3 text-center sm:items-start sm:text-left">
            <p className="text-mono-lg text-brand-primary">Blogs</p>
            <h2 className="bg-gradient-to-b from-text-primary to-neutral-800 bg-clip-text text-h1 text-transparent">
              Latest Insights.
            </h2>
          </div>
          <Button
            href="/blog"
            variant="ghost"
            trailingIcon={<ArrowRight size={20} weight="bold" />}
          >
            Find More
          </Button>
        </SectionRevealItem>

        <SectionRevealGroup className="grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
          {posts.map((post) => (
            <SectionRevealItem key={post.slug}>
              <BlogCard
                title={post.title}
                excerpt={post.excerpt}
                category={post.category}
                date={formatBlogDate(post.publishedAt)}
                imageSrc={post.coverImage?.url ?? PLACEHOLDER_IMAGE}
                imageAlt={post.coverImage?.alt ?? post.title}
                href={`/blog/${post.slug}`}
              />
            </SectionRevealItem>
          ))}
        </SectionRevealGroup>
      </SectionReveal>
    </section>
  );
}
