import type { Metadata, Viewport } from "next";
import { Cairo, Cormorant_Garamond, DM_Mono, Noto_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getLang } from "@/lib/lang";
import { site } from "@/lib/content";

const cairo = Cairo({ subsets: ["arabic", "latin"], weight: ["400", "600", "700", "900"], variable: "--font-cairo" });
const noto = Noto_Sans({ subsets: ["latin"], weight: ["400", "500", "700", "900"], variable: "--font-noto" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-cormorant" });
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-dm-mono" });

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const base = process.env.NEXT_PUBLIC_SITE_URL;
  return {
    metadataBase: base ? new URL(base) : undefined,
    title: { default: `${site.name[lang]} — ${site.role[lang]}`, template: `%s · ${site.name[lang]}` },
    description: site.description[lang],
    openGraph: { title: `${site.name[lang]} — ${site.role[lang]}`, description: site.description[lang], type: "website" },
  };
}

export const viewport: Viewport = { themeColor: "#080808" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang();
  return (
    <html
      lang={lang}
      dir={lang === "ar" ? "rtl" : "ltr"}
      className={`${cairo.variable} ${noto.variable} ${cormorant.variable} ${dmMono.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <Header lang={lang} />
        <main className="flex-1">{children}</main>
        <Footer lang={lang} />
      </body>
    </html>
  );
}
