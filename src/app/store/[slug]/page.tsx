import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLang } from "@/lib/lang";
import { getProductBySlug } from "@/lib/db";
import { OrderForm } from "@/components/OrderForm";
import { money } from "@/components/ProductCard";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [{ slug }, lang] = await Promise.all([params, getLang()]);
  const p = await getProductBySlug(slug);
  if (!p) return {};
  return { title: lang === "ar" ? p.title_ar : p.title_en, description: lang === "ar" ? p.desc_ar : p.desc_en };
}

export default async function ProductPage({ params }: Props) {
  const [{ slug }, lang] = await Promise.all([params, getLang()]);
  const p = await getProductBySlug(slug);
  if (!p || !p.active) notFound();

  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <Link href="/store" className="label hover:text-snow">{lang === "ar" ? "→ المتجر" : "← Store"}</Link>
      <div className="mt-8 grid gap-10 md:grid-cols-[1.2fr_1fr]">
        <div>
          <span className="label">{p.type === "digital" ? "DIGITAL" : "SERVICE"}</span>
          <h1 className="mt-4 text-3xl leading-tight md:text-5xl">{lang === "ar" ? p.title_ar : p.title_en}</h1>
          <p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-silver">{lang === "ar" ? p.desc_ar : p.desc_en}</p>
          <p className="mt-10 font-mono text-3xl">{money(p.price, lang)}</p>
        </div>
        <OrderForm productId={p.id} price={p.price} lang={lang} />
      </div>
    </div>
  );
}
