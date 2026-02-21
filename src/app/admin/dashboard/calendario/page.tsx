'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, CheckCircle2, FileText, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface Noticia {
    id: string
    titulo_viral: string
    status: string
    agendado_para: string | null
    created_at: string
    categoria: string
}

export default function EditorialCalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [noticias, setNoticias] = useState<Noticia[]>([])
    const [loading, setLoading] = useState(true)

    // Calendar generation logic
    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay()

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))
    const goToToday = () => setCurrentDate(new Date())

    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ]
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

    const loadNoticias = async () => {
        setLoading(true)
        // Fetch news for the current month and the next few days to cover overlaps
        const startOfMonth = new Date(year, month, 1).toISOString()
        const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59).toISOString()

        // We check either agendado_para OR created_at depending on the status
        const { data, error } = await supabase
            .from('noticias')
            .select('id, titulo_viral, status, agendado_para, created_at, categoria')
            .or(`agendado_para.gte.${startOfMonth},and(status.eq.publicado,created_at.gte.${startOfMonth})`)
            .order('agendado_para', { ascending: true })

        if (!error && data) {
            setNoticias(data)
        }
        setLoading(false)
    }

    useEffect(() => {
        loadNoticias()
    }, [currentDate])

    // Get news for a specific day
    const getNewsForDay = (day: number) => {
        return noticias.filter(n => {
            const dateStr = n.status === 'agendado' && n.agendado_para ? n.agendado_para : n.created_at
            if (!dateStr) return false
            const date = new Date(dateStr)
            return date.getDate() === day && date.getMonth() === month && date.getFullYear() === year
        })
    }

    // Render the calendar grid
    const renderCalendar = () => {
        const days = []
        let currentDay = 1

        // Pad the beginning of the month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="bg-gray-50 border border-gray-100 min-h-[120px]"></div>)
        }

        // Fill in the days
        for (let i = 1; i <= daysInMonth; i++) {
            const dayNews = getNewsForDay(i)
            const isToday = new Date().getDate() === i && new Date().getMonth() === month && new Date().getFullYear() === year

            days.push(
                <div key={i} className={`bg-white border border-gray-200 min-h-[120px] p-2 flex flex-col transition-all hover:shadow-md ${isToday ? 'bg-blue-50/30 ring-2 ring-blue-500 ring-inset' : ''}`}>
                    <div className="flex justify-between items-start mb-2">
                        <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white' : 'text-gray-700'}`}>
                            {i}
                        </span>
                        {dayNews.length > 0 && (
                            <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                {dayNews.length}
                            </span>
                        )}
                    </div>

                    <div className="flex-1 space-y-1.5 overflow-y-auto custom-scrollbar pr-1 max-h-[100px]">
                        {dayNews.map(news => {
                            const isPublished = news.status === 'publicado'
                            const isScheduled = news.status === 'agendado'

                            return (
                                <Link
                                    href={`/admin/dashboard/editor?id=${news.id}`}
                                    key={news.id}
                                    title={news.titulo_viral}
                                    className={`block text-xs p-1.5 border-l-2 rounded-r bg-gray-50 hover:bg-gray-100 truncate transition-colors cursor-pointer
                                        ${isPublished ? 'border-green-500' : isScheduled ? 'border-blue-500' : 'border-yellow-500'}`}
                                >
                                    <div className="flex items-center gap-1.5">
                                        {isPublished ? (
                                            <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0" />
                                        ) : isScheduled ? (
                                            <Clock className="w-3 h-3 text-blue-600 flex-shrink-0" />
                                        ) : (
                                            <AlertCircle className="w-3 h-3 text-yellow-600 flex-shrink-0" />
                                        )}
                                        <span className="truncate flex-1 font-medium text-gray-700">{news.titulo_viral}</span>
                                    </div>
                                    <div className="text-[10px] text-gray-500 mt-0.5 ml-4">
                                        {news.categoria}
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            )
        }

        // Pad the end of the month to complete the grid (optional, but looks cleaner)
        const totalSlots = days.length
        const remainingSlots = (Math.ceil(totalSlots / 7) * 7) - totalSlots
        for (let i = 0; i < remainingSlots; i++) {
            days.push(<div key={`empty-end-${i}`} className="bg-gray-50 border border-gray-100 min-h-[120px]"></div>)
        }

        return days
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                            <CalendarIcon className="w-8 h-8 text-blue-600" />
                            Calendário Editorial
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Acompanhe o fluxo de publicações do robô e da equipe.
                        </p>
                    </div>

                    <div className="flex items-center gap-6 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 text-sm">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-gray-700 font-medium">Publicado</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span className="text-gray-700 font-medium">Agendado</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <span className="text-gray-700 font-medium">Outros</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
                    {/* Calendar Header Controls */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={prevMonth}
                                className="p-2 hover:bg-gray-200 rounded-lg transition"
                                title="Mês Anterior"
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <h2 className="text-xl font-bold text-gray-900 capitalize w-48 text-center">
                                {monthNames[month]} {year}
                            </h2>
                            <button
                                onClick={nextMonth}
                                className="p-2 hover:bg-gray-200 rounded-lg transition"
                                title="Próximo Mês"
                            >
                                <ChevronRight className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            {loading && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>}
                            <button
                                onClick={goToToday}
                                className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-semibold transition shadow-sm"
                            >
                                Hoje
                            </button>
                            <Link
                                href="/admin/dashboard/editor"
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition shadow-sm flex items-center gap-2"
                            >
                                <FileText className="w-4 h-4" />
                                Nova Matéria
                            </Link>
                        </div>
                    </div>

                    {/* Day Names Header */}
                    <div className="grid grid-cols-7 border-b border-gray-200 bg-white">
                        {dayNames.map(day => (
                            <div key={day} className="py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-widest border-r border-gray-100 last:border-r-0">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 bg-gray-100 gap-[1px]">
                        {renderCalendar()}
                    </div>
                </div>

                {/* Custom Scrollbar Styles for the tiny boxes */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 4px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background-color: #cbd5e1;
                        border-radius: 20px;
                    }
                `}} />
            </div>
        </div>
    )
}
