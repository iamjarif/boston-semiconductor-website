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

function cardItemClass(align: "start" | "end", index: number) {
  const alignClass = align === "end" ? "lg:self-end" : "lg:self-start";
  const middleNudge =
    index === 1 ? "lg:-translate-y-8" : index === 4 ? "lg:translate-y-8" : "";

  return [alignClass, middleNudge].filter(Boolean).join(" ");
}

function cardContentClass() {
  return "w-full lg:min-h-[200px]";
}

function WhyUsHeadline() {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <p className="text-mono-lg text-brand-primary">
        WHY BOSTON SEMICONDUCTOR
      </p>
      <h2 className="max-w-[1316px] bg-gradient-to-b from-text-primary to-neutral-800 bg-clip-text text-h1 text-transparent">
        Built for chip teams that{" "}
        <br className="hidden sm:inline" />
        can&apos;t afford a leak.
      </h2>
    </div>
  );
}

function WhyUsRevealLayout({
  allCards,
  renderCard,
}: {
  allCards: WhyUsCardData[];
  renderCard: (card: WhyUsCardData, index: number) => ReactNode;
}) {
  return (
    <SectionReveal className="flex w-full flex-col items-center gap-6 lg:grid lg:grid-cols-3 lg:items-stretch lg:gap-x-6 lg:gap-y-16">
      <SectionRevealItem className="order-1 w-full pb-4 lg:order-2 lg:col-span-3 lg:pb-0">
        <WhyUsHeadline />
      </SectionRevealItem>

      {allCards.map((card, index) => (
        <SectionRevealItem
          key={card.title}
          className={`order-2 w-full ${index < 3 ? "lg:order-1" : "lg:order-3"} ${cardItemClass(card.align, index)}`}
        >
          {renderCard(card, index)}
        </SectionRevealItem>
      ))}
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
  const allCards = [...firstRow, ...secondRow];

  const renderStaticCard = (card: WhyUsCardData) => (
    <Card
      key={card.title}
      caption={card.caption}
      title={card.title}
      subText={card.subText}
      hoverEffect={false}
      className={cardContentClass()}
    />
  );

  const renderParallaxCard = (card: WhyUsCardData, index: number) => (
    <FloatingElement
      key={card.title}
      depth={CARD_DEPTHS[index]}
      className={cardContentClass()}
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

  if (!parallaxEnabled) {
    return (
      <WhyUsRevealLayout
        allCards={allCards}
        renderCard={(card) => renderStaticCard(card)}
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
        allCards={allCards}
        renderCard={(card, index) => renderParallaxCard(card, index)}
      />
    </Floating>
  );
}
