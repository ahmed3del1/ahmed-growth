import type { Bi } from "./lang";

export type Option = { value: string; label: Bi };

export const roles: Option[] = [
  { value: "owner", label: { ar: "صاحب بيزنس", en: "Business owner" } },
  { value: "marketing", label: { ar: "مسؤول Marketing", en: "Marketing lead" } },
  { value: "agency", label: { ar: "Agency", en: "Agency" } },
  { value: "other", label: { ar: "حاجة تانية", en: "Other" } },
];

export const industries: Option[] = [
  { value: "ecommerce", label: { ar: "E-commerce", en: "E-commerce" } },
  { value: "real_estate", label: { ar: "عقارات", en: "Real estate" } },
  { value: "services", label: { ar: "خدمات", en: "Services" } },
  { value: "education", label: { ar: "تعليم", en: "Education" } },
  { value: "health", label: { ar: "صحة وجمال", en: "Health & beauty" } },
  { value: "food", label: { ar: "أكل ومطاعم", en: "Food & restaurants" } },
  { value: "saas", label: { ar: "SaaS / Apps", en: "SaaS / Apps" } },
  { value: "other", label: { ar: "مجال تاني", en: "Other" } },
];

export const adStatus: Option[] = [
  { value: "never", label: { ar: "لسه ما عملتش إعلانات", en: "Never run ads" } },
  { value: "running", label: { ar: "بعمل إعلانات حاليًا", en: "Running ads now" } },
  { value: "paused", label: { ar: "وقفتها", en: "Paused / stopped" } },
];

export const platforms: Option[] = [
  { value: "meta", label: { ar: "Meta (FB/IG)", en: "Meta (FB/IG)" } },
  { value: "google", label: { ar: "Google Ads", en: "Google Ads" } },
  { value: "tiktok", label: { ar: "TikTok", en: "TikTok" } },
  { value: "snapchat", label: { ar: "Snapchat", en: "Snapchat" } },
  { value: "youtube", label: { ar: "YouTube", en: "YouTube" } },
  { value: "other", label: { ar: "تاني", en: "Other" } },
];

export const budgets: Option[] = [
  { value: "lt500", label: { ar: "أقل من $500 / شهر", en: "Under $500 / month" } },
  { value: "500_2k", label: { ar: "$500 – $2,000", en: "$500 – $2,000" } },
  { value: "2k_5k", label: { ar: "$2,000 – $5,000", en: "$2,000 – $5,000" } },
  { value: "5k_15k", label: { ar: "$5,000 – $15,000", en: "$5,000 – $15,000" } },
  { value: "15k_plus", label: { ar: "$15,000+", en: "$15,000+" } },
  { value: "unsure", label: { ar: "مش متأكد", en: "Not sure yet" } },
];

export const goals: Option[] = [
  { value: "sales", label: { ar: "مبيعات E-commerce", en: "E-commerce sales" } },
  { value: "leads", label: { ar: "Leads", en: "Leads" } },
  { value: "installs", label: { ar: "App installs", en: "App installs" } },
  { value: "awareness", label: { ar: "Brand awareness", en: "Brand awareness" } },
  { value: "scale", label: { ar: "Scale لحاجة شغّالة", en: "Scale what works" } },
  { value: "fix", label: { ar: "إصلاح Tracking / حساب", en: "Fix tracking / account" } },
];

export const timelines: Option[] = [
  { value: "asap", label: { ar: "في أقرب وقت", en: "As soon as possible" } },
  { value: "month", label: { ar: "خلال شهر", en: "Within a month" } },
  { value: "quarter", label: { ar: "خلال 2–3 شهور", en: "In 2–3 months" } },
  { value: "exploring", label: { ar: "بستكشف بس", en: "Just exploring" } },
];

export const neededServices: Option[] = [
  { value: "buying", label: { ar: "إدارة حملات", en: "Campaign management" } },
  { value: "audit", label: { ar: "Account Audit", en: "Account Audit" } },
  { value: "tracking", label: { ar: "Tracking", en: "Tracking" } },
  { value: "creative", label: { ar: "Creative Strategy", en: "Creative Strategy" } },
  { value: "consulting", label: { ar: "Consulting / Training", en: "Consulting / Training" } },
];

export const paymentMethods: Option[] = [
  { value: "instapay", label: { ar: "InstaPay", en: "InstaPay" } },
  { value: "vodafone", label: { ar: "Vodafone Cash", en: "Vodafone Cash" } },
  { value: "other", label: { ar: "تنسيق على واتساب", en: "Arrange on WhatsApp" } },
];

export const values = (opts: Option[]) => opts.map((o) => o.value);
export const labelOf = (opts: Option[], value: string, lang: "ar" | "en") =>
  opts.find((o) => o.value === value)?.label[lang] ?? value;
