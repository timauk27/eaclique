'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Edit, Trash2, X, BookOpen, Save, RefreshCw, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import RichTextEditor from '@/components/RichTextEditor'

interface Pagina {
    id: string
    titulo: string
    slug: string
    conteudo_html: string
    resumo_seo: string
    status: string
    created_at: string
}

export default function AdminPaginasPage() {
    const [paginas, setPaginas] = useState<Pagina[]>([])
    const [loading, setLoading] = useState(true)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [showForm, setShowForm] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        titulo: '',
        slug: '',
        conteudo_html: '',
        resumo_seo: '',
        status: 'publicado'
    })

    const loadPaginas = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('paginas')
            .select('*')
            .order('created_at', { ascending: false })

        if (!error && data) {
            setPaginas(data)
        }
        setLoading(false)
    }

    useEffect(() => {
        loadPaginas()
    }, [])

    const deletePagina = async (id: string) => {
        if (!confirm('Tem certeza que deseja deletar esta página? Links apontando para ela quebrarão (404).')) return

        const { error } = await supabase
            .from('paginas')
            .delete()
            .eq('id', id)

        if (!error) {
            loadPaginas()
            alert('🗑️ Página deletada!')
        } else {
            alert('Erro ao excluir: ' + error.message)
        }
    }

    const savePagina = async () => {
        if (!formData.titulo || !formData.slug || !formData.conteudo_html) {
            alert('Título, Slug e Conteúdo são obrigatórios!')
            return
        }

        const dataToSave = {
            titulo: formData.titulo,
            slug: formData.slug
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, ''), // slugify limpo
            conteudo_html: formData.conteudo_html,
            resumo_seo: formData.resumo_seo,
            status: formData.status,
            updated_at: new Date().toISOString()
        }

        if (editingId) {
            // Update
            const { error } = await supabase
                .from('paginas')
                .update(dataToSave)
                .eq('id', editingId)

            if (!error) {
                resetForm()
                loadPaginas()
                alert('✅ Página atualizada!')
            } else {
                alert(`❌ Erro ao atualizar: ${error.message}`)
            }
        } else {
            // Insert
            const { error } = await supabase
                .from('paginas')
                .insert([dataToSave])

            if (!error) {
                resetForm()
                loadPaginas()
                alert('✅ Página criada com sucesso!')
            } else {
                alert(`❌ Erro ao criar: ${error.message}`)
            }
        }
    }

    const resetForm = () => {
        setFormData({ titulo: '', slug: '', conteudo_html: '', resumo_seo: '', status: 'publicado' })
        setEditingId(null)
        setShowForm(false)
    }

    const startEdit = (pagina: Pagina) => {
        setEditingId(pagina.id)
        setFormData({
            titulo: pagina.titulo || '',
            slug: pagina.slug || '',
            conteudo_html: pagina.conteudo_html || '',
            resumo_seo: pagina.resumo_seo || '',
            status: pagina.status || 'publicado'
        })
        setShowForm(true)
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                            <BookOpen className="w-8 h-8 text-blue-600" />
                            Gerenciador de Páginas Fixas
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Crie páginas estáticas como Sobre Nós, Contato, Termos de Uso, etc.
                        </p>
                    </div>
                    <button
                        onClick={() => { resetForm(); setShowForm(true); }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition whitespace-nowrap"
                    >
                        <Plus className="w-5 h-5" />
                        Nova Página
                    </button>
                </div>

                {showForm && (
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-t-4 border-blue-500">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {editingId ? '✏️ Editar Página' : '➕ Nova Página'}
                            </h2>
                            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Título da Página *
                                </label>
                                <input
                                    type="text"
                                    value={formData.titulo}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        // Auto-gerar slug se for nova
                                        if (!editingId) {
                                            const autoSlug = val.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                                            setFormData({ ...formData, titulo: val, slug: autoSlug });
                                        } else {
                                            setFormData({ ...formData, titulo: val });
                                        }
                                    }}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    URL (Slug) *
                                </label>
                                <div className="flex bg-gray-50 border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                                    <span className="px-4 py-2 text-gray-500 bg-gray-100 border-r border-gray-300 select-none hidden sm:inline-block">/pagina/</span>
                                    <input
                                        type="text"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        className="w-full px-4 py-2 bg-transparent outline-none"
                                        placeholder="sobre-nos"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Resumo SEO (Description)
                            </label>
                            <textarea
                                value={formData.resumo_seo}
                                onChange={(e) => setFormData({ ...formData, resumo_seo: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                rows={2}
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Conteúdo HTML / Rich Text *
                            </label>
                            <RichTextEditor
                                content={formData.conteudo_html}
                                onChange={(html) => setFormData(prev => ({ ...prev, conteudo_html: html }))}
                            />
                        </div>

                        <div className="flex gap-3 justify-end pt-4 border-t">
                            <button onClick={resetForm} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                                Cancelar
                            </button>
                            <button onClick={savePagina} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition">
                                <Save className="w-5 h-5" />
                                Salvar Página
                            </button>
                        </div>
                    </div>
                )}

                {/* Lista de Páginas */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900">Páginas Existentes</h2>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="text-gray-500 mt-4">Carregando páginas...</p>
                        </div>
                    ) : paginas.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            Nenhuma página estática encontrada. Crie sua primeira página!
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {paginas.map((pagina) => (
                                <div key={pagina.id} className="p-6 hover:bg-gray-50 transition flex items-center justify-between">
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg">{pagina.titulo}</h3>
                                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                            <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                                                /pagina/{pagina.slug}
                                            </span>
                                            <span>•</span>
                                            <span>Criado em: {new Date(pagina.created_at).toLocaleDateString('pt-BR')}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/pagina/${pagina.slug}`}
                                            target="_blank"
                                            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                                            title="Ver no site"
                                        >
                                            <ExternalLink className="w-5 h-5" />
                                        </Link>
                                        <button
                                            onClick={() => startEdit(pagina)}
                                            className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition"
                                            title="Editar"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => deletePagina(pagina.id)}
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
