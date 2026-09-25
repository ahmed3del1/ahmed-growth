import Link from "next/link";
import { notFound } from "next/navigation";
import { LEAD_STATUSES, getLead } from "@/lib/db";
import {
  adStatus, budgets, goals, industries, labelOf, neededServices, platforms, roles, timelines,
} from "@/lib/form-options";
import { saveLeadNotes, setLeadStatus } from "../../../actions";

export default async function LeadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await getLead(id);
  if (!lead) notFound();

  const a = lead.answers as Record<string, string | string[]>;
  const one = (o: Parameters<typeof labelOf>[0], k: string) => labelOf(o, String(a[k] ?? ""), "en");
  const many = (o: Parameters<typeof labelOf>[0], k: string) =>
    ((a[k] as string[]) ?? []).map((v) => labelOf(o, v, "en")).join(", ");
  const wa = lead.whatsapp.replace(/\D/g, "");

  const rows: [string, string][] = [
    ["Role", one(roles, "role")],
    ["Industry", one(industries, "industry")],
    ["Sells", String(a.offer ?? "")],
    ["Market", String(a.market ?? "")],
    ["Link", String(a.link ?? "")],
    ["Ads status", one(adStatus, "adStatus")],
    ["Platforms", many(platforms, "platforms")],
    ["Budget", one(budgets, "budget")],
    ["Problem", String(a.problem ?? "")],
    ["Goals", many(goals, "goals")],
    ["Goal detail", String(a.goalDetail ?? "")],
    ["Needs", many(neededServices, "services")],
    ["Timeline", one(timelines, "timeline")],
    ["Heard from", String(a.heard ?? "")],
  ];

  return (
    <>
      <Link href="/admin" className="label hover:text-snow">← Leads</Link>
      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="label">{lead.code} · {new Date(lead.created_at).toLocaleString("en-GB")}</p>
          <h1 className="mt-2 text-3xl">{lead.name}</h1>
          <p className="mt-1 text-silver">{lead.business}</p>
        </div>
        <div className="flex gap-2">
          <a className="btn btn-primary btn-sm" target="_blank" rel="noopener noreferrer" href={`https://wa.me/${wa}`}>WhatsApp</a>
          <a className="btn btn-ghost btn-sm" href={`mailto:${lead.email}`}>Email</a>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <dl className="card divide-y divide-smoke">
          <Row k="WhatsApp" v={lead.whatsapp} mono />
          <Row k="Email" v={lead.email} mono />
          {rows.map(([k, v]) => <Row key={k} k={k} v={v} />)}
        </dl>

        <div className="space-y-6">
          <form action={setLeadStatus.bind(null, lead.id)} className="card space-y-3 p-5">
            <label className="label block">Status</label>
            <select name="status" defaultValue={lead.status} className="field">
              {LEAD_STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
            </select>
            <button className="btn btn-ghost btn-sm" type="submit">Update status</button>
          </form>

          <form action={saveLeadNotes.bind(null, lead.id)} className="card space-y-3 p-5">
            <label className="label block">Private notes</label>
            <textarea name="notes" rows={6} defaultValue={lead.notes} className="field" />
            <button className="btn btn-ghost btn-sm" type="submit">Save notes</button>
          </form>
        </div>
      </div>
    </>
  );
}

function Row({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="grid grid-cols-[8rem_1fr] gap-4 p-4 text-sm">
      <dt className="label">{k}</dt>
      <dd className={`break-words whitespace-pre-line ${mono ? "font-mono" : ""}`}>{v || "—"}</dd>
    </div>
  );
}
