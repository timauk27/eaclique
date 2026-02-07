-- ========================================
-- SCHEMA DO BANCO DE DADOS - EACLIQUE PORTAL
-- ========================================
-- Este arquivo contém o schema completo do banco de dados Supabase
-- para o portal de notícias EAClique

-- ========================================
-- TABELA: Noticias
-- ========================================
-- Armazena todas as notícias do portal
CREATE TABLE IF NOT EXISTS public."Noticias" (
    -- Identificadores
    id BIGSERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    
    -- Conteúdo Principal
    titulo_viral TEXT NOT NULL,
    resumo_seo TEXT,
    conteudo_html TEXT NOT NULL,
    
    -- Categorização
    categoria TEXT NOT NULL,
    
    -- Imagens
    imagem_capa TEXT NOT NULL,
    imagem_alt TEXT,
    
    -- Afiliados Amazon
    link_afiliado_gerado TEXT,
    call_to_action_prod TEXT,
    
    -- Atribuição
    fonte_original TEXT,
    
    -- Métricas
    views_fake INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- ÍNDICES
-- ========================================
-- Índice para busca por categoria (usado nas páginas de categoria)
CREATE INDEX IF NOT EXISTS idx_noticias_categoria ON public."Noticias"(categoria);

-- Índice para busca por slug (usado nas páginas de notícia individual)
CREATE INDEX IF NOT EXISTS idx_noticias_slug ON public."Noticias"(slug);

-- Índice para ordenação por data de criação
CREATE INDEX IF NOT EXISTS idx_noticias_created_at ON public."Noticias"(created_at DESC);

-- ========================================
-- POLÍTICAS RLS (Row Level Security)
-- ========================================
-- Habilitar RLS na tabela
ALTER TABLE public."Noticias" ENABLE ROW LEVEL SECURITY;

-- Política: Permitir leitura pública (todos podem ver as notícias)
CREATE POLICY "Permitir leitura pública de notícias"
ON public."Noticias"
FOR SELECT
USING (true);

-- Política: Apenas usuários autenticados podem inserir
CREATE POLICY "Apenas autenticados podem inserir"
ON public."Noticias"
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Política: Apenas usuários autenticados podem atualizar
CREATE POLICY "Apenas autenticados podem atualizar"
ON public."Noticias"
FOR UPDATE
USING (auth.role() = 'authenticated');

-- Política: Apenas usuários autenticados podem deletar
CREATE POLICY "Apenas autenticados podem deletar"
ON public."Noticias"
FOR DELETE
USING (auth.role() = 'authenticated');

-- ========================================
-- FUNÇÃO: Atualizar updated_at automaticamente
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_noticias_updated_at
BEFORE UPDATE ON public."Noticias"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- DADOS DE EXEMPLO
-- ========================================
-- Inserir notícias de exemplo para testar o portal

INSERT INTO public."Noticias" (
    slug, 
    titulo_viral, 
    resumo_seo, 
    conteudo_html, 
    categoria, 
    imagem_capa, 
    imagem_alt, 
    views_fake
) VALUES
-- Notícia 1: PLANTÃO
(
    'queimadas-na-amazonia-atingem-recorde-historico',
    'Queimadas na Amazônia atingem recorde histórico e preocupam cientistas',
    'Dados do INPE mostram aumento de 85% nas queimadas em relação ao mesmo período do ano passado',
    '<p>As queimadas na Amazônia registraram números alarmantes neste mês, segundo dados divulgados pelo Instituto Nacional de Pesquisas Espaciais (INPE). O aumento de 85% em relação ao mesmo período do ano anterior preocupa cientistas e ambientalistas.</p><p>Especialistas alertam que a situação pode se agravar nos próximos meses devido ao período de seca. O desmatamento ilegal e a falta de fiscalização são apontados como principais causas do problema.</p><p>O governo federal anunciou medidas emergenciais, incluindo o reforço de equipes de combate ao fogo e maior vigilância por satélite nas áreas críticas.</p>',
    'PLANTÃO',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=630&fit=crop',
    'Fumaça de queimadas na floresta amazônica',
    1247
),
-- Notícia 2: ARENA (Esportes)
(
    'brasil-vence-argentina-nas-eliminatorias',
    'Brasil domina Argentina por 3 a 0 e assume liderança isolada',
    'Seleção brasileira faz grande partida e vence clássico sul-americano pelas Eliminatórias da Copa',
    '<p>Em uma noite histórica no Maracanã, a Seleção Brasileira goleou a Argentina por 3 a 0, em partida válida pelas Eliminatórias da Copa do Mundo. Os gols foram marcados por Vinícius Jr., Raphinha e Richarlison.</p><p>A vitória coloca o Brasil na liderança isolada das Eliminatórias com 100% de aproveitamento. O técnico Dorival Júnior elogiou a atuação da equipe e destacou a importância da vitória.</p><p>O próximo desafio será contra o Uruguai, fora de casa, na próxima data FIFA.</p>',
    'ARENA',
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=630&fit=crop',
    'Jogadores da seleção brasileira comemorando gol',
    3542
),
-- Notícia 3: PIXEL (Tecnologia)
(
    'novo-iphone-16-pro-revoluciona-fotografia-mobile',
    'iPhone 16 Pro traz câmera de 200MP e revoluciona fotografia mobile',
    'Apple anuncia novo modelo com recursos profissionais de fotografia e vídeo em 8K',
    '<p>A Apple anunciou hoje o iPhone 16 Pro, seu novo smartphone topo de linha que promete revolucionar a fotografia mobile com uma câmera principal de 200 megapixels e capacidade de gravar vídeos em 8K a 60fps.</p><p>O novo modelo também traz o chip A18 Pro, 50% mais rápido que a geração anterior, e uma bateria que promete durar até 2 dias com uso moderado.</p><p>Os pré-pedidos começam na próxima semana e os preços partem de R$ 9.999.</p>',
    'PIXEL',
    'https://images.unsplash.com/photo-1592286927505-c0d0eb5c0d81?w=1200&h=630&fit=crop',
    'Novo iPhone 16 Pro em destaque',
    2156
),
-- Notícia 4: HOLOFOTE (Famosos)
(
    'atriz-famosa-anuncia-nova-serie-netflix',
    'Bruna Marquezine anuncia série exclusiva da Netflix ao lado de Zendaya',
    'Produção bilionária marca estreia da atriz brasileira em Hollywood',
    '<p>Bruna Marquezine surpreendeu os fãs ao anunciar sua participação em uma nova série da Netflix ao lado de Zendaya. A produção, estimada em US$ 200 milhões, marca a estreia da atriz brasileira em uma grande produção hollywoodiana.</p><p>A série de ficção científica terá 10 episódios e estreia prevista para 2025. Bruna interpretará uma cientista brasileira que trabalha em um projeto secreto da NASA.</p><p>As gravações começam no próximo mês em Los Angeles e no Rio de Janeiro.</p>',
    'HOLOFOTE',
    'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=1200&h=630&fit=crop',
    'Atriz em evento de gala',
    4521
),
-- Notícia 5: MERCADO (Economia)
(
    'bitcoin-atinge-marca-historica-100-mil-dolares',
    'Bitcoin supera US$ 100 mil pela primeira vez na história',
    'Criptomoeda dispara após aprovação de ETF nos Estados Unidos',
    '<p>O Bitcoin atingiu a marca histórica de US$ 100 mil nesta manhã, após a aprovação de um ETF (fundo de índice) pela Securities and Exchange Commission (SEC) nos Estados Unidos.</p><p>Analistas apontam que a valorização deve continuar nos próximos meses, com previsões de que a moeda digital pode chegar a US$ 150 mil ainda este ano.</p><p>Investidores brasileiros também celebram a alta, com exchanges nacionais registrando aumento de 300% no volume de negociações.</p>',
    'MERCADO',
    'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=1200&h=630&fit=crop',
    'Gráfico mostrando valorização do Bitcoin',
    1893
),
-- Notícia 6: VITAL (Saúde)
(
    'vacina-cancer-promete-revolucionar-tratamento',
    'Nova vacina contra o câncer mostra 95% de eficácia em testes',
    'Pesquisadores brasileiros desenvolvem tratamento inovador para diversos tipos de tumor',
    '<p>Pesquisadores brasileiros da USP anunciaram resultados promissores de uma nova vacina contra o câncer que mostrou 95% de eficácia em testes com animais.</p><p>A vacina funciona estimulando o sistema imunológico a reconhecer e atacar células cancerígenas, sendo eficaz contra diversos tipos de tumor, incluindo mama, próstata e pulmão.</p><p>Os testes em humanos devem começar no próximo semestre, com previsão de lançamento comercial em 3 anos.</p>',
    'VITAL',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=630&fit=crop',
    'Cientista em laboratório trabalhando com vacinas',
    2743
);

-- ========================================
-- FIM DO SCHEMA
-- ========================================
