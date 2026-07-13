import { homeContent } from "@/lib/config/home";
import { AboutSection } from "@/components/sections/AboutSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { StatsSection } from "@/components/sections/StatsSection";

export default function HomePage() {
  return (
    <>
      <HeroSection content={homeContent.hero} />
      <ServicesSection services={homeContent.services} />
      <StatsSection stats={homeContent.stats} />
      <AboutSection content={homeContent.about} />
      <CtaSection content={homeContent.cta} />
    </>
  );
}
