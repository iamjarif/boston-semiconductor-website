"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/Button";
import { useLenis } from "@/components/ui/SmoothScrollProvider";
import { siteConfig } from "@/lib/config/site";
import { useScrollToSection } from "@/lib/navigation/use-scroll-to-section";
import {
  isNavLinkActive,
  useNavActiveState,
} from "@/lib/navigation/use-nav-active-state";
import {
  BUTTON_REVEAL_EASE,
  NAV_INTRO_DURATION,
  REVEAL_EASE,
} from "@/lib/motion/reveal-presets";

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

const DRAWER_DURATION = 0.3;
const DRAWER_EASE = BUTTON_REVEAL_EASE;
const ITEM_STAGGER = 0.04;

const backdropVariants: Variants = {
  closed: { opacity: 0 },
  open: { opacity: 1 },
};

const drawerVariants: Variants = {
  closed: { x: "100%" },
  open: { x: 0 },
};

const menuVariants: Variants = {
  closed: {
    transition: { staggerChildren: 0.03, staggerDirection: -1 },
  },
  open: {
    transition: { staggerChildren: ITEM_STAGGER, delayChildren: 0.06 },
  },
};

const menuItemVariants: Variants = {
  closed: { opacity: 0, x: 12 },
  open: {
    opacity: 1,
    x: 0,
    transition: { duration: DRAWER_DURATION, ease: DRAWER_EASE },
  },
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

function CloseIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  const reduceMotion = useReducedMotion();
  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: DRAWER_DURATION, ease: DRAWER_EASE };

  const topBar = open
    ? { y: 6, rotate: 45 }
    : { y: 0, rotate: 0 };
  const middleBar = open
    ? { opacity: 0, scaleX: 0 }
    : { opacity: 1, scaleX: 1 };
  const bottomBar = open
    ? { y: -6, rotate: -45 }
    : { y: 0, rotate: 0 };

  return (
    <span className="relative block size-6" aria-hidden="true">
      <motion.span
        className="absolute left-0 top-1 block h-0.5 w-6 origin-center rounded-full bg-current"
        animate={topBar}
        transition={transition}
      />
      <motion.span
        className="absolute left-0 top-[11px] block h-0.5 w-6 origin-center rounded-full bg-current"
        animate={middleBar}
        transition={transition}
      />
      <motion.span
        className="absolute bottom-1 left-0 block h-0.5 w-6 origin-center rounded-full bg-current"
        animate={bottomBar}
        transition={transition}
      />
    </span>
  );
}

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  links: NavigationBarLink[];
  activeKey: ReturnType<typeof useNavActiveState>;
  ctaLabel: string;
  ctaSectionId: string;
}

function MobileNavDrawer({
  isOpen,
  onClose,
  links,
  activeKey,
  ctaLabel,
  ctaSectionId,
}: MobileNavDrawerProps) {
  const drawerRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: DRAWER_DURATION, ease: DRAWER_EASE };

  useEffect(() => {
    if (!isOpen || !drawerRef.current) return;

    const drawer = drawerRef.current;
    const focusable = Array.from(
      drawer.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    ).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);

    const previouslyFocused = document.activeElement as HTMLElement | null;
    focusable[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [isOpen, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-[60] bg-bg-base/70 backdrop-blur-sm lg:hidden"
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={transition}
            onClick={onClose}
          />
          <motion.aside
            ref={drawerRef}
            id="mobile-nav-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-[min(100%,320px)] flex-col border-l border-border-default bg-bg-base/95 shadow-[-8px_0_32px_rgba(0,0,0,0.35)] backdrop-blur-md lg:hidden"
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={transition}
          >
            <div className="flex shrink-0 items-center justify-end border-b border-border-default px-4 py-3">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-lg p-2 text-text-primary transition-colors pointer-fine:hover:bg-bg-surface-raised"
                aria-label="Close menu"
              >
                <CloseIcon />
              </button>
            </div>

            <motion.div
              className="flex min-h-0 flex-1 flex-col"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <nav
                className="flex flex-1 flex-col gap-1 overflow-y-auto px-5 py-6"
                aria-label="Mobile navigation"
              >
                {links.map((link) => (
                  <motion.div key={link.label} variants={menuItemVariants}>
                    <Button
                      href={link.href}
                      sectionId={link.sectionId}
                      active={isNavLinkActive(link, activeKey)}
                      variant="ghost"
                      size="l"
                      className="w-full justify-start px-3 py-4 text-body font-medium"
                      onClick={onClose}
                    >
                      {link.label}
                    </Button>
                  </motion.div>
                ))}
              </nav>

              <div className="shrink-0 border-t border-border-default px-5 py-5">
                <motion.div variants={menuItemVariants}>
                  <Button
                    sectionId={ctaSectionId}
                    variant="outline"
                    size="m"
                    className="w-full"
                    onClick={onClose}
                  >
                    {ctaLabel}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

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

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <motion.header
        ref={headerRef}
        initial={{ y: reduceMotion ? 0 : "-100%" }}
        animate={{ y: isVisuallyHidden ? "-100%" : "0%" }}
        transition={{ duration: NAV_INTRO_DURATION, ease: REVEAL_EASE }}
        className={`fixed inset-x-0 top-0 z-50 flex items-center justify-center px-4 py-4 transition-[background-color,backdrop-filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:duration-0 ${
          isScrolled || isMenuOpen
            ? "bg-bg-base/80 backdrop-blur-md"
            : "bg-transparent"
        } ${className}`}
      >
        <div className="flex w-full max-w-[1800px] items-center">
          <div className="flex w-auto shrink-0 items-center lg:w-[200px]">
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
            className="hidden min-w-0 flex-1 flex-wrap items-center justify-center gap-3 lg:flex"
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

          <div className="hidden w-[200px] shrink-0 items-center justify-end lg:flex">
            <Button sectionId={ctaSectionId} variant="outline" size="m">
              {ctaLabel}
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="ml-auto inline-flex items-center justify-center rounded-lg p-2 text-text-primary transition-colors pointer-fine:hover:bg-bg-surface-raised lg:hidden"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav-panel"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <HamburgerIcon open={isMenuOpen} />
          </button>
        </div>
      </motion.header>

      {isMounted ? (
        <MobileNavDrawer
          isOpen={isMenuOpen}
          onClose={closeMenu}
          links={links}
          activeKey={activeKey}
          ctaLabel={ctaLabel}
          ctaSectionId={ctaSectionId}
        />
      ) : null}
    </>
  );
}
