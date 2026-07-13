import { Button } from "@/components/ui/Button";
import type { HeroContent } from "@/types/content";

interface HeroSectionProps {
  content: HeroContent;
}

export function HeroSection({ content }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-brand-primary-dark text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-brand-accent)_0%,_transparent_50%)] opacity-20" />
      <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="max-w-3xl">
          <p className="text-label-sm mb-4 uppercase text-brand-accent">
            {content.eyebrow}
          </p>
          <h1 className="text-h1 md:text-title">
            {content.title}
          </h1>
          <p className="text-body-lg mt-6 text-white/80">
            {content.subtitle}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href={content.primaryCta.href} size="lg">
              {content.primaryCta.label}
            </Button>
            {content.secondaryCta && (
              <Button
                href={content.secondaryCta.href}
                variant="secondary"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10"
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
