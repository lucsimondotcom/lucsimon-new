import Link from "next/link";
import { getNextProject, type Project } from "@/data/projects";
import { ProjectDetailVisuals } from "./ProjectDetailVisuals";
import { ProjectNextLink } from "./ProjectNextLink";

interface ProjectDetailLayoutProps {
  project: Project;
  projectIndex: number;
  projectTotal: number;
}

export function ProjectDetailLayout({
  project,
  projectIndex,
  projectTotal,
}: ProjectDetailLayoutProps) {
  const { detail } = project;
  const nextProject = getNextProject(project.slug);
  const indexLabel = String(projectIndex).padStart(2, "0");
  const totalLabel = String(projectTotal).padStart(2, "0");

  return (
    <>
      <div className="mx-auto grid grid-cols-1 gap-8 px-4 py-4 sm:px-12 sm:py-12 lg:grid-cols-4 lg:items-start lg:gap-0 lg:px-20 lg:py-0">
      <aside className="flex flex-col lg:sticky lg:top-16 lg:col-span-1 lg:max-h-[calc(100svh-4rem)] lg:min-h-[calc(100svh-4rem)] lg:self-start lg:py-8 lg:pr-10">
        <div>
          <h1 className="text-3xl tracking-tight text-foreground sm:text-4xl xl:text-6xl w-3/4 lg:w-full">
            {project.title}
          </h1>
          <p className="mt-2 lg:mt-8 max-w-xs text-sm lg:text-lg tracking-tighter leading-tight text-muted w-3/4 lg:w-full">
            {detail.subtitle}
          </p>
         
        </div>
        <div className="px-5 lg:px-0">
        <dl className="mt-8 lg:mt-10 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-1 uppercase">
          {detail.specs.map((spec) => (
            <div key={spec.label}>
              <dt className="text-xs font-semibold tracking-tighter text-foreground">{spec.label}</dt>
              <dd className="text-xs leading-tight tracking-tighter text-muted">{spec.value}</dd>
            </div>
          ))}
        </dl>
        </div>

      </aside>

      <ProjectDetailVisuals visuals={detail.visuals} />
      
      <aside className="flex flex-col lg:sticky lg:top-16 lg:col-span-1 lg:self-start lg:py-8 lg:pl-10">
        <p className="text-sm font-medium tracking-wide text-foreground">
          <span className="text-6xl">{indexLabel}</span>
          <span className="mx-2.5 text-2xl">/</span>
          <span className="text-2xl">{totalLabel}</span>
        </p>

       

         {detail.website && (
            <a
              href={detail.website.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-12 border border-border/80 pt-8 pb-8 px-4 rounded-xl items-center gap-2 text-xs font-medium tracking-tighter text-foreground uppercase transition-colors hover:text-muted"
            >
              {detail.website.label}
              <span aria-hidden>↗</span>
            </a>
          )}
          
      </aside>
      </div>

      {nextProject && <ProjectNextLink project={nextProject} />}
    </>
  );
}
