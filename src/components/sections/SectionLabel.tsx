interface SectionLabelProps {
  children: React.ReactNode;
}

export function SectionLabel({ children }: SectionLabelProps) {
  return (
    <p className="text-sm font-normal tracking-[0.22em] text-soft-accent uppercase">
      {children}
    </p>
  );
}
