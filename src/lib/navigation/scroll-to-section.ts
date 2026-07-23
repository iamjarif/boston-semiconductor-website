import type Lenis from "lenis";

export const PENDING_SECTION_SCROLL_KEY = "pending-section-scroll";

export function getNavHeightOffset(): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--layout-nav-height")
    .trim();
  const parsed = parseFloat(raw);
  return Number.isFinite(parsed) ? -parsed : 0;
}

export function scrollToSection(sectionId: string, lenis: Lenis | null) {
  if (sectionId === "hero") {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    return true;
  }

  const element = document.getElementById(sectionId);
  if (!element) return false;

  const offset = getNavHeightOffset();

  if (lenis) {
    lenis.scrollTo(element, { offset, duration: 1.2 });
  } else {
    const top = element.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: "smooth" });
  }

  return true;
}

export function setPendingSectionScroll(sectionId: string) {
  sessionStorage.setItem(PENDING_SECTION_SCROLL_KEY, sectionId);
}

export function peekPendingSectionScroll(): string | null {
  return sessionStorage.getItem(PENDING_SECTION_SCROLL_KEY);
}

export function clearPendingSectionScroll() {
  sessionStorage.removeItem(PENDING_SECTION_SCROLL_KEY);
}
