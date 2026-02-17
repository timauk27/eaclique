-- ========================================
-- TABELA: Missões (Jornalismo Sob Demanda)
-- ========================================

-- Criação do ENUM para status e tipo (se não existirem)
DO $$ BEGIN
    CREATE TYPE transform_status AS ENUM ('PENDENTE', 'EXECUTANDO', 'CONCLUIDA', 'ERRO');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE mission_type AS ENUM ('link_especifico', 'pesquisa_tematica');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Tabela Principal
CREATE TABLE IF NOT EXISTS public.missoes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Configuração da Missão
    tipo_missao mission_type NOT NULL,
    prioridade INTEGER DEFAULT 5, -- 1 a 10
    
    -- Parâmetros de Entrada
    url_alvo TEXT,                -- Para link_especifico
    termo_busca TEXT,             -- Para pesquisa_tematica
    categoria_alvo_nome TEXT NOT NULL, -- "Tecnologia", "Famosos"...
    subcategoria TEXT,            -- Opcional
    
    -- Controle de Estado
    status transform_status DEFAULT 'PENDENTE',
    log_resultado TEXT,
    
    -- Métricas de Resultado
    noticias_salvas INTEGER DEFAULT 0,
    noticias_ignoradas INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    concluido_em TIMESTAMP WITH TIME ZONE
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_missoes_status ON public.missoes(status);
CREATE INDEX IF NOT EXISTS idx_missoes_created_at ON public.missoes(created_at DESC);

-- RLS (Reaplicando para garantir)
ALTER TABLE public.missoes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Gerenciamento total para autenticados" ON public.missoes;
CREATE POLICY "Gerenciamento total para autenticados"
ON public.missoes FOR ALL TO authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Acesso total para Robô" ON public.missoes;
CREATE POLICY "Acesso total para Robô"
ON public.missoes FOR ALL TO service_role
USING (true) WITH CHECK (true);
