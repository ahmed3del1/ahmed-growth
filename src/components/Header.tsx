import Link from "next/link";
import { LogoMark } from "./Logo";
import { setLang } from "@/app/actions";
import { site, ui } from "@/lib/content";
import type { Lang } from "@/lib/lang";

export function Header({ lang }: { lang: Lang }) {
  const next: Lang = lang === "ar" ? "en" : "ar";
  const switchLang = setLang.bind(null, next);
  const links = [
    { href: "/services", label: ui.nav.services[lang] },
    { href: "/#process", label: ui.nav.process[lang] },
    { href: "/store", label: ui.nav.store[lang] },
    { href: "/track", label: ui.nav.track[lang] },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-smoke bg-ink/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <Link href="/" className="flex items-center gap-3">
          <LogoMark />
          <span className={lang === "ar" ? "text-lg font-black" : "font-display text-2xl font-bold tracking-wide"}>
            {site.name[lang]}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-silver transition-colors hover:text-snow">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <form action={switchLang}>
            <button className="label px-2 py-1 transition-colors hover:text-snow" type="submit">
              {ui.nav.switch[lang]}
            </button>
          </form>
          <Link href="/start" className="btn btn-primary btn-sm hidden sm:inline-flex">
            {ui.nav.start[lang]}
          </Link>
          <details className="relative md:hidden">
            <summary className="label cursor-pointer list-none border border-smoke px-3 py-2">MENU</summary>
            <div className="card absolute end-0 mt-2 flex w-56 flex-col p-2">
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="px-3 py-3 text-sm text-silver hover:text-snow">
                  {l.label}
                </Link>
              ))}
              <Link href="/start" className="btn btn-primary btn-sm mt-2">
                {ui.nav.start[lang]}
              </Link>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
