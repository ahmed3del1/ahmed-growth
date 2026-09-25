import type { Metadata } from "next";
import { getLang } from "@/lib/lang";
import { LeadForm } from "@/components/LeadForm";
import { ui } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return { title: ui.nav.start[lang] };
}

export default async function StartPage() {
  const lang = await getLang();
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <p className="label">BRIEF</p>
      <h1 className="mt-4 text-4xl md:text-5xl">{lang === "ar" ? "ابدأ معايا" : "Start a project"}</h1>
      <p className="mt-4 mb-10 leading-relaxed text-silver">
        {lang === "ar"
          ? "5 خطوات قصيرة. كل ما كانت الإجابات أدق، كان الرد أسرع وأنفع."
          : "Five short steps. The more precise your answers, the faster and more useful my reply."}
      </p>
      <LeadForm lang={lang} />
    </div>
  );
}
