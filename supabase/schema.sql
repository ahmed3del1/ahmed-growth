-- Run once in Supabase: SQL Editor -> New query -> paste -> Run.
-- RLS is enabled with NO policies: the public anon key can read/write nothing.
-- Only the server (service_role key) touches these tables.

create table if not exists leads (
  id uuid primary key,
  code text unique not null,
  created_at timestamptz not null default now(),
  status text not null default 'new',
  name text not null,
  whatsapp text not null,
  email text not null,
  business text not null,
  answers jsonb not null default '{}'::jsonb,
  notes text not null default ''
);

create table if not exists products (
  id uuid primary key,
  slug text unique not null,
  type text not null default 'digital',
  title_ar text not null,
  title_en text not null,
  desc_ar text not null default '',
  desc_en text not null default '',
  price integer not null default 0,
  active boolean not null default true,
  delivery_url text not null default '',
  sort integer not null default 10,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key,
  code text unique not null,
  created_at timestamptz not null default now(),
  product_id uuid not null,
  product_title text not null,
  price integer not null,
  name text not null,
  phone text not null,
  email text not null,
  method text not null,
  note text not null default '',
  status text not null default 'pending',
  admin_note text not null default ''
);

alter table leads enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
