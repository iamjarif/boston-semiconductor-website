"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useMemo, useRef } from "react";

import { ParallaxGlowOrb } from "@/components/ui/ParallaxGlowOrb";
import { useLenis } from "@/components/ui/SmoothScrollProvider";

const MISSION_TEXT =
  "We are a specialized semiconductor design partner, delivering silicon-proven VLSI solutions across advanced process nodes for clients in power electronics, telecommunications, automotive, and IoT.";

const PARALLAX_TRAVEL = 96;
const desktopMediaQuery = "(min-width: 1024px)";

export function MissionStatementScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const lenis = useLenis();

  const splitText = useMemo(
    () =>
      MISSION_TEXT.split(/(\s+)/).map((token, index) =>
        token.match(/^\s+$/) ? (
          token
        ) : (
          <span
            key={index}
            className="word inline-block bg-gradient-to-b from-text-primary to-neutral-800 bg-clip-text text-transparent will-change-[opacity,translate]"
          >
            {token}
          </span>
        ),
      ),
    [],
  );

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    if (!window.matchMedia(desktopMediaQuery).matches) return;

    // ScrollTrigger pin/scrub requires Lenis scrollerProxy from SmoothScrollProvider.
    if (!lenis) return;

    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    if (!section) return;

    const words = section.querySelectorAll<HTMLElement>(".word");
    if (words.length === 0) return;

    gsap.set(words, { opacity: 0.1, y: 12 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${window.innerHeight}`,
        pin: true,
        pinSpacing: true,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    tl.to(words, {
      opacity: 1,
      y: 0,
      ease: "none",
      stagger: 1 / words.length,
    });

    const glows = section.querySelectorAll<HTMLElement>("[data-parallax-glow]");
    glows.forEach((el) => {
      const speed = Number(el.dataset.parallaxSpeed ?? 0);
      tl.fromTo(
        el,
        { y: 0 },
        { y: PARALLAX_TRAVEL * speed, ease: "none" },
        0,
      );
    });

    const refreshScrollTriggers = () => ScrollTrigger.refresh();
    window.addEventListener("resize", refreshScrollTriggers);
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("resize", refreshScrollTriggers);
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [lenis]);

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-label="Mission"
      className="relative flex min-h-svh items-center justify-center overflow-hidden bg-bg-base px-4"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] overflow-visible"
      >
        <ParallaxGlowOrb
          speed={0.2}
          src="/images/glows/glow-mission-1.svg"
          size={299}
          className="right-[-150px] top-[100px] scale-50 sm:scale-75 lg:scale-100"
        />
        <ParallaxGlowOrb
          speed={0.3}
          src="/images/glows/glow-mission-2.svg"
          size={366}
          rotate={-165}
          className="left-[-100px] top-[250px] scale-50 sm:scale-75 lg:scale-100"
        />
        <ParallaxGlowOrb
          speed={0.4}
          centered
          src="/images/glows/glow-mission-3.svg"
          size={524}
          className="bottom-[-200px] left-1/2 scale-50 sm:scale-75 lg:scale-100"
        />
      </div>

      <p className="relative z-10 max-w-[1316px] text-center text-h2 max-sm:text-[2.25rem]">
        {splitText}
      </p>
    </section>
  );
}
