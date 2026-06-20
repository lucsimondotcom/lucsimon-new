import { STORY_STEPS, STORY_TOTAL } from "@/data/storySteps";
import { getMeasuringTextOpacity, getStaticZoneOpacity } from "@/lib/scrollZones";
import { StepTasks } from "./StepTasks";
import { StoryScrollRail } from "./StoryScrollRail";

/** Aligné sur le padding droit du header (Menu) */
const SCROLL_RAIL_INSET = "right-8 sm:right-12 lg:right-20";
/** Espace entre mots-clés et rail de scroll */
const TASKS_INSET = "right-36 sm:right-44 lg:right-48";

interface ScrollPanelsProps {
  progress: number;
  activeZone: number;
  zoneLocalProgress: number;
  storyProgress: number;
  inHeroIntro: boolean;
  outroTextProgress: number;
  reducedMotion: boolean;
}

function StepNumber({ number }: { number: string }) {
  return (
    <p className="text-sm font-medium tracking-wide text-accent">
      <span className="text-2xl">{number}</span>
      <span className="mx-2.5 text-soft-accent/60">/</span>
      <span>{String(STORY_TOTAL).padStart(2, "0")}</span>
    </p>
  );
}

export function ScrollPanels({
  progress,
  activeZone,
  zoneLocalProgress,
  storyProgress,
  inHeroIntro,
  outroTextProgress,
  reducedMotion,
}: ScrollPanelsProps) {
  const measuringOpacity = getMeasuringTextOpacity(progress);
  const hideStoryUi =
    inHeroIntro || outroTextProgress > 0 || measuringOpacity < 0.02;
  const mobileOpacity = getStaticZoneOpacity(activeZone, progress);
  if (reducedMotion) {
    return (
      <div className="relative z-10 space-y-20 overflow-y-auto px-8 py-32 sm:px-12 lg:px-20">
        {STORY_STEPS.map((step) => (
          <div
            key={step.id}
            className="grid gap-8 lg:grid-cols-2 lg:gap-16"
          >
            <div className="max-w-md">
              <StepNumber number={step.number} />
              <h2 className="mt-4 text-3xl tracking-tight text-foreground">
                {step.title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                {step.description}
              </p>
            </div>
            <div className="max-w-xs lg:pt-10">
              <StepTasks tasks={step.tasks} zoneLocalProgress={1} allChecked />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative z-10 h-full">
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        {STORY_STEPS.map((step, index) => {
          const opacity = getStaticZoneOpacity(index, progress);
          return (
            <div
              key={step.id}
              className="absolute inset-0 flex flex-col justify-center pl-20 xl:pl-24"
              style={{ opacity }}
              aria-hidden={activeZone !== index || inHeroIntro}
            >
              <div className="max-w-sm">
                <StepNumber number={step.number} />
                <h2 className="mt-8 text-3xl tracking-tight text-foreground xl:text-6xl">
                  {step.title}
                </h2>
                <p className="mt-5 max-w-xs text-base text-muted">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        {STORY_STEPS.map((step, index) => {
          const opacity = getStaticZoneOpacity(index, progress);
          const taskProgress = activeZone === index ? zoneLocalProgress : 0;

          return (
            <div
              key={`${step.id}-tasks`}
              className={`absolute inset-y-0 flex flex-col justify-center ${TASKS_INSET}`}
              style={{ opacity }}
              aria-hidden={activeZone !== index || inHeroIntro}
            >
              <div className="max-w-[220px]">
                <StepTasks tasks={step.tasks} zoneLocalProgress={taskProgress} />
              </div>
            </div>
          );
        })}
      </div>

      <div
        className={`pointer-events-none absolute top-1/2 hidden -translate-y-1/2 flex-col items-end lg:flex ${SCROLL_RAIL_INSET} ${
          hideStoryUi ? "opacity-0" : "opacity-100"
        } transition-opacity duration-500`}
      >
        <StoryScrollRail
          activeZone={activeZone}
          storyProgress={storyProgress}
        />
      </div>

      {!inHeroIntro && outroTextProgress <= 0 && mobileOpacity > 0.01 && (
        <div
          className="absolute inset-x-0 bottom-10 px-8 lg:hidden"
          style={{ opacity: mobileOpacity }}
        >
          <StepNumber number={STORY_STEPS[activeZone].number} />
          <h2 className="mt-3 text-xl tracking-tight text-foreground">
            {STORY_STEPS[activeZone].title}
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
            {STORY_STEPS[activeZone].description}
          </p>
          <div className="mt-5">
            <StepTasks
              tasks={STORY_STEPS[activeZone].tasks}
              zoneLocalProgress={zoneLocalProgress}
            />
          </div>
        </div>
      )}
    </div>
  );
}
