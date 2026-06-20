interface ScrollArrowDownProps {
  className?: string;
}

export function ScrollArrowDown({ className = "" }: ScrollArrowDownProps) {
  return (
    <svg
      className={className}
      width="10"
      height="14"
      viewBox="0 0 10 14"
      fill="none"
      aria-hidden
    >
      <path
        d="M5 1.5v8.5M5 10l3.25-3.25M5 10L1.75 6.75"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
