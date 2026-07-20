import { BlogSection } from "@/components/sections/BlogSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { EngagementModels } from "@/components/sections/EngagementModels";
import { HeroSection } from "@/components/sections/HeroSection";
import { MissionStatement } from "@/components/sections/MissionStatement";
import { ProcessBreakdown } from "@/components/sections/ProcessBreakdown";
import { SecuritySection } from "@/components/sections/SecuritySection";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { WhyUsSection } from "@/components/sections/WhyUsSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MissionStatement />
      <ServicesGrid />
      <ProcessBreakdown />
      <EngagementModels />
      <SecuritySection />
      <WhyUsSection />
      <BlogSection />
      <ContactSection />
    </>
  );
}
