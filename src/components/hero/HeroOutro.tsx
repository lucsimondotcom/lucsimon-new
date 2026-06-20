import { HERO_OUTRO_CONTENT } from "@/data/heroContent";

interface HeroOutroProps {
  textProgress: number;
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function smoothstep(t: number): number {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
}

export function HeroOutro({ textProgress }: HeroOutroProps) {
  if (textProgress <= 0) return null;

  const reveal = smoothstep(textProgress / 0.72);
  const translateY = (1 - reveal) * 56;

  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-center px-8 pb-[20vh] text-center sm:pb-[21vh] lg:pb-[22vh]"
      style={{
        opacity: reveal,
        transform: `translate3d(0, ${translateY}px, 0)`,
        willChange: "transform, opacity",
      }}
    >
      <h3 className="max-w-3xl text-3xl text-muted sm:text-5xl">
        {HERO_OUTRO_CONTENT.hint}
      </h3>
    </div>
  );
}
