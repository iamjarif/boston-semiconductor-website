export interface GlowOrbProps {
  /** Path to the pre-blurred blob asset (e.g. an svg under public/images/glows). */
  src: string;
  /** Width/height in pixels — the glow assets are always square. */
  size: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  /** Rotation in degrees. */
  rotate?: number;
  className?: string;
}

/**
 * Purely decorative ambient background blob. Absolutely positioned and
 * removed from the accessibility tree — never carries content.
 */
export function GlowOrb({
  src,
  size,
  top,
  left,
  right,
  bottom,
  rotate = 0,
  className = "",
}: GlowOrbProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- purely decorative, non-critical background asset
    <img
      src={src}
      alt=""
      aria-hidden="true"
      className={`pointer-events-none absolute select-none ${className}`}
      style={{
        width: size,
        height: size,
        top,
        left,
        right,
        bottom,
        rotate: `${rotate}deg`,
      }}
    />
  );
}
