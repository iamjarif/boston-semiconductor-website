"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

import { useLenis } from "@/components/ui/SmoothScrollProvider";
import {
  scrollToSection,
  setPendingSectionScroll,
} from "@/lib/navigation/scroll-to-section";

export function useScrollToSection() {
  const lenis = useLenis();
  const pathname = usePathname();
  const router = useRouter();

  return useCallback(
    (sectionId: string) => {
      if (pathname === "/") {
        scrollToSection(sectionId, lenis);
        return;
      }

      setPendingSectionScroll(sectionId);
      router.push("/", { scroll: false });
    },
    [lenis, pathname, router],
  );
}
