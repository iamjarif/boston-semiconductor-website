"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef, type ReactNode } from "react";

import {
  REVEAL_DURATION,
  REVEAL_EASE,
  REVEAL_SCALE,
  REVEAL_VIEWPORT,
  REVEAL_Y,
} from "@/lib/motion/reveal-presets";

export interface RevealInViewProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  scale?: number;
  variant?: "default" | "subtle";
}

export function RevealInView({
  children,
  className = "",
  delay = 0,
  duration = REVEAL_DURATION,
  y = REVEAL_Y,
  scale = REVEAL_SCALE,
  variant = "default",
}: RevealInViewProps) {
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

  const isSubtle = variant === "subtle";
  const hidden = isSubtle
    ? { opacity: 0 }
    : { opacity: 0, y, scale };
  const visible = isSubtle
    ? { opacity: 1 }
    : { opacity: 1, y: 0, scale: 1 };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={hidden}
      animate={isInView ? visible : hidden}
      transition={{
        duration: isSubtle ? 1 : duration,
        delay,
        ease: REVEAL_EASE,
      }}
    >
      {children}
    </motion.div>
  );
}
