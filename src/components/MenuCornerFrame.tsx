"use client";

interface MenuCornerFrameProps {
  arm?: number;
  className?: string;
}

const CORNER_ARM = 5;

const corners = [
  "top-0 left-0 border-t border-l",
  "top-0 right-0 border-t border-r",
  "bottom-0 left-0 border-b border-l",
  "bottom-0 right-0 border-b border-r",
] as const;

export function MenuCornerFrame({
  arm = CORNER_ARM,
  className = "",
}: MenuCornerFrameProps) {
  return (
    <div className={`pointer-events-none ${className}`} aria-hidden="true">
      {corners.map((position) => (
        <span
          key={position}
          className={`absolute border-current ${position}`}
          style={{ width: arm, height: arm }}
        />
      ))}
    </div>
  );
}
