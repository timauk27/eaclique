-- ========================================
-- TABELA: Config_Afiliados
-- ========================================
-- Gerenciamento dinâmico de tags de afiliados (Amazon, Shopee, AliExpress, etc)

CREATE TABLE IF NOT EXISTS public."Config_Afiliados" (
    -- Identificador único
    id BIGSERIAL PRIMARY KEY,
    
    -- Nome da rede de afiliados
    rede TEXT UNIQUE NOT NULL, -- 'amazon', 'shopee', 'aliexpress', 'americanas'
    
    -- Tag/ID de afiliado
    tag TEXT NOT NULL, -- '1barba-20', 'eaclique-shopee', etc
    
    -- Controle de ativação
    ativo BOOLEAN DEFAULT true,
    
    -- Metadados
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Seed inicial com dados reais
INSERT INTO public."Config_Afiliados" (rede, tag, ativo) VALUES
('amazon', '1barba-20', true),
('shopee', 'eaclique-shopee', false),
('aliexpress', 'eaclique-ali', false),
('americanas', 'eaclique-ame', false)
ON CONFLICT (rede) DO NOTHING;

-- Index para buscar rede ativa rapidamente
CREATE INDEX IF NOT EXISTS idx_afiliados_rede_ativo 
ON public."Config_Afiliados" (rede, ativo);

-- RLS (Row Level Security)
ALTER TABLE public."Config_Afiliados" ENABLE ROW LEVEL SECURITY;

-- Política: Qualquer um pode LER (robô precisa)
CREATE POLICY "Config afiliados público"
ON public."Config_Afiliados"
FOR SELECT
USING (true);

-- Política: Apenas admin autenticado pode editar
CREATE POLICY "Apenas admin edita afiliados"
ON public."Config_Afiliados"
FOR ALL
USING (auth.role() = 'authenticated');

-- Comentários
COMMENT ON TABLE public."Config_Afiliados" IS 'Configuração dinâmica de tags de afiliados para múltiplas redes';
COMMENT ON COLUMN public."Config_Afiliados".rede IS 'Nome da rede de afiliados (amazon, shopee, etc)';
COMMENT ON COLUMN public."Config_Afiliados".tag IS 'Tag/ID de rastreamento fornecido pela rede';
COMMENT ON COLUMN public."Config_Afiliados".ativo IS 'Se false, não usa esta rede nos links';
