'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Edit, Trash2, X, List as ListIcon, Save, MoveUp, MoveDown } from 'lucide-react'

interface MenuLink {
    id: string
    nome: string
    link_url: string
    ordem: number
    ativo: boolean
    created_at: string
}

export default function AdminMenusPage() {
    const [menus, setMenus] = useState<MenuLink[]>([])
    const [loading, setLoading] = useState(true)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [showForm, setShowForm] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        nome: '',
        link_url: '',
        ativo: true
    })

    const loadMenus = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('menus')
            .select('*')
            .order('ordem', { ascending: true }) // important: ordered by 'ordem'

        if (!error && data) {
            setMenus(data)
        }
        setLoading(false)
    }

    useEffect(() => {
        loadMenus()
    }, [])

    const deleteMenu = async (id: string) => {
        if (!confirm('Tem certeza que deseja deletar este link do menu principal?')) return

        const { error } = await supabase
            .from('menus')
            .delete()
            .eq('id', id)

        if (!error) {
            loadMenus()
        } else {
            alert('Erro ao excluir: ' + error.message)
        }
    }

    const saveMenu = async () => {
        if (!formData.nome || !formData.link_url) {
            alert('Nome e Link são obrigatórios!')
            return
        }

        const dataToSave = {
            nome: formData.nome,
            link_url: formData.link_url,
            ativo: formData.ativo,
            updated_at: new Date().toISOString()
        }

        if (editingId) {
            const { error } = await supabase
                .from('menus')
                .update(dataToSave)
                .eq('id', editingId)

            if (!error) {
                resetForm()
                loadMenus()
            } else {
                alert(`Erro ao atualizar: ${error.message}`)
            }
        } else {
            // nova insercao vai pro final (maior ordem + 1)
            const nextOrdem = menus.length > 0 ? Math.max(...menus.map(m => m.ordem)) + 1 : 0

            const { error } = await supabase
                .from('menus')
                .insert([{ ...dataToSave, ordem: nextOrdem }])

            if (!error) {
                resetForm()
                loadMenus()
            } else {
                alert(`Erro ao criar: ${error.message}`)
            }
        }
    }

    const changeOrder = async (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === menus.length - 1) return;

        const newMenus = [...menus];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;

        // Swap ordem values
        const tempOrdem = newMenus[index].ordem;
        newMenus[index].ordem = newMenus[swapIndex].ordem;
        newMenus[swapIndex].ordem = tempOrdem;

        // Visual update immediately
        // re-sort based on new order
        newMenus.sort((a, b) => a.ordem - b.ordem);
        setMenus(newMenus);

        // Batch update to Supabase
        // Update item 1
        await supabase.from('menus').update({ ordem: newMenus.find(m => m.id === menus[index].id)?.ordem }).eq('id', menus[index].id);
        // Update item 2
        await supabase.from('menus').update({ ordem: newMenus.find(m => m.id === menus[swapIndex].id)?.ordem }).eq('id', menus[swapIndex].id);

        loadMenus(); // reload to ensure consistency
    }

    const toggleAtivo = async (menu: MenuLink) => {
        await supabase.from('menus').update({ ativo: !menu.ativo }).eq('id', menu.id)
        loadMenus()
    }

    const resetForm = () => {
        setFormData({ nome: '', link_url: '', ativo: true })
        setEditingId(null)
        setShowForm(false)
    }

    const startEdit = (menu: MenuLink) => {
        setEditingId(menu.id)
        setFormData({
            nome: menu.nome || '',
            link_url: menu.link_url || '',
            ativo: menu.ativo
        })
        setShowForm(true)
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                            <ListIcon className="w-8 h-8 text-blue-600" />
                            Gerenciador de Menu Principal
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Controle a barra de navegação superior do seu portal de forma dinâmica.
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Lista (Lado Esquerdo/Maior) */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
                                <h2 className="text-lg font-bold text-gray-900">Links do Menu</h2>
                                <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                                    {menus.length} itens
                                </span>
                            </div>

                            {loading ? (
                                <div className="p-8 text-center text-gray-500">Carregando...</div>
                            ) : menus.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">Nenhum link no menu principal.</div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {menus.map((menu, index) => (
                                        <div key={menu.id} className={`p-4 hover:bg-gray-50 transition flex items-center justify-between gap-4 ${!menu.ativo ? 'opacity-50' : ''}`}>
                                            <div className="flex flex-col gap-1 w-12 items-center flex-shrink-0">
                                                <button onClick={() => changeOrder(index, 'up')} disabled={index === 0} className="text-gray-400 hover:text-gray-700 disabled:opacity-30">
                                                    <MoveUp className="w-4 h-4" />
                                                </button>
                                                <span className="text-xs font-bold text-gray-400">{index + 1}</span>
                                                <button onClick={() => changeOrder(index, 'down')} disabled={index === menus.length - 1} className="text-gray-400 hover:text-gray-700 disabled:opacity-30">
                                                    <MoveDown className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                                                    {menu.nome}
                                                    {!menu.ativo && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 rounded uppercase">Inativo</span>}
                                                </h3>
                                                <p className="text-sm text-gray-500 truncate font-mono mt-0.5">{menu.link_url}</p>
                                            </div>

                                            <div className="flex items-center gap-1 flex-shrink-0">
                                                <button
                                                    onClick={() => toggleAtivo(menu)}
                                                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${menu.ativo ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                                                >
                                                    {menu.ativo ? 'Visível' : 'Oculto'}
                                                </button>
                                                <button onClick={() => startEdit(menu)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Editar">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => deleteMenu(menu.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Deletar">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Formulário (Lado Direito) */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
                            <div className="flex justify-between items-center border-b pb-4 mb-4">
                                <h3 className="text-lg font-bold text-gray-900">
                                    {editingId ? 'Editar Item' : 'Adicionar Item'}
                                </h3>
                                {editingId && (
                                    <button onClick={resetForm} className="text-gray-400 hover:text-gray-700">
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nome no Menu</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Sobre Nós"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.nome}
                                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">URL / Link</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: /pagina/sobre-nos"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.link_url}
                                        onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Dica: Use URLs relativas como <code>/category/tecnologia</code> para links internos.</p>
                                </div>

                                <div className="pt-2">
                                    <button
                                        onClick={saveMenu}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition"
                                    >
                                        {editingId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                        {editingId ? 'Salvar Edição' : 'Adicionar ao Menu'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
