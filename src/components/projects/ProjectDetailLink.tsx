import Link from "next/link";
import { getProjectBySlug } from "@/data/projects";

interface ProjectDetailLinkProps {
  slug: string;
  className?: string;
}

export function ProjectDetailLink({ slug, className = "" }: ProjectDetailLinkProps) {
  if (!getProjectBySlug(slug)) return null;

  return (
    <Link
      href={`/projets/${slug}`}
      className={`inline-flex items-center gap-2 text-xs font-medium tracking-[0.04em] text-foreground uppercase transition-colors hover:text-muted ${className}`}
    >
      Voir le projet
      <span aria-hidden>→</span>
    </Link>
  );
}
