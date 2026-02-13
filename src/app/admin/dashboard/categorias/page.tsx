'use client'

import { useEffect, useMemo, useState } from 'react'
import { ChevronDown, ChevronRight, ArrowUp, ArrowDown, Plus, Edit, Trash } from 'lucide-react'
import CategoryEditor from '@/components/CategoryEditor'

type Cat = {
    id: string
    nome: string
    slug?: string
    cor?: string
    ativo?: boolean
    parent_id?: string | null
    tags?: string[]
    rss_urls?: string[]
}

export default function CategoriesAdmin() {
    const [cats, setCats] = useState<Cat[]>([])
    const [expanded, setExpanded] = useState<Record<string, boolean>>({})
    const [loading, setLoading] = useState(true)
    const [editorOpen, setEditorOpen] = useState(false)
    const [editing, setEditing] = useState<Cat | null>(null)
    const [parentForNew, setParentForNew] = useState<string | null>(null)

    useEffect(() => {
        load()
    }, [])

    const load = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/admin/categorias')
            if (!res.ok) {
                const err = await res.json()
                console.error('Failed to load categories:', err)
                alert(`Erro ao carregar categorias: ${err.error || res.statusText}`)
                setCats([])
                return
            }
            const data = await res.json()
            console.log('Categories loaded:', data)
            if (Array.isArray(data)) {
                setCats(data)
            } else {
                console.error('Invalid data format:', data)
                setCats([])
            }
        } catch (e) {
            console.error('Load error:', e)
            alert('Erro de conexão ao carregar categorias.')
        } finally {
            setLoading(false)
        }
    }

    const tree = useMemo(() => {
        const map: Record<string, Cat & { children?: Cat[] }> = {}
        const roots: (Cat & { children?: Cat[] })[] = []
        if (!Array.isArray(cats)) return []
        cats.forEach(c => { map[c.id] = { ...c, children: [] } })
        cats.forEach(c => {
            if (c.parent_id && map[c.parent_id]) map[c.parent_id].children!.push(map[c.id])
            else roots.push(map[c.id])
        })
        return roots
    }, [cats])

    const toggle = (id: string) => setExpanded(s => ({ ...s, [id]: !s[id] }))

    const openCreate = (parentId: string | null = null) => {
        setParentForNew(parentId)
        setEditing(null)
        setEditorOpen(true)
    }

    const openEdit = (c: Cat) => {
        setEditing(c)
        setEditorOpen(true)
    }

    const handleSaved = (data: any) => {
        load()
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Excluir categoria?')) return
        await fetch('/api/admin/categorias', { method: 'POST', body: JSON.stringify({ action: 'delete', id }), headers: { 'Content-Type': 'application/json' } })
        load()
    }

    const reparent = async (id: string, parent_id: string | null) => {
        await fetch('/api/admin/categorias', { method: 'POST', body: JSON.stringify({ action: 'reparent', id, parent_id }), headers: { 'Content-Type': 'application/json' } })
        load()
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Categorias</h1>
                    <p className="text-sm text-gray-500">Gerencie categorias - árvore, tags e RSS</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => openCreate(null)} className="px-3 py-2 bg-green-600 text-white rounded flex items-center gap-2"><Plus />Nova Categoria</button>
                </div>
            </div>

            {loading ? (
                <div>Carregando...</div>
            ) : (
                <div className="bg-white border rounded shadow-sm p-4">
                    <div className="mb-3 p-3 border rounded text-sm text-gray-600" onDragOver={(e) => e.preventDefault()} onDrop={async (e) => {
                        e.preventDefault()
                        const draggedId = e.dataTransfer.getData('text/plain')
                        if (draggedId) await reparent(draggedId, null)
                    }}>
                        Arraste aqui para tornar raiz (drop to set as root)
                    </div>
                    <Tree nodes={tree} expanded={expanded} toggle={toggle} onCreate={openCreate} onEdit={openEdit} onDelete={handleDelete} onReparent={reparent} />
                </div>
            )}

            <CategoryEditor open={editorOpen} onClose={() => setEditorOpen(false)} onSaved={handleSaved} initial={editing || undefined} parentId={parentForNew} />
        </div>
    )
}

function Tree({ nodes, expanded, toggle, onCreate, onEdit, onDelete, onReparent }: any) {
    return (
        <ul className="space-y-2">
            {nodes.map((n: any) => (
                <Node key={n.id} node={n} level={0} expanded={expanded} toggle={toggle} onCreate={onCreate} onEdit={onEdit} onDelete={onDelete} onReparent={onReparent} />
            ))}
        </ul>
    )
}

function Node({ node, level, expanded, toggle, onCreate, onEdit, onDelete, onReparent }: any) {
    const isExpanded = expanded[node.id]
    return (
        <li>
            <div className="flex items-center gap-3">
                <div
                    style={{ marginLeft: level * 12 }}
                    className="flex items-center gap-2 flex-1"
                    draggable
                    onDragStart={(e) => { e.dataTransfer.setData('text/plain', node.id); e.dataTransfer.effectAllowed = 'move' }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={async (e) => {
                        e.preventDefault()
                        const draggedId = e.dataTransfer.getData('text/plain')
                        if (draggedId && draggedId !== node.id) {
                            await onReparent(draggedId, node.id)
                        }
                    }}
                    aria-label={`Categoria ${node.nome}`}
                >
                    {node.children && node.children.length > 0 ? (
                        <button onClick={() => toggle(node.id)} className="p-1 rounded hover:bg-gray-100" aria-label={isExpanded ? 'Colapsar' : 'Expandir'}>
                            <ChevronDown className={`w-4 h-4 ${isExpanded ? '' : 'rotate-90'}`} />
                        </button>
                    ) : (
                        <span className="w-4 h-4" />
                    )}

                    <div className="flex items-center gap-2">
                        <div style={{ width: 14, height: 14, background: node.cor || '#ccc', borderRadius: 4 }} aria-hidden />
                        <div className="font-medium">{node.nome}</div>
                        {!node.ativo && <div className="text-xs text-red-600 ml-2">Inativo</div>}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button title="Adicionar filha" onClick={() => onCreate(node.id)} className="p-1 rounded hover:bg-gray-100" aria-label="Adicionar filha"><Plus className="w-4 h-4" /></button>
                    <button title="Editar" onClick={() => onEdit(node)} className="p-1 rounded hover:bg-gray-100" aria-label="Editar"><Edit className="w-4 h-4" /></button>
                    <button title="Excluir" onClick={() => onDelete(node.id)} className="p-1 rounded hover:bg-gray-100" aria-label="Excluir"><Trash className="w-4 h-4 text-red-600" /></button>
                    <button title="Tornar pai" onClick={() => onReparent(node.id, null)} className="p-1 rounded hover:bg-gray-100" aria-label="Tornar pai">Pai</button>
                </div>
            </div>

            {isExpanded && node.children && node.children.length > 0 && (
                <ul className="mt-2">
                    {node.children.map((c: any) => (
                        <Node key={c.id} node={c} level={level + 1} expanded={expanded} toggle={toggle} onCreate={onCreate} onEdit={onEdit} onDelete={onDelete} onReparent={onReparent} />
                    ))}
                </ul>
            )}
        </li>
    )
}
