import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { loginAction } from "../actions";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  if (await isAdmin()) redirect("/admin");
  const { e } = await searchParams;
  return (
    <div dir="ltr" className="mx-auto max-w-sm px-5 py-24">
      <p className="label">ADMIN</p>
      <h1 className="mt-4 text-3xl">Sign in</h1>
      <form action={loginAction} className="mt-8 space-y-4">
        <input name="password" type="password" required autoFocus placeholder="Password" className="field" autoComplete="current-password" />
        {e && <p role="alert" className="text-sm text-signal">Wrong password.</p>}
        <button className="btn btn-primary w-full" type="submit">Enter</button>
      </form>
    </div>
  );
}
