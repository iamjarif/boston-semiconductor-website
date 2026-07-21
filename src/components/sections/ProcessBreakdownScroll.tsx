"use client";

import { Check } from "@phosphor-icons/react/dist/ssr";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useLayoutEffect, useRef } from "react";

import { GlowOrb } from "@/components/ui/GlowOrb";
import { useLenis } from "@/components/ui/SmoothScrollProvider";

interface ProcessBlockData {
  title: string;
  description: string;
  bullets: string[];
  image: { src: string; alt: string };
  imageSide: "left" | "right";
}

const processBlocks: ProcessBlockData[] = [
  {
    title: "Device physics through to power stage.",
    description:
      "We design high-electron-mobility transistors (HEMTs) across GaN-on-Si and GaN-on-SiC processes \u2014 from gate driver co-design to thermal reliability analysis. Every device is simulated end-to-end with SPICE models calibrated to foundry PDKs, targeting EV chargers, telecom, and 5G power stages.",
    bullets: [
      "HEMT design \u00b7 GaN-on-Si & GaN-on-SiC",
      "Process simulation via Sentaurus TCAD & Silvaco Atlas",
      "I-V, C-V, transient & AC device analysis",
      "SPICE extraction calibrated to foundry PDKs",
    ],
    image: {
      src: "/images/process/hemt-device.png",
      alt: "Rendered HEMT die and gate driver package connected by ribbon leads",
    },
    imageSide: "right",
  },
  {
    title: "Advanced-node PnR, signed off.",
    description:
      "Full RTL-to-GDSII implementation from synthesis through DRC/LVS signoff, across nodes from 3nm to 90nm using Synopsys Fusion Compiler, Cadence Innovus, and ICC2. Low-power flows with multi-Vt, power gating, and UPF/CPF \u2014 plus 3D-IC chiplet integration including UCIe, HBM, and EMIB die-to-die interfaces. 10+ tapeouts delivered.",
    bullets: [
      "RTL-to-GDSII \u00b7 Synopsys FC \u00b7 Cadence Innovus \u00b7 ICC2",
      "Nodes: 3nm, 5nm, 7nm, 14nm, 28nm \u2192 90nm",
      "Low-power: multi-Vt, power gating, UPF/CPF",
      "Chiplet integration: UCIe \u00b7 HBM \u00b7 EMIB \u00b7 TSV",
    ],
    image: {
      src: "/images/process/pnr-tiles.png",
      alt: "Isometric floorplan tiles representing placed-and-routed standard cell blocks",
    },
    imageSide: "left",
  },
  {
    title: "RF-aware, parasitic-sensitive layout.",
    description:
      "Proven expertise across LNAs, PAs, mixers, VCO/PLLs, and full transceiver front-ends \u2014 verified via HFSS and Momentum/ADS EM simulation. We cover HDMI, MIPI, USB3.x, and PCIe analog interfaces, SerDes AFE, LVDS/DDR/LPDDR comboPHY, and 5G communication chip IP modules, all built with parasitic-sensitive custom layout at the core.",
    bullets: [
      "LNA \u00b7 PA \u00b7 Mixer \u00b7 VCO/PLL \u00b7 Synthesizer design",
      "Full TX/RX transceiver front-end architecture",
      "SerDes AFE \u00b7 LVDS/DDR/LPDDR comboPHY",
      "EM simulation: HFSS & Momentum/ADS",
    ],
    image: {
      src: "/images/process/rf-layout.png",
      alt: "RF die layout with concentric inductor rings and EM simulation overlay",
    },
    imageSide: "right",
  },
];

const CARD_SCALE_STEP = 0.04;
const CARD_OPACITY_STEP = 0.12;
const CARD_OPACITY_FLOOR = 0.7;
const CARD_PEEK_Y_PERCENT = 3;
const IMAGE_PARALLAX_PERCENT = 6;
const CARD_TRANSITION_VH = 0.8;
const CARD_HOLD_VH = 0.6;
// Reserved above (header peek) and mirrored below (empty band) so the stage
// stays symmetric in the viewport. Keep in sync with the stage's
// lg:h-[calc(...)] class below, which subtracts 2x this value.
const HEADER_PEEK_PX = 64;
const desktopMediaQuery = "(min-width: 1024px)";

function getNavHeightPx(): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--layout-nav-height")
    .trim();
  const parsed = parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function ProcessBreakdownScroll() {
  const stageRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    const isDesktop = window.matchMedia(desktopMediaQuery).matches;
    if (!isDesktop) return;

    // ScrollTrigger pin/scrub requires Lenis scrollerProxy from SmoothScrollProvider.
    if (!lenis) return;

    gsap.registerPlugin(ScrollTrigger);

    const stage = stageRef.current;
    if (!stage) return;

    const cards = gsap.utils.toArray<HTMLElement>(".stack-card", stage);
    const total = cards.length;
    if (total === 0) return;

    const transitionCount = Math.max(total - 1, 0);
    const totalTimelineVh =
      total * CARD_HOLD_VH + transitionCount * CARD_TRANSITION_VH;
    const stageHeightPx = stage.getBoundingClientRect().height;

    gsap.set(cards, { y: stageHeightPx, yPercent: 0 });
    gsap.set(cards[0], { y: 0, yPercent: 0 });

    cards.forEach((card, index) => {
      const imageInner = card.querySelector<HTMLElement>(".card-image-inner");
      if (!imageInner) return;

      gsap.set(imageInner, {
        yPercent: index === 0 ? 0 : IMAGE_PARALLAX_PERCENT,
      });
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stage,
        start: () => `top ${getNavHeightPx() + HEADER_PEEK_PX}px`,
        end: () => `+=${window.innerHeight * totalTimelineVh}`,
        pin: true,
        pinSpacing: true,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    for (let step = 1; step < total; step += 1) {
      const transitionStart =
        (step - 1) * (CARD_HOLD_VH + CARD_TRANSITION_VH) + CARD_HOLD_VH;

      for (let cardIndex = 0; cardIndex <= step; cardIndex += 1) {
        const behind = step - cardIndex;
        tl.to(
          cards[cardIndex],
          {
            y: 0,
            yPercent: behind === 0 ? 0 : -behind * CARD_PEEK_Y_PERCENT,
            scale: 1 - behind * CARD_SCALE_STEP,
            ease: "none",
            duration: CARD_TRANSITION_VH,
          },
          transitionStart,
        );

        const content = cards[cardIndex].querySelector<HTMLElement>(
          ".card-content",
        );
        if (content) {
          tl.to(
            content,
            {
              opacity: Math.max(
                CARD_OPACITY_FLOOR,
                1 - behind * CARD_OPACITY_STEP,
              ),
              ease: "none",
              duration: CARD_TRANSITION_VH,
            },
            transitionStart,
          );
        }
      }

      const enteringCard = cards[step];
      const imageInner = enteringCard.querySelector<HTMLElement>(
        ".card-image-inner",
      );

      if (imageInner) {
        tl.to(
          imageInner,
          { yPercent: 0, ease: "none", duration: CARD_TRANSITION_VH },
          transitionStart,
        );
      }
    }

    tl.to({}, { duration: CARD_HOLD_VH });

    const refreshScrollTriggers = () => ScrollTrigger.refresh();
    window.addEventListener("resize", refreshScrollTriggers);
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("resize", refreshScrollTriggers);
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [lenis]);

  return (
    <section className="relative flex flex-col items-center gap-16 overflow-clip bg-bg-base px-4 py-24 lg:py-[140px]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] overflow-visible"
      >
        <GlowOrb
          src="/images/glows/glow-process.svg"
          size={477}
          rotate={-90}
          className="left-1/2 top-[-100px] -translate-x-1/2"
        />
      </div>

      <div className="relative z-10 flex max-w-[1316px] flex-col items-center gap-7 text-center">
        <div className="flex flex-col items-center gap-3">
          <p className="text-mono-lg text-brand-primary">
            UNDER THE FLOORPLAN
          </p>
          <h2 className="bg-gradient-to-b from-text-primary to-neutral-800 bg-clip-text text-h1 text-transparent">
            How each block <br></br> actually gets built.
          </h2>
        </div>
        <p className="max-w-[750px] text-body text-text-secondary">
          The toolchains, nodes, and signoff criteria behind each service
          area.
        </p>
      </div>

      <div
        ref={stageRef}
        className="relative z-10 flex w-full max-w-[1316px] flex-col gap-16 lg:h-[calc(100vh-var(--layout-nav-height)-128px)] lg:gap-0"
      >
        {processBlocks.map((block, index) => (
          <div
            key={block.title}
            className="stack-card w-full will-change-transform lg:absolute lg:inset-0 lg:my-auto lg:h-[85%] lg:max-h-[820px] lg:rounded-[32px] lg:bg-bg-base lg:px-16 lg:py-16"
          >
            <div
              className={`card-content flex w-full flex-col items-center gap-8 lg:h-full lg:flex-row lg:gap-24 ${
                block.imageSide === "left" ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className="flex w-full flex-col items-start gap-7 lg:w-[58%]">
                <h3 className="text-h3 text-text-primary">{block.title}</h3>
                <p className="text-body text-text-primary">
                  {block.description}
                </p>
                <ul className="flex w-full flex-col text-body-sm text-text-secondary">
                  {block.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-3 border-t border-border-default py-3"
                    >
                      <Check
                        size={14}
                        weight="bold"
                        className="mt-[3px] shrink-0 text-brand-primary"
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative h-[300px] w-full overflow-hidden rounded-3xl lg:h-full lg:w-[42%]">
                <div className="card-image-inner absolute inset-0 scale-110 will-change-transform">
                  <Image
                    src={block.image.src}
                    alt={block.image.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 550px"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
