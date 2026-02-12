import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Calendar, TrendingUp } from 'lucide-react'
import AdBillboard from '@/components/ads/AdBillboard'

interface PageProps {
    params: Promise<{ categoria: string }>
}

// Category mapping (URL slug to database category)
// Categorias reais no banco: TECH, BRASIL, MUNDO, GAMES, ECONOMIA, SAUDE, ESPORTES, CIENCIA, CINEMA, FAMOSOS, HOLOFOTE, ARENA, PIXEL, PLAY, VITAL, MERCADO, PLANTÃO, MOTOR, ESTILO
const categoryMap: Record<string, string | string[]> = {
    // Menu principal (mapeia exatamente para as categorias do banco)
    'plantão': 'PLANTÃO',
    'plantao': 'PLANTÃO',
    'brasil': 'BRASIL',
    'mundo': 'MUNDO',
    'arena': ['ARENA', 'ESPORTES'], // Arena exibe: Arena + Esportes (FUTEBOL, VÔLEI, ETC)
    'esportes': ['ARENA', 'ESPORTES'],
    'holofote': 'HOLOFOTE',
    'mercado': 'MERCADO',
    'pixel': 'PIXEL',
    'play': ['PLAY', 'GAMES'], // Play exibe: Play + Games (PS5, XBOX, ETC)
    'games': ['PLAY', 'GAMES'],
    'vital': 'VITAL',

    // Aliases e categorias adicionais
    'tech': 'TECH',
    'tecnologia': 'TECH',
    'jogos': ['PLAY', 'GAMES'],
    'cinema': 'CINEMA',
    'filmes': 'CINEMA',
    'economia': 'ECONOMIA',
    'dinheiro': 'ECONOMIA',
    'saude': 'SAUDE',
    'ciencia': 'CIENCIA',
    'ciência': 'CIENCIA',
    'famosos': 'FAMOSOS',
    'motor': 'MOTOR',
    'auto': 'MOTOR',
    'estilo': 'ESTILO',
    'entretenimento': 'ENTRETENIMENTO',
}

// Category colors (usando as mesmas cores do menu)
const categoryColors: Record<string, string> = {
    'PLANTÃO': 'bg-red-600',
    'BRASIL': 'bg-red-600',
    'MUNDO': 'bg-red-600',
    'ARENA': 'bg-green-600',
    'HOLOFOTE': 'bg-pink-600',
    'MERCADO': 'bg-yellow-600',
    'PIXEL': 'bg-cyan-600',
    'PLAY': 'bg-purple-600',
    'VITAL': 'bg-teal-600',
    'TECH': 'bg-cyan-600',
    'GAMES': 'bg-purple-600',
    'CINEMA': 'bg-pink-600',
    'ECONOMIA': 'bg-yellow-600',
    'SAUDE': 'bg-teal-600',
    'CIENCIA': 'bg-blue-600',
    'ESPORTES': 'bg-green-600',
    'FAMOSOS': 'bg-pink-600',
    'MOTOR': 'bg-gray-600',
    'ESTILO': 'bg-indigo-600',
    'ENTRETENIMENTO': 'bg-pink-600',
}


// Fetch news by category (case-insensitive)
async function getNewsByCategory(category: string | string[]) {
    let query = supabase
        .from('noticias')
        .select('*')

    if (Array.isArray(category)) {
        query = query.in('categoria', category)
    } else {
        query = query.ilike('categoria', category)
    }

    const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(100)

    if (error) {
        console.error('Error fetching news:', error)
        return []
    }

    return data || []
}

// Generate metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { categoria } = await params
    const dbCategoryVal = categoryMap[categoria.toLowerCase()]

    if (!dbCategoryVal) {
        return {
            title: 'Categoria não encontrada - EAClique',
        }
    }

    const titleCategory = Array.isArray(dbCategoryVal) ? dbCategoryVal[0] : dbCategoryVal
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eaclique.com.br'
    const categoryUrl = `${siteUrl}/category/${categoria.toLowerCase()}`

    return {
        title: `${titleCategory} - Notícias e Atualizações | EAClique`,
        description: `Fique por dentro das últimas notícias de ${titleCategory} no EAClique. Notícias atualizadas em tempo real.`,
        alternates: {
            canonical: categoryUrl,
        },
        openGraph: {
            title: `${titleCategory} - Notícias e Atualizações`,
            description: `Fique por dentro das últimas notícias de ${titleCategory} no EAClique.`,
            url: categoryUrl,
            siteName: 'EAClique',
            locale: 'pt_BR',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${titleCategory} - Notícias e Atualizações`,
            description: `Fique por dentro das últimas notícias de ${titleCategory} no EAClique.`,
        },
    }
}

export default async function CategoryPage({ params }: PageProps) {
    const { categoria } = await params
    const dbCategoryVal = categoryMap[categoria.toLowerCase()]

    if (!dbCategoryVal) {
        notFound()
    }

    const news = await getNewsByCategory(dbCategoryVal)

    const titleCategory = Array.isArray(dbCategoryVal) ? dbCategoryVal[0] : dbCategoryVal
    const categoryColor = categoryColors[titleCategory] || 'bg-slate-600'

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Category Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <span className={`inline-block px-4 py-2 text-sm font-bold uppercase tracking-wider text-white rounded ${categoryColor}`}>
                            {titleCategory}
                        </span>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <TrendingUp className="h-4 w-4" />
                            <span>{news.length} notícias</span>
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900">
                        Últimas de {titleCategory}
                    </h1>
                </div>

                {/* News Grid */}
                {news.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-xl text-slate-500">
                            Nenhuma notícia encontrada nesta categoria ainda.
                        </p>
                        <Link
                            href="/"
                            className="inline-block mt-4 text-blue-600 hover:underline"
                        >
                            Voltar para a página inicial
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {(() => {
                            const elements = [];
                            for (let i = 0; i < news.length; i += 6) {
                                // Add a batch of up to 6 news items
                                const batch = news.slice(i, i + 6);
                                elements.push(
                                    <div key={`batch-${i}`} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {batch.map((article) => (
                                            <Link
                                                key={article.slug}
                                                href={`/noticia/${article.slug}`}
                                                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200"
                                            >
                                                {/* Image */}
                                                {article.imagem_capa && (
                                                    <div className="relative h-48 overflow-hidden">
                                                        <img
                                                            src={article.imagem_capa}
                                                            alt={article.imagem_alt || article.titulo_viral}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                        <div className={`absolute top-3 left-3 px-2 py-1 text-xs font-bold uppercase text-white rounded ${categoryColor}`}>
                                                            {article.categoria}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Content */}
                                                <div className="p-5">
                                                    <h2 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                                        {article.titulo_viral}
                                                    </h2>

                                                    {article.resumo_seo && (
                                                        <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                                                            {article.resumo_seo}
                                                        </p>
                                                    )}

                                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                                        <Calendar className="h-3 w-3" />
                                                        <time dateTime={article.created_at}>
                                                            {new Date(article.created_at).toLocaleDateString('pt-BR', {
                                                                day: '2-digit',
                                                                month: 'short',
                                                                year: 'numeric',
                                                            })}
                                                        </time>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                );

                                // Add banner after every 6 items (but not after the last batch)
                                if (i + 6 < news.length) {
                                    elements.push(
                                        <div key={`ad-${i}`} className="w-full flex justify-center py-4">
                                            <AdBillboard />
                                        </div>
                                    );
                                }
                            }
                            return elements;
                        })()}
                    </div>
                )}
            </div>
        </div>
    )
}
