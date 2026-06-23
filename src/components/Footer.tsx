import Link from "next/link";
import { SITE_NAV, VISIO_PAGE, CONTACT_EMAIL } from "@/data/siteNav";

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-[var(--surface-subtle)] px-8 py-14 text-xs sm:px-12 lg:px-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/"
            className="font-medium tracking-[0.08em] text-foreground transition-colors hover:text-muted"
          >
            LUC SIMON
          </Link>
          <p className="mt-3 max-w-xs leading-relaxed text-muted">
            Product Engineer — systèmes web clairs, fiables et performants pour
            les PME.
          </p>
        </div>

        <nav aria-label="Pied de page">
          <ul className="flex flex-col gap-2 sm:items-end">
            {SITE_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-muted transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={VISIO_PAGE.href}
                className="text-muted transition-colors hover:text-foreground"
              >
                {VISIO_PAGE.label}
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-border/60 pt-8 text-center text-muted sm:flex-row sm:text-left">
        <p>© {new Date().getFullYear()} Luc Simon — Product Engineer</p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="transition-colors hover:text-foreground"
        >
          {CONTACT_EMAIL}
        </a>
      </div>
    </footer>
  );
}
