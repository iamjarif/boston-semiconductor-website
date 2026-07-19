import { RevealInView } from "@/components/ui/RevealInView";
import { SplitTextReveal } from "@/components/ui/SplitTextReveal";

interface StatItemData {
  value: string;
  label: string;
}

const stats: StatItemData[] = [
  { value: "20+", label: "Senior VLSI engineers" },
  { value: "15+", label: "Tapeouts delivered" },
  { value: "3\u2013180nm", label: "Process nodes" },
  { value: "TSMC/SS/GF", label: "Foundry experience" },
];

export function StatsBar() {
  return (
    <section className="flex flex-col items-center bg-bg-base px-4 py-6">
      <div className="grid w-full max-w-[1316px] grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <RevealInView
            key={stat.label}
            delay={index * 0.08}
            className="flex flex-col gap-2 p-8"
          >
            <SplitTextReveal
              as="p"
              className="text-h3 text-text-primary"
              delay={0.06}
            >
              {stat.value}
            </SplitTextReveal>
            <SplitTextReveal
              as="p"
              className="text-body text-text-secondary"
              delay={0.14}
            >
              {stat.label}
            </SplitTextReveal>
          </RevealInView>
        ))}
      </div>
    </section>
  );
}
