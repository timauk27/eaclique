'use client';

import { useAdConfig, generateAdsterraCode } from '@/hooks/useAdConfig';

export default function AdInArticle() {
    const adConfig = useAdConfig('in_article');

    if (!adConfig) {
        return null; // Ad is disabled in config
    }

    const adsterraCode = generateAdsterraCode(adConfig);

    return (
        <div className="my-8 flex flex-col items-center">
            <p className="text-xs uppercase tracking-wider text-slate-400 mb-3">
                Continua após a publicidade
            </p>
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
                <iframe
                    srcDoc={adsterraCode}
                    width="300"
                    height="250"
                    frameBorder="0"
                    scrolling="no"
                    style={{ maxWidth: '100%', border: 'none', display: 'block' }}
                    title="Advertisement"
                />
            </div>
        </div>
    );
}
