import Link from "next/link";
import { LogoMark } from "./Logo";
import { site, ui } from "@/lib/content";
import type { Lang } from "@/lib/lang";

export function Footer({ lang }: { lang: Lang }) {
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
  const socials = [
    { label: "Instagram", href: process.env.NEXT_PUBLIC_INSTAGRAM_URL },
    { label: "LinkedIn", href: process.env.NEXT_PUBLIC_LINKEDIN_URL },
    { label: "TikTok", href: process.env.NEXT_PUBLIC_TIKTOK_URL },
    { label: "WhatsApp", href: wa ? `https://wa.me/${wa}` : undefined },
  ].filter((s) => s.href);

  return (
    <footer className="border-t border-smoke">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <div className="flex items-center gap-3">
            <LogoMark size={24} />
            <span className={lang === "ar" ? "font-black" : "font-display text-xl font-bold"}>{site.name[lang]}</span>
          </div>
          <p className="mt-4 text-sm text-silver">{site.tagline[lang]}</p>
        </div>

        <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-silver">
          <Link href="/services" className="hover:text-snow">{ui.nav.services[lang]}</Link>
          <Link href="/store" className="hover:text-snow">{ui.nav.store[lang]}</Link>
          <Link href="/track" className="hover:text-snow">{ui.nav.track[lang]}</Link>
          <Link href="/start" className="hover:text-snow">{ui.nav.start[lang]}</Link>
          {socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-snow">
              {s.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="border-t border-smoke">
        <p className="label mx-auto max-w-6xl px-5 py-5">
          © {new Date().getFullYear()} {site.name.en}
        </p>
      </div>
    </footer>
  );
}
