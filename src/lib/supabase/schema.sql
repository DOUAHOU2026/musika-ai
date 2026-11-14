-- ==============================================================================
-- MUSIKA AI - SCHÉMA DE BASE DE DONNÉES SUPABASE (POSTGRESQL 100% GRATUIT)
-- Compatible avec l'offre gratuite de Supabase (Free Tier)
-- ==============================================================================

-- 1. Table des profils utilisateurs reliée à Supabase Auth
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text,
  avatar_url text,
  plan text not null default 'free' check (plan in ('free', 'creator', 'studio-pro')),
  remaining_credits integer not null default 5,
  preferred_language text not null default 'fr' check (preferred_language in ('fr', 'en')),
  custom_lyria_key text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Active la sécurité au niveau des lignes (RLS)
alter table public.profiles enable row level security;

create policy "Les utilisateurs peuvent consulter leur propre profil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Les utilisateurs peuvent mettre à jour leur propre profil"
  on public.profiles for update
  using (auth.uid() = id);

-- 2. Table des morceaux musicaux générés
create table if not exists public.tracks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  title text not null,
  genre text not null,
  bpm integer not null default 104,
  duration_seconds integer not null default 120,
  prompt text not null,
  lyrics text,
  vocal_gender text not null default 'none',
  mood text not null default 'energetic',
  language text not null default 'fr',
  is_instrumental boolean not null default false,
  audio_url text,
  cover_url text,
  ai_provider text not null default 'google-lyria',
  status text not null default 'ready' check (status in ('ready', 'generating', 'failed')),
  likes_count integer not null default 0,
  is_public boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.tracks enable row level security;

create policy "Tout le monde peut lire les morceaux publics"
  on public.tracks for select
  using (is_public = true or auth.uid() = user_id);

create policy "Les utilisateurs peuvent créer des morceaux"
  on public.tracks for insert
  with check (auth.uid() = user_id);

create policy "Les utilisateurs peuvent modifier leurs morceaux"
  on public.tracks for update
  using (auth.uid() = user_id);

-- 3. Déclencheur automatique de création de profil lors de l'inscription Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, remaining_credits, preferred_language)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), 5, 'fr');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

