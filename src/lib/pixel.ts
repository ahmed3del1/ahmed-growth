"use client";

type Fbq = (...args: unknown[]) => void;

/** Fire a Meta Pixel event. Safe no-op when the pixel isn't configured or blocked. */
export function trackPixel(event: string, params?: Record<string, unknown>) {
  const fbq = (window as unknown as { fbq?: Fbq }).fbq;
  if (typeof fbq === "function") fbq("track", event, params);
}
