"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface SiteLoaderContextValue {
  isComplete: boolean;
  setComplete: (value: boolean) => void;
  signalExperienceReady: () => void;
}

let experienceReady = false;
const experienceResolvers: Array<() => void> = [];

export function signalExperienceReady() {
  if (experienceReady) return;
  experienceReady = true;
  experienceResolvers.splice(0).forEach((resolve) => resolve());
}

export function waitForExperienceReady(maxMs = 5000): Promise<void> {
  if (experienceReady) return Promise.resolve();
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, maxMs);
    experienceResolvers.push(() => {
      clearTimeout(timer);
      resolve();
    });
  });
}

const SiteLoaderContext = createContext<SiteLoaderContextValue>({
  isComplete: true,
  setComplete: () => {},
  signalExperienceReady: () => {},
});

export function useSiteLoader() {
  return useContext(SiteLoaderContext);
}

export function SiteLoaderProvider({ children }: { children: ReactNode }) {
  const [isComplete, setComplete] = useState(true);

  return (
    <SiteLoaderContext.Provider
      value={{ isComplete, setComplete, signalExperienceReady }}
    >
      {children}
    </SiteLoaderContext.Provider>
  );
}
