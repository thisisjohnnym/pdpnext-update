type CartBagIconProps = {
  count?: number | string;
  size?: number;
  className?: string;
};

/** Solid filled shopping bag — overlapping shapes so handle and body have no gaps. */
export function CartBagIcon({
  count = 2,
  size = 24,
  className,
}: CartBagIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <rect x="4.5" y="9.5" width="15" height="12" rx="2.5" fill="currentColor" />
      <rect x="7" y="4.5" width="2.75" height="6.25" rx="1.25" fill="currentColor" />
      <rect x="14.25" y="4.5" width="2.75" height="6.25" rx="1.25" fill="currentColor" />
      <rect x="7" y="4.5" width="10" height="2.75" rx="1.25" fill="currentColor" />
      <text
        x="12"
        y="17.75"
        textAnchor="middle"
        fill="#0e0d0c"
        fontSize="10"
        fontWeight="500"
        fontFamily="var(--font-coach-extended), Helvetica Neue, Helvetica, Arial, sans-serif"
      >
        {count}
      </text>
    </svg>
  );
}
