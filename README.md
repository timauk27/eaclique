# EAClique Portal

Portal de notícias automatizado com IA e links de afiliados Amazon.

## 🚀 Tecnologias

- **Frontend**: Next.js 14 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **AI**: Ollama (Llama 3.1)
- **Backend**: Python 3.12
- **Icons**: Lucide React

## 📁 Estrutura do Projeto

```
eaclique-portal/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Homepage
│   │   ├── noticia/[slug]/       # Página de detalhes da notícia
│   │   └── category/[categoria]/ # Páginas de categoria
│   ├── components/
│   │   ├── AmazonProductCard.tsx # Card de produto afiliado
│   │   ├── ShareBar.tsx          # Barra de compartilhamento
│   │   ├── NewsSidebar.tsx       # Sidebar com widgets
│   │   └── ads/                  # Componentes de anúncios
│   └── lib/
│       └── supabase.ts           # Cliente Supabase
└── scripts/
    ├── roboportal.py             # Robô de notícias V5.0
    └── fix_supabase.sql          # Script SQL
```

## 🤖 Roboportal V5.0

Sistema automatizado que:
- Lê feeds RSS de múltiplas fontes
- Usa IA (Llama 3.1) para reescrever notícias
- Sugere produtos Amazon contextuais
- Gera links de afiliado automaticamente
- Publica no Supabase 24/7

## 🎨 Features

### Página de Notícia
- Layout 3 colunas (Desktop) / 1 coluna (Mobile)
- Barra de compartilhamento (WhatsApp, Twitter, LinkedIn)
- Injeção inteligente de anúncios (a cada 3 parágrafos)
- Card de produto Amazon contextual
- SEO otimizado para Google e redes sociais
- Sidebar com "Últimas Notícias" e "Mais Lidas"

### Páginas de Categoria
- Filtro por categoria (Plantão, Arena, Holofote, etc.)
- Grid responsivo de notícias
- Badges coloridos por categoria

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/timauk27/eaclique.git
cd eaclique
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente (`.env.local`):
```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
```

4. Execute o projeto:
```bash
npm run dev
```

Acesse: http://localhost:3000

## 🤖 Roboportal

1. Instale as dependências Python:
```bash
pip install feedparser beautifulsoup4 supabase ollama colorama
```

2. Inicie o Ollama:
```bash
ollama serve
```

3. Execute o roboportal:
```bash
python scripts/roboportal.py
```

## 📊 Monetização

- **Amazon Afiliados**: Links contextuais gerados por IA
- **Display Ads**: Placeholders para Adsterra/Google AdSense

## 🚀 Deploy

### Vercel (Recomendado)
```bash
vercel --prod
```

### Outras Plataformas
- Netlify
- Railway
- Render

## 📝 Licença

MIT

## 👤 Autor

**timauk27**
- GitHub: [@timauk27](https://github.com/timauk27)
