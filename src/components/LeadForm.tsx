"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { submitLead } from "@/app/actions";
import {
  adStatus,
  budgets,
  goals,
  industries,
  neededServices,
  platforms,
  roles,
  timelines,
  type Option,
} from "@/lib/form-options";

type Lang = "ar" | "en";

type Form = {
  hp: string;
  name: string;
  whatsapp: string;
  email: string;
  role: string;
  business: string;
  link: string;
  industry: string;
  offer: string;
  market: string;
  adStatus: string;
  platforms: string[];
  budget: string;
  problem: string;
  goals: string[];
  goalDetail: string;
  timeline: string;
  services: string[];
  heard: string;
};

const empty: Form = {
  hp: "",
  name: "",
  whatsapp: "",
  email: "",
  role: "",
  business: "",
  link: "",
  industry: "",
  offer: "",
  market: "",
  adStatus: "",
  platforms: [],
  budget: "",
  problem: "",
  goals: [],
  goalDetail: "",
  timeline: "",
  services: [],
  heard: "",
};

const STEPS = 5;
const PHONE = /^[+\d][\d\s-]{6,}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function valid(step: number, f: Form) {
  switch (step) {
    case 0:
      return f.name.trim().length >= 2 && PHONE.test(f.whatsapp.trim()) && EMAIL.test(f.email.trim()) && !!f.role;
    case 1:
      return f.business.trim().length >= 2 && !!f.industry && f.offer.trim().length >= 5 && f.market.trim().length >= 2;
    case 2:
      return !!f.adStatus && !!f.budget;
    case 3:
      return f.goals.length > 0 && f.goalDetail.trim().length >= 10 && !!f.timeline && f.services.length > 0;
    default:
      return true;
  }
}

export function LeadForm({ lang }: { lang: Lang }) {
  const L = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const [step, setStep] = useState(0);
  const [f, setF] = useState<Form>(empty);
  const [tried, setTried] = useState(false);
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [pending, start] = useTransition();

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((p) => ({ ...p, [k]: v }));
  const toggle = (k: "platforms" | "goals" | "services", v: string) =>
    setF((p) => ({ ...p, [k]: p[k].includes(v) ? p[k].filter((x) => x !== v) : [...p[k], v] }));

  const next = () => {
    setTried(true);
    if (!valid(step, f)) return;
    setTried(false);
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const back = () => {
    setTried(false);
    setStep((s) => s - 1);
  };

  const submit = () => {
    setError("");
    start(async () => {
      const res = await submitLead(f);
      if (res.ok) setCode(res.code);
      else setError(res.error === "invalid" ? L("راجع البيانات وحاول تاني.", "Please check your details and try again.") : L("حصلت مشكلة. حاول تاني بعد شوية.", "Something went wrong. Please try again shortly."));
    });
  };

  if (code) {
    const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
    return (
      <div className="card p-8 md:p-12">
        <p className="label">{L("تم الاستلام", "RECEIVED")}</p>
        <h2 className="mt-4 text-3xl">{L("وصلني الـ Brief بتاعك.", "I got your brief.")}</h2>
        <p className="mt-4 max-w-xl leading-relaxed text-silver">
          {L(
            "هراجعه بنفسي وأتواصل معاك على واتساب لو فيه Fit حقيقي. احتفظ بكود الطلب ده للمتابعة.",
            "I'll review it personally and reach out on WhatsApp if there's a real fit. Keep this reference code.",
          )}
        </p>
        <p className="mt-8 font-mono text-2xl tracking-widest">{code}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-ghost">{L("الرئيسية", "Home")}</Link>
          <Link href="/store" className="btn btn-ghost">{L("المتجر", "Store")}</Link>
          {wa && (
            <a className="btn btn-primary" target="_blank" rel="noopener noreferrer"
              href={`https://wa.me/${wa}?text=${encodeURIComponent(`${L("أهلا، أنا", "Hi, I'm")} ${f.name} — ${code}`)}`}>
              {L("كلمني على واتساب", "Message on WhatsApp")}
            </a>
          )}
        </div>
      </div>
    );
  }

  const err = (cond: boolean) => (tried && cond ? "border-signal" : "");
  const titles = [
    L("عنك", "About you"),
    L("البيزنس", "Your business"),
    L("الإعلانات دلوقتي", "Ads today"),
    L("الأهداف", "Goals"),
    L("مراجعة وإرسال", "Review & send"),
  ];

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <span className="label">{L("الخطوة", "STEP")} {step + 1}/{STEPS}</span>
          <span className="label text-snow">{titles[step]}</span>
        </div>
        <div className="mt-3 h-px w-full bg-smoke">
          <div className="h-px bg-signal transition-all" style={{ width: `${((step + 1) / STEPS) * 100}%` }} />
        </div>
      </div>

      <div className="card space-y-6 p-6 md:p-10">
        {/* honeypot — hidden from humans */}
        <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" value={f.hp}
          onChange={(e) => set("hp", e.target.value)} className="absolute -start-[9999px] h-0 w-0 opacity-0" name="company_site" />

        {step === 0 && (
          <>
            <Field label={L("الاسم", "Full name")}>
              <input className={`field ${err(f.name.trim().length < 2)}`} value={f.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" />
            </Field>
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label={L("رقم واتساب", "WhatsApp number")} hint={L("بالكود الدولي، مثال: +20…", "With country code, e.g. +20…")}>
                <input dir="ltr" inputMode="tel" className={`field ${err(!PHONE.test(f.whatsapp.trim()))}`} value={f.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} autoComplete="tel" />
              </Field>
              <Field label={L("الإيميل", "Email")}>
                <input dir="ltr" type="email" className={`field ${err(!EMAIL.test(f.email.trim()))}`} value={f.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" />
              </Field>
            </div>
            <Field label={L("إنت…", "You are…")}>
              <Single options={roles} value={f.role} onChange={(v) => set("role", v)} lang={lang} />
              {tried && !f.role && <Required lang={lang} />}
            </Field>
          </>
        )}

        {step === 1 && (
          <>
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label={L("اسم البيزنس / البراند", "Business / brand name")}>
                <input className={`field ${err(f.business.trim().length < 2)}`} value={f.business} onChange={(e) => set("business", e.target.value)} />
              </Field>
              <Field label={L("لينك الموقع أو الصفحة", "Website or social link")} hint={L("اختياري", "Optional")}>
                <input dir="ltr" className="field" value={f.link} onChange={(e) => set("link", e.target.value)} placeholder="https://" />
              </Field>
            </div>
            <Field label={L("المجال", "Industry")}>
              <Single options={industries} value={f.industry} onChange={(v) => set("industry", v)} lang={lang} />
              {tried && !f.industry && <Required lang={lang} />}
            </Field>
            <Field label={L("بتبيع إيه بالظبط؟", "What exactly do you sell?")}>
              <textarea rows={3} className={`field ${err(f.offer.trim().length < 5)}`} value={f.offer} onChange={(e) => set("offer", e.target.value)} />
            </Field>
            <Field label={L("السوق المستهدف", "Target market")} hint={L("دول / مدن", "Countries / cities")}>
              <input className={`field ${err(f.market.trim().length < 2)}`} value={f.market} onChange={(e) => set("market", e.target.value)} />
            </Field>
          </>
        )}

        {step === 2 && (
          <>
            <Field label={L("وضعك مع الإعلانات", "Where are you with ads?")}>
              <Single options={adStatus} value={f.adStatus} onChange={(v) => set("adStatus", v)} lang={lang} />
              {tried && !f.adStatus && <Required lang={lang} />}
            </Field>
            <Field label={L("المنصات اللي جربتها", "Platforms you've used")} hint={L("اختياري", "Optional")}>
              <Multi options={platforms} values={f.platforms} onToggle={(v) => toggle("platforms", v)} lang={lang} />
            </Field>
            <Field label={L("ميزانية الإعلانات الشهرية", "Monthly ad budget")}>
              <Single options={budgets} value={f.budget} onChange={(v) => set("budget", v)} lang={lang} />
              {tried && !f.budget && <Required lang={lang} />}
            </Field>
            <Field label={L("أكبر مشكلة قدامك دلوقتي", "Your biggest problem right now")} hint={L("اختياري", "Optional")}>
              <textarea rows={3} className="field" value={f.problem} onChange={(e) => set("problem", e.target.value)} />
            </Field>
          </>
        )}

        {step === 3 && (
          <>
            <Field label={L("عاوز توصل لإيه؟", "What do you want to achieve?")} hint={L("اختار واحد أو أكتر", "Pick one or more")}>
              <Multi options={goals} values={f.goals} onToggle={(v) => toggle("goals", v)} lang={lang} />
              {tried && f.goals.length === 0 && <Required lang={lang} />}
            </Field>
            <Field label={L("احكيلي عن هدفك بالتفصيل", "Describe your goal in detail")}>
              <textarea rows={4} className={`field ${err(f.goalDetail.trim().length < 10)}`} value={f.goalDetail} onChange={(e) => set("goalDetail", e.target.value)} />
            </Field>
            <Field label={L("محتاج إيه مني؟", "What do you need from me?")}>
              <Multi options={neededServices} values={f.services} onToggle={(v) => toggle("services", v)} lang={lang} />
              {tried && f.services.length === 0 && <Required lang={lang} />}
            </Field>
            <Field label={L("عاوز تبدأ إمتى؟", "When do you want to start?")}>
              <Single options={timelines} value={f.timeline} onChange={(v) => set("timeline", v)} lang={lang} />
              {tried && !f.timeline && <Required lang={lang} />}
            </Field>
            <Field label={L("عرفتني منين؟", "How did you find me?")} hint={L("اختياري", "Optional")}>
              <input className="field" value={f.heard} onChange={(e) => set("heard", e.target.value)} />
            </Field>
          </>
        )}

        {step === 4 && (
          <div className="space-y-5 text-sm">
            <p className="text-silver">{L("راجع بياناتك قبل الإرسال.", "Review your details before sending.")}</p>
            <Summary rows={[
              [L("الاسم", "Name"), f.name],
              [L("واتساب", "WhatsApp"), f.whatsapp],
              [L("الإيميل", "Email"), f.email],
              [L("البيزنس", "Business"), f.business],
              [L("المجال", "Industry"), lab(industries, f.industry, lang)],
              [L("السوق", "Market"), f.market],
              [L("الميزانية", "Budget"), lab(budgets, f.budget, lang)],
              [L("الأهداف", "Goals"), f.goals.map((g) => lab(goals, g, lang)).join("، ")],
              [L("الخدمات", "Services"), f.services.map((g) => lab(neededServices, g, lang)).join("، ")],
              [L("البداية", "Timeline"), lab(timelines, f.timeline, lang)],
            ]} />
            {error && <p role="alert" className="border border-signal p-3 text-signal">{error}</p>}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-smoke pt-6">
          {step > 0 ? (
            <button type="button" onClick={back} className="btn btn-ghost">{L("رجوع", "Back")}</button>
          ) : <span />}
          {step < STEPS - 1 ? (
            <button type="button" onClick={next} className="btn btn-primary">{L("التالي", "Next")}</button>
          ) : (
            <button type="button" onClick={submit} disabled={pending} className="btn btn-primary">
              {pending ? L("بيتبعت…", "Sending…") : L("ابعت الـ Brief", "Send brief")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const lab = (opts: Option[], v: string, lang: Lang) => opts.find((o) => o.value === v)?.label[lang] ?? v;

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label className="text-sm font-bold">{label}</label>
        {hint && <span className="label normal-case tracking-normal">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Required({ lang }: { lang: Lang }) {
  return <p className="mt-2 text-xs text-signal">{lang === "ar" ? "مطلوب" : "Required"}</p>;
}

function Single({ options, value, onChange, lang }: { options: Option[]; value: string; onChange: (v: string) => void; lang: Lang }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button key={o.value} dir="auto" type="button" className="chip" aria-pressed={value === o.value} onClick={() => onChange(o.value)}>
          {o.label[lang]}
        </button>
      ))}
    </div>
  );
}

function Multi({ options, values, onToggle, lang }: { options: Option[]; values: string[]; onToggle: (v: string) => void; lang: Lang }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button key={o.value} dir="auto" type="button" className="chip" aria-pressed={values.includes(o.value)} onClick={() => onToggle(o.value)}>
          {o.label[lang]}
        </button>
      ))}
    </div>
  );
}

function Summary({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="divide-y divide-smoke border border-smoke">
      {rows.map(([k, v]) => (
        <div key={k} className="grid grid-cols-[8rem_1fr] gap-4 p-3">
          <dt className="label">{k}</dt>
          <dd dir="auto" className="break-words text-start">{v || "—"}</dd>
        </div>
      ))}
    </dl>
  );
}
