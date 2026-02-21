-- Create paginas (static pages) table
CREATE TABLE IF NOT EXISTS public.paginas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  conteudo_html text not null,
  resumo_seo text,
  status text not null default 'publicado', -- 'rascunho' ou 'publicado'
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create menus table
CREATE TABLE IF NOT EXISTS public.menus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  link_url TEXT NOT NULL,
  ordem integer not null default 0,
  ativo boolean not null default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
