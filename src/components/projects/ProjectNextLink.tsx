import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";

interface ProjectNextLinkProps {
  project: Project;
}

function projectPreviewImage(project: Project): string | undefined {
  return project.image ?? project.detail.visuals[0]?.src;
}

export function ProjectNextLink({ project }: ProjectNextLinkProps) {
  const imageSrc = projectPreviewImage(project);

  return (
    <Link
      href={`/projets/${project.slug}`}
      className="group fixed right-8 bottom-8 z-[50] sm:right-12 sm:bottom-10 lg:right-20"
      aria-label={`Projet suivant : ${project.title}`}
    >
      <span className="relative block h-20 w-20 overflow-hidden rounded-full border border-border/70 shadow-[0_8px_32px_rgba(0,0,0,0.18)] transition-transform duration-300 group-hover:scale-105 sm:h-24 sm:w-24">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt=""
            fill
            className="object-cover"
            sizes="96px"
          />
        ) : (
          <span
            className="block h-full w-full bg-accent"
            aria-hidden
          />
        )}
      </span>
      <span className="pointer-events-none absolute -top-8 right-0 text-xs font-medium tracking-tighter text-muted uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        Suivant
      </span>
    </Link>
  );
}
