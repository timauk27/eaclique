'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Image as ImageIcon, Quote, Undo, Redo, Heading1, Heading2, Search, X, Link2 } from 'lucide-react'
import { useCallback, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface RichTextEditorProps {
    content: string
    onChange: (html: string) => void
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 underline',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full h-auto my-4',
                },
            }),
        ],
        content: content,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        immediatelyRender: false,
    })

    const [showLinkModal, setShowLinkModal] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<any[]>([])
    const [isSearching, setIsSearching] = useState(false)

    const searchNoticias = async (query: string) => {
        if (!query.trim()) {
            setSearchResults([])
            return
        }
        setIsSearching(true)
        const { data, error } = await supabase
            .from('noticias')
            .select('id, titulo_viral, slug, categoria')
            .ilike('titulo_viral', `%${query}%`)
            .order('created_at', { ascending: false })
            .limit(10)

        if (!error && data) {
            setSearchResults(data)
        }
        setIsSearching(false)
    }

    const insertInternalLink = useCallback((href: string) => {
        if (!editor) return
        editor.chain().focus().extendMarkRange('link').setLink({ href }).run()
        setShowLinkModal(false)
        setSearchQuery('')
        setSearchResults([])
    }, [editor])

    const setLink = useCallback(() => {
        if (!editor) return
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL', previousUrl)

        // cancelled
        if (url === null) return

        // empty
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }

        // update
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }, [editor])

    const addImage = useCallback(() => {
        if (!editor) return
        const url = window.prompt('URL da imagem')

        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }, [editor])

    if (!editor) {
        return null
    }

    const ToolbarButton = ({ onClick, active = false, disabled = false, children, title }: any) => (
        <button
            onClick={(e) => { e.preventDefault(); onClick() }}
            disabled={disabled}
            className={`p-2 rounded hover:bg-gray-100 transition ${active ? 'bg-gray-200 text-blue-600' : 'text-gray-600'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={title}
        >
            {children}
        </button>
    )

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden flex flex-col bg-white">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    active={editor.isActive('bold')}
                    title="Negrito"
                >
                    <Bold className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    active={editor.isActive('italic')}
                    title="Itálico"
                >
                    <Italic className="w-4 h-4" />
                </ToolbarButton>

                <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    active={editor.isActive('heading', { level: 2 })}
                    title="Título H2"
                >
                    <Heading1 className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    active={editor.isActive('heading', { level: 3 })}
                    title="Subtítulo H3"
                >
                    <Heading2 className="w-4 h-4" />
                </ToolbarButton>

                <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    active={editor.isActive('bulletList')}
                    title="Lista com marcadores"
                >
                    <List className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    active={editor.isActive('orderedList')}
                    title="Lista numerada"
                >
                    <ListOrdered className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    active={editor.isActive('blockquote')}
                    title="Citação"
                >
                    <Quote className="w-4 h-4" />
                </ToolbarButton>

                <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

                <ToolbarButton onClick={setLink} active={editor.isActive('link')} title="Adicionar Link Externo">
                    <LinkIcon className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => setShowLinkModal(true)} title="Linkar Matéria (SEO Interno)">
                    <Link2 className="w-4 h-4 text-green-600" />
                </ToolbarButton>
                <ToolbarButton onClick={addImage} title="Adicionar Imagem">
                    <ImageIcon className="w-4 h-4" />
                </ToolbarButton>

                <div className="flex-1" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    title="Desfazer"
                >
                    <Undo className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    title="Refazer"
                >
                    <Redo className="w-4 h-4" />
                </ToolbarButton>
            </div>

            {/* Editor Area */}
            <div className="flex-1 bg-white min-h-[400px]">
                <EditorContent editor={editor} className="h-full" />
            </div>

            {/* Status Bar */}
            <div className="px-3 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex justify-between">
                <span>
                    {editor.storage.characterCount?.words?.() || 0} palavras
                </span>
                <span>
                    HTML Mode
                </span>
            </div>

            {/* Internal Link Modal */}
            {showLinkModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <Search className="w-5 h-5 text-blue-600" />
                                Pesquisa de Link Interno
                            </h3>
                            <button onClick={() => setShowLinkModal(false)} className="text-gray-400 hover:text-gray-700">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar notícia pelo título..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                searchNoticias(e.target.value);
                            }}
                            autoFocus
                        />
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {isSearching ? (
                                <p className="text-gray-500 text-sm text-center py-4">Buscando...</p>
                            ) : searchResults.length > 0 ? (
                                searchResults.map(res => (
                                    <button
                                        key={res.id}
                                        className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition"
                                        onClick={() => insertInternalLink(`/noticia/${res.slug}`)}
                                    >
                                        <span className="block text-xs font-semibold text-blue-600 bg-blue-100 uppercase px-2 py-0.5 rounded inline-block mb-1">
                                            {res.categoria}
                                        </span>
                                        <span className="block text-sm font-semibold text-gray-800 line-clamp-2">
                                            {res.titulo_viral}
                                        </span>
                                    </button>
                                ))
                            ) : searchQuery.trim() !== '' ? (
                                <p className="text-gray-500 text-sm text-center py-4">Nenhuma notícia encontrada.</p>
                            ) : (
                                <p className="text-gray-400 text-sm text-center py-4">Digite para buscar artigos do seu portal e fortalecer o SEO.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
