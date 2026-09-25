import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/db";
import { deleteProductAction, saveProductAction } from "../../../actions";

export default async function ProductEditor({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ e?: string }>;
}) {
  const [{ id }, { e }] = await Promise.all([params, searchParams]);
  const isNew = id === "new";
  const p = isNew ? null : await getProduct(id);
  if (!isNew && !p) notFound();

  return (
    <>
      <Link href="/admin/products" className="label hover:text-snow">← Products</Link>
      <h1 className="mt-6 text-3xl">{isNew ? "New product" : p!.title_en}</h1>

      <form action={saveProductAction.bind(null, isNew ? null : id)} className="card mt-8 space-y-5 p-6">
        {e && <p role="alert" className="border border-signal p-3 text-sm text-signal">Check the fields. Slug must be lowercase letters, numbers and dashes.</p>}

        <div className="grid gap-5 sm:grid-cols-2">
          <F label="Title (Arabic)"><input name="title_ar" required defaultValue={p?.title_ar} className="field" /></F>
          <F label="Title (English)"><input name="title_en" required defaultValue={p?.title_en} className="field" dir="ltr" /></F>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <F label="Description (Arabic)"><textarea name="desc_ar" rows={4} defaultValue={p?.desc_ar} className="field" /></F>
          <F label="Description (English)"><textarea name="desc_en" rows={4} defaultValue={p?.desc_en} className="field" dir="ltr" /></F>
        </div>
        <div className="grid gap-5 sm:grid-cols-4">
          <F label="Slug (URL)"><input name="slug" required defaultValue={p?.slug} className="field" dir="ltr" /></F>
          <F label="Type">
            <select name="type" defaultValue={p?.type ?? "digital"} className="field">
              <option value="digital">digital</option>
              <option value="service">service</option>
            </select>
          </F>
          <F label="Price (EGP)"><input name="price" type="number" min={0} step={1} required defaultValue={p?.price ?? 0} className="field" dir="ltr" /></F>
          <F label="Sort order"><input name="sort" type="number" min={0} defaultValue={p?.sort ?? 10} className="field" dir="ltr" /></F>
        </div>
        <F label="Delivery URL (shown to the buyer after you mark the order paid)">
          <input name="delivery_url" defaultValue={p?.delivery_url} placeholder="https://drive.google.com/…" className="field" dir="ltr" />
        </F>
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" name="active" defaultChecked={p?.active ?? true} className="size-4 accent-[#E8271A]" />
          Visible in the store
        </label>

        <div className="flex gap-3 border-t border-smoke pt-5">
          <button className="btn btn-primary" type="submit">Save</button>
        </div>
      </form>

      {!isNew && (
        <form action={deleteProductAction.bind(null, id)} className="mt-6">
          <button className="label text-signal hover:underline" type="submit">Delete product</button>
        </form>
      )}
    </>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label mb-2 block normal-case tracking-normal">{label}</span>
      {children}
    </label>
  );
}
