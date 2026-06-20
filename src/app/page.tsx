import { DeferredExperience } from "@/components/hero/DeferredExperience";
import { CtaSection } from "@/components/sections/CtaSection";

export default function Home() {
  return (
    <main className="bg-[var(--background-gradient)]">
      <DeferredExperience />
      <CtaSection />
    </main>
  );
}
