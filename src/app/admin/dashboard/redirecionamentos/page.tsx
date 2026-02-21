'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Edit, Trash2, X, Route, ExternalLink, Save } from 'lucide-react'

interface Redirecionamento {
    id: string
    origem_slug: string
    destino_url: string
    ativo: boolean
    created_at: string
}

export default function AdminRedirecionamentosPage() {
    const [redirecionamentos, setRedirecionamentos] = useState<Redirecionamento[]>([])
    const [loading, setLoading] = useState(true)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [showForm, setShowForm] = useState(false)

    const [formData, setFormData] = useState({
        origem_slug: '',
        destino_url: '',
        ativo: true
    })

    const loadData = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('redirecionamentos')
            .select('*')
            .order('created_at', { ascending: false })

        if (!error && data) {
            setRedirecionamentos(data)
        }
        setLoading(false)
    }

    useEffect(() => {
        loadData()
    }, [])

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja apagar este redirecionamento? A URL antiga voltará a dar Erro 404.')) return

        const { error } = await supabase
            .from('redirecionamentos')
            .delete()
            .eq('id', id)

        if (!error) {
            loadData()
        } else {
            alert('Erro ao excluir: ' + error.message)
        }
    }

    const toggleAtivo = async (red: Redirecionamento) => {
        await supabase
            .from('redirecionamentos')
            .update({ ativo: !red.ativo })
            .eq('id', red.id)
        loadData()
    }

    const handleSave = async () => {
        if (!formData.origem_slug || !formData.destino_url) {
            alert('A URL antiga e a URL nova são obrigatórias!')
            return
        }

        // Limpar origem para ser apenas o path/slug sem dominio
        let cleanOrigem = formData.origem_slug.trim();
        if (cleanOrigem.startsWith(process.env.NEXT_PUBLIC_SITE_URL || '')) {
            cleanOrigem = cleanOrigem.replace(process.env.NEXT_PUBLIC_SITE_URL || '', '');
        }
        if (!cleanOrigem.startsWith('/')) cleanOrigem = '/' + cleanOrigem;

        const dataToSave = {
            origem_slug: cleanOrigem,
            destino_url: formData.destino_url.trim(),
            ativo: formData.ativo,
            updated_at: new Date().toISOString()
        }

        if (editingId) {
            const { error } = await supabase
                .from('redirecionamentos')
                .update(dataToSave)
                .eq('id', editingId)

            if (!error) {
                resetForm()
                loadData()
            } else {
                alert(`Erro ao atualizar: ${error.message}`)
            }
        } else {
            const { error } = await supabase
                .from('redirecionamentos')
                .insert([dataToSave])

            if (!error) {
                resetForm()
                loadData()
            } else {
                alert(`Erro ao criar: ${error.message}`)
            }
        }
    }

    const resetForm = () => {
        setFormData({ origem_slug: '', destino_url: '', ativo: true })
        setEditingId(null)
        setShowForm(false)
    }

    const startEdit = (red: Redirecionamento) => {
        setEditingId(red.id)
        setFormData({
            origem_slug: red.origem_slug || '',
            destino_url: red.destino_url || '',
            ativo: red.ativo
        })
        setShowForm(true)
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                            <Route className="w-8 h-8 text-blue-600" />
                            Redirecionamentos 301 (SEO)
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Redirecione URLs antigas (404) para novas páginas e preserve seu ranqueamento no Google.
                        </p>
                    </div>
                    <button
                        onClick={() => { resetForm(); setShowForm(true); }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition whitespace-nowrap"
                    >
                        <Plus className="w-5 h-5" />
                        Novo Redirecionamento
                    </button>
                </div>

                {showForm && (
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-t-4 border-blue-500">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {editingId ? '✏️ Editar Redirecionamento' : '➕ Novo Redirecionamento'}
                            </h2>
                            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    URL Antiga / Quebrada (Origem) *
                                </label>
                                <input
                                    type="text"
                                    value={formData.origem_slug}
                                    onChange={(e) => setFormData({ ...formData, origem_slug: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                                    placeholder="Ex: /noticia/carro-velho"
                                />
                                <p className="text-xs text-gray-500 mt-1">Comece com / para links internos.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    URL Nova (Destino Final) *
                                </label>
                                <input
                                    type="text"
                                    value={formData.destino_url}
                                    onChange={(e) => setFormData({ ...formData, destino_url: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                                    placeholder="Ex: /noticia/carro-novo ou https://site.com"
                                />
                                <p className="text-xs text-gray-500 mt-1">Para onde o leitor e o Google devem ir?</p>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end pt-4 border-t">
                            <button onClick={resetForm} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                                Cancelar
                            </button>
                            <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition">
                                <Save className="w-5 h-5" />
                                Salvar 301
                            </button>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                        <h2 className="text-xl font-bold text-gray-900">Redirecionamentos Ativos</h2>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="text-gray-500 mt-4">Carregando mapa de links...</p>
                        </div>
                    ) : redirecionamentos.length === 0 ? (
                        <div className="p-12 text-center text-gray-500 box-content">
                            Nenhum redirecionamento configurado.
                            <br />Use essa ferramenta para corrigir links quebrados 404.
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {redirecionamentos.map((red) => (
                                <div key={red.id} className={`p-6 hover:bg-gray-50 transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${!red.ativo ? 'opacity-50' : ''}`}>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="font-mono bg-red-50 text-red-700 px-2 py-1 rounded text-sm border border-red-100 truncate max-w-[250px] md:max-w-xs">
                                                {red.origem_slug}
                                            </span>
                                            <span className="text-gray-400 font-bold">➔</span>
                                            <span className="font-mono bg-green-50 text-green-700 px-2 py-1 rounded text-sm border border-green-100 truncate max-w-[250px] md:max-w-xs flex items-center gap-1">
                                                {red.destino_url}
                                                <a href={red.destino_url} target="_blank" className="hover:text-green-900 ml-1"><ExternalLink className="w-3 h-3" /></a>
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-2">
                                            Criado em: {new Date(red.created_at).toLocaleDateString('pt-BR')}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => toggleAtivo(red)}
                                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${red.ativo ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                                        >
                                            {red.ativo ? 'Ativado' : 'Desativado'}
                                        </button>
                                        <button
                                            onClick={() => startEdit(red)}
                                            className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition"
                                            title="Editar"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(red.id)}
                                            className="p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition"
                                            title="Deletar"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
