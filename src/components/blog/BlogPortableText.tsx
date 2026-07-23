import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="text-h4 mt-10 mb-4 text-text-primary first:mt-0">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-h5 mt-8 mb-3 text-text-primary first:mt-0">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="text-body mb-6 text-text-secondary last:mb-0">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-brand-primary text-body my-8 border-l-4 pl-6 text-text-secondary italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="text-body mb-6 list-disc space-y-2 pl-6 text-text-secondary">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="text-body mb-6 list-decimal space-y-2 pl-6 text-text-secondary">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-text-primary">{children}</strong>
    ),
    em: ({ children }) => <em>{children}</em>,
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : "#";

      return (
        <a
          href={href}
          className="text-brand-primary underline-offset-2 transition-colors hover:underline"
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      );
    },
  },
};

interface BlogPortableTextProps {
  value: PortableTextBlock[];
  className?: string;
}

export function BlogPortableText({ value, className = "" }: BlogPortableTextProps) {
  return (
    <div className={className}>
      <PortableText value={value} components={portableTextComponents} />
    </div>
  );
}
