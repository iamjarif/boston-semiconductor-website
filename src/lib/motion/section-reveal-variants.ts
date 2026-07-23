import {
  SECTION_REVEAL_BLUR,
  SECTION_REVEAL_CHILD_STAGGER,
  SECTION_REVEAL_DURATION,
  SECTION_REVEAL_EASE,
  SECTION_REVEAL_STAGGER,
  SECTION_REVEAL_Y,
} from "@/lib/motion/reveal-presets";

export const sectionRevealContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: SECTION_REVEAL_STAGGER },
  },
};

export const sectionRevealGroup = {
  hidden: {},
  visible: {
    transition: { staggerChildren: SECTION_REVEAL_CHILD_STAGGER },
  },
};

export const sectionRevealItem = {
  hidden: {
    opacity: 0,
    y: SECTION_REVEAL_Y,
    filter: `blur(${SECTION_REVEAL_BLUR})`,
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: SECTION_REVEAL_DURATION, ease: SECTION_REVEAL_EASE },
  },
};

export const sectionRevealItemLayout = {
  hidden: {
    opacity: 0,
    y: SECTION_REVEAL_Y,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: SECTION_REVEAL_DURATION, ease: SECTION_REVEAL_EASE },
  },
};

export const sectionRevealItemBlur = {
  hidden: {
    filter: `blur(${SECTION_REVEAL_BLUR})`,
  },
  visible: {
    filter: "blur(0px)",
    transition: { duration: SECTION_REVEAL_DURATION, ease: SECTION_REVEAL_EASE },
  },
};
