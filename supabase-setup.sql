-- 南大人的美食地图：登录用户评价、评分与图片存储
-- 在 Supabase Dashboard -> SQL Editor 中一次性运行。

create extension if not exists pgcrypto;

create table if not exists public.food_reviews (
  id text primary key,
  place_id text not null,
  score smallint not null check (score between 1 and 5),
  text text not null check (char_length(text) between 2 and 600),
  author text not null default '南大食客',
  images jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- 兼容旧表并补齐登录用户字段。
alter table public.food_reviews
  add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table public.food_reviews
  add column if not exists updated_at timestamptz not null default now();

create unique index if not exists food_reviews_place_user_idx
  on public.food_reviews (place_id, user_id);
create index if not exists food_reviews_place_created_idx
  on public.food_reviews (place_id, created_at desc);

alter table public.food_reviews enable row level security;

drop policy if exists "public read reviews" on public.food_reviews;
drop policy if exists "public add reviews" on public.food_reviews;
drop policy if exists "authenticated read reviews" on public.food_reviews;
drop policy if exists "authenticated add own review" on public.food_reviews;
drop policy if exists "authenticated update own review" on public.food_reviews;
drop policy if exists "authenticated delete own review" on public.food_reviews;

create policy "authenticated read reviews"
  on public.food_reviews for select
  to authenticated
  using (true);

create policy "authenticated add own review"
  on public.food_reviews for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "authenticated update own review"
  on public.food_reviews for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "authenticated delete own review"
  on public.food_reviews for delete
  to authenticated
  using (user_id = auth.uid());

-- 旧版本曾允许匿名新增店铺和平台评分。本版本不开放这些写入。
do $$
begin
  if to_regclass('public.food_places') is not null then
    execute 'drop policy if exists "public add places" on public.food_places';
  end if;
  if to_regclass('public.food_platform_updates') is not null then
    execute 'drop policy if exists "public add platform updates" on public.food_platform_updates';
    execute 'drop policy if exists "public update platform updates" on public.food_platform_updates';
  end if;
end
$$;

-- 评价图片桶。公开读取便于登录用户查看评价图片，写入仅允许本人目录。
insert into storage.buckets (id, name, public)
values ('review-images', 'review-images', true)
on conflict (id) do update set public = true;

drop policy if exists "public review image reads" on storage.objects;
drop policy if exists "public review image uploads" on storage.objects;
drop policy if exists "authenticated review image reads" on storage.objects;
drop policy if exists "authenticated review image uploads" on storage.objects;
drop policy if exists "owner review image updates" on storage.objects;
drop policy if exists "owner review image deletes" on storage.objects;

create policy "authenticated review image reads"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'review-images');

create policy "authenticated review image uploads"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'review-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "owner review image updates"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'review-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'review-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "owner review image deletes"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'review-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
