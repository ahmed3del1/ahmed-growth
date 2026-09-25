import Link from "next/link";
import type { Product } from "@/lib/db";
import type { Lang } from "@/lib/lang";

export const money = (n: number, lang: Lang) =>
  lang === "ar" ? `${n.toLocaleString("ar-EG")} ج.م` : `EGP ${n.toLocaleString("en-US")}`;

export function ProductCard({ product, lang }: { product: Product; lang: Lang }) {
  const title = lang === "ar" ? product.title_ar : product.title_en;
  const desc = lang === "ar" ? product.desc_ar : product.desc_en;
  const type = product.type === "digital" ? (lang === "ar" ? "DIGITAL" : "DIGITAL") : lang === "ar" ? "SERVICE" : "SERVICE";

  return (
    <Link
      href={`/store/${product.slug}`}
      className="card group flex flex-col justify-between p-6 transition-colors hover:border-silver"
    >
      <div>
        <span className="label">{type}</span>
        <h3 className="mt-4 text-xl leading-snug">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-silver">{desc}</p>
      </div>
      <div className="mt-8 flex items-center justify-between">
        <span className="font-mono text-lg">{money(product.price, lang)}</span>
        <span className="text-sm font-bold text-signal">{lang === "ar" ? "التفاصيل ←" : "Details →"}</span>
      </div>
    </Link>
  );
}
