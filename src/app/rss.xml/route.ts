import { supabase } from '@/lib/supabase'

export async function GET() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eaclique.com.br'

    // Busca as 50 notícias mais recentes
    const { data: articles } = await supabase
        .from('noticias')
        .select('*')
        .order('created_at', { ascending: false })
        .not('imagem_capa', 'is', null) // Traz apenas artigos que possuem capa (Obrigatório para o Pinterest)
        .limit(50)

    // Monta as tags no padrão exato exigido pelo Pinterest Bulk Create
    const feedItems = (articles || []).map((article) => {
        const pubDate = new Date(article.created_at).toUTCString()
        const articleUrl = `${siteUrl}/noticia/${article.slug}`

        return `
    <item>
      <title><![CDATA[${article.titulo_viral}]]></title>
      <link>${articleUrl}</link>
      <description><![CDATA[${article.resumo_seo || article.titulo_viral}]]></description>
      <pubDate>${pubDate}</pubDate>
      <image>
        <url><![CDATA[${article.imagem_capa}]]></url>
      </image>
    </item>`
    }).join('\n')

    const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>EAClique</title>
    <link>${siteUrl}</link>
    <description>Pinterest Feed</description>
${feedItems}
  </channel>
</rss>`

    return new Response(rssFeed, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400', // Cache forte pra n derrubar o banco
        },
    })
}
