import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getLang } from "@/lib/lang";
import { getOrderByCode } from "@/lib/db";
import { ui } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return { title: ui.nav.track[lang] };
}

type Props = { searchParams: Promise<{ e?: string }> };

async function lookup(formData: FormData) {
  "use server";
  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  const order = code ? await getOrderByCode(code) : null;
  redirect(order ? `/order/${order.code}` : "/track?e=1");
}

export default async function TrackPage({ searchParams }: Props) {
  const [{ e }, lang] = await Promise.all([searchParams, getLang()]);
  return (
    <div className="mx-auto max-w-xl px-5 py-20">
      <p className="label">{ui.nav.track[lang]}</p>
      <h1 className="mt-4 text-4xl">{lang === "ar" ? "تابع طلبك" : "Track your order"}</h1>
      <form action={lookup} className="mt-10 space-y-4">
        <input name="code" required dir="ltr" placeholder="ORD-XXXXXX" className="field font-mono uppercase tracking-widest" />
        {e && <p role="alert" className="text-sm text-signal">{lang === "ar" ? "الكود ده مش موجود." : "Order code not found."}</p>}
        <button className="btn btn-primary" type="submit">{lang === "ar" ? "ابحث" : "Look up"}</button>
      </form>
    </div>
  );
}
