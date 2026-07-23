"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { useLenis } from "@/components/ui/SmoothScrollProvider";
import {
  clearPendingSectionScroll,
  peekPendingSectionScroll,
  scrollToSection,
} from "@/lib/navigation/scroll-to-section";

const MAX_ATTEMPTS = 60;
const RETRY_MS = 50;

function isSectionReady(sectionId: string): boolean {
  return sectionId === "hero" || document.getElementById(sectionId) !== null;
}

/** Applies a deferred in-page scroll after navigating home from another route. */
export function PendingSectionScroll() {
  const lenis = useLenis();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    const target = peekPendingSectionScroll();
    if (!target) return;

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let attempts = 0;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const needsLenis = !reduceMotion;

    const attemptScroll = () => {
      if (cancelled) return;

      attempts += 1;

      const lenisReady = !needsLenis || lenis !== null;
      if (!lenisReady || !isSectionReady(target)) {
        if (attempts < MAX_ATTEMPTS) {
          timeoutId = setTimeout(attemptScroll, RETRY_MS);
        }
        return;
      }

      requestAnimationFrame(() => {
        if (cancelled) return;

        const scrolled = scrollToSection(target, lenis);
        if (scrolled) {
          clearPendingSectionScroll();
          return;
        }

        if (attempts < MAX_ATTEMPTS) {
          timeoutId = setTimeout(attemptScroll, RETRY_MS);
        }
      });
    };

    attemptScroll();

    return () => {
      cancelled = true;
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, [pathname, lenis]);

  return null;
}
