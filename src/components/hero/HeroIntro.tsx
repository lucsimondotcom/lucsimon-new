import { HERO_CONTENT } from "@/data/heroContent";
import { ScrollArrowDown } from "@/components/icons/ScrollArrowDown";

interface HeroIntroProps {
  heroProgress: number;
  visible: boolean;
}

export function HeroIntro({ heroProgress, visible }: HeroIntroProps) {
  if (!visible) return null;

  const fadeOut = heroProgress > 0.55 ? 1 - (heroProgress - 0.55) / 0.45 : 1;
  const rise = Math.min(1, heroProgress * 1.4) * 24;
  const scrollHintOpacity = 1 - heroProgress * 0.85;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-10"
      style={{ opacity: fadeOut }}
      aria-hidden={heroProgress > 0.95}
    >
      <div
        className="flex h-full flex-col items-center justify-center px-8 text-center"
        style={{ transform: `translateY(${-rise}px)` }}
      >
        <p className="text-[11px] font-normal tracking-[0.28em] text-muted uppercase">
          {HERO_CONTENT.role}
        </p>
        <h1 className="mt-5 max-w-3xl lg:max-w-4xl text-4xl tracking-tight text-foreground sm:text-5xl lg:text-7xl xl:text-8xl">
          {HERO_CONTENT.name}
        </h1>
        <p className="mt-6 max-w-md text-base text-foreground sm:text-lg">
          {HERO_CONTENT.tagline}
        </p>
      </div>

      <ul
        className="absolute bottom-8 left-8 space-y-0.5 text-xs tracking-tighter text-foreground uppercase sm:bottom-10 sm:left-12 lg:left-20"
        style={{ opacity: scrollHintOpacity }}
      >
        {HERO_CONTENT.stats.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 sm:bottom-10"
        style={{ opacity: scrollHintOpacity }}
        aria-label="Faire défiler pour commencer"
      >
        <p className="flex items-center gap-2 text-xs font-medium tracking-[0.12em] text-foreground uppercase">
          <span>Commençons</span>
          <ScrollArrowDown className="hero-scroll-arrow shrink-0" />
        </p>
      </div>
    </div>
  );
}
