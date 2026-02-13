import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

async function requireAdmin(supabase: any) {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw new Error('Auth check failed')
    if (!session) throw { status: 401, message: 'Unauthorized' }
    const user = session.user
    const role = (user?.app_metadata as any)?.role
    if (role !== 'admin') throw { status: 403, message: 'Forbidden' }
}

function validateSlug(s: string) {
    return s && /^[a-z0-9\-]+$/.test(s)
}

function sanitizeArrayOfStrings(arr: any) {
    if (!Array.isArray(arr)) return []
    return arr.map(String).map(s => s.trim()).filter(Boolean)
}

async function wouldCreateCycle(supabase: any, id: string, parent_id: string | null) {
    if (!parent_id) return false
    if (id === parent_id) return true
    let current = parent_id
    const seen = new Set<string>()
    while (current) {
        if (seen.has(current)) break
        if (current === id) return true
        seen.add(current)
        const { data, error } = await supabase.from('categorias').select('parent_id').eq('id', current).maybeSingle()
        if (error) break
        if (!data) break
        current = data.parent_id
    }
    return false
}

export async function GET() {
    try {
        const supabase = await createClient()
        // try { await requireAdmin(supabase) } catch (e: any) { return NextResponse.json({ error: e.message || 'Auth' }, { status: e.status || 401 }) }

        const { data, error } = await supabase
            .from('categorias')
            .select('*')
            .order('nome', { ascending: true })

        if (error) throw error

        return NextResponse.json(data || [])
    } catch (err: any) {
        console.error('GET /api/admin/categorias error', err)
        return NextResponse.json({ error: err.message || 'Erro' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        // try { await requireAdmin(supabase) } catch (e: any) { return NextResponse.json({ error: e.message || 'Auth' }, { status: e.status || 401 }) }

        const body = await request.json()
        const { action } = body

        if (action === 'create') {
            if (!body.nome || String(body.nome).trim().length === 0) return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 })
            const slug = body.slug || String(body.nome).toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
            if (!validateSlug(slug)) return NextResponse.json({ error: 'Slug inválido' }, { status: 400 })

            const parent_id = body.parent_id || null
            if (parent_id && await wouldCreateCycle(supabase, 'TEMP_ID', parent_id)) {
                // 'TEMP_ID' is placeholder; since new record has no id yet, only check parent exists
            }

            const payload = {
                nome: body.nome,
                slug,
                cor: body.cor || '#ff0000',
                ativo: body.ativo ?? true,
                parent_id: parent_id,
                tags: sanitizeArrayOfStrings(body.tags),
                rss_urls: sanitizeArrayOfStrings(body.rss_urls),
            }

            const { data, error } = await supabase.from('categorias').insert(payload).select().single()
            if (error) throw error
            return NextResponse.json(data)
        }

        if (action === 'update') {
            const { id, parent_id } = body
            if (!id) return NextResponse.json({ error: 'id é obrigatório' }, { status: 400 })
            if (parent_id && await wouldCreateCycle(supabase, id, parent_id)) return NextResponse.json({ error: 'Ciclo detectado' }, { status: 400 })

            const rest = {
                nome: body.nome,
                slug: body.slug,
                cor: body.cor,
                ativo: body.ativo,
                parent_id: body.parent_id ?? null,
                tags: sanitizeArrayOfStrings(body.tags),
                rss_urls: sanitizeArrayOfStrings(body.rss_urls),
            }

            const { data, error } = await supabase.from('categorias').update(rest).eq('id', id).select().single()
            if (error) throw error
            return NextResponse.json(data)
        }

        if (action === 'delete') {
            const { id } = body
            if (!id) return NextResponse.json({ error: 'id é obrigatório' }, { status: 400 })
            const { error } = await supabase.from('categorias').delete().eq('id', id)
            if (error) throw error
            return NextResponse.json({ success: true })
        }

        if (action === 'reparent') {
            const { id, parent_id } = body
            if (!id) return NextResponse.json({ error: 'id é obrigatório' }, { status: 400 })
            if (parent_id && await wouldCreateCycle(supabase, id, parent_id)) return NextResponse.json({ error: 'Ciclo detectado' }, { status: 400 })

            const { data, error } = await supabase.from('categorias').update({ parent_id: parent_id ?? null }).eq('id', id).select().single()
            if (error) throw error
            return NextResponse.json(data)
        }

        return NextResponse.json({ error: 'Ação inválida' }, { status: 400 })
    } catch (err: any) {
        console.error('POST /api/admin/categorias error', err)
        return NextResponse.json({ error: err.message || 'Erro' }, { status: 500 })
    }
}
