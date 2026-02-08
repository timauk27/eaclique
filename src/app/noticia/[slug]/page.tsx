import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ShareBar from '@/components/ShareBar'
import AmazonProductCard from '@/components/AmazonProductCard'
import AdInArticle from '@/components/ads/AdInArticle'
import AdBillboard from '@/components/ads/AdBillboard'
import AdSkyscraper from '@/components/ads/AdSkyscraper'
import AdStickyFooter from '@/components/ads/AdStickyFooter'
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
    const { data, error } = await supabase
        .from('Noticias')
        .select('*')
        .eq('slug', slug)
        .single()

    if (error || !data) {
        return null
    }

    return data
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

// Parse HTML and inject ads + Amazon card
function parseContentWithAds(
    htmlContent: string,
    affiliateLink?: string,
    productName?: string
) {
    // Parse HTML to extract paragraphs
    const paragraphRegex = /<p[^>]*>.*?<\/p>/gs
    const paragraphs = htmlContent.match(paragraphRegex) || []

    const elements: React.ReactElement[] = []
    let paragraphCount = 0
    let amazonCardInserted = false

    // Get non-paragraph content (headings, lists, etc.)
    let remainingContent = htmlContent

    paragraphs.forEach((paragraph, index) => {
        // Add content before this paragraph
        const beforeIndex = remainingContent.indexOf(paragraph)
        if (beforeIndex > 0) {
            const beforeContent = remainingContent.substring(0, beforeIndex)
            if (beforeContent.trim()) {
                elements.push(
                    <div
                        key={`before-${index}`}
                        dangerouslySetInnerHTML={{ __html: beforeContent }}
                        className="prose prose-lg prose-slate max-w-none"
                    />
                )
            }
        }

        // Add the paragraph
        elements.push(
            <div
                key={`p-${index}`}
                dangerouslySetInnerHTML={{ __html: paragraph }}
                className="prose prose-lg prose-slate max-w-none"
            />
        )

        paragraphCount++

        // Insert Amazon card after 2nd paragraph
        if (paragraphCount === 2 && !amazonCardInserted && affiliateLink && productName) {
            elements.push(
                <AmazonProductCard
                    key="amazon-card"
                    productName={productName}
                    affiliateLink={affiliateLink}
                />
            )
            amazonCardInserted = true
        }

        // Insert ad every 3 paragraphs
        if (paragraphCount % 3 === 0) {
            elements.push(<AdInArticle key={`ad-${paragraphCount}`} />)
        }

        // Update remaining content
        remainingContent = remainingContent.substring(beforeIndex + paragraph.length)
    })

    // Add any remaining content
    if (remainingContent.trim()) {
        elements.push(
            <div
                key="remaining"
                dangerouslySetInnerHTML={{ __html: remainingContent }}
                className="prose prose-lg prose-slate max-w-none"
            />
        )
    }

    return elements
}

export default async function NewsPage({ params }: PageProps) {
    const { slug } = await params
    const news = await getNewsData(slug)

    if (!news) {
        notFound()
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eaclique.com.br'
    const newsUrl = `${siteUrl}/noticia/${news.slug}`

    const categoryColor = categoryColors[news.categoria] || 'bg-slate-600'

    const contentElements = parseContentWithAds(
        news.conteudo_html,
        news.link_afiliado_gerado,
        news.call_to_action_prod
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
                    { name: news.categoria, url: `/categoria/${news.categoria.toLowerCase()}` },
                    { name: news.titulo_viral, url: `/noticia/${news.slug}` }
                ]}
            />

            <AdStickyFooter />

            <div className="min-h-screen bg-white">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    {/* Billboard Ad */}
                    <AdBillboard />

                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-sm text-slate-600 mb-6">
                        <Link href="/" className="hover:text-blue-600">
                            Home
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <Link href={`/categoria/${news.categoria.toLowerCase()}`} className="hover:text-blue-600">
                            {news.categoria}
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
                                    {news.categoria}
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
                                    <span>Redação EAClique</span>
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

                            {/* Source Attribution */}
                            {news.fonte_original && (
                                <div className="mt-8 pt-6 border-t border-slate-200">
                                    <p className="text-sm text-slate-500">
                                        Fonte original:{' '}
                                        <a
                                            href={news.fonte_original}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            {new URL(news.fonte_original).hostname}
                                        </a>
                                    </p>
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
