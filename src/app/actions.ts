"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { createLead, createOrder, getProduct } from "@/lib/db";
import { notify } from "@/lib/notify";
import {
  adStatus,
  budgets,
  goals,
  industries,
  neededServices,
  paymentMethods,
  platforms,
  roles,
  timelines,
  values,
} from "@/lib/form-options";

export async function setLang(lang: "ar" | "en") {
  (await cookies()).set("lang", lang === "en" ? "en" : "ar", {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}

type Result = { ok: true; code: string } | { ok: false; error: string };

const oneOf = (opts: Parameters<typeof values>[0]) => z.enum(values(opts) as [string, ...string[]]);
const text = (max: number) => z.string().trim().max(max);

const leadSchema = z.object({
  hp: z.string().max(0).optional(), // honeypot
  name: text(120).min(2),
  whatsapp: text(30).regex(/^[+\d][\d\s-]{6,}$/),
  email: text(160).pipe(z.email()),
  role: oneOf(roles),
  business: text(160).min(2),
  link: text(300),
  industry: oneOf(industries),
  offer: text(1200).min(5),
  market: text(160).min(2),
  adStatus: oneOf(adStatus),
  platforms: z.array(oneOf(platforms)).max(10),
  budget: oneOf(budgets),
  problem: text(1500),
  goals: z.array(oneOf(goals)).min(1).max(10),
  goalDetail: text(2000).min(10),
  timeline: oneOf(timelines),
  services: z.array(oneOf(neededServices)).min(1).max(10),
  heard: text(200),
});

export async function submitLead(input: unknown): Promise<Result> {
  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid" };
  const { hp, name, whatsapp, email, business, ...answers } = parsed.data;
  if (hp) return { ok: true, code: "AA-000000" }; // bot: pretend success

  try {
    const lead = await createLead({ name, whatsapp, email, business, answers });
    await notify(`New lead ${lead.code}\n${name} — ${business}\nWhatsApp: ${whatsapp}\nBudget: ${answers.budget}`);
    return { ok: true, code: lead.code };
  } catch (e) {
    console.error(e);
    return { ok: false, error: "server" };
  }
}

const orderSchema = z.object({
  hp: z.string().max(0).optional(),
  productId: z.string().min(1),
  name: text(120).min(2),
  phone: text(30).regex(/^[+\d][\d\s-]{6,}$/),
  email: text(160).pipe(z.email()),
  method: oneOf(paymentMethods),
  note: text(800),
});

export async function placeOrder(input: unknown): Promise<Result> {
  const parsed = orderSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid" };
  const { hp, productId, name, phone, email, method, note } = parsed.data;
  if (hp) return { ok: true, code: "ORD-000000" };

  try {
    const product = await getProduct(productId);
    if (!product || !product.active) return { ok: false, error: "unavailable" };
    const order = await createOrder({
      product_id: product.id,
      product_title: product.title_en,
      price: product.price, // price always comes from the DB, never the client
      name,
      phone,
      email,
      method,
      note,
    });
    await notify(`New order ${order.code}\n${product.title_en} — EGP ${product.price}\n${name} — ${phone}`);
    return { ok: true, code: order.code };
  } catch (e) {
    console.error(e);
    return { ok: false, error: "server" };
  }
}
