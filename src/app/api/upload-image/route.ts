import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Remove top-level client creation
// const supabase = createClient(...)

export async function POST(req: NextRequest) {
    try {
        // Initialize Supabase client at runtime to avoid build-time errors
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
            console.error('❌ Supabase credentials missing')
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        )

        const { imageUrl, noticiaId } = await req.json()

        if (!imageUrl) {
            return NextResponse.json({ error: 'URL da imagem é obrigatória' }, { status: 400 })
        }

        // 1. Download da imagem
        console.log('📥 Baixando imagem de:', imageUrl)
        const imageResponse = await fetch(imageUrl)

        if (!imageResponse.ok) {
            throw new Error(`Erro ao baixar imagem: ${imageResponse.statusText}`)
        }

        const contentType = imageResponse.headers.get('content-type') || 'image/jpeg'
        const imageBuffer = await imageResponse.arrayBuffer()
        const buffer = Buffer.from(imageBuffer)

        // 2. Gerar nome único
        const timestamp = Date.now()
        const extension = contentType.split('/')[1] || 'jpg'
        const fileName = `noticia_${noticiaId}_${timestamp}.${extension}`
        const filePath = `noticias/${fileName}`

        // 3. Upload para Supabase Storage
        console.log('☁️ Fazendo upload para Supabase:', filePath)
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('imagens')
            .upload(filePath, buffer, {
                contentType,
                upsert: true
            })

        if (uploadError) {
            console.error('Erro no upload:', uploadError)
            throw uploadError
        }

        // 4. Obter URL pública
        const { data: { publicUrl } } = supabase.storage
            .from('imagens')
            .getPublicUrl(filePath)

        console.log('✅ Upload concluído:', publicUrl)

        return NextResponse.json({
            success: true,
            publicUrl,
            fileName
        })

    } catch (error: any) {
        console.error('❌ Erro ao processar imagem:', error)
        return NextResponse.json(
            { error: error.message || 'Erro ao processar imagem' },
            { status: 500 }
        )
    }
}
