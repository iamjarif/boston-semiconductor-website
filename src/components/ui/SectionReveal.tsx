"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  sectionRevealContainer,
  sectionRevealGroup,
  sectionRevealItem,
  sectionRevealItemBlur,
  sectionRevealItemLayout,
} from "@/lib/motion/section-reveal-variants";
import { REVEAL_VIEWPORT } from "@/lib/motion/reveal-presets";

const SectionRevealMotionContext = createContext(false);

interface SectionRevealProps {
  children: ReactNode;
  className?: string;
}

export function SectionRevealRoot({ children, className = "" }: SectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, REVEAL_VIEWPORT);
  const [hasRevealed, setHasRevealed] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (isInView) {
      setHasRevealed(true);
    }
  }, [isInView]);

  if (reduceMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <SectionRevealMotionContext.Provider value={true}>
      <motion.div
        ref={ref}
        className={className}
        variants={sectionRevealContainer}
        initial="hidden"
        animate={hasRevealed ? "visible" : "hidden"}
      >
        {children}
      </motion.div>
    </SectionRevealMotionContext.Provider>
  );
}

interface SectionRevealItemProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "p";
  layoutOnly?: boolean;
  blurFromLg?: boolean;
}

export function SectionRevealItem({
  children,
  className = "",
  as = "div",
  layoutOnly = false,
  blurFromLg = false,
}: SectionRevealItemProps) {
  const motionEnabled = useContext(SectionRevealMotionContext);
  const [applyBlur, setApplyBlur] = useState(!blurFromLg);

  useEffect(() => {
    if (!blurFromLg) return;

    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const update = () => setApplyBlur(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, [blurFromLg]);

  const variants =
    layoutOnly || (blurFromLg && !applyBlur)
      ? sectionRevealItemLayout
      : sectionRevealItem;

  if (!motionEnabled) {
    if (as === "p") {
      return <p className={className}>{children}</p>;
    }
    return <div className={className}>{children}</div>;
  }

  if (as === "p") {
    return (
      <motion.p className={className} variants={variants}>
        {children}
      </motion.p>
    );
  }

  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}

export function SectionRevealBlurWrap({
  children,
  className = "",
  blurFromLg = false,
}: SectionRevealProps & { blurFromLg?: boolean }) {
  const motionEnabled = useContext(SectionRevealMotionContext);
  const [applyBlur, setApplyBlur] = useState(!blurFromLg);

  useEffect(() => {
    if (!blurFromLg) return;

    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const update = () => setApplyBlur(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, [blurFromLg]);

  if (!motionEnabled || !applyBlur) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} variants={sectionRevealItemBlur}>
      {children}
    </motion.div>
  );
}

export function SectionRevealGroup({ children, className = "" }: SectionRevealProps) {
  const motionEnabled = useContext(SectionRevealMotionContext);

  if (!motionEnabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} variants={sectionRevealGroup}>
      {children}
    </motion.div>
  );
}

export const SectionReveal = SectionRevealRoot;
