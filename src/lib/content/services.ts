export interface ServiceOffering {
  caption: string;
  title: string;
  description: string;
}

/** Canonical service list — used on the homepage grid and site footer. */
export const serviceOfferings: ServiceOffering[] = [
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
      "Design and engineering support for quantum hardware — from cryo-CMOS control circuitry to qubit interconnect and packaging challenges unique to sub-Kelvin operation.",
  },
  {
    caption: "// 06",
    title: "Physical Design",
    description:
      "Full RTL-to-GDSII implementation — synthesis, floorplan, CTS, routing and signoff on nodes down to 3nm.",
  },
  {
    caption: "// 07",
    title: "AMS Verification",
    description:
      "Our modeling team delivers deep expertise in analog behavioral modeling and AMS (Analog Mixed-Signal) verification for complex analog IPs. We enable early mixed-signal validation, reducing verification cycles while improving design-to-silicon confidence.",
  },
];
