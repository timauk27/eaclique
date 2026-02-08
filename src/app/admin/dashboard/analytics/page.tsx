'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { TrendingUp, Eye, Clock, BarChart3 } from 'lucide-react'

interface TopNoticia {
    id: number
    titulo_viral: string
    categoria: string
    views_fake: number
    created_at: string
    slug: string
}

export default function AdminAnalyticsPage() {
    const [topNoticias, setTopNoticias] = useState<TopNoticia[]>([])
    const [loading, setLoading] = useState(true)
    const [lastUpdate, setLastUpdate] = useState(new Date())

    const loadTopNoticias = async () => {
        setLoading(true)

        // Top 5 notícias das últimas 24h ordenadas por views
        const oneDayAgo = new Date()
        oneDayAgo.setHours(oneDayAgo.getHours() - 24)

        const { data, error } = await supabase
            .from('Noticias')
            .select('id, titulo_viral, categoria, views_fake, created_at, slug')
            .gte('created_at', oneDayAgo.toISOString())
            .order('views_fake', { ascending: false })
            .limit(5)

        if (!error && data) {
            setTopNoticias(data)
        }

        setLoading(false)
        setLastUpdate(new Date())
    }

    useEffect(() => {
        loadTopNoticias()

        // Atualiza a cada 5 minutos
        const interval = setInterval(loadTopNoticias, 5 * 60 * 1000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <BarChart3 className="w-8 h-8 text-blue-600" />
                        <h1 className="text-3xl font-bold text-gray-900">Analytics Real-Time</h1>
                    </div>
                    <div className="flex items-center gap-4 text-gray-600">
                        <p>Notícias mais lidas nas últimas 24 horas</p>
                        <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4" />
                            <span>Atualizado {lastUpdate.toLocaleTimeString('pt-BR')}</span>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center gap-3 mb-2">
                            <Eye className="w-6 h-6 text-blue-600" />
                            <h3 className="font-semibold text-gray-700">Views Totais (24h)</h3>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">
                            {topNoticias.reduce((sum, n) => sum + n.views_fake, 0).toLocaleString('pt-BR')}
                        </p>
                    </div>

                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center gap-3 mb-2">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                            <h3 className="font-semibold text-gray-700">Top Post</h3>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">
                            {topNoticias[0]?.views_fake.toLocaleString('pt-BR') || '0'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">views</p>
                    </div>

                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center gap-3 mb-2">
                            <BarChart3 className="w-6 h-6 text-purple-600" />
                            <h3 className="font-semibold text-gray-700">Categoria Destaque</h3>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            {topNoticias[0]?.categoria || 'N/A'}
                        </p>
                    </div>
                </div>

                {/* Top 5 Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            🔥 Top 5 Notícias Mais Lidas
                        </h2>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-500">Carregando dados...</p>
                        </div>
                    ) : topNoticias.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-gray-500 text-lg">Nenhuma notícia nas últimas 24h</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {topNoticias.map((noticia, index) => (
                                <div key={noticia.id} className="p-6 hover:bg-gray-50 transition">
                                    <div className="flex items-start gap-4">
                                        {/* Ranking Badge */}
                                        <div
                                            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${index === 0
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : index === 1
                                                        ? 'bg-gray-100 text-gray-700'
                                                        : index === 2
                                                            ? 'bg-orange-100 text-orange-700'
                                                            : 'bg-blue-50 text-blue-600'
                                                }`}
                                        >
                                            {index + 1}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            {/* Title */}
                                            <a
                                                href={`/noticia/${noticia.slug}`}
                                                target="_blank"
                                                className="font-semibold text-gray-900 hover:text-blue-600 transition line-clamp-2 mb-2 block"
                                            >
                                                {noticia.titulo_viral}
                                            </a>

                                            {/* Meta */}
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold">
                                                    {noticia.categoria}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(noticia.created_at).toLocaleString('pt-BR', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Views */}
                                        <div className="flex-shrink-0 text-right">
                                            <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">
                                                <Eye className="w-5 h-5" />
                                                {noticia.views_fake.toLocaleString('pt-BR')}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">visualizações</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Refresh Button */}
                <div className="mt-6 text-center">
                    <button
                        onClick={loadTopNoticias}
                        disabled={loading}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition inline-flex items-center gap-2"
                    >
                        <BarChart3 className="w-5 h-5" />
                        {loading ? 'Atualizando...' : 'Atualizar Agora'}
                    </button>
                </div>

                {/* Info Box */}
                <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-bold text-blue-900 mb-2">💡 Em Breve</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Gráfico de views por hora</li>
                        <li>• Origem do tráfego (Google vs WhatsApp)</li>
                        <li>• CTR dos anúncios</li>
                        <li>• Comparação com dias anteriores</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
