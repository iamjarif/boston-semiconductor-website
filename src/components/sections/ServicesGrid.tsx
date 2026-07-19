import { Card } from "@/components/ui/Card";
import { GlowOrb } from "@/components/ui/GlowOrb";

interface ServiceCardData {
  caption: string;
  title: string;
  description: string;
  wide?: boolean;
}

const services: ServiceCardData[] = [
  {
    caption: "// 01",
    title: "3D-IC Design",
    description:
      "Advanced 3D integration, chiplet architecture, die-to-die interfaces, and TSV design for next-gen packaging.",
  },
  {
    caption: "// 02",
    title: "Silicon Photonics",
    description:
      "Photonic IC design and integration services spanning waveguides, modulators, and electronic-photonic co-packaging for high-bandwidth optical interconnect.",
  },
  {
    caption: "// 03",
    title: "RF & Analog",
    description:
      "Transceivers, PLLs/synthesizers, and high-speed analog interfaces for 5G, Wi-Fi, automotive, and IoT applications.",
  },
  {
    caption: "// 05",
    title: "TCAD Simulation",
    description:
      "Process and device simulation, PDK calibration, and SPICE model extraction using Sentaurus TCAD and Silvaco Atlas/Victory.",
  },
  {
    caption: "// 04",
    title: "Quantum Computing",
    description:
      "Design and engineering support for quantum hardware \u2014 from cryo-CMOS control circuitry to qubit interconnect and packaging challenges unique to sub-Kelvin operation.",
  },
  {
    caption: "// 06",
    title: "Physical Design",
    description:
      "Full RTL-to-GDSII implementation \u2014 synthesis, floorplan, CTS, routing and signoff on nodes down to 3nm.",
  },
  {
    caption: "// 07",
    title: "AMS Verification",
    description:
      "Our Modeling team brings deep expertise in analog behavioral modeling, enabling accurate and efficient AMS (Analog Mixed-Signal) verification of complex analog IPs. This capability strengthens our ability to validate mixed-signal designs early, reducing verification cycles and improving design-to-silicon confidence.",
    wide: true,
  },
];

export function ServicesGrid() {
  return (
    <section
      id="services"
      className="relative flex flex-col items-center gap-16 overflow-hidden bg-bg-surface px-4 py-24 lg:py-[140px]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] overflow-visible"
      >
        <GlowOrb
          src="/images/glows/glow-services.svg"
          size={477}
          rotate={-90}
          className="left-1/2 top-[-50px] -translate-x-1/2"
        />
      </div>

      <div className="relative z-10 flex max-w-[1316px] flex-col items-center gap-7 text-center">
        <div className="flex flex-col items-center gap-3">
          <p className="text-mono-lg text-brand-primary">CORE SERVICES</p>
          <h2 className="bg-gradient-to-b from-text-primary to-neutral-800 bg-clip-text text-h1 text-transparent">
            Our Expertise.
          </h2>
        </div>
        <p className="max-w-[750px] text-body text-text-secondary">
          Full-stack semiconductor design capability, mapped the way our
          engineers actually think about a chip.
        </p>
      </div>

      <div className="relative z-10 grid w-full max-w-[1316px] grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service) => (
          <Card
            key={service.title}
            caption={service.caption}
            title={service.title}
            subText={service.description}
            className={`!bg-bg-base ${service.wide ? "lg:col-span-2" : ""}`}
          />
        ))}
      </div>
    </section>
  );
}
