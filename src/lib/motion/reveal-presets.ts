import type { Easing } from "motion/react";

export const REVEAL_EASE: Easing = [0.16, 1, 0.3, 1];
export const REVEAL_DURATION = 0.7;
export const REVEAL_Y = 24;
export const REVEAL_SCALE = 0.96;
export const REVEAL_VIEWPORT = { once: true, amount: 0.25 } as const;

export const NAV_INTRO_DURATION = 0.65;

export const BUTTON_REVEAL_DURATION = 0.3;
export const BUTTON_REVEAL_EASE: Easing = [0.22, 1, 0.36, 1];
