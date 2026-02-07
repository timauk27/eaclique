'use client';

import { useAdConfig, generateAdsterraCode } from '@/hooks/useAdConfig';

export default function AdSkyscraper() {
    const adConfig = useAdConfig('skyscraper');

    if (!adConfig) {
        return null; // Ad is disabled in config
    }

    const adsterraCode = generateAdsterraCode(adConfig);

    return (
        <div className="sticky top-24 w-full rounded-lg overflow-hidden" style={{ minHeight: '600px' }}>
            <div className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                <div className="text-xs text-slate-400 text-center py-1 border-b border-slate-200 dark:border-slate-700">
                    PUBLICIDADE
                </div>
                <div className="flex items-center justify-center">
                    <iframe
                        srcDoc={adsterraCode}
                        width="160"
                        height="600"
                        frameBorder="0"
                        scrolling="no"
                        style={{ border: 'none', display: 'block' }}
                        title="Advertisement"
                    />
                </div>
            </div>
        </div>
    );
}
