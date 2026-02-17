'use client'

import { FileText, Image, DollarSign, Megaphone, CheckCircle, Users, Settings, Target } from 'lucide-react'
import Link from 'next/link'
import AnalyticsCharts from './components/AnalyticsCharts'
import ActivityStream from './components/ActivityStream'
import SystemHealth from './components/SystemHealth'

export default function AdminDashboardHome() {
    const quickActions = [
        {
            href: '/admin/dashboard/noticias',
            label: 'Moderar News',
            icon: CheckCircle,
            color: 'bg-indigo-600 hover:bg-indigo-700'
        },
        {
            href: '/admin/dashboard/missoes',
            label: 'Missões Robô',
            icon: Target,
            color: 'bg-pink-600 hover:bg-pink-700'
        },
        {
            href: '/admin/dashboard/editor',
            label: 'Criar Notícia',
            icon: FileText,
            color: 'bg-blue-600 hover:bg-blue-700'
        },
        {
            href: '/admin/dashboard/categorias',
            label: 'Categorias',
            icon: Users, // Using Users as a placeholder for Categories if FileText is used
            color: 'bg-teal-600 hover:bg-teal-700'
        },
        {
            href: '/admin/dashboard/afiliados',
            label: 'Afiliados',
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
            label: 'SEO Check',
            icon: Image,
            color: 'bg-orange-600 hover:bg-orange-700'
        },
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Painel de Controle</h1>
                <p className="text-gray-500">Visão geral do sistema e performance</p>
            </div>

            {/* Analytics Section */}
            <AnalyticsCharts />

            {/* Middle Section: Activity & Health */}
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <ActivityStream />
                </div>
                <div className="lg:col-span-1">
                    <SystemHealth />

                    {/* Mini Quick Links for things not in the main grid */}
                    <div className="mt-6 bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                        <h3 className="font-bold text-gray-900 mb-3 border-b pb-2">Atalhos</h3>
                        <nav className="space-y-2">
                            <Link href="/admin/profile" className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 p-2 hover:bg-gray-50 rounded">
                                <Users className="w-4 h-4" /> Gerenciar Usuários
                            </Link>
                            <Link href="/admin/settings" className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 p-2 hover:bg-gray-50 rounded">
                                <Settings className="w-4 h-4" /> Configurações Gerais
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Quick Actions Grid */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Acesso Rápido</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {quickActions.map((action) => {
                        const Icon = action.icon
                        return (
                            <Link
                                key={action.href}
                                href={action.href}
                                className={`${action.color} text-white rounded-lg p-4 transition shadow-sm hover:shadow-md flex flex-col items-center justify-center text-center h-32`}
                            >
                                <Icon className="w-8 h-8 mb-2" />
                                <span className="font-semibold text-sm">{action.label}</span>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

