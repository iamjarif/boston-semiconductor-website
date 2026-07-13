import type { Metadata } from "next";

import { SiteShell } from "@/components/ui/SiteShell";

export const metadata: Metadata = {
  title: "Blog | Boston Semiconductor",
  description:
    "Insights, news, and technical articles from the Boston Semiconductor team.",
};

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SiteShell>{children}</SiteShell>;
}
