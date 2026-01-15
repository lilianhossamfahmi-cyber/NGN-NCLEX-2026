-- Run this in Supabase SQL Editor

create table if not exists item_bank (
    id text primary key,
    type_id text not null,
    clinical_focus text,
    difficulty_level integer not null,
    cjmm_step text,
    client_needs text,
    created_at text not null,
    updated_at text not null,
    created_by text not null,
    updated_by text not null,
    status text not null,
    quality_score integer not null,
    tags text,
    allowed_modes text,
    item_json text not null
);

create index if not exists ix_item_bank_type on item_bank (type_id);
create index if not exists ix_item_bank_difficulty on item_bank (difficulty_level);
create index if not exists ix_item_bank_status on item_bank (status);
create index if not exists ix_item_bank_created_at on item_bank (created_at desc);
create index if not exists ix_item_bank_tags on item_bank (tags);

-- Enable RLS
alter table item_bank enable row level security;

-- Allow public access (since the backend uses the anon key)
-- WARNING: This makes the table public. In a real app, use Service Role key for backend.
create policy "Allow Public Access" on item_bank for all using (true) with check (true);
