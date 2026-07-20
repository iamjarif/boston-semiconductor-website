import Image from "next/image";

import { GlowOrb } from "@/components/ui/GlowOrb";

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

export function ProcessBreakdown() {
  return (
    <section className="relative flex flex-col items-center gap-16 overflow-hidden bg-bg-base px-4 py-24 lg:py-[140px]">
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

      <div className="relative z-10 flex w-full max-w-[1316px] flex-col gap-16">
        {processBlocks.map((block) => (
          <div
            key={block.title}
            className={`flex flex-col items-center gap-8 lg:flex-row lg:gap-8 ${
              block.imageSide === "left" ? "lg:flex-row-reverse" : ""
            }`}
          >
            <div className="flex w-full flex-col items-start gap-7 lg:w-1/2">
              <h3 className="text-h3 text-text-primary">{block.title}</h3>
              <p className="text-body text-text-primary">
                {block.description}
              </p>
              <ul className="list-disc space-y-1 pl-6 text-body text-text-secondary">
                {block.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
            <div className="relative h-[300px] w-full overflow-hidden rounded-3xl lg:h-[500px] lg:w-1/2">
              <Image
                src={block.image.src}
                alt={block.image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 550px"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
