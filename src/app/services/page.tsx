import type { Metadata } from "next";
import Link from "next/link";
import { getLang } from "@/lib/lang";
import { services, ui } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return { title: ui.nav.services[lang] };
}

export default async function ServicesPage() {
  const lang = await getLang();
  return (
    <div className="mx-auto max-w-6xl px-5 py-20">
      <p className="label">{ui.nav.services[lang]}</p>
      <h1 className="mt-4 max-w-3xl text-4xl md:text-5xl">
        {lang === "ar" ? "خدمات مبنية على نظام واضح" : "Services built on a clear system"}
      </h1>

      <div className="mt-14 grid gap-4 md:grid-cols-2">
        {services.map((s, i) => (
          <article key={s.key} className="card p-8">
            <span className="label">{String(i + 1).padStart(2, "0")}</span>
            <h2 className="mt-4 text-2xl leading-snug">{s.title[lang]}</h2>
            <p className="mt-3 leading-relaxed text-silver">{s.body[lang]}</p>
            <ul className="mt-6 space-y-2 border-t border-smoke pt-6 text-sm">
              {s.items.map((it) => (
                <li key={it.en} className="flex gap-3">
                  <span className="text-signal">—</span>
                  <span>{it[lang]}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="mt-16 flex flex-col items-start gap-4 border-t border-smoke pt-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-lg text-silver">
          {lang === "ar"
            ? "مش متأكد إنت محتاج إيه؟ املا الـ Brief وأنا أرشحلك الأنسب."
            : "Not sure what you need? Fill the brief and I'll recommend the right fit."}
        </p>
        <Link href="/start" className="btn btn-primary">{ui.nav.start[lang]}</Link>
      </div>
    </div>
  );
}
