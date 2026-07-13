import type { ReactNode } from "react";

import { Footer } from "@/components/ui/Footer";
import { Nav } from "@/components/ui/Nav";

interface SiteShellProps {
  children: ReactNode;
}

/** Shared layout wrapper used by marketing and blog route groups. */
export function SiteShell({ children }: SiteShellProps) {
  return (
    <>
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
