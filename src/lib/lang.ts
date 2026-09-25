import { cookies } from "next/headers";

export type Lang = "ar" | "en";
export type Bi = { ar: string; en: string };

export async function getLang(): Promise<Lang> {
  const value = (await cookies()).get("lang")?.value;
  return value === "en" ? "en" : "ar";
}

export const pick = (lang: Lang, text: Bi) => text[lang];
