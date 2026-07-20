import { GlowOrb, type GlowOrbProps } from "@/components/ui/GlowOrb";

export interface ParallaxGlowOrbProps extends GlowOrbProps {
  speed: number;
  centered?: boolean;
}

export function ParallaxGlowOrb({
  speed,
  centered = false,
  className = "",
  size,
  ...glowProps
}: ParallaxGlowOrbProps) {
  return (
    <div
      aria-hidden="true"
      data-parallax-glow=""
      data-parallax-speed={speed}
      className={`pointer-events-none absolute will-change-transform ${className}`}
      style={{ width: size, height: size }}
    >
      <div
        className={
          centered
            ? "relative left-1/2 h-full w-full -translate-x-1/2"
            : "h-full w-full"
        }
      >
        <GlowOrb {...glowProps} size={size} className="left-0 top-0" />
      </div>
    </div>
  );
}
