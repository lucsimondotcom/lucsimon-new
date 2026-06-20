import { STORY_STEPS } from "@/data/storySteps";

interface StoryScrollRailProps {
  activeZone: number;
  storyProgress: number;
}

export function StoryScrollRail({
  activeZone,
  storyProgress,
}: StoryScrollRailProps) {
  const fillHeight = `${Math.min(100, Math.max(0, storyProgress * 100))}%`;

  return (
    <div
      className="relative flex h-36 flex-col items-end justify-between"
      aria-label={`Étape ${activeZone + 1} sur ${STORY_STEPS.length}`}
    >
      <div className="absolute top-1 bottom-1 right-[3px] w-px bg-border/70" />
      <div
        className="absolute top-1 right-[3px] w-px origin-top bg-accent/50 transition-[height] duration-300"
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
                ? "border-accent bg-accent"
                : "border-border/80 bg-background"
            } ${isActive ? "scale-125" : ""}`}
          />
        );
      })}
    </div>
  );
}
