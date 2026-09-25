import type { Bi } from "./lang";

export const site = {
  name: { ar: "أحمد عادل", en: "Ahmed Adel" } as Bi,
  role: { ar: "Media Buyer", en: "Media Buyer" } as Bi,
  tagline: {
    ar: "Media Buying بيتبني على نظام. مش على حظ.",
    en: "Media buying built on a system. Not luck.",
  } as Bi,
  description: {
    ar: "أحمد عادل — Media Buyer. إدارة حملات Meta و Google و TikTok، وتتبع دقيق، وقرارات على أساس داتا.",
    en: "Ahmed Adel — Media Buyer. Meta, Google and TikTok campaigns, precise tracking, decisions driven by data.",
  } as Bi,
};

export const ui = {
  nav: {
    services: { ar: "الخدمات", en: "Services" },
    process: { ar: "طريقة الشغل", en: "Process" },
    store: { ar: "المتجر", en: "Store" },
    track: { ar: "تتبع طلب", en: "Track order" },
    start: { ar: "ابدأ معايا", en: "Start a project" },
    switch: { ar: "English", en: "عربي" },
  },
  hero: {
    label: { ar: "PERFORMANCE MEDIA BUYING", en: "PERFORMANCE MEDIA BUYING" } as Bi,
    sub: {
      ar: "بشتغل مع البراندات اللي عاوزة تكبر بإعلانات مدفوعة على Meta و Google و TikTok — بخطة واضحة، وتتبع دقيق، وقرارات مبنية على الداتا.",
      en: "I work with brands that want to grow through paid ads on Meta, Google and TikTok — with a clear plan, precise tracking and data-backed decisions.",
    } as Bi,
    cta: { ar: "ابدأ معايا", en: "Start a project" } as Bi,
    cta2: { ar: "شوف المتجر", en: "Browse the store" } as Bi,
  },
};

export const services: { key: string; title: Bi; body: Bi; items: Bi[] }[] = [
  {
    key: "buying",
    title: { ar: "Media Buying & Campaign Management", en: "Media Buying & Campaign Management" },
    body: {
      ar: "بناء وإدارة وتحسين الحملات على Meta و Google و TikTok من الـ Structure لحد الـ Scale.",
      en: "Building, running and optimising campaigns on Meta, Google and TikTok — from structure to scale.",
    },
    items: [
      { ar: "Account & campaign structure", en: "Account & campaign structure" },
      { ar: "Audience & offer testing", en: "Audience & offer testing" },
      { ar: "Budget allocation و Scaling", en: "Budget allocation and scaling" },
      { ar: "Reporting واضح بقرارات", en: "Clear reporting with decisions" },
    ],
  },
  {
    key: "audit",
    title: { ar: "Account Audit", en: "Account Audit" },
    body: {
      ar: "مراجعة كاملة لحسابك الإعلاني: فين الميزانية بتضيع وإيه الأولويات.",
      en: "A full review of your ad account: where budget leaks and what to fix first.",
    },
    items: [
      { ar: "Structure & settings", en: "Structure & settings" },
      { ar: "Creative & audience analysis", en: "Creative & audience analysis" },
      { ar: "Tracking health", en: "Tracking health" },
      { ar: "Action plan بالأولويات", en: "Prioritised action plan" },
    ],
  },
  {
    key: "tracking",
    title: { ar: "Tracking & Measurement", en: "Tracking & Measurement" },
    body: {
      ar: "لو الداتا غلط، القرارات غلط. بظبط التتبع الأول.",
      en: "If the data is wrong, the decisions are wrong. Tracking comes first.",
    },
    items: [
      { ar: "Pixel & Conversions API", en: "Pixel & Conversions API" },
      { ar: "GA4 & GTM", en: "GA4 & GTM" },
      { ar: "Event mapping", en: "Event mapping" },
      { ar: "Attribution sanity checks", en: "Attribution sanity checks" },
    ],
  },
  {
    key: "creative",
    title: { ar: "Creative Strategy", en: "Creative Strategy" },
    body: {
      ar: "نظام لاختبار الـ Hooks والـ Angles بدل التخمين.",
      en: "A system for testing hooks and angles instead of guessing.",
    },
    items: [
      { ar: "Hooks & angles", en: "Hooks & angles" },
      { ar: "Creative briefs", en: "Creative briefs" },
      { ar: "Testing framework", en: "Testing framework" },
      { ar: "Iteration على أساس النتايج", en: "Iteration based on results" },
    ],
  },
  {
    key: "consulting",
    title: { ar: "Consulting & Training", en: "Consulting & Training" },
    body: {
      ar: "جلسات للفرق والـ Founders عشان يبنوا نظام Media Buying جوّه شركتهم.",
      en: "Sessions for teams and founders to build a media buying system in-house.",
    },
    items: [
      { ar: "Strategy sessions", en: "Strategy sessions" },
      { ar: "Team training", en: "Team training" },
      { ar: "Playbooks & SOPs", en: "Playbooks & SOPs" },
    ],
  },
];

export const process: { title: Bi; body: Bi }[] = [
  {
    title: { ar: "Brief", en: "Brief" },
    body: {
      ar: "بتملّا الفورم: البيزنس، والأهداف، والوضع الحالي.",
      en: "You fill the form: your business, goals and current situation.",
    },
  },
  {
    title: { ar: "Review", en: "Review" },
    body: {
      ar: "براجع الـ Brief بنفسي وأرد عليك لو فيه Fit حقيقي بينا.",
      en: "I review your brief personally and reply if there is a real fit.",
    },
  },
  {
    title: { ar: "Plan", en: "Plan" },
    body: {
      ar: "مكالمة قصيرة، وبعدها خطة واضحة بالنطاق والخطوات.",
      en: "A short call, then a clear plan with scope and steps.",
    },
  },
  {
    title: { ar: "Launch & Optimise", en: "Launch & Optimise" },
    body: {
      ar: "بنطلق، وبنقيس، وبنحسّن على أساس الداتا.",
      en: "We launch, measure, and optimise on data.",
    },
  },
];

export const principles: { title: Bi; body: Bi }[] = [
  {
    title: { ar: "Tracking first", en: "Tracking first" },
    body: { ar: "مفيش Scale على داتا مش مضبوطة.", en: "No scaling on data you can't trust." },
  },
  {
    title: { ar: "One clear KPI", en: "One clear KPI" },
    body: { ar: "هدف واحد واضح لكل حملة.", en: "One clear objective per campaign." },
  },
  {
    title: { ar: "Testing system", en: "Testing system" },
    body: { ar: "كل قرار ليه سبب، وكل اختبار ليه نتيجة.", en: "Every decision has a reason, every test a result." },
  },
  {
    title: { ar: "Direct communication", en: "Direct communication" },
    body: { ar: "كلام مباشر من غير لف ودوران.", en: "Straight talk, no fluff." },
  },
];
