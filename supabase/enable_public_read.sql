-- ==========================================
-- PERMITIR LEITURA PÚBLICA DA TABELA NOTICIAS
-- ==========================================
-- Execute este SQL no Supabase para permitir que o site leia as notícias

-- 1. Verificar se RLS está habilitado (deve estar)
-- Se não estiver, habilite:
ALTER TABLE public."Noticias" ENABLE ROW LEVEL SECURITY;

-- 2. Criar política para permitir SELECT público
-- Isso permite que qualquer pessoa (mesmo sem login) possa LER as notícias
DROP POLICY IF EXISTS "Permitir leitura pública de notícias" ON public."Noticias";

CREATE POLICY "Permitir leitura pública de notícias"
ON public."Noticias"
FOR SELECT
USING (true);

-- PRONTO! Agora qualquer um pode ler as notícias (mas não editar/deletar)
