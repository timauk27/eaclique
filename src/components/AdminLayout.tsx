'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    DollarSign,
    BarChart3,
    Edit,
    AlertTriangle,
    Megaphone,
    Menu,
    X,
    Home,
    FileText,
    Target,
    Users,
    BookOpen,
    List,
    Route,
    CalendarDays
} from 'lucide-react'
import { useState } from 'react'

import LogoutButton from './LogoutButton'

interface AdminLayoutProps {
    children: ReactNode
}

const menuItems = [
    { href: '/admin/dashboard', label: 'Visão Geral', icon: LayoutDashboard },
    { href: '/admin/dashboard/noticias', label: 'Notícias', icon: FileText },
    { href: '/admin/dashboard/calendario', label: 'Calendário', icon: CalendarDays },
    { href: '/admin/dashboard/paginas', label: 'Páginas Fixas', icon: BookOpen },
    { href: '/admin/dashboard/menus', label: 'Menus', icon: List },
    { href: '/admin/dashboard/missoes', label: 'Missões Robô', icon: Target },
    { href: '/admin/dashboard/categorias', label: 'Categorias', icon: FileText },
    { href: '/admin/dashboard/autores', label: 'Autores', icon: Users },
    { href: '/admin/dashboard/editor', label: 'Editor', icon: Edit },
    { href: '/admin/dashboard/afiliados', label: 'Afiliados', icon: DollarSign },
    { href: '/admin/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/admin/dashboard/seo', label: 'SEO Check', icon: AlertTriangle },
    { href: '/admin/dashboard/redirecionamentos', label: 'Redirecionamentos', icon: Route },
    { href: '/admin/dashboard/ads', label: 'Anúncios', icon: Megaphone },
]

export default function AdminLayout({ children }: AdminLayoutProps) {
    const pathname = usePathname()
    const [sidebarOpen, setSidebarOpen] = useState(true)

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-all duration-300 flex flex-col fixed h-screen z-50`}>
                {/* Header */}
                <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                    {sidebarOpen && (
                        <div>
                            <h1 className="text-xl font-bold text-red-500">EA Clique</h1>
                            <p className="text-xs text-gray-400">Admin Dashboard</p>
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-gray-800 rounded transition"
                    >
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4">
                    {menuItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 transition ${isActive
                                    ? 'bg-red-600 text-white border-l-4 border-white'
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                    }`}
                            >
                                <Icon className="w-5 h-5 flex-shrink-0" />
                                {sidebarOpen && (
                                    <span className="font-medium">{item.label}</span>
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-gray-800">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded transition"
                    >
                        <Home className="w-5 h-5" />
                        {sidebarOpen && <span>Ver Site</span>}
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
                {/* Top Bar */}
                <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0  z-40">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                {menuItems.find(item => item.href === pathname)?.label || 'Dashboard'}
                            </h2>
                            <p className="text-sm text-gray-500">
                                Gerencie seu portal de notícias
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm font-semibold text-gray-900">Admin</p>
                                <p className="text-xs text-gray-500">EA Clique</p>
                            </div>
                            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                                A
                            </div>
                            <LogoutButton />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    )
}
