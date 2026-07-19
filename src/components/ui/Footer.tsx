import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/lib/config/site";

interface FooterLink {
  label: string;
  href?: string;
}

interface FooterColumnData {
  heading: string;
  links: FooterLink[];
}

const footerColumns: FooterColumnData[] = [
  {
    heading: "Pages",
    links: [
      { label: "GaN Power", href: "/services/gan-power" },
      { label: "TCAD", href: "/services/tcad" },
      { label: "RF & Analog", href: "/services/rf-analog" },
      { label: "Place & Route", href: "/services/place-and-route" },
      { label: "3D-IC", href: "/services/3d-ic" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Engagement Models", href: "/#engagement-models" },
      { label: "IP Security", href: "/#ip-security" },
    ],
  },
  {
    heading: "Contact",
    links: [
      { label: "info@bostonsemiconductor.com", href: "mailto:info@bostonsemiconductor.com" },
      { label: "Dhaka, Bangladesh" },
      { label: "Management: USA" },
    ],
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="flex flex-col items-center justify-center gap-16 px-4 py-6">
      <div className="flex w-full max-w-[1316px] flex-col gap-12">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div className="flex min-w-[280px] flex-col gap-6">
            <Image
              src="/images/logo-mark.svg"
              alt={siteConfig.name}
              width={102}
              height={42}
              className="h-[42px] w-auto"
            />
            <p className="max-w-[280px] text-body text-text-secondary">
              Premier VLSI design services, headquartered in the USA with a
              design center in Dhaka, Bangladesh.
            </p>
          </div>

          <div className="flex flex-1 flex-wrap gap-8 sm:justify-end">
            {footerColumns.map((column) => (
              <div key={column.heading} className="flex min-w-[160px] flex-col gap-4">
                <h3 className="text-mono text-text-secondary">{column.heading}</h3>
                <ul className="flex flex-col gap-4">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      {link.href ? (
                        <Link
                          href={link.href}
                          className="text-body text-text-primary transition-colors hover:text-brand-primary"
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <span className="text-body text-text-primary">
                          {link.label}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center border-t border-border-default pt-8">
          <p className="text-center text-body-sm text-text-secondary">
            &copy; {currentYear} {siteConfig.name} Pvt Ltd. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
