import "server-only";
import nodemailer from "nodemailer";

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

/** Picks the right SMTP provider from the sender's own address — no domain needed. */
function detectService(email: string): string | undefined {
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  if (domain.includes("gmail")) return "gmail";
  if (domain.includes("hotmail") || domain.includes("outlook") || domain.includes("live.com")) return "hotmail";
  return undefined;
}

let transport: ReturnType<typeof nodemailer.createTransport> | undefined;
function getTransport() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_APP_PASSWORD;
  if (!user || !pass) return null;
  if (!transport) {
    const service = detectService(user);
    transport = nodemailer.createTransport(
      service
        ? { service, auth: { user, pass } }
        : { host: "smtp.office365.com", port: 587, secure: false, auth: { user, pass } }, // best-effort fallback
    );
  }
  return transport;
}

/**
 * Send an email to any address — no domain needed. Sends through your own inbox
 * (EMAIL_USER + EMAIL_APP_PASSWORD, Gmail or Outlook/Hotmail — auto-detected) if
 * configured, else via Resend (RESEND_API_KEY), which only reaches the Resend
 * account's own email unless a domain is verified. Silent no-op if neither is set.
 */
export async function sendEmail(to: string, subject: string, text: string) {
  const smtp = getTransport();
  if (smtp) {
    await smtp.sendMail({ from: process.env.EMAIL_USER, to, subject, text });
    return;
  }
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
  await Promise.allSettled([notifyTelegram(body), ownerEmail ? sendEmail(ownerEmail, subject, body) : Promise.resolve()]);
}
