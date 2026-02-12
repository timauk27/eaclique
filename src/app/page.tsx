import { createClient } from "@/utils/supabase/server";
import { FeatureCard, CompactCard, TextCard } from "@/components/Card";
import { SectionHeader } from "@/components/Structure";
import { Clock, TrendingUp } from "lucide-react";
import { Metadata } from 'next';
import Link from 'next/link';
import AdBillboard from '@/components/ads/AdBillboard';
import AdSkyscraper from '@/components/ads/AdSkyscraper';

export const metadata: Metadata = {
  title: 'EAClique - Portal de Notícias',
  description: 'Portal de notícias com informações sobre tecnologia, economia, mundo, entretenimento e muito mais. Fique por dentro das últimas notícias.',
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://eaclique.com.br',
  },
  openGraph: {
    title: 'EAClique - Portal de Notícias',
    description: 'Fique por dentro das últimas notícias de tecnologia, economia, mundo, entretenimento e muito mais.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://eaclique.com.br',
    siteName: 'EAClique',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EAClique - Portal de Notícias',
    description: 'Fique por dentro das últimas notícias de tecnologia, economia, mundo, entretenimento e muito mais.',
  },
};

export const revalidate = 60; // Revalidate every minute

async function getData() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("noticias")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100); // Increased from 20 to 100 to have more content

  return posts || [];
}

export default async function Home() {
  const posts = await getData();

  // Filter by actual database categories
  const arenaPosts = posts.filter(p => p.categoria?.toUpperCase() === 'ESPORTES' || p.categoria?.toUpperCase() === 'ARENA').slice(0, 4);
  const holofotePosts = posts.filter(p => p.categoria?.toUpperCase() === 'HOLOFOTE' || p.categoria?.toUpperCase() === 'FAMOSOS' || p.categoria?.toUpperCase() === 'CINEMA' || p.categoria?.toUpperCase() === 'ENTRETENIMENTO' || p.categoria?.toUpperCase() === 'CELEBRIDADES' || p.categoria?.toUpperCase() === 'MODA' || p.categoria?.toUpperCase() === 'BELEZA' || p.categoria?.toUpperCase() === 'LIFESTYLE').slice(0, 9);
  const techPosts = posts.filter(p => p.categoria?.toUpperCase() === 'TECH' || p.categoria?.toUpperCase() === 'PIXEL').slice(0, 4);
  const mainPosts = posts.slice(0, 5);

  // Fallback if filters are empty (mocking for density)
  const heroPost = mainPosts[0] || {};
  const sidePosts = mainPosts.slice(1, 3);

  return (
    <main className="min-h-screen bg-gray-50 pb-12 font-sans">

      <div className="container mx-auto px-4 pt-6">

        {/* HERO SECTION (12 Cols) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* LEFT: Main Headline (8 cols) */}
          <div className="lg:col-span-8">
            {heroPost.slug && (
              <FeatureCard
                slug={heroPost.slug}
                category={heroPost.categoria || "Plantão"}
                categoryColor={heroPost.categoria?.toLowerCase() === 'arena' ? 'arena' : 'plantao'}
                title={heroPost.titulo_viral}
                image={heroPost.imagem_capa}
                time="Há 10 min"
              />
            )}
          </div>

          {/* RIGHT: Sidebar (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <AdBillboard />
            <div className="flex flex-col gap-0 border-t-2 border-gra-900">
              <h3 className="font-bold uppercase text-xs tracking-widest text-red-600 mb-2 mt-1">Mais Lidas</h3>
              {sidePosts.map((post, idx) => (
                <CompactCard
                  key={idx}
                  slug={post.slug}
                  category={post.categoria || "Geral"}
                  categoryColor="plantao"
                  title={post.titulo_viral}
                  image={post.imagem_capa}
                  time="Há 30 min"
                />
              ))}
            </div>
          </div>
        </section>

        {/* ARENA STRIP */}
        <section className="mb-12 bg-green-50/50 p-6 -mx-4 md:mx-0 rounded-xl border border-green-100">
          <SectionHeader title="Arena Esportiva" color="arena" categoryLink="/category/esportes" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {arenaPosts.length > 0 ? arenaPosts.map((post, idx) => (
              <div key={idx} className={idx === 0 ? "md:col-span-2" : ""}>
                {idx === 0 ? (
                  <FeatureCard
                    slug={post.slug}
                    category="Arena" categoryColor="arena"
                    title={post.titulo_viral} image={post.imagem_capa}
                    size="small"
                  />
                ) : (
                  <TextCard
                    slug={post.slug}
                    category="Arena" categoryColor="arena"
                    title={post.titulo_viral} time="1h atrás"
                  />
                )}
              </div>
            )) : (
              <div className="col-span-4 text-center py-10 text-gray-400">Sem notícias de esportes no momento.</div>
            )}
          </div>
        </section>

        {/* BANNER HORIZONTAL */}
        <section className="mb-12">
          <AdBillboard />
        </section>

        {/* PIXEL/TECH SECTION */}
        <section className="mb-12 bg-cyan-50/50 p-6 -mx-4 md:mx-0 rounded-xl border border-cyan-100">
          <SectionHeader title="Pixel & Tecnologia" color="pixel" categoryLink="/category/tech" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {techPosts.length > 0 ? techPosts.map((post, idx) => (
              <div key={idx} className={idx === 0 ? "md:col-span-2" : ""}>
                {idx === 0 ? (
                  <FeatureCard
                    slug={post.slug}
                    category="Pixel" categoryColor="pixel"
                    title={post.titulo_viral} image={post.imagem_capa}
                    size="small"
                  />
                ) : (
                  <TextCard
                    slug={post.slug}
                    category="Tech" categoryColor="pixel"
                    title={post.titulo_viral} time="2h atrás"
                  />
                )}
              </div>
            )) : (
              <div className="col-span-4 text-center py-10 text-gray-400">Sem notícias de tecnologia no momento.</div>
            )}
          </div>
        </section>

        {/* GRID COMPLEXO (Holofote + Sidebar Sticky) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">

          {/* Main Feed (8 cols) */}
          <div className="lg:col-span-8">

            {/* HOLOFOTE Grid */}
            <div className="mb-10">
              <SectionHeader title="Holofote & Famosos" color="holofote" categoryLink="/category/holofote" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
                {holofotePosts.map((post, idx) => (
                  <Link key={idx} href={`/noticia/${post.slug}`} className="aspect-square relative group overflow-hidden bg-gray-200 block">
                    {post.imagem_capa && (
                      <img src={post.imagem_capa} alt={post.titulo_viral} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      <span className="text-[10px] font-bold text-pink-500 bg-black/50 px-1 rounded uppercase mb-1 inline-block">Fama</span>
                      <p className="text-white text-xs font-bold leading-tight line-clamp-2">{post.titulo_viral}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* LATEST LIST */}
            <SectionHeader title="Últimas Notícias" color="pixel" />
            <div className="divide-y divide-gray-100">
              {mainPosts.slice(3).map((post, idx) => (
                <div className="py-4" key={idx}>
                  <CompactCard
                    slug={post.slug}
                    category={post.categoria || "Pixel"}
                    categoryColor="pixel"
                    title={post.titulo_viral}
                    image={post.imagem_capa}
                    time="Agora"
                  />
                </div>
              ))}
            </div>

          </div>

          {/* STICKY SIDEBAR (4 cols) */}
          <div className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-24 space-y-8">
              <AdSkyscraper />

              <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-purple-900 border-b border-purple-100 pb-2">
                  <TrendingUp className="w-5 h-5 text-purple-700" />
                  <h4 className="font-black uppercase tracking-tighter">Em Alta</h4>
                </div>
                <ol className="list-decimal list-inside space-y-3 font-bold text-gray-700 text-sm">
                  <li className="marker:text-purple-500 marker:font-black hover:text-purple-700 cursor-pointer">Dólar despenca após anúncio do Fed</li>
                  <li className="marker:text-purple-500 marker:font-black hover:text-purple-700 cursor-pointer">Neymar anuncia aposentadoria (Fake)</li>
                  <li className="marker:text-purple-500 marker:font-black hover:text-purple-700 cursor-pointer">Novo iPhone 17 vaza na web</li>
                  <li className="marker:text-purple-500 marker:font-black hover:text-purple-700 cursor-pointer">Greve geral confirmada para sexta</li>
                  <li className="marker:text-purple-500 marker:font-black hover:text-purple-700 cursor-pointer">BBB 26: Paredão falso hoje</li>
                </ol>
              </div>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
