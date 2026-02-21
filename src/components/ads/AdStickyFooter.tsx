'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useAdScript } from '@/hooks/useAdScript';

export default function AdStickyFooter() {
    const [isVisible, setIsVisible] = useState(true);
    const script = useAdScript('footer_sticky');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!script || !containerRef.current) return;
        containerRef.current.innerHTML = '';
        try {
            const fragment = document.createRange().createContextualFragment(script);
            containerRef.current.appendChild(fragment);
        } catch (error) {
            console.error('Erro injetando anúncio footer_sticky:', error);
        }
    }, [script]);

    if (!isVisible || !script) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900 border-t border-slate-800 shadow-2xl lg:hidden">
            <div className="relative flex items-center justify-center p-2">
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute right-2 top-2 p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors z-50"
                    aria-label="Fechar anúncio"
                >
                    <X className="h-4 w-4" />
                </button>
                <div ref={containerRef} />
            </div>
        </div>
    );
}
