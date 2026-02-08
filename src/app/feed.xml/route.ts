import { supabase } from '@/lib/supabase'

export async function GET() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eaclique.com.br'

    // Fetch latest 50 articles
    const { data: articles } = await supabase
        .from('Noticias')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

    const feedItems = (articles || []).map((article) => {
        const pubDate = new Date(article.created_at).toUTCString()
        const articleUrl = `${siteUrl}/noticia/${article.slug}`

        return `
    <item>
      <title><![CDATA[${article.titulo_viral}]]></title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <description><![CDATA[${article.resumo_seo || article.titulo_viral}]]></description>
      <pubDate>${pubDate}</pubDate>
      <category>${article.categoria}</category>
      ${article.imagem_capa ? `<enclosure url="${article.imagem_capa}" type="image/jpeg" />` : ''}
    </item>`
    }).join('\n')

    const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>EAClique - Portal de Notícias</title>
    <link>${siteUrl}</link>
    <description>Fique por dentro das últimas notícias de tecnologia, esportes, entretenimento e muito mais.</description>
    <language>pt-BR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${siteUrl}/favicon.ico</url>
      <title>EAClique</title>
      <link>${siteUrl}</link>
    </image>
${feedItems}
  </channel>
</rss>`

    return new Response(rssFeed, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
    })
}
