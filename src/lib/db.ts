import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { randomInt, randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

/* ---------- Domain types ---------- */

export const LEAD_STATUSES = ["new", "contacted", "call_booked", "won", "lost"] as const;
export const ORDER_STATUSES = ["pending", "paid", "delivered", "cancelled"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type Lead = {
  id: string;
  code: string;
  created_at: string;
  status: LeadStatus;
  name: string;
  whatsapp: string;
  email: string;
  business: string;
  answers: Record<string, unknown>;
  notes: string;
};

export type Product = {
  id: string;
  slug: string;
  type: "digital" | "service";
  title_ar: string;
  title_en: string;
  desc_ar: string;
  desc_en: string;
  price: number;
  active: boolean;
  delivery_url: string;
  sort: number;
  created_at: string;
};

export type Order = {
  id: string;
  code: string;
  created_at: string;
  product_id: string;
  product_title: string;
  price: number;
  name: string;
  phone: string;
  email: string;
  method: string;
  note: string;
  status: OrderStatus;
  admin_note: string;
};

type Table = "leads" | "products" | "orders";
type Row = Record<string, unknown>;

interface Store {
  list(table: Table): Promise<Row[]>;
  insert(table: Table, row: Row): Promise<Row>;
  update(table: Table, id: string, patch: Row): Promise<Row | null>;
  remove(table: Table, id: string): Promise<void>;
}

/* ---------- Supabase store (production) ---------- */

function supabaseStore(url: string, key: string): Store {
  const sb = createClient(url, key, { auth: { persistSession: false } });
  return {
    async list(table) {
      const { data, error } = await sb.from(table).select("*");
      if (error) throw new Error(`[db] ${table}: ${error.message}`);
      return data ?? [];
    },
    async insert(table, row) {
      const { data, error } = await sb.from(table).insert(row).select().single();
      if (error) throw new Error(`[db] ${table}: ${error.message}`);
      return data;
    },
    async update(table, id, patch) {
      const { data, error } = await sb.from(table).update(patch).eq("id", id).select().maybeSingle();
      if (error) throw new Error(`[db] ${table}: ${error.message}`);
      return data;
    },
    async remove(table, id) {
      const { error } = await sb.from(table).delete().eq("id", id);
      if (error) throw new Error(`[db] ${table}: ${error.message}`);
    },
  };
}

/* ---------- Local JSON store (development only) ---------- */

const FILE = path.join(process.cwd(), ".data", "db.json");
type FileDb = Record<Table, Row[]>;

const now = () => new Date().toISOString();

function seedProducts(): Row[] {
  const base = { active: true, delivery_url: "", created_at: now() };
  return [
    {
      ...base,
      id: randomUUID(),
      slug: "meta-ads-audit-checklist",
      type: "digital",
      title_ar: "Meta Ads Audit Checklist",
      title_en: "Meta Ads Audit Checklist",
      desc_ar: "Checklist عملية تراجع بيها حسابك الإعلاني خطوة بخطوة وتعرف فين الفلوس بتضيع.",
      desc_en: "A practical checklist to audit your ad account step by step and find where budget leaks.",
      price: 499,
      sort: 1,
    },
    {
      ...base,
      id: randomUUID(),
      slug: "creative-testing-sheet",
      type: "digital",
      title_ar: "Creative Testing Sheet",
      title_en: "Creative Testing Sheet",
      desc_ar: "شيت جاهز لتنظيم اختبار الـ Creatives: Hooks و Angles وقرارات واضحة.",
      desc_en: "A ready sheet to organise creative tests: hooks, angles, and clear decisions.",
      price: 399,
      sort: 2,
    },
    {
      ...base,
      id: randomUUID(),
      slug: "account-audit-session",
      type: "service",
      title_ar: "Account Audit Session",
      title_en: "Account Audit Session",
      desc_ar: "جلسة مراجعة لحسابك الإعلاني مع تقرير بالأولويات.",
      desc_en: "A live review of your ad account with a prioritised action report.",
      price: 2500,
      sort: 3,
    },
  ];
}

async function readFile(): Promise<FileDb> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8")) as FileDb;
  } catch {
    const fresh: FileDb = { leads: [], products: seedProducts(), orders: [] };
    await writeFile(fresh);
    return fresh;
  }
}

async function writeFile(db: FileDb) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(db, null, 2));
}

function fileStore(): Store {
  return {
    async list(table) {
      return (await readFile())[table];
    },
    async insert(table, row) {
      const db = await readFile();
      db[table].push(row);
      await writeFile(db);
      return row;
    },
    async update(table, id, patch) {
      const db = await readFile();
      const i = db[table].findIndex((r) => r.id === id);
      if (i < 0) return null;
      db[table][i] = { ...db[table][i], ...patch };
      await writeFile(db);
      return db[table][i];
    },
    async remove(table, id) {
      const db = await readFile();
      db[table] = db[table].filter((r) => r.id !== id);
      await writeFile(db);
    },
  };
}

let store: Store | undefined;
function getStore(): Store {
  if (store) return store;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && key) return (store = supabaseStore(url, key));
  if (process.env.NODE_ENV === "production") {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in production.");
  }
  return (store = fileStore());
}

/* ---------- Helpers ---------- */

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function makeCode(prefix: string) {
  let out = "";
  for (let i = 0; i < 6; i++) out += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  return `${prefix}-${out}`;
}

const byNewest = <T extends { created_at: string }>(a: T, b: T) => b.created_at.localeCompare(a.created_at);

/* ---------- Leads ---------- */

export async function createLead(input: Pick<Lead, "name" | "whatsapp" | "email" | "business" | "answers">) {
  const lead: Lead = {
    id: randomUUID(),
    code: makeCode("AA"),
    created_at: now(),
    status: "new",
    notes: "",
    ...input,
  };
  return (await getStore().insert("leads", lead)) as unknown as Lead;
}

export async function listLeads() {
  return ((await getStore().list("leads")) as unknown as Lead[]).sort(byNewest);
}

export async function getLead(id: string) {
  return (await listLeads()).find((l) => l.id === id) ?? null;
}

export async function updateLead(id: string, patch: Partial<Pick<Lead, "status" | "notes">>) {
  await getStore().update("leads", id, patch);
}

/* ---------- Products ---------- */

export async function listProducts(opts: { activeOnly?: boolean } = {}) {
  const all = (await getStore().list("products")) as unknown as Product[];
  return all
    .filter((p) => !opts.activeOnly || p.active)
    .sort((a, b) => a.sort - b.sort || byNewest(a, b));
}

export async function getProductBySlug(slug: string) {
  return (await listProducts()).find((p) => p.slug === slug) ?? null;
}

export async function getProduct(id: string) {
  return (await listProducts()).find((p) => p.id === id) ?? null;
}

export type ProductInput = Omit<Product, "id" | "created_at">;

export async function saveProduct(id: string | null, input: ProductInput) {
  if (id) {
    await getStore().update("products", id, input);
    return id;
  }
  const row: Product = { id: randomUUID(), created_at: now(), ...input };
  await getStore().insert("products", row);
  return row.id;
}

export async function deleteProduct(id: string) {
  await getStore().remove("products", id);
}

/* ---------- Orders ---------- */

export async function createOrder(
  input: Pick<Order, "product_id" | "product_title" | "price" | "name" | "phone" | "email" | "method" | "note">,
) {
  const order: Order = {
    id: randomUUID(),
    code: makeCode("ORD"),
    created_at: now(),
    status: "pending",
    admin_note: "",
    ...input,
  };
  return (await getStore().insert("orders", order)) as unknown as Order;
}

export async function listOrders() {
  return ((await getStore().list("orders")) as unknown as Order[]).sort(byNewest);
}

export async function getOrderByCode(code: string) {
  return (await listOrders()).find((o) => o.code === code.trim().toUpperCase()) ?? null;
}

export async function updateOrder(id: string, patch: Partial<Pick<Order, "status" | "admin_note">>) {
  await getStore().update("orders", id, patch);
}
