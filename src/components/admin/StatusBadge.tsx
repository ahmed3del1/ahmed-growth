/** Brand-safe badge: monochrome, red only for statuses that need attention. */
export function StatusBadge({ status }: { status: string }) {
  const attention = status === "new" || status === "pending";
  return (
    <span className={`label border px-2 py-1 ${attention ? "border-signal text-signal" : "border-smoke"}`}>
      {status.replace("_", " ")}
    </span>
  );
}
