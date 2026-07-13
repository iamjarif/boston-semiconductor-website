import type { SiteConfig } from "@/types/content";

export const siteConfig: SiteConfig = {
  name: "Boston Semiconductor",
  tagline: "Advanced semiconductor solutions for tomorrow's technology",
  navLinks: [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
  ],
  footerColumns: [
    {
      title: "Company",
      links: [
        { label: "Home", href: "/" },
        { label: "Blog", href: "/blog" },
      ],
    },
    {
      title: "Connect",
      links: [
        { label: "Contact", href: "mailto:info@bostonsemiconductor.com" },
        { label: "LinkedIn", href: "https://linkedin.com" },
      ],
    },
  ],
  socialLinks: [
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "Twitter", href: "https://twitter.com" },
  ],
  metadata: {
    title: "Boston Semiconductor | Advanced Chip Solutions",
    description:
      "Boston Semiconductor delivers cutting-edge semiconductor design, manufacturing, and testing solutions for the world's most demanding applications.",
  },
};
