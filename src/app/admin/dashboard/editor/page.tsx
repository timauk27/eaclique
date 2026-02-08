'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Edit, Plus, Save, X, Trash2, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface Noticia {
    id: number
    titulo_viral: string
    categoria: string
    conteudo_html: string
    imagem_capa: string
    resumo_seo: string
    slug: string
    created_at: string
}

export default function AdminEditorPage() {
    const [noticias, setNoticias] = useState<Noticia[]>([])
    const [loading, setLoading] = useState(true)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [showNewForm, setShowNewForm] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        titulo_viral: '',
        categoria: 'BRASIL',
        conteudo_html: '',
        imagem_capa: '',
        resumo_seo: ''
    })

    const categorias = ['PLANTÃO', 'BRASIL', 'MUNDO', 'ARENA', 'HOLOFOTE', 'PIXEL', 'PLAY', 'VITAL', 'MERCADO']

    const loadNoticias = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('Noticias')
            .select('id, titulo_viral, categoria, conteudo_html, imagem_capa, resumo_seo, slug, created_at')
            .order('created_at', { ascending: false })
            .limit(20)

        if (!error && data) {
            setNoticias(data)
        }
        setLoading(false)
    }

    useEffect(() => {
        loadNoticias()
    }, [])

    const startEdit = (noticia: Noticia) => {
        setEditingId(noticia.id)
        setFormData({
            titulo_viral: noticia.titulo_viral,
            categoria: noticia.categoria,
            conteudo_html: noticia.conteudo_html,
            imagem_capa: noticia.imagem_capa,
            resumo_seo: noticia.resumo_seo
        })
        setShowNewForm(false)
    }

    const saveNoticia = async () => {
        if (!formData.titulo_viral || !formData.conteudo_html) {
            alert('Título e conteúdo são obrigatórios!')
            return
        }

        if (editingId) {
            // Update
            const { error } = await supabase
                .from('Noticias')
                .update({
                    titulo_viral: formData.titulo_viral,
                    categoria: formData.categoria,
                    conteudo_html: formData.conteudo_html,
                    imagem_capa: formData.imagem_capa,
                    resumo_seo: formData.resumo_seo,
                    updated_at: new Date().toISOString()
                })
                .eq('id', editingId)

            if (!error) {
                resetForm()
                loadNoticias()
                alert('✅ Notícia atualizada!')
            }
        } else {
            // Insert - criar nova notícia manual
            const slug = formData.titulo_viral
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')

            const { error } = await supabase
                .from('Noticias')
                .insert([{
                    titulo_viral: formData.titulo_viral,
                    titulo_original: formData.titulo_viral,
                    categoria: formData.categoria,
                    conteudo_html: formData.conteudo_html,
                    imagem_capa: formData.imagem_capa,
                    imagem_alt: formData.titulo_viral,
                    resumo_seo: formData.resumo_seo,
                    slug: slug,
                    views_fake: 0,
                    fonte_original: 'manual',
                    call_to_action_prod: 'Produtos Relacionados',
                    link_afiliado_gerado: 'https://amazon.com.br'
                }])

            if (!error) {
                resetForm()
                loadNoticias()
                alert('✅ Notícia criada!')
            }
        }
    }

    const deleteNoticia = async (id: number) => {
        if (!confirm('Tem certeza que deseja deletar esta notícia?')) return

        const { error } = await supabase
            .from('Noticias')
            .delete()
            .eq('id', id)

        if (!error) {
            loadNoticias()
            alert('🗑️ Notícia deletada!')
        }
    }

    const resetForm = () => {
        setFormData({
            titulo_viral: '',
            categoria: 'BRASIL',
            conteudo_html: '',
            imagem_capa: '',
            resumo_seo: ''
        })
        setEditingId(null)
        setShowNewForm(false)
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Editor de Notícias</h1>
                        <p className="text-gray-600 mt-1">Crie e edite notícias manualmente</p>
                    </div>
                    <button
                        onClick={() => {
                            resetForm()
                            setShowNewForm(true)
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
                    >
                        <Plus className="w-5 h-5" />
                        Nova Notícia
                    </button>
                </div>

                {/* Editor Form */}
                {(showNewForm || editingId) && (
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-2 border-blue-500">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {editingId ? '✏️ Editar Notícia' : '➕ Nova Notícia'}
                            </h2>
                            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Título */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Título *
                                </label>
                                <input
                                    type="text"
                                    value={formData.titulo_viral}
                                    onChange={(e) => setFormData({ ...formData, titulo_viral: e.target.value })}
                                    placeholder="Título chamativo da notícia"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            {/* Categoria + Imagem */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Categoria
                                    </label>
                                    <select
                                        value={formData.categoria}
                                        onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        {categorias.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        URL da Imagem
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.imagem_capa}
                                        onChange={(e) => setFormData({ ...formData, imagem_capa: e.target.value })}
                                        placeholder="https://..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            {/* Resumo SEO */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Resumo SEO (máx 160 caracteres)
                                </label>
                                <input
                                    type="text"
                                    value={formData.resumo_seo}
                                    onChange={(e) => setFormData({ ...formData, resumo_seo: e.target.value })}
                                    placeholder="Descrição para Google"
                                    maxLength={160}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">{formData.resumo_seo.length}/160</p>
                            </div>

                            {/* Conteúdo HTML */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Conteúdo (HTML) *
                                </label>
                                <textarea
                                    value={formData.conteudo_html}
                                    onChange={(e) => setFormData({ ...formData, conteudo_html: e.target.value })}
                                    placeholder="<p>Primeiro parágrafo...</p>"
                                    rows={15}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 justify-end pt-4 border-t">
                                <button
                                    onClick={resetForm}
                                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={saveNoticia}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition"
                                >
                                    <Save className="w-5 h-5" />
                                    {editingId ? 'Salvar Alterações' : 'Publicar'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Lista de Notícias */}
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900">Últimas 20 Notícias</h2>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {noticias.map((noticia) => (
                                <div key={noticia.id} className="p-6 hover:bg-gray-50 transition">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                                                {noticia.titulo_viral}
                                            </h3>
                                            <div className="flex items-center gap-3 text-sm text-gray-500">
                                                <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold">
                                                    {noticia.categoria}
                                                </span>
                                                <span>
                                                    {new Date(noticia.created_at).toLocaleString('pt-BR')}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Link
                                                href={`/noticia/${noticia.slug}`}
                                                target="_blank"
                                                className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                                                title="Ver no site"
                                            >
                                                <ExternalLink className="w-5 h-5" />
                                            </Link>
                                            <button
                                                onClick={() => startEdit(noticia)}
                                                className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition"
                                                title="Editar"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => deleteNoticia(noticia.id)}
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
        </div>
    )
}
