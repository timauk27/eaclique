'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Edit, Trash2, Power, PowerOff, Save, X } from 'lucide-react'

interface Ad {
    id: number
    posicao: string
    empresa: string
    codigo_script: string
    ativo: boolean
    created_at: string
}

const POSICOES_DISPONIVEIS = [
    { value: 'billboard', label: 'Billboard (Topo)', description: 'Banner largo no topo de todas as páginas (728x90).' },
    { value: 'sidebar_top', label: 'Sidebar Topo', description: 'Acima da lista de "Últimas Notícias" na barra lateral.' },
    { value: 'skyscraper', label: 'Skyscraper (Lateral)', description: 'Banner vertical na barra lateral que acompanha a rolagem (160x600 ou 300x600).' },
    { value: 'in_article', label: 'Dentro do Artigo', description: 'Aparece automaticamente a cada 3 parágrafos dentro das notícias.' },
    { value: 'footer_sticky', label: 'Footer Sticky (Mobile)', description: 'Banner fixo no rodapé apenas em dispositivos móveis.' },
]

export default function AdminAdsPage() {
    const [ads, setAds] = useState<Ad[]>([])
    const [loading, setLoading] = useState(true)
    const [editingAd, setEditingAd] = useState<Ad | null>(null)
    const [showForm, setShowForm] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        posicao: '',
        empresa: '',
        codigo_script: ''
    })

    // Carregar ads do banco
    const loadAds = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('Config_Ads')
            .select('*')
            .order('created_at', { ascending: false })

        if (!error && data) {
            setAds(data)
        }
        setLoading(false)
    }

    useEffect(() => {
        loadAds()
    }, [])

    // Toggle ativo/inativo
    const toggleAtivo = async (id: number, currentStatus: boolean) => {
        const { error } = await supabase
            .from('Config_Ads')
            .update({ ativo: !currentStatus })
            .eq('id', id)

        if (!error) {
            loadAds()
        }
    }

    // Deletar ad
    const deleteAd = async (id: number) => {
        if (!confirm('Tem certeza que deseja deletar este anúncio?')) return

        const { error } = await supabase
            .from('Config_Ads')
            .delete()
            .eq('id', id)

        if (!error) {
            loadAds()
        }
    }

    // Salvar (criar ou atualizar)
    const saveAd = async () => {
        if (!formData.posicao || !formData.empresa || !formData.codigo_script) {
            alert('Preencha todos os campos!')
            return
        }

        if (editingAd) {
            // Update
            const { error } = await supabase
                .from('Config_Ads')
                .update({
                    posicao: formData.posicao,
                    empresa: formData.empresa,
                    codigo_script: formData.codigo_script,
                    updated_at: new Date().toISOString()
                })
                .eq('id', editingAd.id)

            if (!error) {
                resetForm()
                loadAds()
            }
        } else {
            // Insert
            const { error } = await supabase
                .from('Config_Ads')
                .insert([{
                    posicao: formData.posicao,
                    empresa: formData.empresa,
                    codigo_script: formData.codigo_script,
                    ativo: true
                }])

            if (!error) {
                resetForm()
                loadAds()
            }
        }
    }

    const resetForm = () => {
        setFormData({ posicao: '', empresa: '', codigo_script: '' })
        setEditingAd(null)
        setShowForm(false)
    }

    const startEdit = (ad: Ad) => {
        setEditingAd(ad)
        setFormData({
            posicao: ad.posicao,
            empresa: ad.empresa,
            codigo_script: ad.codigo_script
        })
        setShowForm(true)
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Gerenciador de Anúncios</h1>
                        <p className="text-gray-600 mt-1">
                            Gerencie scripts de AdSense, Adsterra, 1win, MGID e outros
                        </p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
                    >
                        <Plus className="w-5 h-5" />
                        Novo Anúncio
                    </button>
                </div>

                {/* Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {editingAd ? 'Editar Anúncio' : 'Novo Anúncio'}
                                </h2>
                                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                {/* Posição */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Posição
                                    </label>
                                    <select
                                        value={formData.posicao}
                                        onChange={(e) => setFormData({ ...formData, posicao: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                    >
                                        <option value="">Selecione uma posição</option>
                                        {POSICOES_DISPONIVEIS.map((pos) => (
                                            <option key={pos.value} value={pos.value}>
                                                {pos.label}
                                            </option>
                                        ))}
                                    </select>
                                    {formData.posicao && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            {POSICOES_DISPONIVEIS.find(p => p.value === formData.posicao)?.description}
                                        </p>
                                    )}
                                </div>

                                {/* Empresa */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Empresa/Rede
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.empresa}
                                        onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                                        placeholder="Ex: AdSense, Adsterra, 1win, MGID"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                    />
                                </div>

                                {/* Código do Script */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Código HTML/JavaScript
                                    </label>
                                    <textarea
                                        value={formData.codigo_script}
                                        onChange={(e) => setFormData({ ...formData, codigo_script: e.target.value })}
                                        placeholder='Cole o código completo aqui. Ex: <script async src="..."></script>'
                                        rows={12}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none font-mono text-sm"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        ⚠️ Cole EXATAMENTE como fornecido pela rede de anúncios
                                    </p>
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
                                <button
                                    onClick={resetForm}
                                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={saveAd}
                                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition"
                                >
                                    <Save className="w-5 h-5" />
                                    Salvar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Lista de Ads */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                        <p className="text-gray-500 mt-4">Carregando...</p>
                    </div>
                ) : ads.length === 0 ? (
                    <div className="bg-white rounded-lg p-12 text-center">
                        <p className="text-gray-500 text-lg">Nenhum anúncio cadastrado ainda.</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="mt-4 text-red-600 hover:underline"
                        >
                            Criar primeiro anúncio
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {ads.map((ad) => (
                            <div
                                key={ad.id}
                                className={`bg-white rounded-lg p-6 border-2 ${ad.ativo ? 'border-green-500' : 'border-gray-200'
                                    } transition`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${ad.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                {ad.ativo ? '● ATIVO' : '○ INATIVO'}
                                            </span>
                                            <span className="text-sm font-semibold text-gray-600">
                                                {POSICOES_DISPONIVEIS.find(p => p.value === ad.posicao)?.label || ad.posicao}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{ad.empresa}</h3>
                                        <pre className="bg-gray-50 p-3 rounded text-xs text-gray-600 overflow-x-auto max-h-32">
                                            {ad.codigo_script.substring(0, 200)}...
                                        </pre>
                                    </div>

                                    <div className="flex gap-2 ml-4">
                                        <button
                                            onClick={() => toggleAtivo(ad.id, ad.ativo)}
                                            className={`p-2 rounded-lg transition ${ad.ativo
                                                ? 'bg-green-100 hover:bg-green-200 text-green-700'
                                                : 'bg-gray-100 hover:bg-gray-200 text-gray-500'
                                                }`}
                                            title={ad.ativo ? 'Desativar' : 'Ativar'}
                                        >
                                            {ad.ativo ? <Power className="w-5 h-5" /> : <PowerOff className="w-5 h-5" />}
                                        </button>
                                        <button
                                            onClick={() => startEdit(ad)}
                                            className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition"
                                            title="Editar"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => deleteAd(ad.id)}
                                            className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition"
                                            title="Deletar"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
