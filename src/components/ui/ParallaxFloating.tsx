"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  type HTMLAttributes,
  type ReactNode,
  type RefObject,
} from "react";
import { useAnimationFrame } from "motion/react";

import { useMousePositionRef } from "@/hooks/use-mouse-position-ref";

/**
 * Adapted from fancycomponents.dev's "Parallax Floating" component.
 * Registration, rAF loop, and depth/sensitivity/lerp math are unchanged.
 * Forced absolute positioning removed for CSS Grid compatibility.
 */

interface FloatingContextType {
  registerElement: (id: string, element: HTMLDivElement, depth: number) => void;
  unregisterElement: (id: string) => void;
}

const FloatingContext = createContext<FloatingContextType | null>(null);

interface FloatingProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  sensitivity?: number;
  easingFactor?: number;
  /** Element whose box defines the active parallax zone. Defaults to the layout container. */
  boundsRef?: RefObject<HTMLElement | null>;
}

export function Floating({
  children,
  className = "",
  sensitivity = 1,
  easingFactor = 0.05,
  boundsRef,
  ...props
}: FloatingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeBoundsRef = boundsRef ?? containerRef;
  const elementsMap = useRef(
    new Map<
      string,
      {
        element: HTMLDivElement;
        depth: number;
        currentPosition: { x: number; y: number };
      }
    >(),
  );
  const mousePositionRef = useMousePositionRef(activeBoundsRef);

  const registerElement = useCallback(
    (id: string, element: HTMLDivElement, depth: number) => {
      elementsMap.current.set(id, {
        element,
        depth,
        currentPosition: { x: 0, y: 0 },
      });
    },
    [],
  );

  const unregisterElement = useCallback((id: string) => {
    elementsMap.current.delete(id);
  }, []);

  useAnimationFrame(() => {
    if (!containerRef.current) return;

    const boundsEl = activeBoundsRef.current;
    if (!boundsEl) return;

    const { x, y } = mousePositionRef.current;
    const { width, height } = boundsEl.getBoundingClientRect();
    const inside = x >= 0 && x <= width && y >= 0 && y <= height;

    elementsMap.current.forEach((data) => {
      const strength = (data.depth * sensitivity) / 20;
      const newTargetX = inside ? x * strength : 0;
      const newTargetY = inside ? y * strength : 0;
      const dx = newTargetX - data.currentPosition.x;
      const dy = newTargetY - data.currentPosition.y;

      data.currentPosition.x += dx * easingFactor;
      data.currentPosition.y += dy * easingFactor;

      data.element.style.transform = `translate3d(${data.currentPosition.x}px, ${data.currentPosition.y}px, 0)`;
    });
  });

  return (
    <FloatingContext.Provider value={{ registerElement, unregisterElement }}>
      <div ref={containerRef} className={className} {...props}>
        {children}
      </div>
    </FloatingContext.Provider>
  );
}

interface FloatingElementProps {
  children: ReactNode;
  className?: string;
  depth?: number;
}

export function FloatingElement({
  children,
  className = "",
  depth = 1,
}: FloatingElementProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const context = useContext(FloatingContext);

  useEffect(() => {
    if (!elementRef.current || !context) return;

    context.registerElement(id, elementRef.current, depth ?? 0.01);
    return () => context.unregisterElement(id);
  }, [id, depth, context]);

  return (
    <div ref={elementRef} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
