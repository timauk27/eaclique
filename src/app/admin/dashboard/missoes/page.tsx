'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Target, Plus, Calendar, Clock, CheckCircle, XCircle, AlertCircle, Loader } from 'lucide-react'
import MissionForm from './components/MissionForm'
import MissionsTable from './components/MissionsTable'

export default function MissoesPage() {
    const [missoes, setMissoes] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const supabase = createClient()

    // Load missions
    const loadMissoes = async () => {
        try {
            const { data, error } = await supabase
                .from('missoes')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setMissoes(data || [])
        } catch (error) {
            console.error('Erro ao carregar missões:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadMissoes()

        // Real-time updates
        const channel = supabase
            .channel('missoes_changes')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'missoes'
            }, () => {
                loadMissoes()
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    // Stats
    const stats = {
        total: missoes.length,
        pendentes: missoes.filter(m => m.status === 'PENDENTE').length,
        executando: missoes.filter(m => m.status === 'EXECUTANDO').length,
        concluidas: missoes.filter(m => m.status === 'CONCLUIDA').length,
        erros: missoes.filter(m => m.status === 'ERRO').length,
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <Target className="w-8 h-8" />
                        Gerenciador de Missões
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Solicite coberturas específicas para o robô executar automaticamente
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition shadow-sm"
                >
                    <Plus className="w-5 h-5" />
                    Nova Missão
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                        <Target className="w-4 h-4" />
                        Total
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                </div>
                <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
                    <div className="flex items-center gap-2 text-yellow-700 text-sm mb-1">
                        <Clock className="w-4 h-4" />
                        Pendentes
                    </div>
                    <div className="text-2xl font-bold text-yellow-900">{stats.pendentes}</div>
                </div>
                <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                    <div className="flex items-center gap-2 text-blue-700 text-sm mb-1">
                        <Loader className="w-4 h-4" />
                        Executando
                    </div>
                    <div className="text-2xl font-bold text-blue-900">{stats.executando}</div>
                </div>
                <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                    <div className="flex items-center gap-2 text-green-700 text-sm mb-1">
                        <CheckCircle className="w-4 h-4" />
                        Concluídas
                    </div>
                    <div className="text-2xl font-bold text-green-900">{stats.concluidas}</div>
                </div>
                <div className="bg-red-50 rounded-lg border border-red-200 p-4">
                    <div className="flex items-center gap-2 text-red-700 text-sm mb-1">
                        <XCircle className="w-4 h-4" />
                        Erros
                    </div>
                    <div className="text-2xl font-bold text-red-900">{stats.erros}</div>
                </div>
            </div>

            {/* Mission Form (Conditional) */}
            {showForm && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Criar Nova Missão</h2>
                    <MissionForm
                        onSuccess={() => {
                            setShowForm(false)
                            loadMissoes()
                        }}
                        onCancel={() => setShowForm(false)}
                    />
                </div>
            )}

            {/* Missions Table */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900">Missões</h2>
                </div>
                {loading ? (
                    <div className="p-12 text-center">
                        <Loader className="w-8 h-8 animate-spin mx-auto text-gray-400" />
                        <p className="mt-2 text-gray-500">Carregando missões...</p>
                    </div>
                ) : missoes.length === 0 ? (
                    <div className="p-12 text-center">
                        <Target className="w-12 h-12 mx-auto text-gray-300" />
                        <p className="mt-4 text-gray-500">Nenhuma missão criada ainda.</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Criar primeira missão
                        </button>
                    </div>
                ) : (
                    <MissionsTable missoes={missoes} onUpdate={loadMissoes} />
                )}
            </div>
        </div>
    )
}
