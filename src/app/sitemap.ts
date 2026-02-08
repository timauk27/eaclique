import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

const SITE_URL = 'https://eaclique.com.br'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Busca últimas 5000 notícias
    const { data: noticias } = await supabase
        .from('Noticias')
        .select('slug, created_at')
        .order('created_at', { ascending: false })
        .limit(5000)

    // Home + Categorias
    const routes = [
        '',
        '/category/mundo',
        '/category/brasil',
        '/category/ciencia',
        '/category/tech',
        '/category/games',
        '/category/cinema',
        '/category/economia',
        '/category/saude',
        '/category/esportes',
    ].map((route) => ({
        url: `${SITE_URL}${route}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1.0 : 0.9,
    }))

    // Notícias
    const newsRoutes = noticias?.map((noticia) => ({
        url: `${SITE_URL}/noticia/${noticia.slug}`,
        lastModified: noticia.created_at,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    })) || []

    return [...routes, ...newsRoutes]
}
