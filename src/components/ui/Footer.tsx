"use client";

import Image from "next/image";
import type { ReactNode } from "react";

import { FooterLink } from "@/components/ui/FooterLink";
import { FooterNewsletter } from "@/components/ui/FooterNewsletter";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { serviceOfferings } from "@/lib/content/services";
import { siteConfig } from "@/lib/config/site";
import { useScrollToSection } from "@/lib/navigation/use-scroll-to-section";

function LinkedInIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-5"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.126 0 2.063 2.063 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

interface FooterColumnProps {
  heading: string;
  children: ReactNode;
}

function FooterColumn({ heading, children }: FooterColumnProps) {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <h3 className="text-mono text-text-secondary">{heading}</h3>
      <ul className="flex flex-col gap-3">{children}</ul>
    </div>
  );
}

export function Footer() {
  const scrollToSection = useScrollToSection();
  const currentYear = new Date().getFullYear();
  const linkedInUrl = siteConfig.social?.linkedin;

  return (
    <footer className="relative overflow-hidden border-t border-border-default bg-bg-surface px-4 py-16 lg:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] overflow-visible"
      >
        <GlowOrb
          src="/images/glows/glow-contact-1.svg"
          size={524}
          className="left-[-180px] bottom-[-120px] scale-50 sm:scale-75 lg:scale-100"
        />
        <GlowOrb
          src="/images/glows/glow-mission-2.svg"
          size={299}
          rotate={45}
          className="right-[-80px] top-[-60px] scale-50 sm:scale-75 lg:scale-100"
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1316px] flex-col gap-12 lg:gap-16">
        {/* Top: brand + newsletter */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div className="flex max-w-md flex-col gap-5">
            <button
              type="button"
              onClick={() => scrollToSection("hero")}
              className="inline-flex w-fit items-center"
              aria-label={`${siteConfig.name} home`}
            >
              <Image
                src="/images/logo-mark.svg"
                alt={siteConfig.name}
                width={102}
                height={42}
                className="h-[42px] w-auto"
              />
            </button>
            <p className="text-body text-text-secondary">
              {siteConfig.footerTagline}
            </p>
          </div>

          <FooterNewsletter />
        </div>

        <div className="h-px w-full bg-border-default" aria-hidden="true" />

        {/* Middle: link columns */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <FooterColumn heading="Company">
            <li>
              <FooterLink sectionId="about">About</FooterLink>
            </li>
            <li>
              <FooterLink sectionId="contact">Contact</FooterLink>
            </li>
            <li>
              <FooterLink href="/blog">Blog</FooterLink>
            </li>
            <li>
              <FooterLink sectionId="engagement-models">
                Engagement Models
              </FooterLink>
            </li>
          </FooterColumn>

          <FooterColumn heading="Services">
            {serviceOfferings.map((service) => (
              <li key={service.title}>
                <FooterLink sectionId="services">{service.title}</FooterLink>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn heading="Resources">
            <li>
              <FooterLink href="/blog">Blog</FooterLink>
            </li>
            <li>
              <FooterLink sectionId="ip-security">IP Security</FooterLink>
            </li>
            <li>
              <FooterLink sectionId="engagement-models">
                Engagement Models
              </FooterLink>
            </li>
          </FooterColumn>

          <FooterColumn heading="Contact">
            <li>
              <FooterLink
                href={`mailto:${siteConfig.contact.email}`}
                className="break-all"
              >
                {siteConfig.contact.email}
              </FooterLink>
            </li>
            {siteConfig.contact.locations.map((location) => (
              <li key={location.label} className="flex flex-col gap-0.5">
                <span className="text-mono-sm text-text-secondary">
                  {location.label}
                </span>
                <span className="text-body text-text-primary">
                  {location.detail}
                </span>
              </li>
            ))}
          </FooterColumn>
        </div>

        {linkedInUrl ? (
          <>
            <div className="h-px w-full bg-border-default" aria-hidden="true" />
            <div className="flex items-center gap-4">
              <span className="text-mono-sm text-text-secondary">Connect</span>
              <a
                href={linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border-default px-3 py-2 text-body-sm text-text-primary transition-colors pointer-fine:hover:border-border-strong pointer-fine:hover:text-brand-primary"
                aria-label="Boston Semiconductor on LinkedIn"
              >
                <LinkedInIcon />
                LinkedIn
              </a>
            </div>
          </>
        ) : null}

        <div className="h-px w-full bg-border-default" aria-hidden="true" />

        {/* Bottom bar */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-body-sm text-text-secondary">
            &copy; {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-mono-sm text-text-disabled">
            // Precision VLSI Engineering
          </p>
        </div>
      </div>
    </footer>
  );
}
