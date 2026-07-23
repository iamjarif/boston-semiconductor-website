"use client";

import { usePathname } from "next/navigation";

export type NavActiveKey = "blog" | null;

export interface NavLinkLike {
  href?: string;
  sectionId?: string;
}

export function isNavLinkActive(
  link: NavLinkLike,
  activeKey: NavActiveKey,
): boolean {
  if (activeKey !== "blog") return false;
  return link.href?.startsWith("/blog") ?? false;
}

/** Highlights nav items only for route-based pages (e.g. blog), not homepage sections. */
export function useNavActiveState(): NavActiveKey {
  const pathname = usePathname();
  return pathname.startsWith("/blog") ? "blog" : null;
}
