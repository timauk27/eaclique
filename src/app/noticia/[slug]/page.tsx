import React from 'react'
import { Metadata } from 'next'
import { permanentRedirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ShareBar from '@/components/ShareBar'
import AmazonProductCard from '@/components/AmazonProductCard'
import AdBillboard from '@/components/ads/AdBillboard'
import AdSkyscraper from '@/components/ads/AdSkyscraper'
import AdStickyFooter from '@/components/ads/AdStickyFooter'
import AdManager from '@/components/ads/AdManager'
import NewsSidebar from '@/components/NewsSidebar'
import RelatedArticles from '@/components/RelatedArticles'
import { NewsArticleSchema, BreadcrumbSchema } from '@/components/seo/StructuredData'
import { ChevronRight, Calendar, User } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
    params: Promise<{ slug: string }>
}

// Category colors
const categoryColors: Record<string, string> = {
    'PLANTÃO': 'bg-red-600',
    'ARENA': 'bg-green-600',
    'HOLOFOTE': 'bg-pink-600',
    'MERCADO': 'bg-blue-600',
    'PIXEL': 'bg-purple-600',
    'PLAY': 'bg-orange-600',
    'VITAL': 'bg-teal-600',
    'MOTOR': 'bg-gray-600',
    'ESTILO': 'bg-indigo-600',
    'VIRAL': 'bg-yellow-600',
}

// Fetch news data
async function getNewsData(slug: string) {
    // Attempt to fetch with the `autores` relation (if the DB migration was run)
    const { data, error } = await supabase
        .from('noticias')
        .select(`
            *,
            autores (
                id,
                nome,
                foto_url,
                biografia,
                rede_social_link
            )
        `)
        .eq('slug', slug)
        .single()

    if (error) {
        // Fallback to basic fetch if relation doesn't exist yet
        const fallback = await supabase
            .from('noticias')
            .select('*')
            .eq('slug', slug)
            .single()

        if (fallback.error || !fallback.data) return null;
        return fallback.data;
    }

    if (!data) return null;
    return data;
}

// Generate metadata for SEO and social sharing
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params
    const news = await getNewsData(slug)

    if (!news) {
        return {
            title: 'Notícia não encontrada - EAClique',
        }
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eaclique.com.br'
    const newsUrl = `${siteUrl}/noticia/${news.slug}`

    return {
        title: `${news.titulo_viral} - EAClique`,
        description: news.resumo_seo || news.titulo_viral,
        alternates: {
            canonical: newsUrl,
        },
        openGraph: {
            title: news.titulo_viral,
            description: news.resumo_seo || news.titulo_viral,
            url: newsUrl,
            siteName: 'EAClique',
            images: [
                {
                    url: news.imagem_capa,
                    width: 1200,
                    height: 630,
                    alt: news.imagem_alt || news.titulo_viral,
                },
            ],
            locale: 'pt_BR',
            type: 'article',
            publishedTime: news.created_at,
            modifiedTime: news.updated_at || news.created_at,
        },
        twitter: {
            card: 'summary_large_image',
            title: news.titulo_viral,
            description: news.resumo_seo || news.titulo_viral,
            images: [news.imagem_capa],
        },
    }
}

// Fetch single related news for inline injection
async function getInlineRelatedNews(slugToExclude: string, category: string) {
    const { data } = await supabase
        .from('noticias')
        .select('titulo_viral, slug')
        .eq('categoria', category)
        .neq('slug', slugToExclude)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

    return data || null;
}

// Parse HTML and inject ads + Amazon card + Inline Related Article
function parseContentWithAds(
    htmlContent: string,
    affiliateLink?: string,
    productName?: string,
    inlineRelatedArticle?: { titulo_viral: string, slug: string } | null
) {
    // Limpa crases de markdown (```html) que a IA pode ter inserido no JSON
    let cleanHtml = htmlContent.replace(/```html/gi, '').replace(/```/g, '').trim();

    // Filtro para ocultar qualquer "Fonte original: [link]" que a IA tenha inserido no texto final
    cleanHtml = cleanHtml.replace(/<p[^>]*>[\s\n]*((<[^>]+>)*)[\s]*Fonte\s*(original)?\s*:.*?<\/p>/gi, '');
    cleanHtml = cleanHtml.replace(/[\s]*((<[^>]+>)*)[\s]*Fonte\s*(original)?\s*:.*?(\n|$)/gi, '');

    // Lógica para injetar anúncios e links no meio do conteúdo:
    // Quebra o HTML pelos fechamentos de parágrafo </p>
    const paragraphs = cleanHtml.split('</p>');
    const elements: React.ReactNode[] = [];

    paragraphs.forEach((p, index) => {
        // Ignora partes vazias residuais
        if (!p.trim()) return;

        // Reconstrói o parágrafo (já que o split removeu o </p>)
        const fullParagraphHtml = p + '</p>';

        elements.push(
            <div
                key={`p-${index}`}
                className="prose prose-lg prose-slate max-w-none conteudo-noticia mb-4"
                dangerouslySetInnerHTML={{ __html: fullParagraphHtml }}
            />
        );

        // Injeta o AdManager após o 2º parágrafo (índice 1)
        if (index === 1) {
            elements.push(
                <div key="ad-in-article" className="my-8 flex justify-center w-full">
                    <AdManager posicao="Banner 300x250" />
                </div>
            );
        }

        // Injeta o "Leia Também" após o 3º parágrafo lido (índice 2) se houver matéria
        if (index === 2 && inlineRelatedArticle) {
            elements.push(
                <aside key="read-also-inline" className="my-8 bg-blue-50/80 border-l-4 border-blue-600 p-5 rounded-r-xl shadow-sm transform transition-transform hover:-translate-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-blue-700 font-bold tracking-widest uppercase text-xs">
                            🔗 Leia Também
                        </span>
                    </div>
                    <Link
                        href={`/noticia/${inlineRelatedArticle.slug}`}
                        className="text-lg md:text-xl font-bold text-slate-800 hover:text-blue-600 transition-colors block leading-snug"
                    >
                        {inlineRelatedArticle.titulo_viral}
                    </Link>
                </aside>
            );
        }
    });

    return (
        <div className="w-full">
            {elements}

            {/* Renderiza o card da Amazon no final do artigo, já que removemos o injetor frágil de parágrafos */}
            {affiliateLink && productName && (
                <div className="mt-8 border-t pt-8">
                    <AmazonProductCard
                        productName={productName}
                        affiliateLink={affiliateLink}
                    />
                </div>
            )}
        </div>
    );
}

// Helper to slugify category names
function slugify(text: string) {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD') // Split accents from letters
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, '') // Trim - from end of text
}

export default async function NewsPage({ params }: PageProps) {
    const { slug } = await params
    const news = await getNewsData(slug)

    if (!news) {
        // Verifica se existe um redirecionamento (301) configurado para essa URL antiga
        const { data: redir } = await supabase
            .from('redirecionamentos')
            .select('destino_url')
            .eq('origem_slug', `/noticia/${slug}`)
            .eq('ativo', true)
            .single()

        if (redir && redir.destino_url) {
            permanentRedirect(redir.destino_url)
        }

        permanentRedirect('/')
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eaclique.com.br'
    const newsUrl = `${siteUrl}/noticia/${news.slug}`

    const categoryColor = categoryColors[news.categoria || 'Geral'] || 'bg-slate-600'
    const categorySlug = slugify(news.categoria || 'geral')

    // Fetch the inline related reading
    const inlineRelated = await getInlineRelatedNews(news.slug, news.categoria || 'Geral')

    const contentElements = parseContentWithAds(
        news.conteudo_html,
        news.link_afiliado_gerado,
        news.call_to_action_prod,
        inlineRelated
    )

    return (
        <>
            {/* Schema.org Structured Data */}
            <NewsArticleSchema
                title={news.titulo_viral}
                description={news.resumo_seo || news.titulo_viral}
                imageUrl={news.imagem_capa}
                imageAlt={news.imagem_alt}
                datePublished={news.created_at}
                dateModified={news.updated_at}
                category={news.categoria}
                slug={news.slug}
            />
            <BreadcrumbSchema
                items={[
                    { name: 'Home', url: '/' },
                    { name: news.categoria || 'Geral', url: `/category/${categorySlug}` },
                    { name: news.titulo_viral, url: `/noticia/${news.slug}` }
                ]}
            />

            <AdStickyFooter />

            <div className="min-h-screen bg-white">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    {/* Banner Topo */}
                    <div className="flex justify-center w-full mb-8">
                        <AdManager posicao="Banner 728x90" />
                    </div>

                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-sm text-slate-600 mb-6">
                        <Link href="/" className="hover:text-blue-600">
                            Home
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <Link href={`/category/${categorySlug}`} className="hover:text-blue-600">
                            {news.categoria || 'Geral'}
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-slate-900 truncate">
                            {news.titulo_viral}
                        </span>
                    </nav>

                    {/* 3-Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left Column - Share Bar (Desktop Only) */}
                        <div className="hidden lg:block lg:col-span-1">
                            <ShareBar title={news.titulo_viral} url={newsUrl} />
                        </div>

                        {/* Center Column - Main Content */}
                        <article className="lg:col-span-7">
                            {/* Category Badge */}
                            <div className="mb-4">
                                <span className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-white rounded ${categoryColor}`}>
                                    {news.categoria || 'Geral'}
                                </span>
                            </div>

                            {/* Title */}
                            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-slate-900 leading-tight mb-4">
                                {news.titulo_viral}
                            </h1>

                            {/* Subtitle/SEO Summary */}
                            {news.resumo_seo && (
                                <p className="text-xl text-slate-600 mb-6 leading-relaxed">
                                    {news.resumo_seo}
                                </p>
                            )}

                            {/* Meta Info */}
                            <div className="flex items-center gap-4 text-sm text-slate-500 mb-6 pb-6 border-b border-slate-200">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <time dateTime={news.created_at}>
                                        {new Date(news.created_at).toLocaleDateString('pt-BR', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </time>
                                </div>
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    <span>{news.autores?.nome || 'Redação EAClique'}</span>
                                </div>
                            </div>

                            {/* Featured Image */}
                            {news.imagem_capa && (
                                <figure className="mb-8">
                                    <img
                                        src={news.imagem_capa}
                                        alt={news.imagem_alt || news.titulo_viral}
                                        className="w-full h-auto rounded-lg shadow-lg"
                                    />
                                    {news.imagem_alt && (
                                        <figcaption className="text-sm text-slate-500 mt-2 text-center">
                                            {news.imagem_alt}
                                        </figcaption>
                                    )}
                                </figure>
                            )}

                            {/* Article Content with Ads */}
                            <div className="space-y-4">
                                {contentElements}
                            </div>

                            {/* Author Bio Box */}
                            {news.autores && (
                                <div className="mt-10 mb-8 p-6 bg-slate-50 border border-slate-200 rounded-xl flex flex-col md:flex-row gap-6 items-center md:items-start">
                                    {news.autores.foto_url ? (
                                        <img src={news.autores.foto_url} alt={news.autores.nome} className="w-20 h-20 rounded-full object-cover shadow-sm border border-slate-200" />
                                    ) : (
                                        <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 flex-shrink-0">
                                            <User className="w-10 h-10" />
                                        </div>
                                    )}
                                    <div className="text-center md:text-left">
                                        <h3 className="text-lg font-bold text-slate-900">{news.autores.nome}</h3>
                                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">Autor</p>
                                        {news.autores.biografia && (
                                            <p className="text-sm text-slate-600 leading-relaxed">{news.autores.biografia}</p>
                                        )}
                                        {news.autores.rede_social_link && (
                                            <a href={news.autores.rede_social_link} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors mt-3 inline-block">
                                                Acompanhar Autor &rarr;
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Related Articles */}
                            <RelatedArticles currentNewsId={news.id} currentCategory={news.categoria} />
                        </article>

                        {/* Right Column - Sidebar */}
                        <aside className="lg:col-span-4">
                            <div className="space-y-6">
                                <AdSkyscraper />
                                <NewsSidebar />
                            </div>
                        </aside>
                    </div>
                </div>
            </div>

            {/* Mobile Share Bar */}
            <div className="lg:hidden">
                <ShareBar title={news.titulo_viral} url={newsUrl} />
            </div>
        </>
    )
}
