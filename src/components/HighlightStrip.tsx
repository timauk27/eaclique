import Link from 'next/link';
import React from 'react';

// Reflete a interface NewsItem mapeada na Home
interface NewsItem {
    id?: any;
    titulo_viral: string;
    slug: string;
    categoria: string;
    subcategoria?: string;
    imagem_capa?: string;
    resumo_seo?: string;
    created_at?: string;
    views_reais?: number;
}

interface HighlightStripProps {
    title: string;
    watermark: string; // O super texto no fundo, ex: "ARENA"
    posts: NewsItem[];
    colorTheme?: 'green' | 'blue' | 'red' | 'purple' | 'pink' | 'yellow' | 'teal' | 'cyan' | 'gray';
    seeAllLink?: string;
}

// Helpers baseados no page.tsx
function getSubcategories(posts: NewsItem[]): string[] {
    const subs = new Set<string>();
    posts.forEach(p => {
        if (p.subcategoria) subs.add(p.subcategoria);
    });
    return Array.from(subs).slice(0, 5);
}

// Map themes to specific tailwind classes for text, border and bg.
const themeMap = {
    green: {
        text: 'text-green-400',
        hoverBg: 'hover:bg-green-500',
        hoverBorder: 'hover:border-green-500',
        bg: 'bg-green-500',
    },
    blue: {
        text: 'text-blue-400',
        hoverBg: 'hover:bg-blue-500',
        hoverBorder: 'hover:border-blue-500',
        bg: 'bg-blue-500',
    },
    red: {
        text: 'text-red-400',
        hoverBg: 'hover:bg-red-500',
        hoverBorder: 'hover:border-red-500',
        bg: 'bg-red-500',
    },
    purple: {
        text: 'text-purple-400',
        hoverBg: 'hover:bg-purple-500',
        hoverBorder: 'hover:border-purple-500',
        bg: 'bg-purple-500',
    },
    pink: {
        text: 'text-pink-400',
        hoverBg: 'hover:bg-pink-500',
        hoverBorder: 'hover:border-pink-500',
        bg: 'bg-pink-500',
    },
    yellow: {
        text: 'text-yellow-400',
        hoverBg: 'hover:bg-yellow-500',
        hoverBorder: 'hover:border-yellow-500',
        bg: 'bg-yellow-500',
    },
    teal: {
        text: 'text-teal-400',
        hoverBg: 'hover:bg-teal-500',
        hoverBorder: 'hover:border-teal-500',
        bg: 'bg-teal-500',
    },
    cyan: {
        text: 'text-cyan-400',
        hoverBg: 'hover:bg-cyan-500',
        hoverBorder: 'hover:border-cyan-500',
        bg: 'bg-cyan-500',
    },
    gray: {
        text: 'text-gray-400',
        hoverBg: 'hover:bg-gray-500',
        hoverBorder: 'hover:border-gray-500',
        bg: 'bg-gray-500',
    }
};

export default function HighlightStrip({
    title,
    watermark,
    posts = [],
    colorTheme = 'green',
    seeAllLink
}: HighlightStripProps) {

    if (!posts || posts.length === 0) return null;

    const themeClasses = themeMap[colorTheme] || themeMap.green;
    const mainPost = posts[0];
    const sidePosts = posts.slice(1, 5);

    return (
        <section className="mb-12 bg-gray-900 text-gray-100 p-6 -mx-4 md:mx-0 rounded-2xl relative overflow-hidden">
            {/* Background Pattern or Gradient */}
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <h1 className="text-9xl font-black text-white uppercase">{watermark}</h1>
            </div>

            <div className="relative z-10">
                <div className="flex justify-between items-end mb-6 border-b border-gray-700 pb-4">
                    <div className="flex flex-col gap-2">
                        <h2 className={`text-3xl font-black uppercase tracking-tighter ${themeClasses.text}`}>
                            {title}
                        </h2>
                        <div className="flex gap-2">
                            {getSubcategories(posts).map(sub => (
                                <span
                                    key={sub}
                                    className={`px-2 py-0.5 rounded-full border border-gray-600 text-[10px] uppercase cursor-pointer transition-colors hover:text-black ${themeClasses.hoverBg} ${themeClasses.hoverBorder}`}
                                >
                                    {sub}
                                </span>
                            ))}
                        </div>
                    </div>
                    {seeAllLink && (
                        <Link href={seeAllLink} className="text-sm font-bold text-gray-400 hover:text-white transition-colors">
                            Ver tudo &rarr;
                        </Link>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Hero Highlight */}
                    <div className="md:col-span-2">
                        {mainPost && (
                            <Link href={`/noticia/${mainPost.slug}`} className="group block relative h-full min-h-[300px] rounded-lg overflow-hidden">
                                {mainPost.imagem_capa && (
                                    <img src={mainPost.imagem_capa} alt={mainPost.titulo_viral} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                                <div className="absolute bottom-0 p-6">
                                    <span className={`${themeClasses.bg} text-black text-xs font-black uppercase px-2 py-1 rounded-sm mb-2 inline-block`}>
                                        {mainPost.subcategoria || mainPost.categoria || "Destaque"}
                                    </span>
                                    <h3 className="text-2xl font-bold text-white leading-tight group-hover:underline">
                                        {mainPost.titulo_viral}
                                    </h3>
                                </div>
                            </Link>
                        )}
                        {!mainPost && <div className="h-full bg-gray-800 rounded-lg flex items-center justify-center text-gray-500">Sem destaque</div>}
                    </div>

                    {/* Side List */}
                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {sidePosts.map((post, idx) => (
                            <Link key={idx} href={`/noticia/${post.slug}`} className="group block bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors">
                                <div className="h-32 overflow-hidden relative">
                                    {post.imagem_capa ? (
                                        <img src={post.imagem_capa} alt={post.titulo_viral} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-700" />
                                    )}
                                </div>
                                <div className="p-3">
                                    <span className={`text-[10px] font-bold uppercase ${themeClasses.text}`}>
                                        {post.subcategoria || post.categoria || "Geral"}
                                    </span>
                                    <h4 className="text-sm font-bold text-gray-200 leading-snug line-clamp-2 mt-1">
                                        {post.titulo_viral}
                                    </h4>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
