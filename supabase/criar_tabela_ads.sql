-- ========================================
-- TABELA: Config_Ads
-- ========================================
-- Gerenciamento dinâmico de anúncios (AdSense, Adsterra, 1win, MGID, etc)

CREATE TABLE IF NOT EXISTS public."Config_Ads" (
    -- Identificador único
    id BIGSERIAL PRIMARY KEY,
    
    -- Posição do anúncio no site
    posicao TEXT NOT NULL, -- 'sidebar_top', 'in_article', 'footer_sticky', 'billboard', 'skyscraper'
    
    -- Empresa de anúncios
    empresa TEXT NOT NULL, -- 'AdSense', 'Adsterra', '1win', 'MGID', etc
    
    -- Código HTML/JavaScript completo do anúncio
    codigo_script TEXT NOT NULL,
    
    -- Controle de ativação
    ativo BOOLEAN DEFAULT true,
    
    -- Metadados
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index para buscar ads ativos por posição (performance)
CREATE INDEX IF NOT EXISTS idx_ads_posicao_ativo 
ON public."Config_Ads" (posicao, ativo) 
WHERE ativo = true;

-- RLS (Row Level Security) - Permitir leitura pública, escrita apenas autenticada
ALTER TABLE public."Config_Ads" ENABLE ROW LEVEL SECURITY;

-- Política: Qualquer um pode LER ads ativos (para exibir no site)
CREATE POLICY "Ads ativos são públicos"
ON public."Config_Ads"
FOR SELECT
USING (ativo = true);

-- Política: Apenas usuários autenticados podem INSERT/UPDATE/DELETE
CREATE POLICY "Apenas admin pode gerenciar ads"
ON public."Config_Ads"
FOR ALL
USING (auth.role() = 'authenticated');

-- Comentários
COMMENT ON TABLE public."Config_Ads" IS 'Gerenciamento dinâmico de scripts de anúncios para múltiplas redes (AdSense, Adsterra, etc)';
COMMENT ON COLUMN public."Config_Ads".posicao IS 'Localização do ad no site (sidebar_top, in_article, footer_sticky, etc)';
COMMENT ON COLUMN public."Config_Ads".codigo_script IS 'Código HTML/JS completo do anúncio fornecido pela rede';
COMMENT ON COLUMN public."Config_Ads".ativo IS 'Se false, o anúncio não será exibido no site';
