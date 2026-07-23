import { formatBlogDate, formatReadingTime } from "@/lib/blog-utils";

interface BlogArticleHeaderProps {
  category: string;
  publishedAt: string;
  readingTimeMinutes?: number;
  title: string;
  excerpt?: string;
}

export function BlogArticleHeader({
  category,
  publishedAt,
  readingTimeMinutes,
  title,
  excerpt,
}: BlogArticleHeaderProps) {
  return (
    <header className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2 text-mono-sm">
        <span className="text-brand-primary">{category}</span>
        <span className="text-text-disabled">·</span>
        <time dateTime={publishedAt} className="text-body-xs text-text-disabled">
          {formatBlogDate(publishedAt)}
        </time>
        {readingTimeMinutes ? (
          <>
            <span className="text-text-disabled">·</span>
            <span className="text-body-xs text-text-disabled">
              {formatReadingTime(readingTimeMinutes)}
            </span>
          </>
        ) : null}
      </div>
      <h1 className="text-h2 text-text-primary">{title}</h1>
      {excerpt ? (
        <p className="text-body-lg text-text-secondary">{excerpt}</p>
      ) : null}
    </header>
  );
}
