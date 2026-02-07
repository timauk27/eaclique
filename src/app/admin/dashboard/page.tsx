'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Eye, MousePointerClick, TrendingUp, Users, FileText, DollarSign, Activity } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    const [stats, setStats] = useState({
        pageviews: 0,
        visitors: 0,
        clicks: 0,
        avgTime: '0:00',
        revenue: 0,
        articles: 0
    });

    // Simulate dashboard data (in production, this would fetch from GA4 API)
    useEffect(() => {
        // Simulated stats
        setStats({
            pageviews: 12547,
            visitors: 8932,
            clicks: 1234,
            avgTime: '2:34',
            revenue: 47.82,
            articles: 359
        });
    }, []);

    const statCards = [
        { title: 'Visualizações', value: stats.pageviews.toLocaleString(), icon: Eye, color: 'bg-blue-500', change: '+12.5%' },
        { title: 'Visitantes', value: stats.visitors.toLocaleString(), icon: Users, color: 'bg-green-500', change: '+8.2%' },
        { title: 'Cliques em Ads', value: stats.clicks.toLocaleString(), icon: MousePointerClick, color: 'bg-purple-500', change: '+15.3%' },
        { title: 'Tempo Médio', value: stats.avgTime, icon: Activity, color: 'bg-orange-500', change: '+5.1%' },
        { title: 'Receita (mês)', value: `$${stats.revenue.toFixed(2)}`, icon: DollarSign, color: 'bg-emerald-500', change: '+23.7%' },
        { title: 'Artigos Publicados', value: stats.articles.toString(), icon: FileText, color: 'bg-pink-500', change: '+4' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                <BarChart3 className="h-8 w-8 text-blue-600" />
                                Dashboard Analytics
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">
                                Portal EAClique - Visão Geral
                            </p>
                        </div>
                        <Link
                            href="/"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Voltar ao Site
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {statCards.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`${stat.color} p-3 rounded-lg`}>
                                            <Icon className="h-6 w-6 text-white" />
                                        </div>
                                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                                            {stat.change}
                                        </span>
                                    </div>
                                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">
                                        {stat.title}
                                    </h3>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {stat.value}
                                    </p>
                                </div>
                                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 px-6 py-2">
                                    <p className="text-xs text-gray-600 dark:text-gray-300">
                                        Últimos 30 dias
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Traffic Chart Placeholder */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-blue-600" />
                            Tráfego (7 dias)
                        </h3>
                        <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-lg">
                            <div className="text-center">
                                <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500 dark:text-gray-400">
                                    Gráfico de tráfego em tempo real
                                </p>
                                <p className="text-sm text-gray-400 mt-1">
                                    Integração com Google Analytics 4
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Revenue Chart Placeholder */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-green-600" />
                            Receita de Anúncios
                        </h3>
                        <div className="h-64 flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 rounded-lg">
                            <div className="text-center">
                                <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500 dark:text-gray-400">
                                    Desempenho de monetização
                                </p>
                                <p className="text-sm text-gray-400 mt-1">
                                    Adsterra + PropellerAds + Google Ads
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        Links Rápidos
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <a
                            href="https://analytics.google.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg hover:shadow-lg transition-all text-center"
                        >
                            <p className="font-semibold text-blue-900 dark:text-blue-100">Google Analytics</p>
                        </a>
                        <a
                            href="https://search.google.com/search-console"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg hover:shadow-lg transition-all text-center"
                        >
                            <p className="font-semibold text-green-900 dark:text-green-100">Search Console</p>
                        </a>
                        <a
                            href="https://publishers.adsterra.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-lg hover:shadow-lg transition-all text-center"
                        >
                            <p className="font-semibold text-purple-900 dark:text-purple-100">Adsterra</p>
                        </a>
                        <Link
                            href="/admin/dashboard/ads"
                            className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-yellow-800 rounded-lg hover:shadow-lg transition-all text-center"
                        >
                            <p className="font-semibold text-yellow-900 dark:text-yellow-100">📢 Gerenciar Ads</p>
                        </Link>
                    </div>
                </div>

                {/* Info Box */}
                <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                    <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2">
                        📊 Sobre este Dashboard
                    </h4>
                    <p className="text-blue-800 dark:text-blue-200 text-sm">
                        Este é um dashboard simplificado para monitoramento rápido. Os dados são simulados para demonstração.
                        Para métricas em tempo real, acesse o Google Analytics 4 através do link acima.
                    </p>
                    <p className="text-blue-700 dark:text-blue-300 text-xs mt-2">
                        <strong>Em produção:</strong> Integre a API do Google Analytics 4 para dados reais em tempo real.
                    </p>
                </div>
            </div>
        </div>
    );
}
