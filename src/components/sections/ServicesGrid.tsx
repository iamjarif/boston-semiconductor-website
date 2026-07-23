import { Card } from "@/components/ui/Card";
import { GlowOrb } from "@/components/ui/GlowOrb";
import {
  SectionReveal,
  SectionRevealBlurWrap,
  SectionRevealGroup,
  SectionRevealItem,
} from "@/components/ui/SectionReveal";
import { serviceOfferings } from "@/lib/content/services";

interface ServiceCardData {
  caption: string;
  title: string;
  description: string;
}

const services: ServiceCardData[] = serviceOfferings;

export function ServicesGrid() {
  return (
    <section
      id="services"
      className="relative flex flex-col items-center gap-24 overflow-hidden bg-bg-surface px-4 py-24 lg:py-[140px]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] overflow-visible"
      >
        <GlowOrb
          src="/images/glows/glow-services.svg"
          size={477}
          rotate={-90}
          className="left-1/2 top-[-50px] -translate-x-1/2"
        />
      </div>

      <SectionReveal className="relative z-10 flex w-full max-w-[1316px] flex-col items-center gap-24">
        <SectionRevealItem className="flex flex-col items-center gap-7 text-center">
          <div className="flex flex-col items-center gap-3">
            <p className="text-mono-lg text-brand-primary">CORE SERVICES</p>
            <h2 className="bg-gradient-to-b from-text-primary to-neutral-800 bg-clip-text text-h1 text-transparent">
              Our Expertise.
            </h2>
          </div>
          <p className="max-w-[750px] text-body text-text-secondary">
            Full-stack semiconductor design capability, mapped the way <br></br>{" "}
            our engineers actually think about a chip.
          </p>
        </SectionRevealItem>

        <SectionRevealGroup className="card-focus-grid grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12">
          {services.map((service, index) => (
            <SectionRevealItem
              key={service.title}
              layoutOnly
              className={index < 4 ? "lg:col-span-3" : "lg:col-span-4"}
            >
              <SectionRevealBlurWrap className="h-full">
                <Card
                  caption={service.caption}
                  title={service.title}
                  subText={service.description}
                  className="card-focus-target !bg-bg-base hover:!bg-bg-surface-raised h-full"
                />
              </SectionRevealBlurWrap>
            </SectionRevealItem>
          ))}
        </SectionRevealGroup>
      </SectionReveal>
    </section>
  );
}
