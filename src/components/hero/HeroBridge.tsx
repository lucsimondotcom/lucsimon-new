import { HERO_BRIDGE_CONTENT } from "@/data/heroContent";

interface HeroBridgeProps {
  textOpacity: number;
}

export function HeroBridge({ textOpacity }: HeroBridgeProps) {
  if (textOpacity <= 0) return null;

  const reveal = Math.min(1, textOpacity);
  const translateY = (1 - reveal) * 40;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 flex items-center px-8 sm:px-12 lg:px-20"
      style={{
        opacity: reveal,
        transform: `translate3d(0, ${translateY}px, 0)`,
        willChange: "transform, opacity",
      }}
      aria-hidden={reveal < 0.05}
    >
      <h2 className="max-w-5xl font-display text-4xl leading-[1.05] text-[#F5F5F5] sm:text-6xl lg:text-6xl xl:text-8xl lg:max-w-7xl">
        Je transforme <span className="underline-with-blue">des besoins</span>{" "}
        métiers <span className="underline-with-blue">en solutions digitales</span>{" "}
        sur mesure{" "}
        <span className="underline-with-blue">qui génèrent des résultats</span>{" "}
        concrets, améliorent l’expérience utilisateur{" "}
        <span className="underline-with-blue">et soutiennent la croissance</span>.
      </h2>
    </div>
  );
}
