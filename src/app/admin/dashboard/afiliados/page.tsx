'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { DollarSign, Save, RefreshCw } from 'lucide-react'

interface Afiliado {
    id: number
    rede: string
    tag: string
    ativo: boolean
    updated_at: string
}

export default function AdminAfiliadosPage() {
    const [afiliados, setAfiliados] = useState<Afiliado[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const loadAfiliados = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('Config_Afiliados')
            .select('*')
            .order('rede', { ascending: true })

        if (!error && data) {
            setAfiliados(data)
        }
        setLoading(false)
    }

    useEffect(() => {
        loadAfiliados()
    }, [])

    const updateTag = async (id: number, newTag: string) => {
        const { error } = await supabase
            .from('Config_Afiliados')
            .update({ tag: newTag, updated_at: new Date().toISOString() })
            .eq('id', id)

        if (!error) {
            loadAfiliados()
        }
    }

    const toggleAtivo = async (id: number, currentStatus: boolean) => {
        const { error } = await supabase
            .from('Config_Afiliados')
            .update({ ativo: !currentStatus, updated_at: new Date().toISOString() })
            .eq('id', id)

        if (!error) {
            loadAfiliados()
        }
    }

    const saveAll = async () => {
        setSaving(true)
        // Reload para confirmar salvamento
        await loadAfiliados()
        setSaving(false)
        alert('✅ Configurações salvas!')
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <DollarSign className="w-8 h-8 text-green-600" />
                        <h1 className="text-3xl font-bold text-gray-900">Gestor de Afiliados</h1>
                    </div>
                    <p className="text-gray-600">
                        Gerencie tags de afiliados para Amazon, Shopee e outras redes.
                        <span className="font-semibold text-red-600"> O robô usa essas tags automaticamente!</span>
                    </p>
                </div>

                {/* Alert Info */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                    <p className="text-sm text-blue-800">
                        💡 <strong>Dica:</strong> Quando você edita a tag e salva, o robô já começa a usar a nova tag
                        nas próximas notícias. Você nunca mais precisa editar código Python!
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <RefreshCw className="w-12 h-12 text-red-600 animate-spin mx-auto mb-4" />
                        <p className="text-gray-500">Carregando configurações...</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {afiliados.map((afl) => (
                            <div
                                key={afl.id}
                                className={`bg-white rounded-lg p-6 border-2 transition ${afl.ativo ? 'border-green-500 shadow-sm' : 'border-gray-200'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-xl font-bold text-gray-900 capitalize">
                                            {afl.rede}
                                        </h3>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-bold ${afl.ativo
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-500'
                                                }`}
                                        >
                                            {afl.ativo ? '● EM USO' : '○ DESATIVADO'}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => toggleAtivo(afl.id, afl.ativo)}
                                        className={`px-4 py-2 rounded-lg font-semibold transition ${afl.ativo
                                                ? 'bg-red-100 hover:bg-red-200 text-red-700'
                                                : 'bg-green-100 hover:bg-green-200 text-green-700'
                                            }`}
                                    >
                                        {afl.ativo ? 'Desativar' : 'Ativar'}
                                    </button>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Tag de Rastreamento
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={afl.tag}
                                            onChange={(e) => {
                                                const updated = afiliados.map((a) =>
                                                    a.id === afl.id ? { ...a, tag: e.target.value } : a
                                                )
                                                setAfiliados(updated)
                                            }}
                                            onBlur={(e) => updateTag(afl.id, e.target.value)}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none font-mono text-sm"
                                            placeholder="ex: 1barba-20"
                                        />
                                        <button
                                            onClick={() => updateTag(afl.id, afl.tag)}
                                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition flex items-center gap-2"
                                            title="Salvar"
                                        >
                                            <Save className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Última atualização: {new Date(afl.updated_at).toLocaleString('pt-BR')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Info Box */}
                <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-2">Como Funciona</h3>
                    <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                        <li>Edite a tag da rede que você usa (ex: Amazon)</li>
                        <li>Clique em "Salvar" ou pressione Enter</li>
                        <li>O robô Python lê essa tag do Supabase automaticamente</li>
                        <li>Todas as PRÓXIMAS notícias usarão a nova tag</li>
                        <li>Se sua conta mudar, basta atualizar aqui!</li>
                    </ol>
                </div>
            </div>
        </div>
    )
}
