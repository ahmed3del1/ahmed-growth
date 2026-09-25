import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logoutAction } from "../actions";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const nav = [
    { href: "/admin", label: "Leads" },
    { href: "/admin/orders", label: "Orders" },
    { href: "/admin/products", label: "Products" },
  ];
  return (
    <div dir="ltr" className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-smoke pb-5">
        <nav className="flex gap-6">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="label transition-colors hover:text-snow">
              {n.label}
            </Link>
          ))}
        </nav>
        <form action={logoutAction}>
          <button className="label transition-colors hover:text-snow" type="submit">Sign out</button>
        </form>
      </div>
      <div className="pt-8">{children}</div>
    </div>
  );
}
