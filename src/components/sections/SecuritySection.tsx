import {
  FingerprintSimple,
  Lock,
  ShieldCheck,
  Vault,
} from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";

import { Card } from "@/components/ui/Card";
import { GlowOrb } from "@/components/ui/GlowOrb";

interface SecurityCardData {
  icon: ReactNode;
  title: string;
  bullets: string[];
}

const securityCards: SecurityCardData[] = [
  {
    icon: <ShieldCheck size={42} weight="bold" />,
    title: "IP & Legal",
    bullets: [
      "NDA signed by all personnel",
      "Work-for-hire \u2014 client owns IP",
      "Export regulation adherence",
    ],
  },
  {
    icon: <FingerprintSimple size={42} weight="bold" />,
    title: "Device & Data",
    bullets: [
      "Air-gapped RTL/Netlist/GDS machines",
      "Full-disk encryption, EDR tools",
      "No BYOD \u2014 company devices only",
    ],
  },
  {
    icon: <Vault size={42} weight="bold" />,
    title: "Access Control",
    bullets: [
      "Biometric ODC room access",
      "MFA on all engineering systems",
      "Role-based version control",
    ],
  },
  {
    icon: <Lock size={42} weight="bold" />,
    title: "Device & Data",
    bullets: [
      "Encrypted VPN to client servers",
      "24/7 ODC surveillance",
      "Dedicated Bridge Engineer",
    ],
  },
];

export function SecuritySection() {
  return (
    <section
      id="ip-security"
      className="relative flex items-center justify-center overflow-hidden bg-bg-base px-4 py-24 lg:py-[140px]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] overflow-visible"
      >
        <GlowOrb
          src="/images/glows/glow-security-1.svg"
          size={299}
          className="right-[-100px] top-1/2 -translate-y-1/2"
        />
        <GlowOrb
          src="/images/glows/glow-security-2.svg"
          size={524}
          rotate={-165}
          className="left-[-250px] top-1/3"
        />
      </div>

      <div className="relative z-10 flex w-full max-w-[1316px] flex-col items-center gap-8 lg:flex-row">
        <div className="flex flex-1 flex-col items-start gap-7 text-left">
          <div className="flex flex-col items-start gap-3">
            <p className="text-mono-lg text-brand-primary">IP SECURITY</p>
            <h2 className="bg-gradient-to-b from-text-primary to-neutral-800 bg-clip-text text-h1 text-transparent">
              Your IP never leaves the ODC.
            </h2>
          </div>
          <p className="max-w-[750px] text-body text-text-secondary">
            Enterprise-grade protection at our Bangladesh offshore
            development center.
          </p>
        </div>

        <div className="grid w-full flex-1 auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2">
          {securityCards.map((card) => (
            <Card
              key={card.title + card.bullets[0]}
              icon={card.icon}
              title={card.title}
              showCaption={false}
              hoverEffect={false}
              subText={
                <ul className="list-disc space-y-1 pl-5">
                  {card.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
