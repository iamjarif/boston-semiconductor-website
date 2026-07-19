import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import type { ServiceItem } from "@/types/content";

interface ServicesSectionProps {
  services: ServiceItem[];
}

const iconMap: Record<ServiceItem["icon"], string> = {
  chip: "⬡",
  design: "◈",
  manufacturing: "▣",
  testing: "◎",
};

export function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <section id="services" className="bg-bg-base py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-h3 text-text-primary">
            Our Solutions
          </h2>
          <p className="text-body-lg mt-4 text-text-secondary">
            End-to-end semiconductor services tailored to your needs
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Card key={service.title}>
              <CardHeader>
                <span
                  className="mb-2 inline-block text-2xl text-brand-primary"
                  aria-hidden="true"
                >
                  {iconMap[service.icon]}
                </span>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardDescription>{service.description}</CardDescription>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
