-- Executar esse script no painel SQL do Supabase para criar o bucket de imagens das notícias

-- Cria o bucket "noticias_capas"
insert into storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
values (
  'noticias_capas', 
  'noticias_capas', 
  true, 
  false, 
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']::text[]
) on conflict (id) do nothing;

-- Cria políticas de segurança (RLS - Row Level Security) para o bucket

-- Permite acesso público total para a visualização (Select) de qualquer usuário anônimo
CREATE POLICY "Imagens públicas de noticias podem ser vistas por todos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'noticias_capas');

-- Permite que o Service Role (que o robô usa no backend via chaves seguras) possa fazer Upload (Insert)
CREATE POLICY "Permite que Service Role faca uploads para noticias_capas" 
ON storage.objects FOR INSERT 
TO service_role 
WITH CHECK (bucket_id = 'noticias_capas');

-- Permite que o Service Role (que o robô usa no backend) possa Deletar/Atualizar imagens
CREATE POLICY "Permite que Service Role delete e edite em noticias_capas" 
ON storage.objects FOR UPDATE 
TO service_role 
USING (bucket_id = 'noticias_capas');
CREATE POLICY "Permite que Service Role delete em noticias_capas" 
ON storage.objects FOR DELETE 
TO service_role 
USING (bucket_id = 'noticias_capas');
