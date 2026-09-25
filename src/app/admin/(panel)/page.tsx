import Link from "next/link";
import { LEAD_STATUSES, listLeads, type LeadStatus } from "@/lib/db";
import { budgets, labelOf } from "@/lib/form-options";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default async function LeadsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const all = await listLeads();
  const active = LEAD_STATUSES.includes(status as LeadStatus) ? (status as LeadStatus) : null;
  const leads = active ? all.filter((l) => l.status === active) : all;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-3xl">Leads</h1>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin" className="chip" aria-pressed={!active}>All ({all.length})</Link>
          {LEAD_STATUSES.map((s) => (
            <Link key={s} href={`/admin?status=${s}`} className="chip" aria-pressed={active === s}>
              {s.replace("_", " ")} ({all.filter((l) => l.status === s).length})
            </Link>
          ))}
        </div>
      </div>

      {leads.length === 0 ? (
        <p className="mt-10 text-silver">No leads yet.</p>
      ) : (
        <div className="mt-8 overflow-x-auto border border-smoke">
          <table className="w-full text-start text-sm">
            <thead className="bg-carbon">
              <tr className="label">
                <th className="p-3 text-start font-normal">Code</th>
                <th className="p-3 text-start font-normal">Name</th>
                <th className="p-3 text-start font-normal">Business</th>
                <th className="p-3 text-start font-normal">Budget</th>
                <th className="p-3 text-start font-normal">Status</th>
                <th className="p-3 text-start font-normal">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-smoke">
              {leads.map((l) => (
                <tr key={l.id} className="hover:bg-carbon">
                  <td className="p-3 font-mono"><Link href={`/admin/leads/${l.id}`} className="underline underline-offset-4">{l.code}</Link></td>
                  <td className="p-3">{l.name}</td>
                  <td className="p-3 text-silver">{l.business}</td>
                  <td className="p-3 text-silver">{labelOf(budgets, String(l.answers.budget ?? ""), "en")}</td>
                  <td className="p-3"><StatusBadge status={l.status} /></td>
                  <td className="p-3 font-mono text-xs text-silver">{new Date(l.created_at).toLocaleDateString("en-GB")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
