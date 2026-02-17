'use client';

import { useAdScript } from '@/hooks/useAdScript';

export default function AdSkyscraper() {
    const script = useAdScript('skyscraper');

    if (!script) {
        return null; // No active ad
    }

    return (
        <div className="sticky top-24 w-full rounded-lg overflow-hidden" style={{ minHeight: '300px' }}>
            <div className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                <div className="text-xs text-slate-400 text-center py-1 border-b border-slate-200 dark:border-slate-700">
                    PUBLICIDADE
                </div>
                <div className="flex items-center justify-center p-2" dangerouslySetInnerHTML={{ __html: script }} />
            </div>
        </div>
    );
}
