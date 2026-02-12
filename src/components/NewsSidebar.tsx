import Link from 'next/link'
import { Clock, TrendingUp } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default async function NewsSidebar() {
    // Fetch latest news
    const { data: latestNews } = await supabase
        .from('noticias')
        .select('slug, titulo_viral, created_at, categoria')
        .order('created_at', { ascending: false })
        .limit(5)

    // Fetch most read news (using fake views for now)
    const { data: mostRead } = await supabase
        .from('noticias')
        .select('slug, titulo_viral, views_fake, categoria')
        .order('views_fake', { ascending: false })
        .limit(5)

    return (
        <div className="space-y-8">
            {/* Latest News */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        Últimas Notícias
                    </h3>
                </div>
                <div className="space-y-4">
                    {latestNews?.map((news) => (
                        <Link
                            key={news.slug}
                            href={`/noticia/${news.slug}`}
                            className="block group"
                        >
                            <div className="flex items-start gap-3">
                                <div className="flex-1">
                                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase">
                                        {news.categoria}
                                    </span>
                                    <h4 className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mt-1">
                                        {news.titulo_viral}
                                    </h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        {new Date(news.created_at).toLocaleDateString('pt-BR')}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Most Read */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-red-500" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        Mais Lidas
                    </h3>
                </div>
                <div className="space-y-4">
                    {mostRead?.map((news, index) => (
                        <Link
                            key={news.slug}
                            href={`/noticia/${news.slug}`}
                            className="block group"
                        >
                            <div className="flex items-start gap-3">
                                <span className="text-3xl font-bold text-slate-200 dark:text-slate-800 leading-none">
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <div className="flex-1">
                                    <span className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase">
                                        {news.categoria}
                                    </span>
                                    <h4 className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2 mt-1">
                                        {news.titulo_viral}
                                    </h4>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
