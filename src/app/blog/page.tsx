import Link from "next/link";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { getBlogPosts } from "@/lib/blog";

/** ISR: revalidate blog list every hour so new posts appear without full redeploy. */
export const revalidate = 3600;

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, Number(params.page) || 1);
  const { posts, total, pageSize } = await getBlogPosts({
    page: currentPage,
  });
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-h1 text-foreground">
          Blog
        </h1>
        <p className="text-body-lg mt-4 text-muted-foreground">
          Insights and updates from Boston Semiconductor
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="mx-auto mt-16 max-w-md text-center">
          <p className="text-body text-muted-foreground">
            No posts yet. Configure Sanity CMS and publish your first article.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <Card className="h-full">
                  <CardHeader>
                    <time
                      dateTime={post.publishedAt}
                      className="text-body-sm text-muted-foreground"
                    >
                      {formatDate(post.publishedAt)}
                    </time>
                    <CardTitle>{post.title}</CardTitle>
                  </CardHeader>
                  <CardDescription>{post.excerpt}</CardDescription>
                </Card>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <nav
              className="mt-12 flex items-center justify-center gap-4"
              aria-label="Blog pagination"
            >
              {currentPage > 1 && (
                <Link
                  href={`/blog?page=${currentPage - 1}`}
                  className="text-label rounded-lg border border-border px-4 py-2 text-foreground transition-colors hover:bg-muted"
                >
                  Previous
                </Link>
              )}
              <span className="text-body-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              {currentPage < totalPages && (
                <Link
                  href={`/blog?page=${currentPage + 1}`}
                  className="text-label rounded-lg border border-border px-4 py-2 text-foreground transition-colors hover:bg-muted"
                >
                  Next
                </Link>
              )}
            </nav>
          )}
        </>
      )}
    </div>
  );
}
