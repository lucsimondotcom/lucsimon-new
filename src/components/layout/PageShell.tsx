import type { ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
  className?: string;
}

export function PageShell({ children, className = "" }: PageShellProps) {
  return (
    <main
      className={`min-h-screen bg-[var(--background-gradient)] pt-12 lg:pt-16 ${className}`}
    >
      {children}
    </main>
  );
}
