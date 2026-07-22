"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import {
  createContext,
  useContext,
  useRef,
  type ReactNode,
} from "react";

import {
  sectionRevealContainer,
  sectionRevealGroup,
  sectionRevealItem,
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
  const reduceMotion = useReducedMotion();

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
        animate={isInView ? "visible" : "hidden"}
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
}

export function SectionRevealItem({
  children,
  className = "",
  as = "div",
}: SectionRevealItemProps) {
  const motionEnabled = useContext(SectionRevealMotionContext);

  if (!motionEnabled) {
    if (as === "p") {
      return <p className={className}>{children}</p>;
    }
    return <div className={className}>{children}</div>;
  }

  if (as === "p") {
    return (
      <motion.p className={className} variants={sectionRevealItem}>
        {children}
      </motion.p>
    );
  }

  return (
    <motion.div className={className} variants={sectionRevealItem}>
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
