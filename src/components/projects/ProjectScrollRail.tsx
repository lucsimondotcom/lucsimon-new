import { PROJECT_COUNT } from "@/data/projects";

interface ProjectScrollRailProps {
  activeIndex: number;
  storyProgress: number;
}

export function ProjectScrollRail({
  activeIndex,
  storyProgress,
}: ProjectScrollRailProps) {
  const fillHeight = `${Math.min(100, Math.max(0, storyProgress * 100))}%`;

  return (
    <div
      className="relative flex h-36 flex-col items-end justify-between"
      aria-label={`Projet ${activeIndex + 1} sur ${PROJECT_COUNT}`}
    >
      <div className="absolute top-1 bottom-1 right-[3px] w-px bg-border/70" />
      <div
        className="absolute top-1 right-[3px] w-px origin-top bg-accent/50 transition-[height] duration-300"
        style={{ height: fillHeight }}
      />

      {Array.from({ length: PROJECT_COUNT }, (_, index) => {
        const isPast = index < activeIndex;
        const isActive = index === activeIndex;

        return (
          <span
            key={index}
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
