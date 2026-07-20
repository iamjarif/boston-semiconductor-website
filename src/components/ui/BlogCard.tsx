import Image from "next/image";
import Link from "next/link";

export interface BlogCardProps {
  title: string;
  category?: string;
  date?: string;
  imageSrc: string;
  imageAlt?: string;
  href?: string;
  className?: string;
}

export function BlogCard({
  title,
  category = "Category",
  date = "Date",
  imageSrc,
  imageAlt = "",
  href,
  className = "",
}: BlogCardProps) {
  const card = (
    <article
      className={`group relative flex h-96 w-full flex-col overflow-hidden rounded-3xl border border-transparent bg-bg-surface transition-colors hover:border-border-strong hover:bg-bg-surface-raised ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/10 via-brand-primary/5 to-transparent" />
      </div>

      <div className="relative h-[226px] w-full shrink-0">
        <Image
          src={imageSrc}
          alt={imageAlt || title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 424px"
        />
      </div>

      <div className="relative flex flex-col gap-4 p-6">
        <div className="flex items-center gap-2 whitespace-nowrap text-mono-sm">
          <span className="text-brand-primary">{category}</span>
          <span className="text-text-disabled">·</span>
          <span className="text-body-xs text-text-disabled">{date}</span>
        </div>
        <h3 className="text-h6 text-text-primary">{title}</h3>
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
