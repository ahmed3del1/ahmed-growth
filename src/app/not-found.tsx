import Link from "next/link";
import { getLang } from "@/lib/lang";

export default async function NotFound() {
  const lang = await getLang();
  return (
    <div className="mx-auto max-w-xl px-5 py-32 text-center">
      <p className="label">404</p>
      <h1 className="mt-4 text-4xl">{lang === "ar" ? "الصفحة مش موجودة" : "Page not found"}</h1>
      <Link href="/" className="btn btn-primary mt-8">{lang === "ar" ? "الرئيسية" : "Home"}</Link>
    </div>
  );
}
