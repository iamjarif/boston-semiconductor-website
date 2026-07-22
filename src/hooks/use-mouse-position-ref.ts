"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Ported from fancycomponents.dev's Parallax Floating component
 * (https://www.fancycomponents.dev/docs/components/image/parallax-floating).
 *
 * Tracks mouse/touch position relative to a container ref using a mutable
 * ref instead of state, so consumers can read the latest position every
 * animation frame without triggering re-renders on every pointer move.
 */
export function useMousePositionRef(
  containerRef?: RefObject<HTMLElement | SVGElement | null>,
) {
  const positionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (x: number, y: number) => {
      if (containerRef && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        positionRef.current = { x: x - rect.left, y: y - rect.top };
      } else {
        positionRef.current = { x, y };
      }
    };

    const handleMouseMove = (ev: MouseEvent) => {
      updatePosition(ev.clientX, ev.clientY);
    };

    const handleTouchMove = (ev: TouchEvent) => {
      const touch = ev.touches[0];
      if (touch) updatePosition(touch.clientX, touch.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [containerRef]);

  return positionRef;
}
