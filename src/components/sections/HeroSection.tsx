import { Button } from "@/components/ui/Button";
import type { HeroContent } from "@/types/content";

interface HeroSectionProps {
  content: HeroContent;
}

export function HeroSection({ content }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-bg-base text-text-primary">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-brand-primary)_0%,_transparent_50%)] opacity-20" />
      <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="max-w-3xl">
          <p className="text-label-sm mb-4 uppercase text-brand-primary">
            {content.eyebrow}
          </p>
          <h1 className="text-h1 md:text-title">
            {content.title}
          </h1>
          <p className="text-body-lg mt-6 text-text-secondary">
            {content.subtitle}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href={content.primaryCta.href} size="l">
              {content.primaryCta.label}
            </Button>
            {content.secondaryCta && (
              <Button
                href={content.secondaryCta.href}
                variant="outline"
                size="l"
              >
                {content.secondaryCta.label}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
