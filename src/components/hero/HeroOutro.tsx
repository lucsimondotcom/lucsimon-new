import { HERO_OUTRO_CONTENT } from "@/data/heroContent";

interface HeroOutroProps {
  textOpacity: number;
  inverted: boolean;
}

export function HeroOutro({ textOpacity, inverted }: HeroOutroProps) {
  if (textOpacity <= 0) return null;

  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 z-10 hidden flex-col justify-center pl-20 xl:pl-24 lg:flex"
        style={{ opacity: textOpacity }}
        aria-hidden={textOpacity < 0.05}
      >
        <div className="max-w-md lg:max-w-2xl xl:max-w-3xl">
          <h2
            className={`text-3xl tracking-tight xl:text-6xl ${
              inverted ? "text-white" : "text-foreground"
            }`}
          >
            {HERO_OUTRO_CONTENT.hint}
          </h2>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-10 z-10 px-8 lg:hidden"
        style={{ opacity: textOpacity }}
        aria-hidden={textOpacity < 0.05}
      >
        <h2
          className={`max-w-sm text-xl tracking-tight ${
            inverted ? "text-white" : "text-foreground"
          }`}
        >
          {HERO_OUTRO_CONTENT.hint}
        </h2>
      </div>
    </>
  );
}
