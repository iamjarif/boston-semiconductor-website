import type { ReactNode } from "react";

import { Footer } from "@/components/ui/Footer";
import { NavigationBar } from "@/components/ui/NavigationBar";
import { SmoothScrollProvider } from "@/components/ui/SmoothScrollProvider";

interface SiteShellProps {
  children: ReactNode;
}

/** Shared layout wrapper used by marketing and blog route groups. */
export function SiteShell({ children }: SiteShellProps) {
  return (
    <SmoothScrollProvider>
      <NavigationBar />
      <main className="flex-1 pt-[var(--layout-nav-height)]">{children}</main>
      <Footer />
    </SmoothScrollProvider>
  );
}
