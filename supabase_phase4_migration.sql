-- Create redirecionamentos (301 redirects) table
CREATE TABLE IF NOT EXISTS public.redirecionamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  origem_slug TEXT NOT NULL UNIQUE, -- URL antiga (ex: /noticia/carro-velho)
  destino_url TEXT NOT NULL, -- URL nova (ex: /noticia/carro-novo ou https://outrosite.com)
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_redirecionamentos_origem ON public.redirecionamentos(origem_slug);
