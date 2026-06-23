import * as THREE from "three";
import type { Project } from "@/data/projects";

const RASTER_PATTERN = /\.(jpe?g|png|webp)$/i;

function shadeHex(hex: string, amount: number): string {
  const normalized = hex.replace("#", "");
  const num = parseInt(normalized, 16);
  const r = Math.min(255, Math.max(0, ((num >> 16) & 255) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 255) + amount));
  const b = Math.min(255, Math.max(0, (num & 255) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

export function createProjectCanvasTexture(project: Project): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D unavailable");

  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, project.accent);
  gradient.addColorStop(1, shadeHex(project.accent, -36));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.font = "500 44px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(project.title, size / 2, size / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

function loadImageTexture(url: string): Promise<THREE.Texture> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      const texture = new THREE.Texture(image);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = true;
      texture.needsUpdate = true;
      resolve(texture);
    };
    image.onerror = () => reject(new Error(`Could not load ${url}`));
    image.src = url;
  });
}

export async function loadProjectTexture(project: Project): Promise<THREE.Texture> {
  if (project.image && RASTER_PATTERN.test(project.image)) {
    try {
      return await loadImageTexture(project.image);
    } catch {
      return createProjectCanvasTexture(project);
    }
  }
  return createProjectCanvasTexture(project);
}

export function disposeProjectTextures(textures: THREE.Texture[]) {
  textures.forEach((texture) => texture.dispose());
}
