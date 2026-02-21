import React from 'react'
import { Metadata } from 'next'
import { permanentRedirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
    params: Promise<{ slug: string }>
}

// Fetch page data
async function getPageData(slug: string) {
    const { data, error } = await supabase
        .from('paginas')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'publicado') // ensure only published pages are visible
        .single()

    if (error || !data) {
        return null
    }

    return data
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params
    const page = await getPageData(slug)

    if (!page) {
        return {
            title: 'Página não encontrada - EAClique',
        }
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eaclique.com.br'
    const pageUrl = `${siteUrl}/pagina/${page.slug}`

    return {
        title: `${page.titulo} - EAClique`,
        description: page.resumo_seo || `Leia sobre ${page.titulo} no portal EAClique.`,
        alternates: {
            canonical: pageUrl,
        },
        openGraph: {
            title: page.titulo,
            description: page.resumo_seo || `Leia sobre ${page.titulo} no portal EAClique.`,
            url: pageUrl,
            siteName: 'EAClique',
            locale: 'pt_BR',
            type: 'website',
        }
    }
}

export default async function StaticPage({ params }: PageProps) {
    const { slug } = await params
    const page = await getPageData(slug)

    if (!page) {
        permanentRedirect('/404')
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8 border-b border-slate-100 pb-4">
                    <Link href="/" className="hover:text-blue-600 font-semibold transition-colors">
                        Home
                    </Link>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-slate-900 font-bold uppercase tracking-wider text-xs">
                        {page.titulo}
                    </span>
                </nav>

                {/* Main Content */}
                <article>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-8">
                        {page.titulo}
                    </h1>

                    <div
                        className="prose prose-lg prose-slate max-w-none conteudo-noticia pt-4 border-t border-slate-100"
                        dangerouslySetInnerHTML={{ __html: page.conteudo_html }}
                    />
                </article>
            </div>
        </div>
    )
}
