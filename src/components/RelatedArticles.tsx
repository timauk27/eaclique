import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

interface RelatedArticlesProps {
    currentNewsId: number;
    currentCategory: string;
}

async function getRelatedNews(newsId: number, category: string) {
    const { data } = await supabase
        .from('noticias')
        .select('id, slug, titulo_viral, imagem_capa, imagem_alt, categoria, created_at')
        .eq('categoria', category)
        .neq('id', newsId)
        .order('created_at', { ascending: false })
        .limit(3);

    return data || [];
}

export default async function RelatedArticles({ currentNewsId, currentCategory }: RelatedArticlesProps) {
    const relatedNews = await getRelatedNews(currentNewsId, currentCategory);

    if (relatedNews.length === 0) {
        return null;
    }

    return (
        <section className="mt-12 pt-8 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                📰 Leia Também
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
                {relatedNews.map((news) => (
                    <Link
                        key={news.id}
                        href={`/noticia/${news.slug}`}
                        className="group bg-white rounded-lg overflow-hidden border border-slate-200 hover:border-red-600 hover:shadow-lg transition-all"
                    >
                        {/* Image */}
                        <div className="relative aspect-video overflow-hidden bg-slate-100">
                            <img
                                src={news.imagem_capa}
                                alt={news.imagem_alt || news.titulo_viral}
                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                            />
                            {/* Category Badge */}
                            <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                                {news.categoria}
                            </span>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                            <h3 className="font-semibold text-slate-900 line-clamp-2 group-hover:text-red-600 transition-colors">
                                {news.titulo_viral}
                            </h3>
                            <p className="text-xs text-slate-500 mt-2">
                                {new Date(news.created_at).toLocaleDateString('pt-BR', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
