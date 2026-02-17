    -- ========================================
    -- TABELA: Missoes (Jornalismo Sob Demanda)
    -- ========================================
    -- Armazena as missões/pedidos de cobertura criados pelo editor no CMS
    -- O robô consulta esta tabela periodicamente para executar novas missões

    -- Criar tipo ENUM para tipo de missão
    CREATE TYPE tipo_missao_enum AS ENUM ('link_especifico', 'pesquisa_tematica');

    -- Criar tipo ENUM para status da missão
    CREATE TYPE status_missao_enum AS ENUM ('PENDENTE', 'EXECUTANDO', 'CONCLUIDA', 'ERRO');

    -- Criar tabela de missões
    CREATE TABLE IF NOT EXISTS public.missoes (
        -- Identificador único
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        
        -- Tipo de missão
        tipo_missao tipo_missao_enum NOT NULL,
        
        -- Dados da missão (condicionais, dependendo do tipo)
        url_alvo TEXT,  -- Usado quando tipo_missao = 'link_especifico'
        termo_busca TEXT,  -- Usado quando tipo_missao = 'pesquisa_tematica'
        
        -- Categorização alvo
        categoria_alvo_nome TEXT NOT NULL,  -- Nome da categoria (ex: "Carnaval", "Eleições")
        subcategoria TEXT,  -- Subcategoria opcional (ex: "Rio", "São Paulo")
        
        -- Status e logs
        status status_missao_enum NOT NULL DEFAULT 'PENDENTE',
        log_resultado TEXT,  -- Detalhes da execução ou mensagem de erro
        
        -- Métricas da execução
        noticias_salvas INTEGER DEFAULT 0,
        noticias_ignoradas INTEGER DEFAULT 0,
        
        -- Prioridade (para implementação futura)
        prioridade INTEGER DEFAULT 5,  -- 1 (baixa) a 10 (alta)
        
        -- Timestamps
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        agendado_para TIMESTAMP WITH TIME ZONE,  -- Para agendamento futuro
        concluido_em TIMESTAMP WITH TIME ZONE
    );

    -- ========================================
    -- ÍNDICES
    -- ========================================
    -- Índice para busca rápida de missões pendentes (usado pelo robô)
    CREATE INDEX IF NOT EXISTS idx_missoes_status_pendente 
    ON public.missoes(status, prioridade DESC, created_at ASC)
    WHERE status = 'PENDENTE';

    -- Índice para ordenação por data de criação
    CREATE INDEX IF NOT EXISTS idx_missoes_created_at 
    ON public.missoes(created_at DESC);

    -- Índice para busca por categoria
    CREATE INDEX IF NOT EXISTS idx_missoes_categoria 
    ON public.missoes(categoria_alvo_nome);

    -- ========================================
    -- POLÍTICAS RLS (Row Level Security)
    -- ========================================
    -- Habilitar RLS na tabela
    ALTER TABLE public.missoes ENABLE ROW LEVEL SECURITY;

    -- Política: Apenas usuários autenticados podem ler
    CREATE POLICY "Apenas autenticados podem ler missões"
    ON public.missoes
    FOR SELECT
    USING (auth.role() = 'authenticated');

    -- Política: Apenas usuários autenticados podem inserir
    CREATE POLICY "Apenas autenticados podem inserir missões"
    ON public.missoes
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

    -- Política: Apenas usuários autenticados podem atualizar
    CREATE POLICY "Apenas autenticados podem atualizar missões"
    ON public.missoes
    FOR UPDATE
    USING (auth.role() = 'authenticated');

    -- Política: Apenas usuários autenticados podem deletar
    CREATE POLICY "Apenas autenticados podem deletar missões"
    ON public.missoes
    FOR DELETE
    USING (auth.role() = 'authenticated');

    -- ========================================
    -- FUNÇÃO: Atualizar updated_at automaticamente
    -- ========================================
    -- Cria ou substitui a função (pode já existir de outras tabelas)
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    -- ========================================
    -- TRIGGER: Atualizar updated_at automaticamente
    -- ========================================
    CREATE TRIGGER update_missoes_updated_at
    BEFORE UPDATE ON public.missoes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

    -- ========================================
    -- COMENTÁRIOS (Documentação)
    -- ========================================
    COMMENT ON TABLE public.missoes IS 'Armazena pedidos de cobertura (missões) criados pelo editor no CMS para o robô executar';
    COMMENT ON COLUMN public.missoes.tipo_missao IS 'Tipo de missão: link_especifico (processar URL específica) ou pesquisa_tematica (buscar notícias por termo)';
    COMMENT ON COLUMN public.missoes.url_alvo IS 'URL da notícia a processar (apenas para tipo link_especifico)';
    COMMENT ON COLUMN public.missoes.termo_busca IS 'Termo/query de busca (apenas para tipo pesquisa_tematica)';
    COMMENT ON COLUMN public.missoes.categoria_alvo_nome IS 'Nome da categoria para classificar as notícias geradas';
    COMMENT ON COLUMN public.missoes.status IS 'Status atual da missão: PENDENTE, EXECUTANDO, CONCLUIDA ou ERRO';
    COMMENT ON COLUMN public.missoes.prioridade IS 'Nível de prioridade (1-10), usado para ordenar execução das missões';

    -- ========================================
    -- DADOS DE EXEMPLO (Para testes)
    -- ========================================
    -- Exemplo 1: Missão de link específico
    INSERT INTO public.missoes (
        tipo_missao,
        url_alvo,
        categoria_alvo_nome,
        subcategoria,
        prioridade
    ) VALUES (
        'link_especifico',
        'https://g1.globo.com/tecnologia/noticia/2026/02/16/exemplo-noticia.html',
        'PIXEL',
        NULL,
        7
    );

    -- Exemplo 2: Missão de pesquisa temática
    INSERT INTO public.missoes (
        tipo_missao,
        termo_busca,
        categoria_alvo_nome,
        subcategoria,
        prioridade
    ) VALUES (
        'pesquisa_tematica',
        'Carnaval Rio 2026',
        'HOLOFOTE',
        'Carnaval',
        10
    );

    -- ========================================
    -- FIM DA MIGRATION
    -- ========================================
