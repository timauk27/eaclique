'use client';

import { useAdScript } from '@/hooks/useAdScript';

export default function AdInArticle() {
    const script = useAdScript('in_article');

    if (!script) {
        return null; // No active ad
    }

    return (
        <div className="my-8 flex flex-col items-center">
            <p className="text-xs uppercase tracking-wider text-slate-400 mb-3">
                Continua após a publicidade
            </p>
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
                <div dangerouslySetInnerHTML={{ __html: script }} />
            </div>
        </div>
    );
}
