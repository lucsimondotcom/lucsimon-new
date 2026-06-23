import { HERO_BRIDGE_CONTENT } from "@/data/heroContent";
import { STORY_STEPS, STORY_TOTAL } from "@/data/storySteps";
import { getStaticZoneOpacity } from "@/lib/scrollZones";
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
  inHeroBridge: boolean;
  inStoryZones: boolean;
  reducedMotion: boolean;
}

function StepNumber({
  number,
  inverted,
}: {
  number: string;
  inverted: boolean;
}) {
  return (
    <p
      className={`text-sm font-medium tracking-wide ${
        inverted ? "text-white" : "text-accent"
      }`}
    >
      <span className="text-2xl">{number}</span>
      <span className={`mx-2.5 ${inverted ? "text-white/40" : "text-accent/40"}`}>
        /
      </span>
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
  inHeroBridge,
  inStoryZones,
  reducedMotion,
}: ScrollPanelsProps) {
  const inverted = inStoryZones;
  const hideStoryUi = !inStoryZones;
  const mobileOpacity = getStaticZoneOpacity(activeZone, progress);

  if (reducedMotion) {
    return (
      <div className="relative z-10 space-y-20 overflow-y-auto px-8 py-32 sm:px-12 lg:px-20">
        <div className="rounded-2xl bg-[#0A0A0A] px-8 py-16 sm:px-12">
          <h2 className="max-w-4xl font-display text-4xl leading-tight text-[#F5F5F5] sm:text-5xl">
            {HERO_BRIDGE_CONTENT.headline}
          </h2>
        </div>
        {STORY_STEPS.map((step) => (
          <div
            key={step.id}
            className="grid gap-8 rounded-2xl bg-accent px-8 py-12 lg:grid-cols-2 lg:gap-16"
          >
            <div className="max-w-md">
              <StepNumber number={step.number} inverted />
              <h2 className="mt-4 text-3xl tracking-tight text-white">
                {step.title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/65">
                {step.description}
              </p>
            </div>
            <div className="max-w-xs lg:pt-10">
              <StepTasks
                tasks={step.tasks}
                zoneLocalProgress={1}
                allChecked
                inverted
              />
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
              aria-hidden={activeZone !== index || inHeroIntro || inHeroBridge}
            >
              <div className="max-w-sm">
                <StepNumber number={step.number} inverted={inverted} />
                <h2
                  className={`mt-8 text-3xl tracking-tight xl:text-6xl ${
                    inverted ? "text-white" : "text-foreground"
                  }`}
                >
                  {step.title}
                </h2>
                <p
                  className={`mt-5 max-w-xs text-base ${
                    inverted ? "text-white/65" : "text-muted"
                  }`}
                >
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
              aria-hidden={activeZone !== index || inHeroIntro || inHeroBridge}
            >
              <div className="max-w-[220px]">
                <StepTasks
                  tasks={step.tasks}
                  zoneLocalProgress={taskProgress}
                  inverted={inverted}
                />
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
          inverted={inverted}
        />
      </div>

      {!inHeroIntro && !inHeroBridge && inStoryZones && mobileOpacity > 0.01 && (
        <div
          className="absolute inset-x-0 bottom-10 px-8 lg:hidden"
          style={{ opacity: mobileOpacity }}
        >
          <StepNumber number={STORY_STEPS[activeZone].number} inverted={inverted} />
          <h2
            className={`mt-3 text-4xl tracking-tight ${
              inverted ? "text-white" : "text-foreground"
            }`}
          >
            {STORY_STEPS[activeZone].title}
          </h2>
          <p
            className={`mt-3 max-w-sm text-sm leading-relaxed ${
              inverted ? "text-white/65" : "text-muted"
            }`}
          >
            {STORY_STEPS[activeZone].description}
          </p>
          <div className="mt-5">
            <StepTasks
              tasks={STORY_STEPS[activeZone].tasks}
              zoneLocalProgress={zoneLocalProgress}
              inverted={inverted}
            />
          </div>
        </div>
      )}
    </div>
  );
}
