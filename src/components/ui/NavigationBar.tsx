"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { useLenis } from "@/components/ui/SmoothScrollProvider";
import { siteConfig } from "@/lib/config/site";
import { useScrollToSection } from "@/lib/navigation/use-scroll-to-section";
import {
  isNavLinkActive,
  useNavActiveState,
} from "@/lib/navigation/use-nav-active-state";
import { NAV_INTRO_DURATION, REVEAL_EASE } from "@/lib/motion/reveal-presets";

export interface NavigationBarLink {
  label: string;
  href?: string;
  sectionId?: string;
}

export interface NavigationBarProps {
  logo?: ReactNode;
  logoSectionId?: string;
  links?: NavigationBarLink[];
  ctaLabel?: string;
  ctaSectionId?: string;
  className?: string;
}

const defaultLinks: NavigationBarLink[] = [
  { label: "About", sectionId: "about" },
  { label: "Services", sectionId: "services" },
  { label: "Blogs", href: "/blog" },
  { label: "Contact", sectionId: "contact" },
];

export function NavigationBar({
  logo,
  logoSectionId = "hero",
  links = defaultLinks,
  ctaLabel = "Request Quote",
  ctaSectionId = "contact",
  className = "",
}: NavigationBarProps) {
  const scrollToSection = useScrollToSection();
  const activeKey = useNavActiveState();
  // No mobile frame exists in the Figma design, so the collapse breakpoint
  // and drawer treatment below `md` are a judgment call.
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Sections (e.g. the hero) size themselves against the nav's real height via
  // the `--layout-nav-height` CSS var. Measuring it here — rather than hardcoding
  // a guessed constant — keeps it correct across breakpoints, font loading, and
  // future content changes.
  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const updateHeight = () => {
      document.documentElement.style.setProperty(
        "--layout-nav-height",
        `${header.offsetHeight}px`,
      );
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(header);

    return () => observer.disconnect();
  }, []);

  // Auto-hide on scroll down, reappear on scroll up. Direction is committed
  // only once cumulative movement exceeds a small threshold (rather than every
  // rAF tick) so trackpad/rubber-band jitter can't flip the nav back and forth.
  const [isHidden, setIsHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const lenis = useLenis();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let frameId: number | null = null;
    const DIRECTION_THRESHOLD = 8;
    const TOP_THRESHOLD = 10;

    const handleScroll = (y: number) => {
      if (frameId !== null) return;
      frameId = requestAnimationFrame(() => {
        frameId = null;

        setIsScrolled(y > TOP_THRESHOLD);

        if (y < TOP_THRESHOLD) {
          setIsHidden(false);
          lastScrollY.current = y;
        } else if (Math.abs(y - lastScrollY.current) > DIRECTION_THRESHOLD) {
          setIsHidden(y > lastScrollY.current);
          lastScrollY.current = y;
        }
      });
    };

    const initialY = lenis ? lenis.scroll : window.scrollY;
    setIsScrolled(initialY > TOP_THRESHOLD);
    lastScrollY.current = initialY;

    if (lenis) {
      const onLenisScroll = (instance: typeof lenis) => {
        handleScroll(instance.scroll);
      };
      const unsubscribe = lenis.on("scroll", onLenisScroll);

      return () => {
        unsubscribe();
        if (frameId !== null) cancelAnimationFrame(frameId);
      };
    }

    const onScroll = () => handleScroll(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, [lenis]);

  // Never hide the nav while the mobile drawer is open — it shouldn't be able
  // to slide away out from under an open menu.
  const isVisuallyHidden = isHidden && !isMenuOpen;

  const logoContent =
    logo ?? (
      <Image
        src="/images/logo-mark.svg"
        alt={siteConfig.name}
        width={102}
        height={42}
        className="h-[42px] w-auto"
        priority
      />
    );

  return (
    <motion.header
      ref={headerRef}
      initial={{ y: reduceMotion ? 0 : "-100%" }}
      animate={{ y: isVisuallyHidden ? "-100%" : "0%" }}
      transition={{ duration: NAV_INTRO_DURATION, ease: REVEAL_EASE }}
      className={`fixed inset-x-0 top-0 z-50 flex items-center justify-center px-4 py-4 transition-[background-color,backdrop-filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:duration-0 ${
        isScrolled
          ? "bg-bg-base/80 backdrop-blur-md"
          : "bg-transparent"
      } ${className}`}
    >
      <div className="flex w-full max-w-[1800px] items-center">
        <div className="flex w-[200px] shrink-0 items-center">
          <button
            type="button"
            onClick={() => {
              setIsMenuOpen(false);
              scrollToSection(logoSectionId);
            }}
            className="inline-flex cursor-pointer items-center"
            aria-label={`${siteConfig.name} home`}
          >
            {logoContent}
          </button>
        </div>

        <nav
          className="hidden min-w-0 flex-1 flex-wrap items-center justify-center gap-3 md:flex"
          aria-label="Main navigation"
        >
          {links.map((link) => (
            <Button
              key={link.label}
              href={link.href}
              sectionId={link.sectionId}
              active={isNavLinkActive(link, activeKey)}
              variant="ghost"
              size="l"
              className="px-3 py-2"
            >
              {link.label}
            </Button>
          ))}
        </nav>

        <div className="hidden w-[200px] shrink-0 items-center justify-end md:flex">
          <Button sectionId={ctaSectionId} variant="outline" size="m">
            {ctaLabel}
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="ml-auto inline-flex items-center justify-center rounded-lg p-2 text-text-primary transition-colors hover:bg-bg-surface-raised md:hidden"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav-panel"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            {isMenuOpen ? (
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {isMenuOpen ? (
        <div
          id="mobile-nav-panel"
          className="absolute left-0 top-full z-50 w-full border-t border-border-default bg-bg-base p-4 md:hidden"
        >
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {links.map((link) => (
              <Button
                key={link.label}
                href={link.href}
                sectionId={link.sectionId}
                active={isNavLinkActive(link, activeKey)}
                variant="ghost"
                size="l"
                className="w-full justify-start px-3 py-3"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Button>
            ))}
          </nav>
          <div className="mt-4">
            <Button
              sectionId={ctaSectionId}
              variant="outline"
              size="m"
              className="w-full"
              onClick={() => setIsMenuOpen(false)}
            >
              {ctaLabel}
            </Button>
          </div>
        </div>
      ) : null}
    </motion.header>
  );
}
