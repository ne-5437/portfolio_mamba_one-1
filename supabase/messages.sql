-- Run once in Supabase → SQL Editor → New query → Run.
-- Creates the contact-form table. The anon key may INSERT but never read,
-- so messages are only visible to you in the Supabase dashboard.

create table if not exists public.messages (
  id         bigint generated always as identity primary key,
  name       text not null check (char_length(name) between 1 and 100),
  message    text not null check (char_length(message) between 1 and 4000),
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

create policy "anyone can submit a message"
  on public.messages for insert
  to anon
  with check (true);
