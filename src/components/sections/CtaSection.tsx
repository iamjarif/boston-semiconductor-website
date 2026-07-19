import { Button } from "@/components/ui/Button";
import type { CtaBannerContent } from "@/types/content";

interface CtaSectionProps {
  content: CtaBannerContent;
}

export function CtaSection({ content }: CtaSectionProps) {
  return (
    <section className="bg-brand-primary-deep py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
        <h2 className="text-h3 text-text-primary">
          {content.title}
        </h2>
        <p className="text-body-lg mx-auto mt-4 max-w-2xl text-text-secondary">
          {content.description}
        </p>
        <Button
          href={content.cta.href}
          variant="secondary"
          size="l"
          className="mt-8"
        >
          {content.cta.label}
        </Button>
      </div>
    </section>
  );
}
