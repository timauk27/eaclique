'use client'

import { useState } from 'react'
import { MessageCircle, Twitter, Linkedin, Link2, Check } from 'lucide-react'

interface ShareBarProps {
    title: string
    url: string
}

export default function ShareBar({ title, url }: ShareBarProps) {
    const [copied, setCopied] = useState(false)

    const shareLinks = {
        whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' - ' + url)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    }

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    return (
        <>
            {/* Desktop - Sticky Vertical Bar */}
            <div className="hidden lg:flex sticky top-24 flex-col gap-3 h-fit">
                <a
                    href={shareLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 text-white transition-all duration-200 shadow-lg hover:shadow-green-500/50"
                    title="Compartilhar no WhatsApp"
                >
                    <MessageCircle className="h-5 w-5" />
                </a>

                <a
                    href={shareLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-all duration-200 shadow-lg"
                    title="Compartilhar no Twitter"
                >
                    <Twitter className="h-5 w-5" />
                </a>

                <a
                    href={shareLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 shadow-lg"
                    title="Compartilhar no LinkedIn"
                >
                    <Linkedin className="h-5 w-5" />
                </a>

                <button
                    onClick={handleCopyLink}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-700 hover:bg-slate-600 text-white transition-all duration-200 shadow-lg"
                    title="Copiar link"
                >
                    {copied ? <Check className="h-5 w-5" /> : <Link2 className="h-5 w-5" />}
                </button>
            </div>

            {/* Mobile - Horizontal Bar at Bottom */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-800 shadow-2xl">
                <div className="flex items-center justify-around py-3 px-4">
                    <a
                        href={shareLinks.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-1 text-green-500"
                    >
                        <MessageCircle className="h-6 w-6" />
                        <span className="text-xs">WhatsApp</span>
                    </a>

                    <a
                        href={shareLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-1 text-slate-300"
                    >
                        <Twitter className="h-6 w-6" />
                        <span className="text-xs">Twitter</span>
                    </a>

                    <a
                        href={shareLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-1 text-blue-500"
                    >
                        <Linkedin className="h-6 w-6" />
                        <span className="text-xs">LinkedIn</span>
                    </a>

                    <button
                        onClick={handleCopyLink}
                        className="flex flex-col items-center gap-1 text-slate-300"
                    >
                        {copied ? <Check className="h-6 w-6" /> : <Link2 className="h-6 w-6" />}
                        <span className="text-xs">{copied ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                </div>
            </div>
        </>
    )
}
