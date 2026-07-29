/** Responsive horizontal page gutter — 16px / 24px / 32px at md / lg breakpoints. */
export const PAGE_PADDING_X = "px-4 md:px-6 lg:px-8";

export const CONTAINER_MAX_WIDTH = "max-w-[1316px]";
export const ARTICLE_MAX_WIDTH = "max-w-[750px]";
export const NAV_MAX_WIDTH = "max-w-[1800px]";

/** Standard page container: centered, max-width, responsive horizontal padding. */
export function containerClassName(
  maxWidth: string = CONTAINER_MAX_WIDTH,
  extra = "",
) {
  return `mx-auto w-full ${maxWidth} ${PAGE_PADDING_X}${extra ? ` ${extra}` : ""}`;
}
