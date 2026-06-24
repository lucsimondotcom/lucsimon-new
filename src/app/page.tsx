import dynamic from "next/dynamic";
import { HolographicSystemHero } from "@/components/hero/HolographicSystemHero";

const AboutSection = dynamic(
  () =>
    import("@/components/sections/AboutSection").then((mod) => mod.AboutSection),
  { loading: () => null },
);

const VisioSection = dynamic(
  () =>
    import("@/components/sections/VisioSection").then((mod) => mod.VisioSection),
  { loading: () => null },
);

export default function Home() {
  return (
    <main className="bg-background">
      <HolographicSystemHero />
      <AboutSection />
      <VisioSection />
    </main>
  );
}
