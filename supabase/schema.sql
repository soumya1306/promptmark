-- ============================================================================
-- WYSIWYG DOCUMENT EDITOR - COMPLETE DATABASE & STORAGE SCHEMA
-- (Idempotent: Safe to run multiple times)
-- ============================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. USER PROFILES & STORAGE QUOTA MANAGEMENT
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  storage_quota_bytes bigint not null default 52428800, -- 50 MB default free quota
  storage_used_bytes bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Ensure storage quota column default is 50MB if table already existed
alter table public.profiles alter column storage_quota_bytes set default 52428800;

-- Enable RLS on profiles
alter table public.profiles enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" 
  on public.profiles for select 
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" 
  on public.profiles for update 
  using (auth.uid() = id);

-- Trigger: Automatically provision public.profiles when an auth.user signs up via Google OAuth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, storage_quota_bytes, storage_used_bytes)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', ''),
    52428800, -- 50 MB
    0
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, profiles.full_name),
    avatar_url = coalesce(excluded.avatar_url, profiles.avatar_url),
    updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists and recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3. PROJECTS TABLE (Document Workspace Bundles)
create table if not exists public.projects (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  title text not null default 'Untitled Document',
  document_ast jsonb not null default '{"document":{"sections":[]}}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.projects enable row level security;

drop policy if exists "Users can view own projects" on public.projects;
create policy "Users can view own projects" 
  on public.projects for select 
  using (auth.uid() = owner_id);

drop policy if exists "Users can create own projects" on public.projects;
create policy "Users can create own projects" 
  on public.projects for insert 
  with check (auth.uid() = owner_id);

drop policy if exists "Users can update own projects" on public.projects;
create policy "Users can update own projects" 
  on public.projects for update 
  using (auth.uid() = owner_id);

drop policy if exists "Users can delete own projects" on public.projects;
create policy "Users can delete own projects" 
  on public.projects for delete 
  using (auth.uid() = owner_id);

-- 4. PROJECT ASSETS TABLE (Isolated media & attachments)
create table if not exists public.project_assets (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  file_type text not null, -- 'png', 'jpg', 'svg', 'pdf', 'csv', 'docx', 'md'
  size_bytes bigint not null,
  storage_path text not null,
  public_url text not null,
  role text not null default 'inline-embed', -- 'inline-embed', 'table-source', 'reference-attachment'
  created_at timestamptz not null default now()
);

alter table public.project_assets enable row level security;

drop policy if exists "Users can view own assets" on public.project_assets;
create policy "Users can view own assets" 
  on public.project_assets for select 
  using (auth.uid() = owner_id);

drop policy if exists "Users can insert own assets" on public.project_assets;
create policy "Users can insert own assets" 
  on public.project_assets for insert 
  with check (auth.uid() = owner_id);

drop policy if exists "Users can delete own assets" on public.project_assets;
create policy "Users can delete own assets" 
  on public.project_assets for delete 
  using (auth.uid() = owner_id);

-- 5. QUOTA ENFORCEMENT TRIGGERS
create or replace function public.enforce_storage_quota()
returns trigger as $$
declare
  curr_used bigint;
  user_quota bigint;
begin
  select storage_used_bytes, storage_quota_bytes 
  into curr_used, user_quota
  from public.profiles 
  where id = new.owner_id;

  if (curr_used + new.size_bytes) > user_quota then
    raise exception 'STORAGE_QUOTA_EXCEEDED: Cannot upload asset. Storage limit of % bytes reached.', user_quota;
  end if;

  update public.profiles 
  set storage_used_bytes = storage_used_bytes + new.size_bytes,
      updated_at = now()
  where id = new.owner_id;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_enforce_storage_quota on public.project_assets;
create trigger trg_enforce_storage_quota
  before insert on public.project_assets
  for each row execute function public.enforce_storage_quota();

-- Decrement quota on asset deletion
create or replace function public.reclaim_storage_on_delete()
returns trigger as $$
begin
  update public.profiles 
  set storage_used_bytes = greatest(0, storage_used_bytes - old.size_bytes),
      updated_at = now()
  where id = old.owner_id;

  return old;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_reclaim_storage on public.project_assets;
create trigger trg_reclaim_storage
  after delete on public.project_assets
  for each row execute function public.reclaim_storage_on_delete();

-- 6. STORAGE BUCKET CREATION & POLICIES
insert into storage.buckets (id, name, public)
values ('project-assets', 'project-assets', true)
on conflict (id) do update set public = true;

-- Bucket access policies
drop policy if exists "Authenticated users can upload to project-assets" on storage.objects;
create policy "Authenticated users can upload to project-assets" 
  on storage.objects for insert 
  to authenticated 
  with check (bucket_id = 'project-assets' and (auth.uid()::text = (storage.foldername(name))[1]));

drop policy if exists "Users can read project-assets" on storage.objects;
create policy "Users can read project-assets" 
  on storage.objects for select 
  to public 
  using (bucket_id = 'project-assets');

drop policy if exists "Users can delete own files from project-assets" on storage.objects;
create policy "Users can delete own files from project-assets" 
  on storage.objects for delete 
  to authenticated 
  using (bucket_id = 'project-assets' and (auth.uid()::text = (storage.foldername(name))[1]));
