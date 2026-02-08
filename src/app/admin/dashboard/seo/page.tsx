'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { AlertTriangle, Image, FileText, ExternalLink, Edit } from 'lucide-react'
import Link from 'next/link'

interface NoticiaProblematica {
    id: number
    titulo_viral: string
    categoria: string
    imagem_capa: string | null
    resumo_seo: string | null
    slug: string
    created_at: string
    problemas: string[]
}

export default function AdminSEOPage() {
    const [noticias, setNoticias] = useState<NoticiaProblematica[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'sem_imagem' | 'sem_resumo'>('all')

    const loadProblematicas = async () => {
        setLoading(true)

        const { data, error } = await supabase
            .from('Noticias')
            .select('id, titulo_viral, categoria, imagem_capa, resumo_seo, slug, created_at')
            .order('created_at', { ascending: false })
            .limit(100)

        if (!error && data) {
            // Filtra e identifica problemas
            const problematicas = data
                .map((noticia) => {
                    const problemas: string[] = []
                    if (!noticia.imagem_capa || noticia.imagem_capa.trim() === '') {
                        problemas.push('sem_imagem')
                    }
                    if (!noticia.resumo_seo || noticia.resumo_seo.trim() === '') {
                        problemas.push('sem_resumo')
                    }
                    return { ...noticia, problemas }
                })
                .filter((n) => n.problemas.length > 0)

            setNoticias(problematicas)
        }
        setLoading(false)
    }

    useEffect(() => {
        loadProblematicas()
    }, [])

    const noticiasFiltered = noticias.filter((n) => {
        if (filter === 'all') return true
        return n.problemas.includes(filter)
    })

    const stats = {
        total: noticias.length,
        sem_imagem: noticias.filter((n) => n.problemas.includes('sem_imagem')).length,
        sem_resumo: noticias.filter((n) => n.problemas.includes('sem_resumo')).length
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <AlertTriangle className="w-8 h-8 text-orange-600" />
                        <h1 className="text-3xl font-bold text-gray-900">SEO Check</h1>
                    </div>
                    <p className="text-gray-600">
                        Audite notícias com problemas de SEO (sem imagem ou resumo)
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-lg p-6 border-2 border-orange-200">
                        <div className="flex items-center gap-3 mb-2">
                            <AlertTriangle className="w-6 h-6 text-orange-600" />
                            <h3 className="font-semibold text-gray-700">Total de Problemas</h3>
                        </div>
                        <p className="text-4xl font-bold text-orange-600">{stats.total}</p>
                        <p className="text-xs text-gray-500 mt-1">notícias com issues</p>
                    </div>

                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center gap-3 mb-2">
                            <Image className="w-6 h-6 text-red-600" />
                            <h3 className="font-semibold text-gray-700">Sem Imagem</h3>
                        </div>
                        <p className="text-4xl font-bold text-red-600">{stats.sem_imagem}</p>
                        <p className="text-xs text-gray-500 mt-1">imagem_capa vazia</p>
                    </div>

                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center gap-3 mb-2">
                            <FileText className="w-6 h-6 text-blue-600" />
                            <h3 className="font-semibold text-gray-700">Sem Resumo SEO</h3>
                        </div>
                        <p className="text-4xl font-bold text-blue-600">{stats.sem_resumo}</p>
                        <p className="text-xs text-gray-500 mt-1">resumo_seo vazio</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg p-4 mb-6 flex gap-3">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${filter === 'all'
                                ? 'bg-orange-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Todos ({stats.total})
                    </button>
                    <button
                        onClick={() => setFilter('sem_imagem')}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${filter === 'sem_imagem'
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Sem Imagem ({stats.sem_imagem})
                    </button>
                    <button
                        onClick={() => setFilter('sem_resumo')}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${filter === 'sem_resumo'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Sem Resumo ({stats.sem_resumo})
                    </button>
                </div>

                {/* Lista de Notícias Problemáticas */}
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900">
                            Notícias com Problemas ({noticiasFiltered.length})
                        </h2>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                            <p className="text-gray-500">Auditando notícias...</p>
                        </div>
                    ) : noticiasFiltered.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-xl text-green-600 font-semibold mb-2">✅ Tudo certo!</p>
                            <p className="text-gray-500">
                                {filter === 'all'
                                    ? 'Nenhuma notícia com problemas de SEO'
                                    : 'Nenhuma notícia nesta categoria'}
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {noticiasFiltered.map((noticia) => (
                                <div key={noticia.id} className="p-6 hover:bg-gray-50 transition">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start gap-3 mb-2">
                                                <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">
                                                    {noticia.titulo_viral}
                                                </h3>
                                            </div>

                                            {/* Problemas */}
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {noticia.problemas.includes('sem_imagem') && (
                                                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center gap-1">
                                                        <Image className="w-3 h-3" />
                                                        SEM IMAGEM
                                                    </span>
                                                )}
                                                {noticia.problemas.includes('sem_resumo') && (
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex items-center gap-1">
                                                        <FileText className="w-3 h-3" />
                                                        SEM RESUMO SEO
                                                    </span>
                                                )}
                                            </div>

                                            {/* Meta */}
                                            <div className="flex items-center gap-3 text-sm text-gray-500">
                                                <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold">
                                                    {noticia.categoria}
                                                </span>
                                                <span>
                                                    {new Date(noticia.created_at).toLocaleDateString('pt-BR')}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/noticia/${noticia.slug}`}
                                                target="_blank"
                                                className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                                                title="Ver no site"
                                            >
                                                <ExternalLink className="w-5 h-5" />
                                            </Link>
                                            <Link
                                                href={`/admin/dashboard/editor?edit=${noticia.id}`}
                                                className="p-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg transition"
                                                title="Corrigir Agora"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info Box */}
                <div className="mt-8 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h3 className="font-bold text-yellow-900 mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Por que isso importa?
                    </h3>
                    <ul className="text-sm text-yellow-800 space-y-1">
                        <li>• <strong>Sem imagem:</strong> Google penaliza em resultados de pesquisa e não exibe no Discover</li>
                        <li>• <strong>Sem resumo SEO:</strong> Google mostra descrição aleatória, reduzindo CTR</li>
                        <li>• <strong>Recomendação:</strong> Corrija as mais recentes primeiro (rankings melhores)</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
