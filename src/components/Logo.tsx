/** Official "A" mark, traced from the Brand Guide: open at the base, red flame = the only accent. */
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="110 10 690 690" fill="none" aria-hidden="true">
      <polygon fill="#F5F5F5" points="138,684 487,285 777,684 570,684 527,618 597,618 485,453 285,684" />
      <polygon fill="#E8271A" points="730,30 680,232 600,372 565,300 582,205" />
    </svg>
  );
}
