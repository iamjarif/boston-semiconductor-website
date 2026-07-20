"use client";

import { motion, useReducedMotion } from "motion/react";
import { useSyncExternalStore, type ReactNode } from "react";

import {
  BUTTON_REVEAL_DURATION,
  BUTTON_REVEAL_EASE,
} from "@/lib/motion/reveal-presets";

interface ButtonLabelRevealProps {
  label?: string;
  disabled?: boolean;
  hovered?: boolean;
  className?: string;
  children?: ReactNode;
}

const hoverMediaQuery = "(hover: hover) and (pointer: fine)";

function subscribeToHoverCapability(onStoreChange: () => void) {
  const media = window.matchMedia(hoverMediaQuery);
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function getHoverCapabilitySnapshot() {
  return window.matchMedia(hoverMediaQuery).matches;
}

function getHoverCapabilityServerSnapshot() {
  return false;
}

function usePrefersHover() {
  return useSyncExternalStore(
    subscribeToHoverCapability,
    getHoverCapabilitySnapshot,
    getHoverCapabilityServerSnapshot,
  );
}

const revealTransition = {
  duration: BUTTON_REVEAL_DURATION,
  ease: BUTTON_REVEAL_EASE,
};

export function ButtonLabelReveal({
  label,
  disabled = false,
  hovered: isHovered = false,
  className = "",
  children,
}: ButtonLabelRevealProps) {
  const reduceMotion = useReducedMotion();
  const canHover = usePrefersHover();

  if (!label) {
    return children ? <span className={className}>{children}</span> : null;
  }

  if (disabled || reduceMotion) {
    return <span className={className}>{label}</span>;
  }

  const hovered = canHover && isHovered;

  return (
    <span className={`inline-block overflow-hidden [height:1lh] ${className}`}>
      <motion.span
        className="flex flex-col will-change-transform"
        initial={false}
        animate={{ y: hovered ? "-50%" : "0%" }}
        transition={revealTransition}
      >
        <motion.span
          className="block"
          initial={false}
          animate={{ opacity: hovered ? 0 : 1 }}
          transition={revealTransition}
        >
          {label}
        </motion.span>
        <motion.span
          className="block"
          aria-hidden="true"
          initial={false}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={revealTransition}
        >
          {label}
        </motion.span>
      </motion.span>
    </span>
  );
}
