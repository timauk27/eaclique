-- RODE ESTE COMANDO NO SQL EDITOR DO SUPABASE PARA CORRIGIR O ERRO
ALTER TABLE "Noticias"
ADD COLUMN IF NOT EXISTS "fonte_original" TEXT;

-- Opcional: Criar índice para evitar duplicatas mais rápido
CREATE INDEX IF NOT EXISTS idx_noticias_fonte_original ON "Noticias" ("fonte_original");
