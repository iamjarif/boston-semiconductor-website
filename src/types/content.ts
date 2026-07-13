export interface CTA {
  label: string;
  href: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface HeroContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryCta: CTA;
  secondaryCta?: CTA;
}

export interface ServiceItem {
  title: string;
  description: string;
  icon: "chip" | "design" | "manufacturing" | "testing";
}

export interface StatItem {
  value: string;
  label: string;
}

export interface AboutTeaserContent {
  title: string;
  description: string;
  highlights: string[];
  cta: CTA;
}

export interface CtaBannerContent {
  title: string;
  description: string;
  cta: CTA;
}

export interface HomePageContent {
  hero: HeroContent;
  services: ServiceItem[];
  stats: StatItem[];
  about: AboutTeaserContent;
  cta: CtaBannerContent;
}

export interface FooterColumn {
  title: string;
  links: NavLink[];
}

export interface SiteConfig {
  name: string;
  tagline: string;
  navLinks: NavLink[];
  footerColumns: FooterColumn[];
  socialLinks: NavLink[];
  metadata: {
    title: string;
    description: string;
  };
}
