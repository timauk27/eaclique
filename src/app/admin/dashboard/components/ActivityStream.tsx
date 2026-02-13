'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { FileText, Edit, Trash, PlusCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function ActivityStream() {
    const [activities, setActivities] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadActivities() {
            // Since we don't have a dedicated activity log table yet,
            // we'll fetch the latest created/updated news and format them as activities.

            const { data: news } = await supabase
                .from('noticias')
                .select('id, titulo_viral, created_at, categoria')
                .order('created_at', { ascending: false })
                .limit(10)

            const formattedActivities = news?.map((item: any) => ({
                id: item.id,
                type: 'create',
                user: 'Redação', // Placeholder until we have user profiles
                action: 'criou a notícia',
                target: item.titulo_viral,
                timestamp: item.created_at,
                icon: PlusCircle,
                color: 'text-green-600 bg-green-100'
            })) || []

            setActivities(formattedActivities)
            setLoading(false)
        }

        loadActivities()
    }, [])

    if (loading) return <div className="bg-white p-6 rounded-lg border h-96 animate-pulse"></div>

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm h-full">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-900">Atividade Recente</h3>
                <span className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">Ver tudo</span>
            </div>
            <div className="p-0">
                <ul className="divide-y divide-gray-100">
                    {activities.map((activity) => {
                        const Icon = activity.icon
                        return (
                            <li key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex gap-3">
                                    <div className={`mt-1 p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 ${activity.color}`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900">
                                            {activity.user}
                                        </p>
                                        <p className="text-sm text-gray-500 truncate">
                                            {activity.action} <span className="text-gray-900 font-medium">"{activity.target}"</span>
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true, locale: ptBR })}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}
