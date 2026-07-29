import type { ElementType, ReactNode } from "react";

import {
  ARTICLE_MAX_WIDTH,
  CONTAINER_MAX_WIDTH,
  NAV_MAX_WIDTH,
  PAGE_PADDING_X,
} from "@/lib/layout/container";

export { PAGE_PADDING_X } from "@/lib/layout/container";

const maxWidthBySize = {
  default: CONTAINER_MAX_WIDTH,
  article: ARTICLE_MAX_WIDTH,
  nav: NAV_MAX_WIDTH,
  none: "",
} as const;

type ContainerSize = keyof typeof maxWidthBySize;

interface ContainerProps {
  as?: ElementType;
  size?: ContainerSize;
  className?: string;
  children: ReactNode;
}

/** Centered content wrapper with site-wide responsive horizontal padding. */
export function Container({
  as: Component = "div",
  size = "default",
  className = "",
  children,
}: ContainerProps) {
  const maxWidth = maxWidthBySize[size];
  return (
    <Component
      className={`mx-auto w-full ${PAGE_PADDING_X} ${maxWidth} ${className}`.trim()}
    >
      {children}
    </Component>
  );
}
