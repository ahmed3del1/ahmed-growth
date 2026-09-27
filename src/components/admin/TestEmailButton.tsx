"use client";

import { useState, useTransition } from "react";
import { testEmail } from "@/app/admin/actions";

/** One click, no digging through logs: shows exactly why an email did or didn't send. */
export function TestEmailButton() {
  const [result, setResult] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const run = () => {
    setResult(null);
    start(async () => {
      const res = await testEmail();
      setResult(res.ok ? "✅ Sent — check your inbox (and Junk/Spam)." : `❌ ${res.error}`);
    });
  };

  return (
    <div className="card flex flex-wrap items-center gap-4 p-4">
      <button type="button" onClick={run} disabled={pending} className="btn btn-ghost btn-sm">
        {pending ? "Sending…" : "Send test email"}
      </button>
      {result && <p className="break-all text-sm">{result}</p>}
    </div>
  );
}
