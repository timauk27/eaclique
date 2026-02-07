import React from 'react'

interface NewsArticleProps {
    title: string
    description: string
    imageUrl: string
    imageAlt?: string
    datePublished: string
    dateModified?: string
    category: string
    slug: string
    authorName?: string
}

interface OrganizationProps {
    includeOrganization?: boolean
}

interface BreadcrumbProps {
    items: Array<{ name: string; url: string }>
}

/**
 * Schema.org NewsArticle structured data for Google Rich Results
 * Used on individual news pages to enhance SEO and enable rich snippets
 */
export function NewsArticleSchema({
    title,
    description,
    imageUrl,
    imageAlt,
    datePublished,
    dateModified,
    category,
    slug,
    authorName = 'Redação EAClique'
}: NewsArticleProps) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eaclique.com.br'
    const articleUrl = `${siteUrl}/noticia/${slug}`

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: title,
        description: description,
        image: {
            '@type': 'ImageObject',
            url: imageUrl,
            width: 1200,
            height: 630,
            caption: imageAlt || title
        },
        datePublished: datePublished,
        dateModified: dateModified || datePublished,
        author: {
            '@type': 'Organization',
            name: authorName,
            url: siteUrl
        },
        publisher: {
            '@type': 'Organization',
            name: 'EAClique',
            url: siteUrl,
            logo: {
                '@type': 'ImageObject',
                url: `${siteUrl}/logo.png`,
                width: 600,
                height: 60
            }
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': articleUrl
        },
        articleSection: category,
        inLanguage: 'pt-BR'
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    )
}

/**
 * Schema.org Organization structured data
 * Used on the homepage and layout to define the site's organization
 */
export function OrganizationSchema() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eaclique.com.br'

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'EAClique',
        url: siteUrl,
        logo: {
            '@type': 'ImageObject',
            url: `${siteUrl}/logo.png`,
            width: 600,
            height: 60
        },
        description: 'Portal de notícias com informações sobre tecnologia, economia, mundo, entretenimento e muito mais.',
        sameAs: [
            // Add social media profiles here when available
            // 'https://www.facebook.com/eaclique',
            // 'https://twitter.com/eaclique',
            // 'https://www.instagram.com/eaclique'
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            email: 'contato@eaclique.com.br'
        }
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    )
}

/**
 * Schema.org BreadcrumbList structured data
 * Helps Google understand site structure and display breadcrumbs in search results
 */
export function BreadcrumbSchema({ items }: BreadcrumbProps) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eaclique.com.br'

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${siteUrl}${item.url}`
        }))
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    )
}

/**
 * Schema.org WebSite structured data with SearchAction
 * Enables site search box in Google search results
 */
export function WebSiteSchema() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eaclique.com.br'

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'EAClique',
        url: siteUrl,
        description: 'Portal de notícias com informações sobre tecnologia, economia, mundo, entretenimento e muito mais.',
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${siteUrl}/busca?q={search_term_string}`
            },
            'query-input': 'required name=search_term_string'
        },
        inLanguage: 'pt-BR'
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    )
}
