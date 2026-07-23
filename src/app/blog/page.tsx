import { BlogListingGrid } from "@/components/blog/BlogListingGrid";
import { BlogPageHeader } from "@/components/blog/BlogPageHeader";
import { GlowOrb } from "@/components/ui/GlowOrb";
import {
  SectionReveal,
  SectionRevealItem,
} from "@/components/ui/SectionReveal";
import { getBlogPosts } from "@/lib/blog";

/** ISR: revalidate blog list every hour so new posts appear without full redeploy. */
export const revalidate = 3600;

const LISTING_PAGE_SIZE = 9;

export default async function BlogPage() {
  const { posts, total, page, pageSize } = await getBlogPosts({
    page: 1,
    pageSize: LISTING_PAGE_SIZE,
  });

  return (
    <section className="relative -mt-[var(--layout-nav-height)] overflow-hidden bg-bg-base px-4 pb-24 pt-[calc(var(--layout-nav-height)+2rem)] lg:pb-[140px] lg:pt-[calc(var(--layout-nav-height)+3rem)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] overflow-visible"
      >
        <GlowOrb
          src="/images/glows/glow-hero.svg"
          size={600}
          className="left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 scale-50 sm:scale-75 lg:scale-100"
        />
      </div>

      <SectionReveal className="relative z-10 mx-auto flex w-full max-w-[1316px] flex-col items-center gap-16">
        <SectionRevealItem className="w-full">
          <BlogPageHeader
            eyebrow="Blogs"
            heading="Latest Insights."
            subcopy="Insights and updates from Boston Semiconductor"
          />
        </SectionRevealItem>

        {posts.length === 0 ? (
          <SectionRevealItem className="max-w-md text-center">
            <p className="text-body text-text-secondary">
              No posts yet. Configure Sanity CMS and publish your first article.
            </p>
          </SectionRevealItem>
        ) : (
          <SectionRevealItem className="w-full">
            <BlogListingGrid
              initialPosts={posts}
              initialPage={page}
              pageSize={pageSize}
              total={total}
            />
          </SectionRevealItem>
        )}
      </SectionReveal>
    </section>
  );
}
