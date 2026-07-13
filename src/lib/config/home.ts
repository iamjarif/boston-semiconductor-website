import type { HomePageContent } from "@/types/content";

export const homeContent: HomePageContent = {
  hero: {
    eyebrow: "Semiconductor Innovation",
    title: "Powering the Future of Technology",
    subtitle:
      "From design to delivery, Boston Semiconductor provides end-to-end chip solutions that accelerate innovation across industries.",
    primaryCta: { label: "Explore Solutions", href: "#services" },
    secondaryCta: { label: "Read Our Blog", href: "/blog" },
  },
  services: [
    {
      title: "Chip Design",
      description:
        "Custom ASIC and SoC design services optimized for performance, power efficiency, and time-to-market.",
      icon: "design",
    },
    {
      title: "Fabrication",
      description:
        "State-of-the-art manufacturing partnerships delivering reliable, high-yield semiconductor production.",
      icon: "manufacturing",
    },
    {
      title: "Wafer Testing",
      description:
        "Comprehensive validation and quality assurance ensuring every device meets rigorous industry standards.",
      icon: "testing",
    },
    {
      title: "Integrated Solutions",
      description:
        "Full-stack semiconductor services from concept to commercialization under one trusted partner.",
      icon: "chip",
    },
  ],
  stats: [
    { value: "25+", label: "Years of Experience" },
    { value: "500M+", label: "Chips Delivered" },
    { value: "99.9%", label: "Yield Rate" },
    { value: "40+", label: "Global Partners" },
  ],
  about: {
    title: "Engineering Excellence in Semiconductors",
    description:
      "Boston Semiconductor combines deep technical expertise with a commitment to innovation. Our team of engineers and scientists work at the forefront of chip technology, delivering solutions that power everything from consumer electronics to autonomous systems.",
    highlights: [
      "ISO 9001 certified manufacturing processes",
      "Advanced node support down to 3nm",
      "Dedicated R&D lab in Boston, MA",
    ],
    cta: { label: "Learn More About Us", href: "#about" },
  },
  cta: {
    title: "Ready to Build the Future?",
    description:
      "Partner with Boston Semiconductor to bring your next-generation chip designs to life. Our team is ready to discuss your project.",
    cta: { label: "Get in Touch", href: "mailto:info@bostonsemiconductor.com" },
  },
};
