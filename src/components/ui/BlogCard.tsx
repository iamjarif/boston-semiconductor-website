import Image from "next/image";
import Link from "next/link";

export interface BlogCardProps {
  title: string;
  excerpt?: string;
  category?: string;
  date?: string;
  imageSrc: string;
  imageAlt?: string;
  href?: string;
  className?: string;
}

const clampTwoLines =
  "overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]";

export function BlogCard({
  title,
  excerpt,
  category = "Category",
  date = "Date",
  imageSrc,
  imageAlt = "",
  href,
  className = "",
}: BlogCardProps) {
  const card = (
    <article
      className={`group relative flex w-full flex-col overflow-hidden rounded-3xl border border-transparent bg-bg-surface transition-[transform,colors] duration-300 pointer-fine:hover:-translate-y-0.5 pointer-fine:hover:border-border-strong pointer-fine:hover:bg-bg-surface-raised ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity pointer-fine:group-hover:opacity-100"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/10 via-brand-primary/5 to-transparent" />
      </div>

      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden sm:aspect-[16/9] lg:h-[200px] lg:aspect-auto">
        <Image
          src={imageSrc}
          alt={imageAlt || title}
          fill
          className="object-cover transition-transform duration-500 pointer-fine:group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 424px"
        />
      </div>

      <div className="relative flex flex-1 flex-col gap-2 p-6 pt-5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-mono-sm">
          <span className="text-brand-primary">{category}</span>
          <span className="text-text-disabled">·</span>
          <span className="text-body-xs text-text-disabled">{date}</span>
        </div>
        <h3 className={`text-h6 text-text-primary ${clampTwoLines}`}>{title}</h3>
        {excerpt ? (
          <p className={`text-body-sm text-text-secondary ${clampTwoLines}`}>
            {excerpt}
          </p>
        ) : null}
      </div>
    </article>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {card}
      </Link>
    );
  }

  return card;
}
