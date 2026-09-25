"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { placeOrder } from "@/app/actions";
import { paymentMethods } from "@/lib/form-options";

type Lang = "ar" | "en";

export function OrderForm({ productId, lang }: { productId: string; lang: Lang }) {
  const L = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const router = useRouter();
  const [f, setF] = useState({ hp: "", name: "", phone: "", email: "", method: "instapay", note: "" });
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const set = (k: keyof typeof f, v: string) => setF((p) => ({ ...p, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    start(async () => {
      const res = await placeOrder({ ...f, productId });
      if (res.ok) router.push(`/order/${res.code}`);
      else
        setError(
          res.error === "unavailable"
            ? L("المنتج ده مش متاح دلوقتي.", "This product is no longer available.")
            : L("راجع البيانات وحاول تاني.", "Please check your details and try again."),
        );
    });
  };

  return (
    <form onSubmit={submit} className="card space-y-5 p-6 md:p-8">
      <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" value={f.hp}
        onChange={(e) => set("hp", e.target.value)} className="absolute -start-[9999px] h-0 w-0 opacity-0" name="company_site" />

      <h2 className="text-xl">{L("اطلب دلوقتي", "Order now")}</h2>

      <div>
        <label className="mb-2 block text-sm font-bold">{L("الاسم", "Full name")}</label>
        <input required minLength={2} className="field" value={f.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-bold">{L("رقم واتساب", "WhatsApp number")}</label>
          <input required dir="ltr" inputMode="tel" pattern="[+\d][\d\s\-]{6,}" className="field" value={f.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-bold">{L("الإيميل", "Email")}</label>
          <input required dir="ltr" type="email" className="field" value={f.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" />
        </div>
      </div>

      <div>
        <span className="mb-2 block text-sm font-bold">{L("طريقة الدفع", "Payment method")}</span>
        <div className="flex flex-wrap gap-2">
          {paymentMethods.map((m) => (
            <button key={m.value} dir="auto" type="button" className="chip" aria-pressed={f.method === m.value} onClick={() => set("method", m.value)}>
              {m.label[lang]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold">
          {L("ملاحظات", "Notes")} <span className="label normal-case tracking-normal">{L("اختياري", "Optional")}</span>
        </label>
        <textarea rows={3} className="field" value={f.note} onChange={(e) => set("note", e.target.value)} />
      </div>

      {error && <p role="alert" className="border border-signal p-3 text-sm text-signal">{error}</p>}

      <button type="submit" disabled={pending} className="btn btn-primary w-full">
        {pending ? L("بيتسجل…", "Placing…") : L("تأكيد الطلب", "Place order")}
      </button>
      <p className="text-xs leading-relaxed text-silver">
        {L(
          "بعد التأكيد هتلاقي تعليمات الدفع. المنتج بيتسلّم بعد تأكيد الدفع.",
          "After confirming you'll see payment instructions. Delivery happens once payment is confirmed.",
        )}
      </p>
    </form>
  );
}
