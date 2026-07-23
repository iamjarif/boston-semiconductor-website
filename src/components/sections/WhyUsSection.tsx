"use client";

import { useRef } from "react";

import { WhyUsParallaxCards } from "@/components/sections/WhyUsParallaxCards";
import { GlowOrb } from "@/components/ui/GlowOrb";

interface WhyUsCardData {
  caption: string;
  title: string;
  subText: string;
  align: "start" | "end";
}

const whyUsCards: WhyUsCardData[] = [
  {
    caption: "FULL-STACK",
    title: "One team, one partner",
    subText:
      "From TCAD device physics to physical verification signoff - no handoffs between vendors.",
    align: "end",
  },
  {
    caption: "ADVANCED NODE",
    title: "Proven on leading nodes",
    subText:
      "Tapeouts on TSMC 3nm\u201328nm, Samsung 5nm, and GlobalFoundries processes.",
    align: "start",
  },
  {
    caption: "TIME ZONE",
    title: "APAC-aligned hours",
    subText:
      "Bangladesh engineering hub, Taiwan-based management - 2 hours from Malaysia.",
    align: "end",
  },
  {
    caption: "IP-SAFE",
    title: "Air-gapped delivery",
    subText:
      "Biometric ODC access and strict NDAs - your IP never leaves our secure environment.",
    align: "start",
  },
  {
    caption: "COMMERCIAL",
    title: "Flexible terms",
    subText:
      "Retainer or turnkey - we adapt to your project structure and budget.",
    align: "end",
  },
  {
    caption: "TRACK RECORD",
    title: "Silicon-validated",
    subText:
      "10+ tapeouts and proven analog IPs, recognized at BEAR 2025.",
    align: "start",
  },
];

const firstRow = whyUsCards.slice(0, 3);
const secondRow = whyUsCards.slice(3);

export function WhyUsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col items-center gap-16 overflow-hidden bg-bg-base px-4 py-24 lg:py-[140px]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] overflow-visible"
      >
        <GlowOrb
          src="/images/glows/glow-whyus-1.svg"
          size={366}
          rotate={-165}
          className="left-[-150px] top-[60%] scale-50 sm:scale-75 lg:scale-100"
        />
        <GlowOrb
          src="/images/glows/glow-whyus-2.svg"
          size={524}
          className="right-[-200px] top-[45%] scale-50 sm:scale-75 lg:scale-100"
        />
      </div>

      <div className="relative z-10 flex w-full max-w-[1316px] flex-col items-center gap-16">
        <WhyUsParallaxCards
          sectionRef={sectionRef}
          firstRow={firstRow}
          secondRow={secondRow}
        />
      </div>
    </section>
  );
}
