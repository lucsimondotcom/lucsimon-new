"use client";

import { useEffect, useState } from "react";
import * as THREE from "three";
import { RECENT_PROJECTS } from "@/data/projects";
import {
  disposeProjectTextures,
  loadProjectTexture,
} from "./projectTextures";

export function useProjectTextures(): THREE.Texture[] | null {
  const [textures, setTextures] = useState<THREE.Texture[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    let loaded: THREE.Texture[] = [];

    void Promise.all(RECENT_PROJECTS.map((project) => loadProjectTexture(project)))
      .then((results) => {
        if (cancelled) {
          disposeProjectTextures(results);
          return;
        }
        loaded = results;
        setTextures(results);
      })
      .catch(() => {
        if (!cancelled) setTextures(null);
      });

    return () => {
      cancelled = true;
      disposeProjectTextures(loaded);
    };
  }, []);

  return textures;
}
