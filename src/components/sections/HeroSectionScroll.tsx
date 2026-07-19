"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import Image from "next/image";
import { useRef } from "react";

import { Button } from "@/components/ui/Button";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { RevealInView } from "@/components/ui/RevealInView";
import { SplitTextReveal } from "@/components/ui/SplitTextReveal";

export function HeroSectionScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [1, 1] : [1.25, 1],
  );
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? ["0%", "0%"] : ["0%", "6%"],
  );

  return (
    <section
      ref={sectionRef}
      className="relative -mt-[var(--layout-nav-height)] flex min-h-svh flex-col overflow-hidden bg-bg-base"
    >
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{ scale, y, transformOrigin: "center center" }}
        >
          <Image
            src="/images/hero-bg.jpg"
            alt="Microchip under precision probe needles during semiconductor testing"
            fill
            priority
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg-base" />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] overflow-visible"
      >
        <GlowOrb
          src="/images/glows/glow-hero.svg"
          size={477}
          className="left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      {/*
        Nav clearance lives on this wrapper (not the section) so the
        background above can bleed to the true top of the viewport, visible
        through the transparent fixed nav — only the content needs to sit
        below it.
      */}
      <div className="relative z-10 flex min-h-viewport-below-nav flex-1 flex-col items-center px-4 text-center">
        {/*
          Ratio-based spacers (not fixed pixels) bias the centered content
          slightly upward — a geometrically-centered block here reads as
          "too low" because of the heading's leading and the visual weight
          of the button row underneath it.
        */}
        <div className="flex-[0.92]" aria-hidden="true" />

        <div className="flex w-full max-w-[1316px] flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-3">
            <SplitTextReveal
              as="p"
              className="text-mono-lg text-brand-primary"
              delay={0}
            >
              Precision VLSI Engineering
            </SplitTextReveal>
            <SplitTextReveal
              as="h1"
              className="text-h1 sm:text-title"
              wordClassName="bg-gradient-to-b from-text-primary to-neutral-800 bg-clip-text text-transparent"
              delay={0.12}
            >
              {"Silicon Excellence\nDelivered at Scale."}
            </SplitTextReveal>
          </div>

          <SplitTextReveal
            as="p"
            className="max-w-[750px] text-h6 text-text-primary"
            delay={0.28}
          >
            Premium chip design services for the world&apos;s most demanding
            technology companies. From concept to tapeout, we engineer the
            future.
          </SplitTextReveal>

          <RevealInView
            delay={0.42}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Button href="#contact" variant="primary" size="xl">
              Discuss Your Project
            </Button>
            <Button href="#services" variant="secondary" size="xl">
              Explore Services
            </Button>
          </RevealInView>
        </div>

        <div className="flex-[1.08]" aria-hidden="true" />
      </div>
    </section>
  );
}
