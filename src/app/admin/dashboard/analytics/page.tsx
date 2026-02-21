'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, Eye, Clock, BarChart3, Users, AlertTriangle, ExternalLink, Share2, FileText } from 'lucide-react'
import Link from 'next/link'

interface AnalyticsData {
    activeUsers: number;
    views: number;
    topPages: { title: string, path: string, views: number }[];
    sources: { source: string, users: number }[];
}

export default function AdminAnalyticsPage() {
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
    const [isConfigured, setIsConfigured] = useState<boolean | null>(null)
    const [loading, setLoading] = useState(true)
    const [lastUpdate, setLastUpdate] = useState(new Date())

    const loadAnalyticsData = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/admin/analytics', { cache: 'no-store' })
            const result = await res.json()

            if (result.isConfigured) {
                setIsConfigured(true)
                setAnalyticsData(result.data)
            } else {
                setIsConfigured(false)
            }
        } catch (error) {
            console.error('Erro ao buscar dados do Google Analytics:', error)
            setIsConfigured(false)
        }
        setLoading(false)
        setLastUpdate(new Date())
    }

    useEffect(() => {
        loadAnalyticsData()
        const interval = setInterval(loadAnalyticsData, 5 * 60 * 1000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <BarChart3 className="w-8 h-8 text-blue-600" />
                            <h1 className="text-3xl font-bold text-gray-900">Analytics Oficial (GA4)</h1>
                        </div>
                        <div className="flex items-center gap-4 text-gray-600">
                            <p>Dados reais do Google Analytics</p>
                            <div className="flex items-center gap-2 text-sm bg-white px-3 py-1 rounded-full border border-gray-200">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span>Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}</span>
                            </div>
                        </div>
                    </div>
                    {isConfigured && (
                        <button
                            onClick={loadAnalyticsData}
                            disabled={loading}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition inline-flex items-center justify-center gap-2 shadow-sm"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <BarChart3 className="w-5 h-5" />
                            )}
                            Atualizar Dados
                        </button>
                    )}
                </div>

                {isConfigured === false ? (
                    <div className="bg-red-50 border-l-4 border-red-500 p-8 rounded-r-xl shadow-sm">
                        <div className="flex items-start gap-4">
                            <AlertTriangle className="w-8 h-8 text-red-600 mt-1 flex-shrink-0" />
                            <div>
                                <h2 className="text-xl font-bold text-red-900 mb-2">Google Analytics Não Configurado no Back-end</h2>
                                <p className="text-red-800 mb-4 leading-relaxed">
                                    Para exibir relatórios reais aqui no CMS (como Usuários Ativos e Top Páginas), o painel precisa se comunicar com a API do Google Analytics 4 de forma segura.
                                </p>
                                <div className="bg-white p-6 rounded-lg border border-red-100 mb-4">
                                    <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Como configurar (Requer Conta de Serviço GCP):</h3>
                                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                                        <li>Crie um projeto no <strong>Google Cloud Platform</strong> e ative a <strong>Google Analytics Data API</strong>.</li>
                                        <li>Crie uma Conta de Serviço e baixe a chave primária (JSON).</li>
                                        <li>Vá no seu Google Analytics, e adicione o e-mail dessa conta de serviço como <strong>Visualizador</strong> na Propriedade.</li>
                                        <li>Adicione as seguintes variáveis no seu arquivo <code>.env.local</code> ou painel da Vercel:</li>
                                    </ol>
                                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg mt-4 text-xs overflow-x-auto font-mono">
                                        GA_CLIENT_EMAIL="conta-de-servico@seu-projeto.iam.gserviceaccount.com"<br />
                                        GA_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEv...=\n-----END PRIVATE KEY-----\n"<br />
                                        GA_PROPERTY_ID="123456789" // O ID da propriedade lá no Analytics
                                    </pre>
                                </div>
                                <p className="text-sm text-red-700 italic">
                                    *Seu código de tag GTM (<code>GTM-PQ59T8BN</code>) e de Analytics (<code>G-ETDNPWYZ6L</code>) já estão funcionado e instalados nas páginas para usuários verem, mas faltam credenciais do back-end para puxar dados para este painel.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : loading && !analyticsData ? (
                    <div className="p-20 text-center flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-gray-500 text-lg font-medium">Conectando aos servidores do Google Analytics...</p>
                    </div>
                ) : analyticsData && (
                    <>
                        {/* Stats Cards */}
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-[100px] -z-0 transition-transform group-hover:scale-110"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-3 bg-green-100 rounded-lg text-green-700">
                                            <Users className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-500 text-sm uppercase tracking-wide">Usuários Web Ativos</h3>
                                            <p className="text-xs text-gray-400">Tempo Real (Últimos 30 min)</p>
                                        </div>
                                    </div>
                                    <p className="text-5xl font-black text-gray-900 flex items-baseline gap-2">
                                        {analyticsData.activeUsers.toLocaleString('pt-BR')}
                                        <span className="text-base font-medium text-gray-500">pessoas no site</span>
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[100px] -z-0 transition-transform group-hover:scale-110"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-3 bg-blue-100 rounded-lg text-blue-700">
                                            <Eye className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-500 text-sm uppercase tracking-wide">Total de Visualizações</h3>
                                            <p className="text-xs text-gray-400">Consolidado (Últimos 7 dias)</p>
                                        </div>
                                    </div>
                                    <p className="text-5xl font-black text-gray-900 flex items-baseline gap-2">
                                        {analyticsData.views.toLocaleString('pt-BR')}
                                        <span className="text-base font-medium text-gray-500">views</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Top Pages Table */}
                            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-gray-500" />
                                    <h2 className="text-lg font-bold text-gray-900">
                                        Páginas Mais Acessadas (7 dias)
                                    </h2>
                                </div>

                                <div className="divide-y divide-gray-100 flex-1">
                                    {analyticsData.topPages.length > 0 ? analyticsData.topPages.map((page, i) => (
                                        <div key={i} className="flex items-center p-4 hover:bg-gray-50 transition">
                                            <div className="w-8 text-center font-bold text-gray-400 mr-4">#{i + 1}</div>
                                            <div className="flex-1 min-w-0 pr-4">
                                                <h3 className="text-sm font-semibold text-gray-900 truncate mb-1">
                                                    {page.title.split(' - ')[0]}
                                                </h3>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-gray-500 font-mono truncate max-w-[200px]">{page.path}</span>
                                                    <Link href={page.path} target="_blank" className="text-gray-400 hover:text-blue-600">
                                                        <ExternalLink className="w-3 h-3" />
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-gray-900">{page.views.toLocaleString('pt-BR')}</div>
                                                <div className="text-xs text-gray-500">views</div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="p-8 text-center text-gray-500">Sem dados suficientes no período.</div>
                                    )}
                                </div>
                            </div>

                            {/* Traffic Sources */}
                            <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
                                    <Share2 className="w-5 h-5 text-gray-500" />
                                    <h2 className="text-lg font-bold text-gray-900">
                                        Fontes de Tráfego (7 dias)
                                    </h2>
                                </div>

                                <div className="p-4 flex-1">
                                    {analyticsData.sources.length > 0 ? (
                                        <div className="space-y-4">
                                            {analyticsData.sources.map((source, i) => {
                                                const totalSrcUsers = analyticsData.sources.reduce((a, b) => a + b.users, 0);
                                                const percentage = ((source.users / totalSrcUsers) * 100).toFixed(1);

                                                return (
                                                    <div key={i}>
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="text-sm font-semibold text-gray-700 capitalize">
                                                                {source.source === '(direct)' ? 'Tráfego Direto'
                                                                    : source.source === 'organic' ? 'Busca Orgânica (Google)'
                                                                        : source.source === 'referral' ? 'Indicação'
                                                                            : source.source}
                                                            </span>
                                                            <span className="text-sm font-bold text-gray-900">
                                                                {percentage}%
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                                            <div
                                                                className="bg-blue-600 h-2 rounded-full"
                                                                style={{ width: `${percentage}%` }}
                                                            ></div>
                                                        </div>
                                                        <p className="text-right text-xs text-gray-500 mt-1">{source.users.toLocaleString('pt-BR')} usuários</p>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    ) : (
                                        <div className="py-12 text-center text-gray-500">Sem dados de fontes de tráfego.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
