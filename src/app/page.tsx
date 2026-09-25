import Link from "next/link";
import { getLang } from "@/lib/lang";
import { listProducts } from "@/lib/db";
import { principles, process, services, site, ui } from "@/lib/content";
import { ProductCard } from "@/components/ProductCard";
import { LogoMark } from "@/components/Logo";

export default async function Home() {
  const lang = await getLang();
  const products = (await listProducts({ activeOnly: true })).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:grid-cols-[1.4fr_1fr] md:py-28">
        <div>
          <p className="label">{ui.hero.label[lang]}</p>
          <h1 className="mt-6 text-4xl leading-[1.15] sm:text-5xl md:text-6xl">{site.tagline[lang]}</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-silver">{ui.hero.sub[lang]}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/start" className="btn btn-primary">{ui.hero.cta[lang]}</Link>
            <Link href="/store" className="btn btn-ghost">{ui.hero.cta2[lang]}</Link>
          </div>
        </div>
        <div className="card hidden aspect-square items-center justify-center md:flex">
          <LogoMark size={140} />
        </div>
      </section>

      {/* Services */}
      <section className="border-t border-smoke">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <p className="label">01 — {ui.nav.services[lang]}</p>
          <h2 className="mt-4 max-w-2xl text-3xl md:text-4xl">
            {lang === "ar" ? "اللي بشتغل عليه" : "What I work on"}
          </h2>
          <div className="mt-12 grid gap-px border border-smoke bg-smoke sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <div key={s.key} className="bg-ink p-7">
                <span className="label">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 text-lg leading-snug">{s.title[lang]}</h3>
                <p className="mt-3 text-sm leading-relaxed text-silver">{s.body[lang]}</p>
              </div>
            ))}
          </div>
          <Link href="/services" className="mt-8 inline-block text-sm font-bold text-signal">
            {lang === "ar" ? "كل التفاصيل ←" : "Full details →"}
          </Link>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="border-t border-smoke bg-carbon">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <p className="label">02 — {ui.nav.process[lang]}</p>
          <h2 className="mt-4 max-w-2xl text-3xl md:text-4xl">
            {lang === "ar" ? "إزاي بنشتغل مع بعض" : "How we work together"}
          </h2>
          <ol className="mt-12 grid gap-8 md:grid-cols-4">
            {process.map((step, i) => (
              <li key={i} className="border-t border-smoke pt-6">
                <span className="label">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-lg">{step.title[lang]}</h3>
                <p className="mt-2 text-sm leading-relaxed text-silver">{step.body[lang]}</p>
              </li>
            ))}
          </ol>
          <Link href="/start" className="btn btn-primary mt-12">{ui.hero.cta[lang]}</Link>
        </div>
      </section>

      {/* Principles */}
      <section className="border-t border-smoke">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <p className="label">03 — {lang === "ar" ? "المبادئ" : "Principles"}</p>
          <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((p) => (
              <div key={p.title.en}>
                <h3 className="text-lg">{p.title[lang]}</h3>
                <p className="mt-2 text-sm leading-relaxed text-silver">{p.body[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Store teaser */}
      {products.length > 0 && (
        <section className="border-t border-smoke bg-carbon">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="label">04 — {ui.nav.store[lang]}</p>
                <h2 className="mt-4 text-3xl md:text-4xl">
                  {lang === "ar" ? "أدوات جاهزة تبدأ بيها" : "Ready-made tools to start with"}
                </h2>
              </div>
              <Link href="/store" className="hidden text-sm font-bold text-signal sm:block">
                {lang === "ar" ? "كل المنتجات ←" : "All products →"}
              </Link>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} lang={lang} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="border-t border-smoke">
        <div className="mx-auto max-w-3xl px-5 py-24 text-center">
          <h2 className="text-3xl md:text-5xl">
            {lang === "ar" ? "جاهز نبدأ؟" : "Ready to start?"}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-silver">
            {lang === "ar"
              ? "املا الـ Brief في دقايق، وأنا براجعه بنفسي وأرد عليك."
              : "Fill the brief in a few minutes. I review it personally and reply."}
          </p>
          <Link href="/start" className="btn btn-primary mt-8">{ui.hero.cta[lang]}</Link>
        </div>
      </section>
    </>
  );
}
