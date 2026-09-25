import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import { timingSafeEqual } from "node:crypto";

const COOKIE = "aa_admin";
const isDev = process.env.NODE_ENV !== "production";

function secret() {
  const s = process.env.SESSION_SECRET ?? (isDev ? "dev-only-secret-change-me-please-32chars" : "");
  if (!s || s.length < 32) throw new Error("SESSION_SECRET must be set (32+ characters).");
  return new TextEncoder().encode(s);
}

function adminPassword() {
  const p = process.env.ADMIN_PASSWORD ?? (isDev ? "admin" : "");
  if (!p) throw new Error("ADMIN_PASSWORD must be set.");
  return p;
}

export function passwordMatches(input: string) {
  const a = Buffer.from(input);
  const b = Buffer.from(adminPassword());
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function startSession() {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret());
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: !isDev,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, secret());
    return true;
  } catch {
    return false;
  }
}

/** Call at the top of every admin page AND every admin server action. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
