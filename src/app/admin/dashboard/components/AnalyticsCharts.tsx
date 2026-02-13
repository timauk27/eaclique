'use client'

import { useEffect, useState } from 'react'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend
} from 'recharts'
import { supabase } from '@/lib/supabase'

export default function AnalyticsCharts() {
    const [viewsData, setViewsData] = useState<any[]>([])
    const [categoryData, setCategoryData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadData() {
            // Mock data for views (last 7 days)
            // In a real scenario, we would aggregate this from a 'page_views' table
            const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
            const mockViews = days.map(day => ({
                name: day,
                views: Math.floor(Math.random() * 5000) + 1000,
                visitors: Math.floor(Math.random() * 3000) + 500
            }))

            // Fetch actual category distribution
            const { data: news } = await supabase
                .from('noticias')
                .select('categoria')

            const catCounts: Record<string, number> = {}
            news?.forEach((n: any) => {
                const cat = n.categoria || 'Sem Categoria'
                catCounts[cat] = (catCounts[cat] || 0) + 1
            })

            const catData = Object.entries(catCounts)
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 5) // Top 5 categories

            setViewsData(mockViews)
            setCategoryData(catData)
            setLoading(false)
        }

        loadData()
    }, [])

    if (loading) {
        return <div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>
    }

    return (
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Traffic Chart */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Tráfego da Semana</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={viewsData}>
                            <defs>
                                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Area
                                type="monotone"
                                dataKey="views"
                                stroke="#2563eb"
                                fillOpacity={1}
                                fill="url(#colorViews)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Category Distribution */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Notícias por Categoria</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={categoryData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={100} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#4f46e5" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}
