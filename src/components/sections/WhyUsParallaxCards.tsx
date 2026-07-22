"use client";

import { useReducedMotion } from "motion/react";
import type { ReactNode, RefObject } from "react";

import { Card } from "@/components/ui/Card";
import { Floating, FloatingElement } from "@/components/ui/ParallaxFloating";
import { SectionReveal, SectionRevealItem } from "@/components/ui/SectionReveal";
import { usePrefersHover } from "@/hooks/use-prefers-hover";

interface WhyUsCardData {
  caption: string;
  title: string;
  subText: string;
  align: "start" | "end";
}

interface WhyUsParallaxCardsProps {
  firstRow: WhyUsCardData[];
  secondRow: WhyUsCardData[];
  sectionRef: RefObject<HTMLElement | null>;
}

const CARD_DEPTHS = [0.6, 1.0, 0.8, 0.7, 1.1, 0.9] as const;

const FLOAT_SENSITIVITY = 0.3;
const FLOAT_EASING = 0.07;

function cardAlignClass(align: "start" | "end") {
  return align === "end" ? "lg:self-end" : "lg:self-start";
}

function WhyUsHeadline() {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <p className="text-mono-lg text-brand-primary">
        WHY BOSTON SEMICONDUCTOR
      </p>
      <h2 className="max-w-[1316px] bg-gradient-to-b from-text-primary to-neutral-800 bg-clip-text text-h1 text-transparent">
        Built for chip teams that <br /> can&apos;t afford a leak.
      </h2>
    </div>
  );
}

function StaticCardRow({ cards }: { cards: WhyUsCardData[] }) {
  return (
    <>
      {cards.map((card) => (
        <Card
          key={card.title}
          caption={card.caption}
          title={card.title}
          subText={card.subText}
          hoverEffect={false}
          className={`lg:h-[200px] ${cardAlignClass(card.align)}`}
        />
      ))}
    </>
  );
}

function ParallaxCard({
  card,
  depth,
}: {
  card: WhyUsCardData;
  depth: number;
}) {
  return (
    <FloatingElement
      depth={depth}
      className={`lg:h-[200px] ${cardAlignClass(card.align)}`}
    >
      <Card
        caption={card.caption}
        title={card.title}
        subText={card.subText}
        hoverEffect={false}
        className="h-full w-full"
      />
    </FloatingElement>
  );
}

function WhyUsRevealLayout({
  renderFirstRow,
  renderSecondRow,
}: {
  renderFirstRow: () => ReactNode;
  renderSecondRow: () => ReactNode;
}) {
  return (
    <SectionReveal className="flex w-full flex-col items-center gap-16">
      <SectionRevealItem className="order-2 w-full">
        <WhyUsHeadline />
      </SectionRevealItem>

      <SectionRevealItem className="order-1 grid w-full grid-cols-1 gap-6 sm:grid-cols-3 lg:h-[300px]">
        {renderFirstRow()}
      </SectionRevealItem>

      <SectionRevealItem className="order-3 grid w-full grid-cols-1 gap-6 sm:grid-cols-3 lg:h-[300px]">
        {renderSecondRow()}
      </SectionRevealItem>
    </SectionReveal>
  );
}

export function WhyUsParallaxCards({
  firstRow,
  secondRow,
  sectionRef,
}: WhyUsParallaxCardsProps) {
  const canHover = usePrefersHover();
  const reduceMotion = useReducedMotion();
  const parallaxEnabled = canHover && !reduceMotion;

  if (!parallaxEnabled) {
    return (
      <WhyUsRevealLayout
        renderFirstRow={() => <StaticCardRow cards={firstRow} />}
        renderSecondRow={() => <StaticCardRow cards={secondRow} />}
      />
    );
  }

  return (
    <Floating
      boundsRef={sectionRef}
      className="flex w-full flex-col items-center gap-16"
      sensitivity={FLOAT_SENSITIVITY}
      easingFactor={FLOAT_EASING}
    >
      <WhyUsRevealLayout
        renderFirstRow={() =>
          firstRow.map((card, index) => (
            <ParallaxCard
              key={card.title}
              card={card}
              depth={CARD_DEPTHS[index]}
            />
          ))
        }
        renderSecondRow={() =>
          secondRow.map((card, index) => (
            <ParallaxCard
              key={card.title}
              card={card}
              depth={CARD_DEPTHS[index + 3]}
            />
          ))
        }
      />
    </Floating>
  );
}
