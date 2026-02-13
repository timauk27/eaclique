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
            // Fetch actual status distribution
            const { data: news } = await supabase
                .from('noticias')
                .select('categoria, status')

            // Status Counts
            const statusCounts: Record<string, number> = {}
            news?.forEach((n: any) => {
                const s = n.status || 'rascunho'
                statusCounts[s] = (statusCounts[s] || 0) + 1
            })

            const statusChartData = Object.entries(statusCounts)
                .map(([name, count]) => ({
                    name: name.charAt(0).toUpperCase() + name.slice(1),
                    count
                }))
                .sort((a, b) => b.count - a.count)

            // Category Counts
            const catCounts: Record<string, number> = {}
            news?.forEach((n: any) => {
                const cat = n.categoria || 'Sem Categoria'
                catCounts[cat] = (catCounts[cat] || 0) + 1
            })

            const catData = Object.entries(catCounts)
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 5) // Top 5 categories

            setViewsData(statusChartData)
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
                <h3 className="text-lg font-bold text-gray-900 mb-4">Notícias por Status</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={viewsData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} name="Quantidade" />
                        </BarChart>
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
