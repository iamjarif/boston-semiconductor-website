"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import {
  createElement,
  useMemo,
  useRef,
  type ReactNode,
} from "react";

import {
  REVEAL_EASE,
  REVEAL_VIEWPORT,
  SPLIT_TEXT_DURATION,
  SPLIT_TEXT_STAGGER,
  SPLIT_TEXT_Y,
} from "@/lib/motion/reveal-presets";

export interface SplitTextRevealProps {
  as?: "p" | "h1" | "h2" | "h3" | "span";
  className?: string;
  wordClassName?: string;
  children: string;
  stagger?: number;
  delay?: number;
}

function splitLineIntoTokens(line: string): string[] {
  return line.split(/(\s+)/);
}

export function SplitTextReveal({
  as: Tag = "p",
  className = "",
  wordClassName = "",
  children,
  stagger = SPLIT_TEXT_STAGGER,
  delay = 0,
}: SplitTextRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, REVEAL_VIEWPORT);
  const reduceMotion = useReducedMotion();

  const lines = useMemo(() => children.split("\n"), [children]);

  const content = useMemo(() => {
    if (reduceMotion) {
      return lines.map((line, lineIndex) => (
        <span key={lineIndex}>
          {lineIndex > 0 ? <br /> : null}
          {line}
        </span>
      ));
    }

    let wordIndex = 0;
    const nodes: ReactNode[] = [];

    lines.forEach((line, lineIndex) => {
      if (lineIndex > 0) {
        nodes.push(<br key={`br-${lineIndex}`} />);
      }

      splitLineIntoTokens(line).forEach((token, tokenIndex) => {
        if (/^\s+$/.test(token)) {
          nodes.push(token);
          return;
        }

        const currentWordIndex = wordIndex;
        wordIndex += 1;

        nodes.push(
          <motion.span
            key={`${lineIndex}-${tokenIndex}-${token}`}
            className={`inline-block ${wordClassName}`.trim()}
            initial={{ opacity: 0, y: SPLIT_TEXT_Y }}
            animate={
              isInView
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: SPLIT_TEXT_Y }
            }
            transition={{
              duration: SPLIT_TEXT_DURATION,
              delay: delay + currentWordIndex * stagger,
              ease: REVEAL_EASE,
            }}
          >
            {token}
          </motion.span>,
        );
      });
    });

    return nodes;
  }, [delay, isInView, lines, reduceMotion, stagger, wordClassName]);

  return createElement(Tag, { ref, className }, content);
}
