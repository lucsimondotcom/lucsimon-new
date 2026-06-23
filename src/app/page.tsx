import { DeferredExperience } from "@/components/hero/DeferredExperience";
import { AboutSection } from "@/components/sections/AboutSection";
import { VisioSection } from "@/components/sections/VisioSection";

export default function Home() {
  return (
    <main className="bg-background">
      <DeferredExperience />
      <AboutSection />
      <VisioSection />
    </main>
  );
}
