'use client'

import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { Edit, Plus, Save, X, Trash2, ExternalLink, FileText, RefreshCw, Image as ImageIcon, AlertCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import RichTextEditor from '@/components/RichTextEditor'
import { useSearchParams } from 'next/navigation'

interface Noticia {
    id: string
    titulo_viral: string
    categoria: string
    conteudo_html: string
    imagem_capa: string
    resumo_seo: string
    slug: string
    created_at: string
    status: string
    agendado_para?: string
}

export default function AdminEditorPage() {
    const searchParams = useSearchParams()
    const idToEdit = searchParams.get('id')

    const [noticias, setNoticias] = useState<Noticia[]>([])
    const [loading, setLoading] = useState(true)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [showNewForm, setShowNewForm] = useState(false)
    const [replacingImageId, setReplacingImageId] = useState<string | null>(null)
    const [newImageUrl, setNewImageUrl] = useState('')
    const [uploadingImage, setUploadingImage] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        titulo_viral: '',
        categoria: 'BRASIL',
        conteudo_html: '',
        imagem_capa: '',
        resumo_seo: '',
        status: 'rascunho',
        agendado_para: ''
    })

    const categorias = ['PLANTÃO', 'BRASIL', 'MUNDO', 'ARENA', 'HOLOFOTE', 'PIXEL', 'PLAY', 'VITAL', 'MERCADO']

    // SEO Analysis Logic
    const seoAnalysis = useMemo(() => {
        const issues = []
        const good = []
        let score = 100

        // Title Check
        if (formData.titulo_viral.length < 20) {
            issues.push('Título muito curto (min 20 chars)')
            score -= 10
        } else if (formData.titulo_viral.length > 70) {
            issues.push('Título muito longo (max 70 chars)')
            score -= 5
        } else {
            good.push('Tamanho do título ideal')
        }

        // Description Check
        if (formData.resumo_seo.length < 50) {
            issues.push('Resumo SEO muito curto')
            score -= 10
        } else if (formData.resumo_seo.length > 160) {
            issues.push('Resumo SEO muito longo (max 160)')
            score -= 5
        } else {
            good.push('Tamanho do resumo ideal')
        }

        // Content Check
        const wordCount = formData.conteudo_html.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(w => w.length > 0).length
        if (wordCount < 300) {
            issues.push(`Conteúdo muito curto (${wordCount}/300 palavras)`)
            score -= 20
        } else {
            good.push('Quantidade de palavras boa')
        }

        // Image Check
        if (!formData.imagem_capa) {
            issues.push('Imagem de capa obrigatória')
            score -= 20
        }

        return { score: Math.max(0, score), issues, good, wordCount }
    }, [formData])

    const loadNoticias = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('noticias')
            .select('id, titulo_viral, categoria, conteudo_html, imagem_capa, resumo_seo, slug, created_at, status, agendado_para')
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

    useEffect(() => {
        if (idToEdit) {
            async function loadSpecificNews() {
                const { data, error } = await supabase
                    .from('noticias')
                    .select('*')
                    .eq('id', idToEdit)
                    .single()

                if (data && !error) {
                    startEdit(data)
                    setShowNewForm(true)
                }
            }
            loadSpecificNews()
        }
    }, [idToEdit])

    const startEdit = (noticia: Noticia) => {
        setEditingId(noticia.id)
        setFormData({
            titulo_viral: noticia.titulo_viral || '',
            categoria: noticia.categoria || 'BRASIL',
            conteudo_html: noticia.conteudo_html || '',
            imagem_capa: noticia.imagem_capa || '',
            resumo_seo: noticia.resumo_seo || '',
            status: noticia.status || 'rascunho',
            agendado_para: noticia.agendado_para || ''
        })
        setShowNewForm(false)
    }

    const saveNoticia = async () => {
        if (!formData.titulo_viral || !formData.conteudo_html) {
            alert('Título e conteúdo são obrigatórios!')
            return
        }

        const noticiaData = {
            titulo_viral: formData.titulo_viral,
            categoria: formData.categoria,
            conteudo_html: formData.conteudo_html,
            imagem_capa: formData.imagem_capa,
            resumo_seo: formData.resumo_seo,
            status: formData.status,
            agendado_para: formData.status === 'agendado' ? formData.agendado_para : null,
            updated_at: new Date().toISOString()
        }

        if (editingId) {
            // Update
            const { error } = await supabase
                .from('noticias')
                .update(noticiaData)
                .eq('id', editingId)

            if (!error) {
                resetForm()
                loadNoticias()
                alert('✅ Notícia atualizada!')
            }
        } else {
            // Insert
            const slug = formData.titulo_viral
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')

            const { error } = await supabase
                .from('noticias')
                .insert([{
                    ...noticiaData,
                    titulo_original: formData.titulo_viral,
                    imagem_alt: formData.titulo_viral,
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

    const deleteNoticia = async (id: string) => {
        if (!confirm('Tem certeza que deseja deletar esta notícia?')) return

        const { error } = await supabase
            .from('noticias')
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
            resumo_seo: '',
            status: 'rascunho',
            agendado_para: ''
        })
        setEditingId(null)
        setShowNewForm(false)
    }

    const replaceImage = async (noticiaId: string) => {
        if (!newImageUrl.trim()) {
            alert('❌ Cole a URL da imagem!')
            return
        }

        setUploadingImage(true)

        try {
            const { error } = await supabase
                .from('Pedidos_Imagem')
                .insert({
                    noticia_id: noticiaId,
                    url_sugerida: newImageUrl,
                    status: 'pendente'
                })

            if (error) throw error

            setReplacingImageId(null)
            setNewImageUrl('')
            alert('🤖 Pedido enviado pro robô!')
        } catch (err: any) {
            console.error('Erro ao criar pedido:', err)
            alert(`❌ Erro: ${err.message}`)
        } finally {
            setUploadingImage(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
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

                {(showNewForm || editingId) && (
                    <div className="grid lg:grid-cols-3 gap-8 mb-8">
                        {/* Main Editor Column */}
                        <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6 border-t-4 border-blue-500">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {editingId ? '✏️ Editar Notícia' : '➕ Nova Notícia'}
                                </h2>
                                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Título *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.titulo_viral}
                                        onChange={(e) => setFormData({ ...formData, titulo_viral: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-lg font-medium"
                                        placeholder="Título chamativo..."
                                    />
                                </div>

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
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Resumo SEO
                                    </label>
                                    <textarea
                                        value={formData.resumo_seo}
                                        onChange={(e) => setFormData({ ...formData, resumo_seo: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        rows={2}
                                        maxLength={160}
                                    />
                                    <p className="text-xs text-right text-gray-500">{formData.resumo_seo.length}/160</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Conteúdo *
                                    </label>
                                    <RichTextEditor
                                        content={formData.conteudo_html}
                                        onChange={(html) => setFormData(prev => ({ ...prev, conteudo_html: html }))}
                                    />
                                </div>

                                <div className="flex gap-3 justify-end pt-4 border-t">
                                    <button
                                        onClick={resetForm}
                                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={saveNoticia}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition shadow-lg shadow-blue-200"
                                    >
                                        <Save className="w-5 h-5" />
                                        {editingId ? 'Salvar Alterações' : 'Publicar'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar: SEO & Preview */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <RefreshCw className="w-5 h-5 text-green-600" />
                                    SEO Score: {seoAnalysis.score}/100
                                </h3>

                                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                                    <div
                                        className={`h-2.5 rounded-full ${seoAnalysis.score > 80 ? 'bg-green-600' : seoAnalysis.score > 50 ? 'bg-yellow-500' : 'bg-red-600'}`}
                                        style={{ width: `${seoAnalysis.score}%` }}
                                    ></div>
                                </div>

                                <div className="space-y-3">
                                    {seoAnalysis.issues.map((issue, idx) => (
                                        <div key={idx} className="flex items-start gap-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                            <span>{issue}</span>
                                        </div>
                                    ))}
                                    {seoAnalysis.good.map((item, idx) => (
                                        <div key={idx} className="flex items-start gap-2 text-sm text-green-700 bg-green-50 p-2 rounded">
                                            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 pt-4 border-t text-sm text-gray-500">
                                    <p>Palavras: <span className="font-medium text-gray-900">{seoAnalysis.wordCount}</span></p>
                                </div>
                            </div>

                            {/* Preview Card */}
                            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Preview no Google</h4>
                                <div className="font-sans">
                                    <div className="text-xs text-gray-800 mb-0.5 max-w-[300px] truncate">
                                        eaclique.com.br › noticia › ...
                                    </div>
                                    <div className="text-xl text-[#1a0dab] hover:underline cursor-pointer mb-1 leading-snug">
                                        {formData.titulo_viral || 'Título da Notícia aqui...'}
                                    </div>
                                    <div className="text-sm text-gray-600 leading-snug">
                                        {formData.resumo_seo || 'Descrição curta da notícia que aparecerá nos resultados de busca do Google...'}
                                    </div>
                                </div>
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
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            {noticia.imagem_capa ? (
                                                <img
                                                    src={noticia.imagem_capa}
                                                    alt={noticia.titulo_viral}
                                                    className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none'
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-24 h-24 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                                                    <FileText className="w-8 h-8 text-gray-400" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
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
                                                    <button
                                                        onClick={() => {
                                                            setReplacingImageId(noticia.id)
                                                            setNewImageUrl('')
                                                        }}
                                                        className="p-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition"
                                                        title="Trocar Imagem"
                                                    >
                                                        <RefreshCw className="w-5 h-5" />
                                                    </button>
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
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {replacingImageId && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <ImageIcon className="w-6 h-6 text-purple-600" />
                                    Trocar Imagem Automaticamente
                                </h3>
                                <button
                                    onClick={() => {
                                        setReplacingImageId(null)
                                        setNewImageUrl('')
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Cole a URL da nova imagem:
                                    </label>
                                    <input
                                        type="url"
                                        value={newImageUrl}
                                        onChange={(e) => setNewImageUrl(e.target.value)}
                                        placeholder="https://i.ytimg.com/vi/..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                        disabled={uploadingImage}
                                    />
                                    <p className="text-xs text-gray-500 mt-2">
                                        💡 Funciona com YouTube, imagens diretas, etc.
                                    </p>
                                </div>

                                <button
                                    onClick={() => replaceImage(replacingImageId)}
                                    disabled={uploadingImage || !newImageUrl.trim()}
                                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
                                >
                                    {uploadingImage ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Processando...
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className="w-5 h-5" />
                                            Trocar Imagem Agora
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
