-- Tabela para gerenciar pedidos de troca de imagem
-- O robô Python monitora esta tabela e processa os pedidos

CREATE TABLE IF NOT EXISTS "Pedidos_Imagem" (
    id SERIAL PRIMARY KEY,
    noticia_id INTEGER NOT NULL,
    url_sugerida TEXT NOT NULL,
    status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'processando', 'concluido', 'erro')),
    created_at TIMESTAMP DEFAULT NOW(),
    processed_at TIMESTAMP,
    resultado TEXT, -- URL da imagem final usada
    mensagem_erro TEXT -- Se houver erro, armazena aqui
);


-- Index para buscar pedidos pendentes rapidamente
CREATE INDEX IF NOT EXISTS idx_pedidos_status ON "Pedidos_Imagem"(status);
CREATE INDEX IF NOT EXISTS idx_pedidos_noticia ON "Pedidos_Imagem"(noticia_id);

-- Comentários
COMMENT ON TABLE "Pedidos_Imagem" IS 'Fila de pedidos de substituição de imagem processados pelo robô';
COMMENT ON COLUMN "Pedidos_Imagem".url_sugerida IS 'URL da imagem sugerida pelo admin (ex: YouTube thumbnail)';
COMMENT ON COLUMN "Pedidos_Imagem".status IS 'Status: pendente, processando, concluido, erro';
COMMENT ON COLUMN "Pedidos_Imagem".resultado IS 'URL final da imagem que foi usada (aprovada ou gerada)';
