"use client";

import { useSyncExternalStore } from "react";

const HOVER_MEDIA_QUERY = "(hover: hover) and (pointer: fine)";

function subscribeToHoverCapability(onStoreChange: () => void) {
  const media = window.matchMedia(HOVER_MEDIA_QUERY);
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function getHoverCapabilitySnapshot() {
  return window.matchMedia(HOVER_MEDIA_QUERY).matches;
}

function getHoverCapabilityServerSnapshot() {
  return false;
}

/** True for mouse/trackpad; false for touch-only devices (capability, not width). */
export function usePrefersHover() {
  return useSyncExternalStore(
    subscribeToHoverCapability,
    getHoverCapabilitySnapshot,
    getHoverCapabilityServerSnapshot,
  );
}
