import "server-only";

async function notifyTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return;
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chat, text }),
  });
}

/**
 * Send an email via Resend to any address. Silent no-op if RESEND_API_KEY isn't set.
 * Note: without a domain verified in Resend, their sandbox only delivers to the
 * Resend account's own email — sending to customers needs a verified domain.
 */
export async function sendEmail(to: string, subject: string, text: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const from = process.env.RESEND_FROM_EMAIL || "Ahmed Adel <onboarding@resend.dev>";
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject, text }),
  });
}

/**
 * Fan out an alert to Ahmed on every configured channel (Telegram and/or email).
 * Silent if none are configured; one channel failing never blocks the other.
 */
export async function notify(subject: string, text?: string) {
  const body = text ?? subject;
  const ownerEmail = process.env.NOTIFY_EMAIL_TO;
  await Promise.allSettled([
    notifyTelegram(body),
    ownerEmail ? sendEmail(ownerEmail, subject, body) : Promise.resolve(),
  ]);
}
