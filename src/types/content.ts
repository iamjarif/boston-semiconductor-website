export interface CTA {
  label: string;
  href: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  footerTagline: string;
  metadata: {
    title: string;
    description: string;
  };
  contact: {
    email: string;
    locations: Array<{
      label: string;
      detail: string;
    }>;
  };
  /** Omit entries until official profile URLs are confirmed. */
  social?: {
    linkedin?: string;
  };
}
