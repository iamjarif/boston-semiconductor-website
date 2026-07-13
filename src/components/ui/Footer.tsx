import Link from "next/link";

import { siteConfig } from "@/lib/config/site";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-brand-primary-dark text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="text-h6">{siteConfig.name}</p>
            <p className="text-body-sm mt-2 text-white/70">{siteConfig.tagline}</p>
          </div>

          {siteConfig.footerColumns.map((column) => (
            <div key={column.title}>
              <h4 className="text-label-sm uppercase text-white/90">
                {column.title}
              </h4>
              <ul className="mt-4 space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-body-sm text-white/70 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-body-sm text-white/50">
            &copy; {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex gap-6">
            {siteConfig.socialLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-body-sm text-white/50 transition-colors hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
