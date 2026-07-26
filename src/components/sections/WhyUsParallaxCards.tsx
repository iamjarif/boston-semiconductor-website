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

const CARD_DEPTHS = [0.6, 1.0, 0.7, 1.1, 0.9] as const;

const FLOAT_SENSITIVITY = 0.3;
const FLOAT_EASING = 0.07;

function cardItemClass(align: "start" | "end", index: number) {
  const alignClass = align === "end" ? "lg:self-end" : "lg:self-start";
  const middleNudge =
    index === 1 ? "lg:-translate-y-8" : index === 3 ? "lg:translate-y-8" : "";

  return [alignClass, middleNudge].filter(Boolean).join(" ");
}

function cardContentClass() {
  return "w-full lg:min-h-[200px]";
}

function topRowCardClass() {
  return "w-full lg:w-[calc((100%-3rem)/3)]";
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
  firstRow,
  secondRow,
  renderCard,
}: {
  firstRow: WhyUsCardData[];
  secondRow: WhyUsCardData[];
  renderCard: (card: WhyUsCardData, index: number) => ReactNode;
}) {
  return (
    <SectionReveal className="flex w-full flex-col items-center gap-6 lg:gap-y-16">
      <div className="order-2 flex w-full flex-col gap-6 lg:order-1 lg:flex-row lg:items-start lg:justify-center lg:gap-x-6">
        {firstRow.map((card, index) => (
          <SectionRevealItem
            key={card.title}
            className={`w-full ${topRowCardClass()}`}
          >
            {renderCard(card, index)}
          </SectionRevealItem>
        ))}
      </div>

      <SectionRevealItem className="order-1 w-full pb-4 lg:order-2 lg:pb-0">
        <WhyUsHeadline />
      </SectionRevealItem>

      <div className="order-3 grid w-full grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-x-6">
        {secondRow.map((card, index) => {
          const cardIndex = firstRow.length + index;

          return (
            <SectionRevealItem
              key={card.title}
              className={`w-full ${cardItemClass(card.align, cardIndex)}`}
            >
              {renderCard(card, cardIndex)}
            </SectionRevealItem>
          );
        })}
      </div>
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
        firstRow={firstRow}
        secondRow={secondRow}
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
        firstRow={firstRow}
        secondRow={secondRow}
        renderCard={(card, index) => renderParallaxCard(card, index)}
      />
    </Floating>
  );
}
