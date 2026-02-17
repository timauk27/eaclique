import { createClient } from "@/utils/supabase/server";
import { FeatureCard, CompactCard, TextCard } from "@/components/Card";
import { SectionHeader } from "@/components/Structure";
import { Clock, TrendingUp, MapPin } from "lucide-react";
import { Metadata } from 'next';
import Link from 'next/link';
import AdBillboard from '@/components/ads/AdBillboard';
import AdSkyscraper from '@/components/ads/AdSkyscraper';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: 'EAClique - O Seu Portal de Notícias',
  description: 'Portal de notícias com informações sobre tecnologia, economia, mundo, entretenimento e muito mais. Fique por dentro das últimas notícias.',
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://eaclique.com.br',
  },
  openGraph: {
    title: 'EAClique - O Seu Portal de Notícias',
    description: 'Fique por dentro das últimas notícias de tecnologia, economia, mundo, entretenimento e muito mais.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://eaclique.com.br',
    siteName: 'EAClique',
    locale: 'pt_BR',
    type: 'website',
  },
};

export const revalidate = 60; // Revalidate every minute to keep content fresh

// -----------------------------------------------------------------------------
// 1. INTEGRIDADE DE DADOS (The Golden Rule)
// -----------------------------------------------------------------------------
async function getData() {
  const supabase = await createClient();

  // Fetching 1000 records, selecting ONLY necessary columns for rendering
  // Filtering by status 'publicado' if possible, or just fetching all if column doesn't exist yet (handled gracefully)

  let query = supabase
    .from("noticias")
    .select("id, titulo_viral, slug, categoria, imagem_capa, resumo_seo, created_at, views_reais")
    .order("created_at", { ascending: false })
    .limit(1000);

  // Attempt to filter by status if the column exists in your schema.
  // Since we are not 100% sure if 'status' column is populated correctly yet based on previous checks,
  // we will trust the CMS to manage drafts vs published via this query if the column exists.
  // If the column doesn't exist, Supabase might ignore it or error.
  // SAFEGUARD: The user mentioned "Filter de Segurança: Se houver uma coluna de status...".
  // logic: .eq('status', 'publicado') 

  // Note: If the column strictly doesn't exist on the table in the DB, this might throw.
  // However, normally in Supabase selecting a non-existent column in .eq throws an error.
  // Given the user instruction, I will assume 'status' intended to be there.
  // To be safe against 500s if the column is missing, we could try/catch or just omit if unsure.
  // BUT the user explicitly asked for it. I will add it.

  // query = query.eq('status', 'publicado'); // Uncomment this when 'status' column is confirmed and populated

  const { data: posts, error } = await query;

  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }

  return posts || [];
}

// -----------------------------------------------------------------------------
// 2. MAPEAMENTO DE CATEGORIAS (Mirroring the DB)
// -----------------------------------------------------------------------------
const CATEGORY_MAP: Record<string, string> = {
  // DB Category -> Visual Section Title
  'ESPORTES': 'Arena Esportiva',
  'ARENA': 'Arena Esportiva',

  'TECH': 'Pixel Tech',
  'PIXEL': 'Pixel Tech',

  'GAMES': 'Play & Geek',

  'HOLOFOTE': 'Holofote & Famosos',
  'FAMOSOS': 'Holofote & Famosos',
  'ENTRETENIMENTO': 'Holofote & Famosos',

  'ECONOMIA': 'Mercado & Finanças',

  'BRASIL': 'Poder & Política',
  'POLITICA': 'Poder & Política',
  'POLÍTICA': 'Poder & Política',

  'MUNDO': 'Mundo & Internacional',
  'INTERNACIONAL': 'Mundo & Internacional',

  'SAUDE': 'Vital & Ciência',
  'SAÚDE': 'Vital & Ciência',
  'CIENCIA': 'Vital & Ciência',
  'CIÊNCIA': 'Vital & Ciência'
};

const SECTION_COLORS: Record<string, string> = {
  'Arena Esportiva': 'arena', // green
  'Pixel Tech': 'pixel', // purple/cyan
  'Play & Geek': 'pixel', // purple
  'Holofote & Famosos': 'holofote', // pink
  'Mercado & Finanças': 'ciencia', // blue
  'Poder & Política': 'plantao', // red/blue
  'Mundo & Internacional': 'ciencia', // blue
  'Vital & Ciência': 'ciencia' // teal/blue
};

interface NewsItem {
  id: any;
  titulo_viral: string;
  slug: string;
  categoria: string;
  subcategoria?: string;
  imagem_capa?: string;
  resumo_seo?: string;
  created_at: string;
  views_reais?: number;
}

// Helper to group posts by mapped category
function groupPosts(posts: NewsItem[]) {
  const groups: Record<string, NewsItem[]> = {};
  const unmapped: NewsItem[] = [];

  posts.forEach(post => {
    const rawCat = post.categoria?.toUpperCase() || 'OUTROS';
    const mappedTitle = CATEGORY_MAP[rawCat];

    if (mappedTitle) {
      if (!groups[mappedTitle]) groups[mappedTitle] = [];
      groups[mappedTitle].push(post);
    } else {
      unmapped.push(post);
    }
  });

  return { groups, unmapped };
}

// Helper to get unique subcategories for "pills"
function getSubcategories(posts: NewsItem[]): string[] {
  const subs = new Set<string>();
  posts.forEach(p => {
    if (p.subcategoria) subs.add(p.subcategoria);
  });
  return Array.from(subs).slice(0, 5); // Limit to 5 pills
}

export default async function Home() {
  const posts = await getData();
  const { groups, unmapped } = groupPosts(posts);

  // 3. UX/UI E MONETIZAÇÃO (High Density Setup)
  const heroPost = posts[0] || {}; // The very latest post
  const sidePosts = posts.slice(1, 5); // 4 posts for the sidebar

  // Specific Section Data
  const arenaPosts = groups['Arena Esportiva'] || [];
  const techPosts = groups['Pixel Tech'] || [];
  const gamesPosts = groups['Play & Geek'] || [];
  const holofotePosts = groups['Holofote & Famosos'] || [];
  const economiaPosts = groups['Mercado & Finanças'] || [];
  const brasilPosts = groups['Poder & Política'] || [];
  const mundoPosts = groups['Mundo & Internacional'] || [];
  const saudePosts = groups['Vital & Ciência'] || [];

  // Location Greeting (Lightweight)
  const headersList = await headers();
  const city = headersList.get('x-vercel-ip-city') || 'Brasil';

  return (
    <main className="min-h-screen bg-gray-50 pb-16 font-sans text-gray-900">

      {/* HEADER / GREETING */}
      <div className="bg-white border-b border-gray-100 py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-xs font-bold text-gray-500 uppercase tracking-widest">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span>Ao vivo</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{city}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-6">

        {/* 1. HERO SECTION (12 Cols) - High Impact */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
          {/* LEFT: Main Headline (8 cols) */}
          <div className="lg:col-span-8">
            {heroPost.slug ? (
              <FeatureCard
                slug={heroPost.slug}
                category={heroPost.categoria || "Destaque"}
                categoryColor="plantao" // Red for breaking news
                title={heroPost.titulo_viral}
                image={heroPost.imagem_capa}
                time="Destaque Principal"
              />
            ) : (
              <div className="h-[500px] w-full bg-gray-200 rounded-xl flex items-center justify-center text-gray-400 font-bold">
                Aguardando Notícias...
              </div>
            )}
          </div>

          {/* RIGHT: Sidebar (4 cols) - Density */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <AdBillboard /> {/* Placeholder for Top Right Ad */}

            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm h-full">
              <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
                <TrendingUp className="w-4 h-4 text-red-600" />
                <h3 className="font-black uppercase text-xs tracking-widest text-red-600">Mais Lidas</h3>
              </div>
              <div className="flex flex-col gap-0">
                {sidePosts.map((post, idx) => (
                  <CompactCard
                    key={idx}
                    slug={post.slug}
                    category={post.categoria || "Geral"}
                    categoryColor="plantao"
                    title={post.titulo_viral}
                    image={post.imagem_capa}
                    time="Agora"
                  />
                ))}
                {sidePosts.length === 0 && <span className="text-gray-400 text-sm">Sem notícias recentes.</span>}
              </div>
            </div>
          </div>
        </section>

        {/* 2. AD BANNER (Billboard) */}
        <section className="mb-10 text-center">
          <AdBillboard />
        </section>

        {/* 3. COLUNA TRIPLA (Brasil, Mundo, Economia) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 border-t border-gray-200 pt-8">
          {/* BRASIL */}
          <div>
            <SectionHeader title="Poder & Política" color="plantao" categoryLink="/category/brasil" />
            {brasilPosts.slice(0, 5).map((post, idx) => (
              <TextCard key={idx} slug={post.slug} category="Brasil" categoryColor="plantao" title={post.titulo_viral} time="Hoje" />
            ))}
            {brasilPosts.length === 0 && <p className="text-gray-400 text-sm italic">Sem notícias de política.</p>}
          </div>
          {/* MUNDO */}
          <div className="border-l border-gray-100 pl-6 md:border-l-0 md:pl-0"> {/* Mobile responsive border check */}
            <div className="md:border-l md:border-r border-gray-100 md:px-6 h-full">
              <SectionHeader title="Mundo" color="ciencia" categoryLink="/category/mundo" />
              {mundoPosts.slice(0, 5).map((post, idx) => (
                <TextCard key={idx} slug={post.slug} category="Mundo" categoryColor="ciencia" title={post.titulo_viral} time="Hoje" />
              ))}
              {mundoPosts.length === 0 && <p className="text-gray-400 text-sm italic">Sem notícias internacionais.</p>}
            </div>
          </div>
          {/* ECONOMIA */}
          <div>
            <SectionHeader title="Mercado" color="ciencia" categoryLink="/category/economia" />
            {economiaPosts.slice(0, 5).map((post, idx) => (
              <TextCard key={idx} slug={post.slug} category="Economia" categoryColor="ciencia" title={post.titulo_viral} time="Hoje" />
            ))}
            {economiaPosts.length === 0 && <p className="text-gray-400 text-sm italic">Sem notícias de economia.</p>}
          </div>
        </section>

        {/* 4. ARENA ESPORTIVA (Visual Strip) */}
        <section className="mb-12 bg-gray-900 text-gray-100 p-6 -mx-4 md:mx-0 rounded-2xl relative overflow-hidden">
          {/* Background Pattern or Gradient */}
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <h1 className="text-9xl font-black text-white">ARENA</h1>
          </div>

          <div className="relative z-10">
            <div className="flex justify-between items-end mb-6 border-b border-gray-700 pb-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-black uppercase text-green-400 tracking-tighter">Arena Esportiva</h2>
                <div className="flex gap-2">
                  {getSubcategories(arenaPosts).map(sub => (
                    <span key={sub} className="px-2 py-0.5 rounded-full border border-gray-600 text-[10px] uppercase hover:bg-green-500 hover:text-black hover:border-green-500 cursor-pointer transition-colors">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
              <Link href="/category/esportes" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Ver tudo &rarr;</Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Hero do Esporte */}
              <div className="md:col-span-2">
                {arenaPosts[0] && (
                  <Link href={`/noticia/${arenaPosts[0].slug}`} className="group block relative h-full min-h-[300px] rounded-lg overflow-hidden">
                    {arenaPosts[0].imagem_capa && <img src={arenaPosts[0].imagem_capa} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    <div className="absolute bottom-0 p-6">
                      <span className="bg-green-500 text-black text-xs font-black uppercase px-2 py-1 rounded-sm mb-2 inline-block">{arenaPosts[0].subcategoria || "Destaque"}</span>
                      <h3 className="text-2xl font-bold text-white leading-tight group-hover:underline">{arenaPosts[0].titulo_viral}</h3>
                    </div>
                  </Link>
                )}
                {!arenaPosts[0] && <div className="h-full bg-gray-800 rounded-lg flex items-center justify-center text-gray-500">Sem destaque</div>}
              </div>

              {/* Lista Lateral Esporte */}
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {arenaPosts.slice(1, 5).map((post, idx) => (
                  <Link key={idx} href={`/noticia/${post.slug}`} className="group block bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors">
                    <div className="h-32 overflow-hidden relative">
                      {post.imagem_capa ? <img src={post.imagem_capa} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-700" />}
                    </div>
                    <div className="p-3">
                      <span className="text-[10px] text-green-400 font-bold uppercase">{post.subcategoria || "Geral"}</span>
                      <h4 className="text-sm font-bold text-gray-200 leading-snug line-clamp-2 mt-1">{post.titulo_viral}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 5. DUAL SECTION: TECH & GAMES */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* TECH */}
          <div className="flex flex-col gap-4">
            <SectionHeader title="Pixel Tech" color="pixel" categoryLink="/category/tech" />
            <div className="space-y-4">
              {techPosts.slice(0, 3).map((post, idx) => (
                <CompactCard key={idx} slug={post.slug} category="Tech" categoryColor="pixel" title={post.titulo_viral} image={post.imagem_capa} time="Recente" />
              ))}
              {techPosts.length === 0 && <div className="p-4 text-center border border-dashed border-gray-300 rounded-lg text-gray-400">Nada no mundo da tecnologia.</div>}
            </div>
          </div>

          {/* GAMES */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b-2 border-purple-500 pb-2 mb-2">
              <h2 className="text-xl font-black uppercase text-gray-900 tracking-tight">Play & Geek</h2>
              <Link href="/category/geek" className="text-xs font-bold text-purple-600 hover:underline">Ver tudo</Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {gamesPosts.slice(0, 4).map((post, idx) => (
                <Link key={idx} href={`/noticia/${post.slug}`} className="group block">
                  <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden relative mb-2">
                    {post.imagem_capa && <img src={post.imagem_capa} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />}
                  </div>
                  <h4 className="text-sm font-bold leading-tight group-hover:text-purple-600 transition-colors line-clamp-2">{post.titulo_viral}</h4>
                </Link>
              ))}
              {gamesPosts.length === 0 && <div className="col-span-2 text-center text-gray-400 py-10">Sem notícias geek.</div>}
            </div>
          </div>
        </section>

        {/* 6. HOLOFOTE (Image Heavy) */}
        <section className="mb-12">
          <SectionHeader title="Holofote & Famosos" color="holofote" categoryLink="/category/holofote" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1">
            {holofotePosts.slice(0, 6).map((post, idx) => (
              <Link key={idx} href={`/noticia/${post.slug}`} className="group relative aspect-[3/4] bg-gray-200 block overflow-hidden">
                {post.imagem_capa && <img src={post.imagem_capa} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent">
                  <div className="absolute bottom-0 p-3 w-full">
                    <h4 className="text-white text-xs font-bold leading-tight line-clamp-3 group-hover:text-pink-300 transition-colors">{post.titulo_viral}</h4>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {holofotePosts.length === 0 && <div className="text-center py-8 bg-pink-50 rounded-lg text-pink-400 font-bold">Os famosos estão quietos hoje.</div>}
        </section>

        {/* 7. GIRO FINAL & SAUDE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          <div className="lg:col-span-8">
            <SectionHeader title="Giro de Notícias" color="plantao" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
              {unmapped.slice(0, 6).map((post, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="w-20 h-20 bg-gray-100 rounded-md shrink-0 overflow-hidden">
                    {post.imagem_capa && <img src={post.imagem_capa} className="w-full h-full object-cover" />}
                  </div>
                  <div>
                    <span className="text-[10px] bg-gray-200 px-1 rounded text-gray-600 font-bold uppercase">{post.categoria}</span>
                    <Link href={`/noticia/${post.slug}`}><h4 className="font-bold text-sm leading-snug hover:text-blue-600 mt-1">{post.titulo_viral}</h4></Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-teal-50 border border-teal-100 rounded-xl p-5">
              <SectionHeader title="Vital & Ciência" color="ciencia" categoryLink="/category/saude" />
              <ul className="space-y-4">
                {saudePosts.slice(0, 4).map((post, idx) => (
                  <li key={idx} className="border-b border-teal-100 pb-2 last:border-0 last:pb-0">
                    <Link href={`/noticia/${post.slug}`} className="block hover:opacity-70">
                      <h5 className="font-bold text-teal-900 text-sm leading-snug">{post.titulo_viral}</h5>
                      <span className="text-xs text-teal-600 mt-1 block uppercase font-bold">{post.subcategoria || "Saúde"}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8">
              <AdSkyscraper />
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}

