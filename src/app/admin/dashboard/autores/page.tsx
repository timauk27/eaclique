'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Edit, Trash2, X, Image as ImageIcon, Users } from 'lucide-react'

interface Autor {
    id: string
    nome: string
    biografia: string
    foto_url: string
    rede_social_link: string
    created_at: string
}

export default function AdminAutoresPage() {
    const [autores, setAutores] = useState<Autor[]>([])
    const [loading, setLoading] = useState(true)
    const [editingAutor, setEditingAutor] = useState<Autor | null>(null)
    const [showForm, setShowForm] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        nome: '',
        biografia: '',
        foto_url: '',
        rede_social_link: ''
    })

    const loadAutores = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('autores')
            .select('*')
            .order('nome', { ascending: true })

        if (!error && data) {
            setAutores(data)
        } else if (error) {
            console.error(error)
        }
        setLoading(false)
    }

    useEffect(() => {
        loadAutores()
    }, [])

    const deleteAutor = async (id: string) => {
        if (!confirm('Tem certeza que deseja deletar este autor? As matérias perderão a assinatura.')) return

        const { error } = await supabase
            .from('autores')
            .delete()
            .eq('id', id)

        if (!error) {
            loadAutores()
        } else {
            alert('Erro ao excluir autor: ' + error.message)
        }
    }

    const saveAutor = async () => {
        if (!formData.nome) {
            alert('O campo Nome é obrigatório!')
            return
        }

        if (editingAutor) {
            // Update
            const { error } = await supabase
                .from('autores')
                .update({
                    nome: formData.nome,
                    biografia: formData.biografia,
                    foto_url: formData.foto_url,
                    rede_social_link: formData.rede_social_link,
                    updated_at: new Date().toISOString()
                })
                .eq('id', editingAutor.id)

            if (!error) {
                resetForm()
                loadAutores()
            } else {
                alert('Erro ao atualizar: ' + error.message)
            }
        } else {
            // Insert
            const { error } = await supabase
                .from('autores')
                .insert([{
                    nome: formData.nome,
                    biografia: formData.biografia,
                    foto_url: formData.foto_url,
                    rede_social_link: formData.rede_social_link
                }])

            if (!error) {
                resetForm()
                loadAutores()
            } else {
                alert('Erro ao criar: ' + error.message)
            }
        }
    }

    const resetForm = () => {
        setFormData({ nome: '', biografia: '', foto_url: '', rede_social_link: '' })
        setEditingAutor(null)
        setShowForm(false)
    }

    const startEdit = (autor: Autor) => {
        setEditingAutor(autor)
        setFormData({
            nome: autor.nome || '',
            biografia: autor.biografia || '',
            foto_url: autor.foto_url || '',
            rede_social_link: autor.rede_social_link || ''
        })
        setShowForm(true)
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                            <Users className="w-8 h-8 text-blue-600" />
                            Gerenciador de Autores
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Crie perfis de jornalistas (reais ou de IA) para assinar as matérias e turbinar o SEO (E-E-A-T)
                        </p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition whitespace-nowrap"
                    >
                        <Plus className="w-5 h-5" />
                        Novo Autor
                    </button>
                </div>

                {showForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {editingAutor ? 'Editar Autor' : 'Novo Autor'}
                                </h2>
                                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Nome Completo / Pseudônimo *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.nome}
                                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                        placeholder="Ex: João da Silva ou Equipe EAClique"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        URL da Foto (Avatar)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.foto_url}
                                        onChange={(e) => setFormData({ ...formData, foto_url: e.target.value })}
                                        placeholder="https://..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Biografia (Aparece no final da matéria)
                                    </label>
                                    <textarea
                                        value={formData.biografia}
                                        onChange={(e) => setFormData({ ...formData, biografia: e.target.value })}
                                        placeholder="Jornalista com mais de 10 anos de experiência cobrindo tecnologia e mercado financeiro..."
                                        rows={4}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Link Rede Social (Opcional)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.rede_social_link}
                                        onChange={(e) => setFormData({ ...formData, rede_social_link: e.target.value })}
                                        placeholder="https://linkedin.com/in/..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
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
                                    onClick={saveAutor}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                                >
                                    Salvar Autor
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-gray-500 mt-4">Carregando autores...</p>
                    </div>
                ) : autores.length === 0 ? (
                    <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
                        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg mb-2">Nenhum autor cadastrado.</p>
                        <p className="text-sm text-gray-400 mb-4">Adicione autores para assinar suas notícias e ganhar credibilidade no Google.</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                            Criar Primeiro Autor
                        </button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {autores.map((autor) => (
                            <div key={autor.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
                                <div className="p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200 relative">
                                            {autor.foto_url ? (
                                                <img src={autor.foto_url} alt={autor.nome} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <ImageIcon className="w-8 h-8" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 leading-tight">{autor.nome}</h3>
                                            <p className="text-xs text-gray-500 mt-1">Autor</p>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-600 line-clamp-3 mb-4 h-12">
                                        {autor.biografia || <span className="italic text-gray-400">Sem biografia.</span>}
                                    </p>

                                    <div className="flex items-center gap-2 pt-4 border-t border-gray-100 mt-auto">
                                        <button
                                            onClick={() => startEdit(autor)}
                                            className="flex-1 p-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition text-sm font-semibold flex justify-center items-center gap-2"
                                        >
                                            <Edit className="w-4 h-4" />
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => deleteAutor(autor.id)}
                                            className="p-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg transition"
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
