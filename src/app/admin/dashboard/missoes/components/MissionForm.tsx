'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function MissionForm({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
    const [tipoMissao, setTipoMissao] = useState<'link_especifico' | 'pesquisa_tematica'>('pesquisa_tematica')
    const [urlAlvo, setUrlAlvo] = useState('')
    const [termoBusca, setTermoBusca] = useState('')
    const [categoriaAlvo, setCategoriaAlvo] = useState('')
    const [subcategoria, setSubcategoria] = useState('')
    const [prioridade, setPrioridade] = useState(5)
    const [loading, setLoading] = useState(false)
    const [categorias, setCategorias] = useState<any[]>([])
    const supabase = createClient()

    useEffect(() => {
        const fetchCategorias = async () => {
            console.log("Fetching categories...")
            const { data, error } = await supabase
                .from('categorias')
                .select('id, nome')
                .order('nome', { ascending: true })

            if (error) {
                console.error("Error fetching categories:", error)
            } else {
                console.log("Categories fetched:", data)
                if (data) {
                    setCategorias(data)
                }
            }
        }
        fetchCategorias()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Debug: Check user session
            const { data: { user }, error: userError } = await supabase.auth.getUser()

            if (userError) {
                console.error("Erro ao obter user:", userError)
            }

            if (!user) {
                console.error("ERRO CRÍTICO: Usuário não autenticado no cliente Supabase!")
                // Opcional: throw new Error("Usuário não autenticado via Supabase Client")
            } else {
                console.log("Usuário logado:", user.id)
            }

            const payload: any = {
                tipo_missao: tipoMissao,
                categoria_alvo_nome: categoriaAlvo,
                subcategoria: subcategoria || null,
                prioridade,
                status: 'PENDENTE'
            }

            if (tipoMissao === 'link_especifico') {
                payload.url_alvo = urlAlvo
                payload.termo_busca = null
            } else {
                payload.termo_busca = termoBusca
                payload.url_alvo = null
            }

            console.log("Enviando payload:", payload)

            const { error } = await supabase.from('missoes').insert([payload])

            if (error) {
                console.error("Erro Supabase detalhado (INSERT):", error)
                throw error
            }

            alert('✅ Missão criada com sucesso!')
            onSuccess()
        } catch (error: any) {
            console.error('Erro ao processar missão:', error)
            alert(`❌ Erro: ${error.message || JSON.stringify(error)}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mission Type */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Missão
                </label>
                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => setTipoMissao('link_especifico')}
                        className={`p-4 border-2 rounded-lg text-left transition ${tipoMissao === 'link_especifico'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <div className="font-bold text-gray-900">🎯 Link Específico</div>
                        <div className="text-sm text-gray-500 mt-1">
                            Processar uma URL específica
                        </div>
                    </button>
                    <button
                        type="button"
                        onClick={() => setTipoMissao('pesquisa_tematica')}
                        className={`p-4 border-2 rounded-lg text-left transition ${tipoMissao === 'pesquisa_tematica'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <div className="font-bold text-gray-900">🔍 Pesquisa Temática</div>
                        <div className="text-sm text-gray-500 mt-1">
                            Buscar notícias por termo
                        </div>
                    </button>
                </div>
            </div>

            {/* Conditional Fields */}
            {tipoMissao === 'link_especifico' ? (
                <div>
                    <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                        URL Alvo *
                    </label>
                    <input
                        type="url"
                        id="url"
                        required
                        value={urlAlvo}
                        onChange={(e) => setUrlAlvo(e.target.value)}
                        placeholder="https://exemplo.com/noticia"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            ) : (
                <div>
                    <label htmlFor="termo" className="block text-sm font-medium text-gray-700 mb-2">
                        Termo de Busca *
                    </label>
                    <input
                        type="text"
                        id="termo"
                        required
                        value={termoBusca}
                        onChange={(e) => setTermoBusca(e.target.value)}
                        placeholder="Ex: Carnaval Rio 2026"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            )}

            {/* Category */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-2">
                        Categoria Alvo *
                    </label>
                    <select
                        id="categoria"
                        required
                        value={categoriaAlvo}
                        onChange={(e) => setCategoriaAlvo(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Selecione...</option>
                        {categorias.map((cat) => (
                            <option key={cat.id} value={cat.nome}>
                                {cat.nome}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="subcategoria" className="block text-sm font-medium text-gray-700 mb-2">
                        Subcategoria (Opcional)
                    </label>
                    <input
                        type="text"
                        id="subcategoria"
                        value={subcategoria}
                        onChange={(e) => setSubcategoria(e.target.value)}
                        placeholder="Ex: Carnaval, Rio"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Priority */}
            <div>
                <label htmlFor="prioridade" className="block text-sm font-medium text-gray-700 mb-2">
                    Prioridade: {prioridade}
                </label>
                <input
                    type="range"
                    id="prioridade"
                    min="1"
                    max="10"
                    value={prioridade}
                    onChange={(e) => setPrioridade(Number(e.target.value))}
                    className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1 (Baixa)</span>
                    <span>5 (Média)</span>
                    <span>10 (Alta)</span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg font-semibold transition"
                >
                    {loading ? 'Criando...' : '🚀 Enviar Missão'}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                    Cancelar
                </button>
            </div>
        </form>
    )
}
