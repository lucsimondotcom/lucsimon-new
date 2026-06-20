import { cssVariables } from "@/lib/designTokens";

/** Injecte les variables CSS depuis designTokens.ts */
export function ThemeVars() {
  const css = Object.entries(cssVariables)
    .map(([key, value]) => `${key}: ${value};`)
    .join("\n  ");

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `:root {\n  ${css}\n}`,
      }}
    />
  );
}
