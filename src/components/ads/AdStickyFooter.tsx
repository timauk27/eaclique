'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

export default function AdStickyFooter() {
    const [isVisible, setIsVisible] = useState(true)

    if (!isVisible) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900 border-t border-slate-800 shadow-2xl lg:bottom-auto lg:top-0">
            <div className="relative flex items-center justify-center h-24 lg:h-32">
                <div className="text-center text-slate-400">
                    <p className="text-sm font-medium">PUBLICIDADE</p>
                    <p className="text-xs mt-1">728x90 Sticky Banner</p>
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute right-2 top-2 p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                    aria-label="Fechar anúncio"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}
