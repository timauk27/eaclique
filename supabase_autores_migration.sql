-- Create autores table
create table public.autores (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  biografia text,
  foto_url text,
  rede_social_link text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Add autor_id to noticias table
alter table public.noticias
add column autor_id uuid references public.autores(id);
