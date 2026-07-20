import { GlowOrb } from "@/components/ui/GlowOrb";
import { ModelCard, type ModelCardRow } from "@/components/ui/ModelCard";

interface EngagementModelData {
  caption: string;
  title: string;
  rows: ModelCardRow[];
  highlighted?: boolean;
}

const engagementModels: EngagementModelData[] = [
  {
    caption: "// RETAINER-BASED",
    title: "Dedicated team, monthly",
    highlighted: false,
    rows: [
      { label: "Allocation", description: "Senior engineers, assigned monthly" },
      { label: "Scope", description: "Task-driven \u2014 bugs, reviews, new features" },
      { label: "Billing", description: "Predictable monthly, easy to scale" },
      { label: "Best for", description: "Ongoing support & maintenance" },
    ],
  },
  {
    caption: "// TURNKEY",
    title: "Fixed scope, spec to silicon",
    highlighted: true,
    rows: [
      { label: "Delivery", description: "Complete spec \u2192 GDSII / silicon" },
      { label: "Payments", description: "Milestone-based \u2014 spec, RTL, tapeout" },
      { label: "IP terms", description: "Work-for-hire \u2014 client owns all IP" },
      { label: "Best for", description: "New products & time-critical tapeouts" },
    ],
  },
];

export function EngagementModels() {
  return (
    <section
      id="engagement-models"
      className="relative flex flex-col items-center gap-16 overflow-hidden bg-bg-surface px-4 py-24 lg:py-[140px]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] overflow-visible"
      >
        <GlowOrb
          src="/images/glows/glow-engagement.svg"
          size={477}
          rotate={-90}
          className="left-1/2 top-[-80px] -translate-x-1/2"
        />
      </div>

      <div className="relative z-10 flex max-w-[1316px] flex-col items-center gap-7 text-center">
        <div className="flex flex-col items-center gap-3">
          <p className="text-mono-lg text-brand-primary">
            ENGAGEMENT MODELS
          </p>
          <h2 className="bg-gradient-to-b from-text-primary to-neutral-800 bg-clip-text text-h1 text-transparent">
            Two ways to work with us.
          </h2>
        </div>
        <p className="max-w-[750px] text-body text-text-secondary">
          Flexible delivery structures, built around how chip projects
          actually run.
        </p>
      </div>

      <div className="relative z-10 grid w-full max-w-[1316px] grid-cols-1 gap-6 lg:grid-cols-2">
        {engagementModels.map((model) => (
          <ModelCard
            key={model.title}
            caption={model.caption}
            title={model.title}
            rows={model.rows}
            highlighted={model.highlighted}
          />
        ))}
      </div>
    </section>
  );
}
