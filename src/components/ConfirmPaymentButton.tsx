"use client";

import { useState, useTransition } from "react";
import { claimPayment } from "@/app/actions";

/**
 * "I've transferred" button: pings Ahmed instantly (Telegram/email, whatever is
 * configured) the moment the customer clicks — then opens WhatsApp so they can
 * still attach the receipt photo, which can't be sent automatically.
 */
export function ConfirmPaymentButton({
  code,
  waLink,
  label,
  sentLabel,
}: {
  code: string;
  waLink: string;
  label: string;
  sentLabel: string;
}) {
  const [sent, setSent] = useState(false);
  const [pending, start] = useTransition();

  const click = () => {
    start(async () => {
      await claimPayment(code);
      setSent(true);
      window.open(waLink, "_blank", "noopener,noreferrer");
    });
  };

  return (
    <button type="button" onClick={click} disabled={pending} className="btn btn-primary mt-6">
      {sent ? sentLabel : pending ? "…" : label}
    </button>
  );
}
