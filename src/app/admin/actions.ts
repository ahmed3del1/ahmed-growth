"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { endSession, passwordMatches, requireAdmin, startSession } from "@/lib/auth";
import {
  LEAD_STATUSES,
  ORDER_STATUSES,
  deleteProduct,
  saveProduct,
  updateLead,
  updateOrder,
  type LeadStatus,
  type OrderStatus,
} from "@/lib/db";

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
  await updateOrder(id, { status });
  revalidatePath("/admin", "layout");
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
