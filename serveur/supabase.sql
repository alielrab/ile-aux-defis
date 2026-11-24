-- À coller dans Supabase : SQL Editor → New query → Run. On peut le relancer sans rien perdre.
-- Un compte = un parent (e-mail). Les enfants sont rangés chacun à part, pour qu'ils puissent jouer en même temps
-- sur des appareils différents sans effacer les progrès des autres. Jamais la croyance : elle reste sur l'appareil.

-- Ce qui est commun à la famille : le code parent et les réglages
create table if not exists public.parents (
  id uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  donnees jsonb not null,
  maj bigint not null default 0 -- heure du dernier changement (en millisecondes), donnée par l'appareil
);

-- Un enfant par ligne
create table if not exists public.profils (
  famille uuid not null default auth.uid() references auth.users (id) on delete cascade,
  id text not null,
  donnees jsonb not null,
  maj bigint not null default 0,
  primary key (famille, id)
);

-- Chaque parent ne voit et ne change que sa propre famille
alter table public.parents enable row level security;
alter table public.profils enable row level security;
drop policy if exists "sa famille" on public.parents;
create policy "sa famille" on public.parents for all to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));
drop policy if exists "sa famille" on public.profils;
create policy "sa famille" on public.profils for all to authenticated
  using (famille = (select auth.uid())) with check (famille = (select auth.uid()));

-- Le droit d'utiliser ces tables pour un parent connecté (au cas où le projet ne le donne pas tout seul)
grant select, insert, update, delete on public.parents, public.profils to authenticated;

-- Envoyer des changements : une version plus ancienne n'écrase jamais une plus récente
create or replace function public.envoyer(parent jsonb, enfants jsonb) returns void
  language plpgsql security invoker set search_path = '' as $$
begin
  if parent is not null then
    insert into public.parents (id, donnees, maj) values (auth.uid(), parent, coalesce((parent ->> 'majParent')::bigint, 0))
    on conflict (id) do update set donnees = excluded.donnees, maj = excluded.maj where public.parents.maj <= excluded.maj;
  end if;
  insert into public.profils (famille, id, donnees, maj)
    select auth.uid(), e ->> 'id', e, coalesce((e ->> 'maj')::bigint, 0) from jsonb_array_elements(coalesce(enfants, '[]'::jsonb)) e
  on conflict (famille, id) do update set donnees = excluded.donnees, maj = excluded.maj where public.profils.maj <= excluded.maj;
end;
$$;
revoke execute on function public.envoyer(jsonb, jsonb) from public, anon;
grant execute on function public.envoyer(jsonb, jsonb) to authenticated;

-- « Supprimer le compte » dans l'espace parents : efface le compte et, avec lui, toutes les données de la famille
create or replace function public.supprimer_compte() returns void
  language sql security definer set search_path = '' as $$
  delete from auth.users where id = auth.uid();
$$;
revoke execute on function public.supprimer_compte() from public, anon;
grant execute on function public.supprimer_compte() to authenticated;
