# 🚀 Guia de Deploy na Vercel - EAClique Portal

## Erro Atual
O build está falando porque as variáveis de ambiente do Supabase não estão configuradas na Vercel.

```
Error: supabaseUrl is required.
```

## ✅ Solução: Configurar Variáveis de Ambiente

### Passo 1: Acesse as Configurações do Projeto na Vercel

1. Vá para: https://vercel.com/timauk27/eaclique (ou seu projeto)
2. Clique em **"Settings"** no topo
3. Clique em **"Environment Variables"** no menu lateral

### Passo 2: Adicione as Variáveis Obrigatórias

Adicione as seguintes variáveis (uma por vez):

#### Variável 1: Supabase URL
- **Name:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** URL do seu projeto Supabase (exemplo: `https://xxxxx.supabase.co`)
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

#### Variável 2: Supabase Anon Key
- **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** Sua chave anônima do Supabase
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

### Passo 3: Adicione Variáveis Opcionais (Recomendado)

#### Variável 3: Site URL
- **Name:** `NEXT_PUBLIC_SITE_URL`
- **Value:** `https://seu-dominio-vercel.vercel.app` (ou seu domínio customizado)
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

#### Variável 4: Google Analytics (Opcional)
- **Name:** `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- **Value:** Seu ID do Google Analytics (exemplo: `G-XXXXXXXXXX`)
- **Environments:** ✅ Production

### Passo 4: Fazer Redeploy

Após adicionar as variáveis:

1. Vá para a aba **"Deployments"**
2. Encontre o último deployment que falhou
3. Clique nos **três pontos (...)** ao lado
4. Clique em **"Redeploy"**
5. Confirme clicando em **"Redeploy"** novamente

## 📍 Como Obter as Credenciais do Supabase

Se você ainda não tem um projeto Supabase:

1. Acesse: https://supabase.com/dashboard
2. Crie um novo projeto (ou selecione um existente)
3. Vá para **"Settings"** → **"API"**
4. Copie:
   - **Project URL** → use como `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → use como `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 🔧 Estrutura do Banco de Dados

O projeto espera as seguintes tabelas no Supabase:
- `articles` - Para armazenar as notícias
- `categories` - Para categorias
- Outras tabelas conforme necessário

## ⚠️ Importante

- **Não commite** arquivos `.env` ou `.env.local` no Git
- As variáveis `NEXT_PUBLIC_*` são expostas no navegador (client-side)
- Para variáveis secretas server-side, use variáveis sem o prefixo `NEXT_PUBLIC_`

## 🎯 Verificação Final

Após configurar tudo, o build deve passar com sucesso e você verá:

```
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```
