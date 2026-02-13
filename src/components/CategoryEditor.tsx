'use client'

import { useEffect, useState } from 'react'

interface Props {
    open: boolean
    onClose: () => void
    onSaved: (data: any) => void
    initial?: any
    parentId?: string | null
}

export default function CategoryEditor({ open, onClose, onSaved, initial, parentId }: Props) {
    const [nome, setNome] = useState(initial?.nome || '')
    const [slug, setSlug] = useState(initial?.slug || '')
    const [cor, setCor] = useState(initial?.cor || '#ff0000')
    const [ativo, setAtivo] = useState(initial?.ativo ?? true)
    const [tags, setTags] = useState<string>((initial?.tags || []).join(', '))
    const [rss, setRss] = useState<string>((initial?.rss_urls || []).join('\n'))
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        setNome(initial?.nome || '')
        setSlug(initial?.slug || '')
        setCor(initial?.cor || '#ff0000')
        setAtivo(initial?.ativo ?? true)
        setTags((initial?.tags || []).join(', '))
        setRss((initial?.rss_urls || []).join('\n'))
    }, [initial])

    useEffect(() => {
        // auto-generate slug when nome changes and slug not manually edited
        if (!initial) {
            const s = nome
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .trim()
                .replace(/\s+/g, '-')
            setSlug(s)
        }
    }, [nome])

    if (!open) return null

    const handleSave = async () => {
        setSaving(true)
        try {
            const payload: any = {
                action: initial?.id ? 'update' : 'create',
                id: initial?.id,
                nome,
                slug,
                cor,
                ativo,
                parent_id: parentId || (initial?.parent_id ?? null),
                tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
                rss_urls: rss.split(/\n|,|;/).map((r) => r.trim()).filter(Boolean),
            }

            const res = await fetch('/api/admin/categorias', {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: { 'Content-Type': 'application/json' }
            })

            const data = await res.json()

            if (!res.ok) {
                alert(`Erro ao salvar: ${data.error || 'Erro desconhecido'}`)
                console.error(data)
                setSaving(false)
                return
            }

            setSaving(false)
            onSaved(data)
            onClose()
        } catch (e) {
            console.error(e)
            alert('Erro de conexão ao salvar categoria.')
            setSaving(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-[720px] p-6">
                <h3 className="text-lg font-bold mb-4">{initial ? 'Editar Categoria' : 'Criar Categoria'}</h3>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm">Nome</label>
                        <input value={nome} onChange={e => setNome(e.target.value)} className="mt-1 w-full border px-2 py-1 rounded" />
                    </div>
                    <div>
                        <label className="block text-sm">Slug</label>
                        <input value={slug} onChange={e => setSlug(e.target.value)} className="mt-1 w-full border px-2 py-1 rounded" />
                    </div>
                    <div>
                        <label className="block text-sm">Cor</label>
                        <input type="color" value={cor} onChange={e => setCor(e.target.value)} className="mt-1 h-10 w-20 p-0" />
                    </div>
                    <div>
                        <label className="block text-sm">Ativo</label>
                        <div className="mt-1">
                            <label className="inline-flex items-center">
                                <input type="checkbox" checked={ativo} onChange={e => setAtivo(e.target.checked)} className="mr-2" />
                                <span>Ativo</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <label className="block text-sm">Tags (separadas por vírgula)</label>
                    <input value={tags} onChange={e => setTags(e.target.value)} className="mt-1 w-full border px-2 py-1 rounded" />
                </div>

                <div className="mt-4">
                    <label className="block text-sm">RSS URLs (uma por linha)</label>
                    <textarea value={rss} onChange={e => setRss(e.target.value)} className="mt-1 w-full border px-2 py-1 rounded h-24" />
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 rounded border">Cancelar</button>
                    <button onClick={handleSave} disabled={saving} className="px-4 py-2 rounded bg-blue-600 text-white">{saving ? 'Salvando...' : 'Salvar'}</button>
                </div>
            </div>
        </div>
    )
}
