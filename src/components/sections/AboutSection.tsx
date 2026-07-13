import { Button } from "@/components/ui/Button";
import type { AboutTeaserContent } from "@/types/content";

interface AboutSectionProps {
  content: AboutTeaserContent;
}

export function AboutSection({ content }: AboutSectionProps) {
  return (
    <section id="about" className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-h3 text-foreground">
              {content.title}
            </h2>
            <p className="text-body-lg mt-6 text-muted-foreground">
              {content.description}
            </p>
            <Button href={content.cta.href} className="mt-8">
              {content.cta.label}
            </Button>
          </div>

          <ul className="space-y-4">
            {content.highlights.map((highlight) => (
              <li
                key={highlight}
                className="flex items-start gap-3 rounded-lg border border-border bg-surface p-4"
              >
                <span
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-accent/10 text-sm text-brand-accent"
                  aria-hidden="true"
                >
                  ✓
                </span>
                <span className="text-body text-foreground">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
