'use client';

import { useAdScript } from '@/hooks/useAdScript';

export default function AdBillboard() {
    const script = useAdScript('billboard');

    if (!script) {
        return null; // No active ad
    }

    return (
        <div className="w-full flex justify-center my-4">
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden" style={{ minWidth: '300px', minHeight: '50px' }}>
                <div className="text-xs text-slate-400 text-center py-1 border-b border-slate-200 dark:border-slate-700">
                    PUBLICIDADE
                </div>
                <div className="flex justify-center" dangerouslySetInnerHTML={{ __html: script }} />
            </div>
        </div>
    );
}
