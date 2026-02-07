-- Script para verificar as categorias existentes no Supabase
SELECT DISTINCT categoria, COUNT(*) as total
FROM "Noticias"
GROUP BY categoria
ORDER BY total DESC;

-- Ver alguns exemplos de notícias por categoria
SELECT categoria, titulo_viral, slug
FROM "Noticias"
ORDER BY created_at DESC
LIMIT 50;
