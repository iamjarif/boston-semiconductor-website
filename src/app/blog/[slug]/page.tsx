import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { BlogArticleHeader } from "@/components/blog/BlogArticleHeader";
import { BlogPortableText } from "@/components/blog/BlogPortableText";
import { RelatedPostsSection } from "@/components/blog/RelatedPostsSection";
import { Button } from "@/components/ui/Button";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { getAllPostSlugs, getBlogPost, getRelatedPosts } from "@/lib/blog";

/** ISR: revalidate individual posts every hour. */
export const revalidate = 3600;

const ARTICLE_MAX_WIDTH = "max-w-[750px]";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: `${post.title} | Boston Semiconductor`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(slug, post.category, 3);

  return (
    <article className="relative -mt-[var(--layout-nav-height)] overflow-hidden bg-bg-base px-4 pb-24 pt-[calc(var(--layout-nav-height)+2rem)] lg:pb-[140px] lg:pt-[calc(var(--layout-nav-height)+3rem)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] overflow-visible"
      >
        <GlowOrb
          src="/images/glows/glow-hero.svg"
          size={600}
          className="left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      <div className={`relative z-10 mx-auto flex w-full ${ARTICLE_MAX_WIDTH} flex-col gap-8`}>
        <Button
          href="/blog"
          variant="ghost"
          size="m"
          className="self-start"
          leadingIcon={<ArrowLeft size={20} weight="bold" />}
        >
          Back to Blog
        </Button>

        <BlogArticleHeader
          category={post.category}
          publishedAt={post.publishedAt}
          readingTimeMinutes={post.readingTimeMinutes}
          title={post.title}
          excerpt={post.excerpt}
        />

        {post.coverImage ? (
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl">
            <Image
              src={post.coverImage.url}
              alt={post.coverImage.alt}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 750px) 100vw, 750px"
            />
          </div>
        ) : null}

        <BlogPortableText value={post.body} />
      </div>

      {relatedPosts.length > 0 ? (
        <div className="relative z-10 mx-auto mt-20 w-full max-w-[1316px]">
          <RelatedPostsSection posts={relatedPosts} />
        </div>
      ) : null}
    </article>
  );
}
