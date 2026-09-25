import { ORDER_STATUSES, listOrders } from "@/lib/db";
import { labelOf, paymentMethods } from "@/lib/form-options";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { saveOrderNote, setOrderStatus } from "../../actions";

export default async function OrdersPage() {
  const orders = await listOrders();
  return (
    <>
      <h1 className="text-3xl">Orders</h1>
      {orders.length === 0 ? (
        <p className="mt-10 text-silver">No orders yet.</p>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((o) => (
            <article key={o.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-mono">{o.code} <span className="text-silver">· {new Date(o.created_at).toLocaleString("en-GB")}</span></p>
                  <h2 className="mt-2 text-lg">{o.product_title}</h2>
                  <p className="mt-1 font-mono text-sm text-silver">EGP {o.price.toLocaleString("en-US")} · {labelOf(paymentMethods, o.method, "en")}</p>
                </div>
                <StatusBadge status={o.status} />
              </div>

              <p className="mt-4 text-sm">
                {o.name} ·{" "}
                <a className="underline underline-offset-4" target="_blank" rel="noopener noreferrer" href={`https://wa.me/${o.phone.replace(/\D/g, "")}`}>{o.phone}</a>{" "}
                · <a className="underline underline-offset-4" href={`mailto:${o.email}`}>{o.email}</a>
              </p>
              {o.note && <p className="mt-2 text-sm text-silver">“{o.note}”</p>}

              <div className="mt-5 grid gap-3 border-t border-smoke pt-5 md:grid-cols-2">
                <form action={setOrderStatus.bind(null, o.id)} className="flex gap-2">
                  <select name="status" defaultValue={o.status} className="field">
                    {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button className="btn btn-ghost btn-sm" type="submit">Update</button>
                </form>
                <form action={saveOrderNote.bind(null, o.id)} className="flex gap-2">
                  <input name="admin_note" defaultValue={o.admin_note} placeholder="Note shown to the customer" className="field" />
                  <button className="btn btn-ghost btn-sm" type="submit">Save</button>
                </form>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
