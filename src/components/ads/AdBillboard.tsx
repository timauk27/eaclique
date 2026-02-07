'use client';

import { useAdConfig, generateAdsterraCode } from '@/hooks/useAdConfig';

export default function AdBillboard() {
    const adConfig = useAdConfig('billboard');

    if (!adConfig) {
        return null; // Ad is disabled in config
    }

    const adsterraCode = generateAdsterraCode(adConfig);

    return (
        <div className="w-full flex justify-center my-4">
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden" style={{ maxWidth: '728px' }}>
                <div className="text-xs text-slate-400 text-center py-1 border-b border-slate-200 dark:border-slate-700">
                    PUBLICIDADE
                </div>
                <iframe
                    srcDoc={adsterraCode}
                    width="728"
                    height="90"
                    frameBorder="0"
                    scrolling="no"
                    style={{ maxWidth: '100%', border: 'none', display: 'block' }}
                    title="Advertisement"
                />
            </div>
        </div>
    );
}
