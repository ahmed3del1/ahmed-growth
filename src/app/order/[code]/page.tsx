import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLang } from "@/lib/lang";
import { getOrderByCode, getProduct } from "@/lib/db";
import { labelOf, paymentMethods } from "@/lib/form-options";
import { money } from "@/components/ProductCard";

export const metadata: Metadata = { title: "Order", robots: { index: false } };

type Props = { params: Promise<{ code: string }> };

const statusLabel = {
  pending: { ar: "في انتظار الدفع", en: "Awaiting payment" },
  paid: { ar: "تم الدفع", en: "Paid" },
  delivered: { ar: "تم التسليم", en: "Delivered" },
  cancelled: { ar: "ملغي", en: "Cancelled" },
} as const;

export default async function OrderPage({ params }: Props) {
  const [{ code }, lang] = await Promise.all([params, getLang()]);
  const order = await getOrderByCode(decodeURIComponent(code));
  if (!order) notFound();

  const product = await getProduct(order.product_id);
  const title = product ? (lang === "ar" ? product.title_ar : product.title_en) : order.product_title;
  const unlocked = order.status === "paid" || order.status === "delivered";
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
  const instapay = process.env.PAY_INSTAPAY;
  const vodafone = process.env.PAY_VODAFONE_CASH;

  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <p className="label">{lang === "ar" ? "طلبك" : "YOUR ORDER"}</p>
      <h1 className="mt-4 font-mono text-3xl tracking-widest">{order.code}</h1>

      <dl className="card mt-8 divide-y divide-smoke">
        <Row k={lang === "ar" ? "المنتج" : "Product"} v={title} />
        <Row k={lang === "ar" ? "السعر" : "Price"} v={money(order.price, lang)} mono />
        <Row k={lang === "ar" ? "الدفع" : "Payment"} v={labelOf(paymentMethods, order.method, lang)} />
        <Row k={lang === "ar" ? "الحالة" : "Status"} v={statusLabel[order.status][lang]} accent={order.status === "pending"} />
      </dl>

      {order.status === "pending" && (
        <section className="mt-8 card p-6">
          <h2 className="text-lg">{lang === "ar" ? "إزاي تدفع" : "How to pay"}</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {order.method === "instapay" && instapay && <li><span className="label me-3">InstaPay</span><span dir="ltr" className="font-mono">{instapay}</span></li>}
            {order.method === "vodafone" && vodafone && <li><span className="label me-3">Vodafone Cash</span><span dir="ltr" className="font-mono">{vodafone}</span></li>}
            <li className="leading-relaxed text-silver">
              {order.method === "other"
                ? lang === "ar"
                  ? "للتحويل الدولي، كلّمني على واتساب ونتفق على طريقة الدفع الأنسب. ابعتلي كود الطلب."
                  : "For international transfers, message me on WhatsApp and we'll agree on the best payment method. Send me your order code."
                : lang === "ar"
                  ? `حوّل ${money(order.price, lang)} وابعتلي صورة التحويل على واتساب مع كود الطلب.`
                  : `Transfer ${money(order.price, lang)} and send me the receipt on WhatsApp with your order code.`}
            </li>
          </ul>
          {wa && (
            <a className="btn btn-primary mt-6" target="_blank" rel="noopener noreferrer"
              href={`https://wa.me/${wa}?text=${encodeURIComponent(`${order.code} — ${order.name}`)}`}>
              {order.method === "other" ? (lang === "ar" ? "كلّمني على واتساب" : "Message me on WhatsApp") : lang === "ar" ? "ابعت إيصال الدفع" : "Send payment receipt"}
            </a>
          )}
        </section>
      )}

      {unlocked && product?.delivery_url && (
        <section className="mt-8 card p-6">
          <h2 className="text-lg">{lang === "ar" ? "التسليم" : "Delivery"}</h2>
          <a href={product.delivery_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-4">
            {lang === "ar" ? "افتح المنتج" : "Open your product"}
          </a>
        </section>
      )}

      {unlocked && !product?.delivery_url && (
        <p className="mt-8 text-sm leading-relaxed text-silver">
          {lang === "ar" ? "تم تأكيد الدفع. هتواصل معاك على واتساب لتنسيق التسليم." : "Payment confirmed. I'll reach out on WhatsApp to arrange delivery."}
        </p>
      )}

      {order.admin_note && <p className="mt-6 border-s-2 border-smoke ps-4 text-sm text-silver">{order.admin_note}</p>}
    </div>
  );
}

function Row({ k, v, mono, accent }: { k: string; v: string; mono?: boolean; accent?: boolean }) {
  return (
    <div className="grid grid-cols-[7rem_1fr] gap-4 p-4">
      <dt className="label">{k}</dt>
      <dd className={`${mono ? "font-mono" : ""} ${accent ? "text-signal" : ""}`}>{v}</dd>
    </div>
  );
}
