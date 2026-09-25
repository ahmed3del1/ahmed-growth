import type { Metadata } from "next";
import { getLang } from "@/lib/lang";
import { listProducts } from "@/lib/db";
import { ProductCard } from "@/components/ProductCard";
import { ui } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return { title: ui.nav.store[lang] };
}

export default async function StorePage() {
  const lang = await getLang();
  const products = await listProducts({ activeOnly: true });
  return (
    <div className="mx-auto max-w-6xl px-5 py-20">
      <p className="label">{ui.nav.store[lang]}</p>
      <h1 className="mt-4 max-w-3xl text-4xl md:text-5xl">
        {lang === "ar" ? "أدوات وخدمات جاهزة" : "Ready-made tools and services"}
      </h1>
      {products.length === 0 ? (
        <p className="mt-12 text-silver">{lang === "ar" ? "مفيش منتجات دلوقتي. ارجع قريب." : "No products yet. Check back soon."}</p>
      ) : (
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} lang={lang} />
          ))}
        </div>
      )}
    </div>
  );
}
