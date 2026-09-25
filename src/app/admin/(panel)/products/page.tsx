import Link from "next/link";
import { listProducts } from "@/lib/db";

export default async function ProductsAdmin() {
  const products = await listProducts();
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">Products</h1>
        <Link href="/admin/products/new" className="btn btn-primary btn-sm">+ New product</Link>
      </div>
      <div className="mt-8 divide-y divide-smoke border border-smoke">
        {products.length === 0 && <p className="p-6 text-silver">No products yet.</p>}
        {products.map((p) => (
          <Link key={p.id} href={`/admin/products/${p.id}`} className="flex flex-wrap items-center justify-between gap-3 p-4 hover:bg-carbon">
            <div>
              <p className="font-bold">{p.title_en}</p>
              <p className="label mt-1 normal-case tracking-normal">/{p.slug} · {p.type}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm">EGP {p.price.toLocaleString("en-US")}</span>
              <span className={`label border px-2 py-1 ${p.active ? "border-snow text-snow" : "border-smoke"}`}>{p.active ? "live" : "hidden"}</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
