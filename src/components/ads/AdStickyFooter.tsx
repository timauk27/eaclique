'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useAdConfig, generateAdsterraCode } from '@/hooks/useAdConfig';

export default function AdStickyFooter() {
    const [isVisible, setIsVisible] = useState(true);
    const adConfig = useAdConfig('sticky_footer');

    if (!isVisible || !adConfig) {
        return null;
    }

    const adsterraCode = generateAdsterraCode(adConfig);

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900 border-t border-slate-800 shadow-2xl lg:hidden">
            <div className="relative flex items-center justify-center p-2">
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute right-2 top-2 p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                    aria-label="Fechar anúncio"
                >
                    <X className="h-4 w-4" />
                </button>
                <iframe
                    srcDoc={adsterraCode}
                    width="320"
                    height="50"
                    frameBorder="0"
                    scrolling="no"
                    style={{ border: 'none', display: 'block' }}
                    title="Advertisement"
                />
            </div>
        </div>
    );
}
