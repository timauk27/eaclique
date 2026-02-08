-- ========================================
-- FIX: Permitir INSERT público para robô
-- ========================================
-- Este script corrige a política RLS para permitir
-- que o robô Python insira notícias usando a chave anon

-- 1. Remover política antiga que só permite autenticados
DROP POLICY IF EXISTS "Apenas autenticados podem inserir" ON public."Noticias";

-- 2. Criar nova política que permite INSERT público
CREATE POLICY "Permitir inserção pública de notícias"
ON public."Noticias"
FOR INSERT
WITH CHECK (true);

-- ========================================
-- OPCIONAL: Manter UPDATE e DELETE protegidos
-- ========================================
-- UPDATE e DELETE continuam exigindo autenticação
-- (isso está correto e NÃO precisa mudar)
