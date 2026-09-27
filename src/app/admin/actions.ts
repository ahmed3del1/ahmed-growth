"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { endSession, passwordMatches, requireAdmin, startSession } from "@/lib/auth";
import {
  LEAD_STATUSES,
  ORDER_STATUSES,
  deleteProduct,
  getOrder,
  getProduct,
  saveProduct,
  updateLead,
  updateOrder,
  type LeadStatus,
  type OrderStatus,
} from "@/lib/db";
import { sendEmail } from "@/lib/notify";

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!passwordMatches(password)) {
    await new Promise((r) => setTimeout(r, 600)); // slow down guessing
    redirect("/admin/login?e=1");
  }
  await startSession();
  redirect("/admin");
}

export async function logoutAction() {
  await endSession();
  redirect("/admin/login");
}

/** Diagnostic for the admin panel's "Test email" button — shows the real error on screen. */
export async function testEmail() {
  await requireAdmin();
  const to = process.env.NOTIFY_EMAIL_TO || process.env.EMAIL_USER;
  if (!to) return { ok: false as const, error: "NOTIFY_EMAIL_TO (or EMAIL_USER) isn't set in Vercel." };
  return sendEmail(to, "✅ Test email from your site", `If you're reading this, email sending works. Sent to ${to}.`);
}

export async function setLeadStatus(id: string, formData: FormData) {
  await requireAdmin();
  const status = String(formData.get("status")) as LeadStatus;
  if (!LEAD_STATUSES.includes(status)) return;
  await updateLead(id, { status });
  revalidatePath("/admin", "layout");
}

export async function saveLeadNotes(id: string, formData: FormData) {
  await requireAdmin();
  await updateLead(id, { notes: String(formData.get("notes") ?? "").slice(0, 5000) });
  revalidatePath("/admin", "layout");
}

export async function setOrderStatus(id: string, formData: FormData) {
  await requireAdmin();
  const status = String(formData.get("status")) as OrderStatus;
  if (!ORDER_STATUSES.includes(status)) return;

  const before = await getOrder(id);
  await updateOrder(id, { status });

  // Just turned "paid" for the first time: email the product to the customer automatically.
  if (before && before.status !== "paid" && before.status !== "delivered" && status === "paid") {
    try {
      await sendDeliveryEmail(before, before.product_id);
    } catch (e) {
      console.error("delivery email failed", e); // never block the status update on this
    }
  }

  revalidatePath("/admin", "layout");
}

async function sendDeliveryEmail(order: { code: string; email: string; name: string; product_title: string }, productId: string) {
  const product = await getProduct(productId);
  const link = product?.delivery_url;

  const subject = `منتجك جاهز — ${order.code} / Your product is ready`;
  const text = link
    ? [
        `أهلًا ${order.name}،`,
        ``,
        `تم تأكيد الدفع لطلبك ${order.code} — ${order.product_title}.`,
        `افتح المنتج من هنا: ${link}`,
        ``,
        `لو محتاج أي حاجة، رد على الإيميل ده أو كلمني على واتساب.`,
        `— أحمد عادل`,
        ``,
        `----`,
        ``,
        `Hi ${order.name},`,
        ``,
        `Payment confirmed for your order ${order.code} — ${order.product_title}.`,
        `Open your product here: ${link}`,
        ``,
        `Need anything? Reply to this email or message me on WhatsApp.`,
        `— Ahmed Adel`,
      ].join("\n")
    : [
        `أهلًا ${order.name}،`,
        ``,
        `تم تأكيد الدفع لطلبك ${order.code} — ${order.product_title}.`,
        `هتواصل معاك على واتساب لتنسيق التسليم.`,
        `— أحمد عادل`,
        ``,
        `----`,
        ``,
        `Hi ${order.name},`,
        ``,
        `Payment confirmed for your order ${order.code} — ${order.product_title}.`,
        `I'll reach out on WhatsApp to arrange delivery.`,
        `— Ahmed Adel`,
      ].join("\n");

  await sendEmail(order.email, subject, text);
}

export async function saveOrderNote(id: string, formData: FormData) {
  await requireAdmin();
  await updateOrder(id, { admin_note: String(formData.get("admin_note") ?? "").slice(0, 1000) });
  revalidatePath("/admin", "layout");
}

const productSchema = z.object({
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  type: z.enum(["digital", "service"]),
  title_ar: z.string().trim().min(1).max(160),
  title_en: z.string().trim().min(1).max(160),
  desc_ar: z.string().trim().max(3000),
  desc_en: z.string().trim().max(3000),
  price: z.coerce.number().int().min(0).max(10_000_000),
  sort: z.coerce.number().int().min(0).max(9999),
  delivery_url: z.string().trim().max(600),
  active: z.boolean(),
});

export async function saveProductAction(id: string | null, formData: FormData) {
  await requireAdmin();
  const parsed = productSchema.safeParse({
    ...Object.fromEntries(formData),
    active: formData.get("active") === "on",
  });
  if (!parsed.success) redirect(`/admin/products/${id ?? "new"}?e=1`);
  await saveProduct(id, parsed.data);
  revalidatePath("/", "layout");
  redirect("/admin/products");
}

export async function deleteProductAction(id: string) {
  await requireAdmin();
  await deleteProduct(id);
  revalidatePath("/", "layout");
  redirect("/admin/products");
}
