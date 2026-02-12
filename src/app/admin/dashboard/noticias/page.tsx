'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
    CheckCircle,
    XCircle,
    AlertTriangle,
    Edit,
    ExternalLink,
    ShoppingBag,
    Image as ImageIcon,
    Filter,
    Search,
    Eye,
    Globe,
    Clock
} from 'lucide-react'
import Link from 'next/link'

// Tipos baseados no Schema do Robo v33
type NewsItem = {
    id: string
    titulo_viral: string
    categoria: string | null
    imagem_capa: string | null
    status: 'revisao_humana' | 'aguardando_midia' | 'pronto_para_postar' | 'publicado' | 'rejeitado'
    produto_nome: string | null
    copy_venda: string | null
    created_at: string
    slug: string
    views_fake: number
    fonte_original: string | null
}

export default function ModerationPage() {
    const [news, setNews] = useState<NewsItem[]>([])
    const [loading, setLoading] = useState(true)
    const [filterStatus, setFilterStatus] = useState<string>('all') // Default to ALL to debug
    const [search, setSearch] = useState('')

    useEffect(() => {
        fetchNews()
    }, [filterStatus])

    async function fetchNews() {
        setLoading(true)
        console.log("Fetching news with status:", filterStatus)

        let query = supabase
            .from('noticias')
            .select('id, titulo_viral, categoria, imagem_capa, status, produto_nome, copy_venda, created_at, slug, views_fake, fonte_original')
            .order('created_at', { ascending: false })
            .limit(100)

        if (filterStatus !== 'all') {
            query = query.eq('status', filterStatus)
        }

        const { data, error } = await query

        if (error) {
            console.error("Supabase Error:", error)
            alert(`Erro ao carregar notícias: ${error.message}`)
        }

        if (data) {
            console.log("Notícias carregadas:", data.length)
            setNews(data as NewsItem[])
        }
        setLoading(false)
    }

    async function handleAction(id: string, action: 'approve' | 'reject' | 'publish') {
        let newStatus = ''
        if (action === 'approve') newStatus = 'aguardando_midia' // Manda para a Fábrica de Mídia
        if (action === 'publish') newStatus = 'publicado' // Bypass direto (se já tiver mídia)
        if (action === 'reject') newStatus = 'rejeitado' // Soft delete

        const { error } = await supabase
            .from('noticias')
            .update({ status: newStatus })
            .eq('id', id)

        if (!error) {
            // Remove da lista local para UX rápida
            setNews(news.filter(n => n.id !== id))
        } else {
            alert('Erro ao atualizar status')
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'revisao_humana': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            case 'aguardando_midia': return 'bg-blue-100 text-blue-800 border-blue-200'
            case 'pronto_para_postar': return 'bg-green-100 text-green-800 border-green-200'
            case 'publicado': return 'bg-gray-100 text-gray-800 border-gray-200'
            case 'rejeitado': return 'bg-red-50 text-red-800 border-red-200'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getCategoryBadge = (cat: string | null) => {
        if (!cat) return 'bg-gray-100 text-gray-800' // Default for null

        const colors: Record<string, string> = {
            'BRASIL': 'bg-green-100 text-green-800',
            'MUNDO': 'bg-blue-100 text-blue-800',
            'TECH': 'bg-purple-100 text-purple-800',
            'ENTRETENIMENTO': 'bg-pink-100 text-pink-800',
            'CELEBRIDADES': 'bg-pink-100 text-pink-800',
            'MODA': 'bg-indigo-100 text-indigo-800',
            'BELEZA': 'bg-rose-100 text-rose-800',
            'LIFESTYLE': 'bg-orange-100 text-orange-800',
            'ECONOMIA': 'bg-yellow-100 text-yellow-800',
            'CRIME': 'bg-red-900 text-white',
            'DEFAULT': 'bg-gray-100 text-gray-800'
        }
        return colors[cat.toUpperCase()] || colors['DEFAULT']
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Moderação de Notícias</h1>
                        <p className="text-gray-500">Gerencie o fluxo de ingestão do Robô v33</p>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <button
                            onClick={fetchNews}
                            className="bg-white p-2 rounded-lg border hover:bg-gray-50 text-gray-600"
                            title="Atualizar"
                        >
                            <Clock className="w-5 h-5" />
                        </button>
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar título..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Status Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
                    {[
                        { id: 'revisao_humana', label: 'Revisão Humana' },
                        { id: 'aguardando_midia', label: 'Aguardando Mídia' },
                        { id: 'publicado', label: 'Publicados' },
                        { id: 'rejeitado', label: 'Rejeitados' },
                        { id: 'all', label: 'Todas' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setFilterStatus(tab.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all whitespace-nowrap ${filterStatus === tab.id
                                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-500">Carregando feed do robô...</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {news.filter(n => n.titulo_viral.toLowerCase().includes(search.toLowerCase())).length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300 shadow-sm">
                                <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3" />
                                <h3 className="text-lg font-medium text-gray-900">Tudo limpo por aqui!</h3>
                                <p className="text-gray-500">Nenhuma notícia com status "{filterStatus}" encontrada.</p>
                            </div>
                        ) : (
                            news
                                .filter(n => n.titulo_viral.toLowerCase().includes(search.toLowerCase()))
                                .map(item => (
                                    <div key={item.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 group">

                                        {/* Image Preview */}
                                        <div className="w-full md:w-64 h-40 bg-gray-100 rounded-lg overflow-hidden relative shrink-0">
                                            {item.imagem_capa ? (
                                                <img src={item.imagem_capa} alt="Capa" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                                                    <ImageIcon className="h-8 w-8 mb-2" />
                                                    <span className="text-xs">Sem Imagem</span>
                                                </div>
                                            )}
                                            <div className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase shadow-sm ${getCategoryBadge(item.categoria)}`}>
                                                {item.categoria}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4">
                                                <Link href={`/noticia/${item.slug}`} target="_blank" className="hover:underline">
                                                    <h3 className="text-xl font-bold text-gray-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors">
                                                        {item.titulo_viral}
                                                    </h3>
                                                </Link>
                                            </div>

                                            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                                                <div className="flex items-center gap-1" title="Views Fictícios (Prova Social)">
                                                    <Eye className="w-4 h-4" />
                                                    <span className="font-medium text-gray-800">{item.views_fake?.toLocaleString() || 0}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{new Date(item.created_at).toLocaleString('pt-BR')}</span>
                                                </div>
                                                {item.fonte_original && (
                                                    <a href={item.fonte_original} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                                                        <Globe className="w-4 h-4" />
                                                        <span className="truncate max-w-[150px]">Fonte Original</span>
                                                    </a>
                                                )}
                                            </div>

                                            {/* Monetization Check */}
                                            <div className="flex flex-wrap items-center gap-3">
                                                {item.produto_nome ? (
                                                    <span className="flex items-center text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100 text-xs font-semibold">
                                                        <ShoppingBag className="w-3 h-3 mr-1.5" />
                                                        PRODUTO: {item.produto_nome.slice(0, 40)}...
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center text-orange-700 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100 animate-pulse text-xs font-semibold">
                                                        <AlertTriangle className="w-3 h-3 mr-1.5" />
                                                        SEM PRODUTO (PERDA DE RECEITA)
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 shrink-0 min-w-[160px]">
                                            {item.status === 'revisao_humana' && (
                                                <>
                                                    <button
                                                        onClick={() => handleAction(item.id, 'approve')}
                                                        className="flex items-center justify-center w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
                                                    >
                                                        <CheckCircle className="w-4 h-4 mr-2" />
                                                        APROVAR
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(item.id, 'reject')}
                                                        className="flex items-center justify-center w-full px-4 py-2.5 bg-white border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-gray-600 text-sm font-bold rounded-lg transition-colors"
                                                    >
                                                        <XCircle className="w-4 h-4 mr-2" />
                                                        REJEITAR
                                                    </button>
                                                </>
                                            )}

                                            {item.status === 'aguardando_midia' && (
                                                <div className="text-center w-full">
                                                    <div className="inline-flex items-center justify-center px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full mb-2 w-full">
                                                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse mr-2"></div>
                                                        Gerando Mídia...
                                                    </div>
                                                    <button
                                                        onClick={() => handleAction(item.id, 'publish')}
                                                        className="text-xs text-blue-600 hover:underline block mx-auto mt-2"
                                                    >
                                                        Forçar Publicação
                                                    </button>
                                                </div>
                                            )}

                                            {item.status === 'publicado' && (
                                                <div className="flex items-center justify-center w-full px-4 py-2 bg-green-50 text-green-700 text-sm font-bold rounded-lg border border-green-100">
                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                    NO AR
                                                </div>
                                            )}

                                            <Link
                                                href={`/admin/dashboard/editor?id=${item.id}`}
                                                className="flex items-center justify-center w-full px-4 py-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors mt-auto"
                                            >
                                                <Edit className="w-3 h-3 mr-2" />
                                                Editar no Editor
                                            </Link>
                                        </div>
                                    </div>
                                ))
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
