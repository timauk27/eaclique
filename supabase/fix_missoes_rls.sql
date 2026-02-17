-- Habilita RLS na tabela (caso não esteja)
ALTER TABLE missoes ENABLE ROW LEVEL SECURITY;

-- Remove políticas antigas conflitantes (se existirem)
DROP POLICY IF EXISTS "Permitir tudo para autenticados" ON missoes;
DROP POLICY IF EXISTS "Permitir insert para autenticados" ON missoes;
DROP POLICY IF EXISTS "Permitir select para autenticados" ON missoes;
DROP POLICY IF EXISTS "Permitir update para autenticados" ON missoes;

-- Cria uma política permissiva para usuários logados (Admin/CMS)
CREATE POLICY "Gerenciamento total para autenticados"
ON missoes
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Permite acesso total para a service_role (Robô) - geralmente já é padrão, mas garante
CREATE POLICY "Acesso total para Robô"
ON missoes
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
