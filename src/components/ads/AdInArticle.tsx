export default function AdInArticle() {
    return (
        <div className="my-8 flex flex-col items-center">
            <p className="text-xs uppercase tracking-wider text-slate-400 mb-3">
                Continua após a publicidade
            </p>
            <div className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-center h-64">
                <div className="text-center text-slate-400">
                    <p className="text-sm font-medium">PUBLICIDADE</p>
                    <p className="text-xs mt-1">728x90 ou 300x250</p>
                </div>
            </div>
        </div>
    )
}
