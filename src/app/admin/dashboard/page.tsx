'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { TrendingUp, FileText, Image, DollarSign, Megaphone, Eye } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboardHome() {
    const [stats, setStats] = useState({
        totalNoticias: 0,
        noticiasHoje: 0,
        noticiasProblematicas: 0,
        viewsHoje: 0,
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadStats() {
            const hoje = new Date()
            hoje.setHours(0, 0, 0, 0)

            // Total de notícias
            const { count: total } = await supabase
                .from('Noticias')
                .select('*', { count: 'exact', head: true })

            // Notícias de hoje
            const { count: hoje_count } = await supabase
                .from('Noticias')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', hoje.toISOString())

            // Notícias sem imagem ou resumo
            const { data: problematicas } = await supabase
                .from('Noticias')
                .select('id')
                .or('imagem_capa.is.null,resumo_seo.is.null')

            // Views hoje
            const { data: viewsData } = await supabase
                .from('Noticias')
                .select('views_fake')
                .gte('created_at', hoje.toISOString())

            const totalViews = viewsData?.reduce((sum, n) => sum + (n.views_fake || 0), 0) || 0

            setStats({
                totalNoticias: total || 0,
                noticiasHoje: hoje_count || 0,
                noticiasProblematicas: problematicas?.length || 0,
                viewsHoje: totalViews,
            })
            setLoading(false)
        }

        loadStats()
    }, [])

    const quickActions = [
        {
            href: '/admin/dashboard/editor',
            label: 'Criar Notícia',
            icon: FileText,
            color: 'bg-blue-600 hover:bg-blue-700'
        },
        {
            href: '/admin/dashboard/afiliados',
            label: 'Gerenciar Afiliados',
            icon: DollarSign,
            color: 'bg-green-600 hover:bg-green-700'
        },
        {
            href: '/admin/dashboard/ads',
            label: 'Configurar Ads',
            icon: Megaphone,
            color: 'bg-purple-600 hover:bg-purple-700'
        },
        {
            href: '/admin/dashboard/seo',
            label: 'Verificar SEO',
            icon: Image,
            color: 'bg-orange-600 hover:bg-orange-700'
        },
    ]

    return (
        <div>
            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo ao Painel de Controle</h1>
                <p className="text-gray-600">
                    Gerencie todas as funcionalidades do EA Clique em um só lugar
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-gray-700">Total Notícias</h3>
                    </div>
                    {loading ? (
                        <div className="animate-pulse h-8 bg-gray-200 rounded"></div>
                    ) : (
                        <p className="text-3xl font-bold text-gray-900">{stats.totalNoticias}</p>
                    )}
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="font-semibold text-gray-700">Hoje</h3>
                    </div>
                    {loading ? (
                        <div className="animate-pulse h-8 bg-gray-200 rounded"></div>
                    ) : (
                        <p className="text-3xl font-bold text-gray-900">{stats.noticiasHoje}</p>
                    )}
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <Eye className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="font-semibold text-gray-700">Views Hoje</h3>
                    </div>
                    {loading ? (
                        <div className="animate-pulse h-8 bg-gray-200 rounded"></div>
                    ) : (
                        <p className="text-3xl font-bold text-gray-900">{stats.viewsHoje.toLocaleString('pt-BR')}</p>
                    )}
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-orange-100 rounded-lg">
                            <Image className="w-6 h-6 text-orange-600" />
                        </div>
                        <h3 className="font-semibold text-gray-700">Issues SEO</h3>
                    </div>
                    {loading ? (
                        <div className="animate-pulse h-8 bg-gray-200 rounded"></div>
                    ) : (
                        <p className="text-3xl font-bold text-gray-900">{stats.noticiasProblematicas}</p>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Ações Rápidas</h2>
                <div className="grid md:grid-cols-4 gap-4">
                    {quickActions.map((action) => {
                        const Icon = action.icon
                        return (
                            <Link
                                key={action.href}
                                href={action.href}
                                className={`${action.color} text-white rounded-lg p-6 transition shadow-sm hover:shadow-md`}
                            >
                                <Icon className="w-8 h-8 mb-3" />
                                <p className="font-semibold">{action.label}</p>
                            </Link>
                        )
                    })}
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-6 border border-blue-200">
                    <h3 className="font-bold text-gray-900 mb-3">📊 Analytics</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Veja as notícias mais lidas e acompanhe o desempenho em tempo real
                    </p>
                    <Link
                        href="/admin/dashboard/analytics"
                        className="text-blue-600 hover:underline font-semibold text-sm"
                    >
                        Ver Analytics →
                    </Link>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-white rounded-lg p-6 border border-green-200">
                    <h3 className="font-bold text-gray-900 mb-3">💰 Afiliados</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Gerencie tags de Amazon, Shopee e outras redes sem editar código
                    </p>
                    <Link
                        href="/admin/dashboard/afiliados"
                        className="text-green-600 hover:underline font-semibold text-sm"
                    >
                        Gerenciar Tags →
                    </Link>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-white rounded-lg p-6 border border-orange-200">
                    <h3 className="font-bold text-gray-900 mb-3">🔍 SEO Check</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        {stats.noticiasProblematicas} notícias com problemas de SEO precisam de atenção
                    </p>
                    <Link
                        href="/admin/dashboard/seo"
                        className="text-orange-600 hover:underline font-semibold text-sm"
                    >
                        Corrigir Agora →
                    </Link>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg p-6 border border-purple-200">
                    <h3 className="font-bold text-gray-900 mb-3">📢 Anúncios</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Configure AdSense, Adsterra e outros scripts de anúncios
                    </p>
                    <Link
                        href="/admin/dashboard/ads"
                        className="text-purple-600 hover:underline font-semibold text-sm"
                    >
                        Configurar Ads →
                    </Link>
                </div>
            </div>
        </div>
    )
}
