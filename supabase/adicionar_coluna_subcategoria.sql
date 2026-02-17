-- Adiciona coluna subcategoria na tabela noticias
ALTER TABLE public.noticias 
ADD COLUMN IF NOT EXISTS subcategoria text;

-- Opcional: Adicionar comentário
COMMENT ON COLUMN public.noticias.subcategoria IS 'Nome da subcategoria (ex: Hardware, Smartphones)';
