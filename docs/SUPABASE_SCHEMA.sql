-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE (Extends default auth.users)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  role text default 'student', -- 'student', 'educator', 'admin'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. GENERATED ITEMS TABLE (Stores the AI Questions)
create table public.generated_items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  
  -- The core content
  item_type text not null, -- 'case-study', 'bow-tie', etc.
  content jsonb not null,  -- The full JSON structure
  
  -- Metadata for searching/filtering
  difficulty_level text,
  topic text,
  client_needs text,
  
  -- Status
  is_favorite boolean default false,
  is_verified boolean default false, -- If reviewed by human
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. ROW LEVEL SECURITY (RLS) - Vital for security
-- Turn on RLS
alter table public.profiles enable row level security;
alter table public.generated_items enable row level security;

-- Policies for Profiles
create policy "Public profiles are viewable by everyone." 
  on profiles for select using ( true );

create policy "Users can insert their own profile." 
  on profiles for insert with check ( auth.uid() = id );

create policy "Users can update own profile." 
  on profiles for update using ( auth.uid() = id );

-- Policies for Items
create policy "Users can view their own items." 
  on generated_items for select using ( auth.uid() = user_id );

create policy "Users can insert their own items." 
  on generated_items for insert with check ( auth.uid() = user_id );

create policy "Users can update their own items." 
  on generated_items for update using ( auth.uid() = user_id );

create policy "Users can delete their own items." 
  on generated_items for delete using ( auth.uid() = user_id );

-- 4. AUTO-CREATE PROFILE TRIGGER
-- This automatically creates a public.profile entry when a user signs up via Auth
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
