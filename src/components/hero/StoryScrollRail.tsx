import { STORY_STEPS } from "@/data/storySteps";

interface StoryScrollRailProps {
  activeZone: number;
  storyProgress: number;
  inverted?: boolean;
}

export function StoryScrollRail({
  activeZone,
  storyProgress,
  inverted = false,
}: StoryScrollRailProps) {
  const fillHeight = `${Math.min(100, Math.max(0, storyProgress * 100))}%`;

  return (
    <div
      className="relative flex h-36 flex-col items-end justify-between"
      aria-label={`Étape ${activeZone + 1} sur ${STORY_STEPS.length}`}
    >
      <div
        className={`absolute top-1 bottom-1 right-[3px] w-px ${
          inverted ? "bg-white/25" : "bg-border/70"
        }`}
      />
      <div
        className={`absolute top-1 right-[3px] w-px origin-top transition-[height] duration-300 ${
          inverted ? "bg-white/55" : "bg-accent/50"
        }`}
        style={{ height: fillHeight }}
      />

      {STORY_STEPS.map((step, index) => {
        const isPast = index < activeZone;
        const isActive = index === activeZone;

        return (
          <span
            key={step.id}
            className={`relative z-10 block h-2 w-2 shrink-0 rounded-full border transition-all duration-300 ${
              isPast || isActive
                ? inverted
                  ? "border-white bg-white"
                  : "border-accent bg-accent"
                : inverted
                  ? "border-white/35 bg-white/10"
                  : "border-border/80 bg-background"
            } ${isActive ? "scale-125" : ""}`}
          />
        );
      })}
    </div>
  );
}
