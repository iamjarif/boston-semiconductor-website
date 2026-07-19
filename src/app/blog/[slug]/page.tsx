import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { getAllPostSlugs, getBlogPost } from "@/lib/blog";

/** ISR: revalidate individual posts every hour. */
export const revalidate = 3600;

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="text-h4 mt-8 mb-4 text-text-primary">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-h5 mt-6 mb-3 text-text-primary">
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="text-body mb-4 text-text-secondary">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="text-body mb-4 list-disc space-y-2 pl-6 text-text-secondary">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="text-body mb-4 list-decimal space-y-2 pl-6 text-text-secondary">
        {children}
      </ol>
    ),
  },
};

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

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
      <header>
        <time
          dateTime={post.publishedAt}
          className="text-body-sm text-text-secondary"
        >
          {formatDate(post.publishedAt)}
        </time>
        <h1 className="text-h3 mt-2 text-text-primary">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="text-body-lg mt-4 text-text-secondary">{post.excerpt}</p>
        )}
      </header>

      {post.coverImage && (
        <div className="relative mt-8 aspect-video overflow-hidden rounded-xl">
          <Image
            src={post.coverImage.url}
            alt={post.coverImage.alt}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="prose-custom mt-10">
        <PortableText value={post.body} components={portableTextComponents} />
      </div>
    </article>
  );
}
