import { cn } from "@/lib/utils";

export function SectionHeader({ title, color }: { title: string, color: string }) {
    return (
        <div className="flex items-center justify-between border-b-2 border-gray-100 mb-6 pb-2" style={{ borderColor: `var(--color-${color})` }}>
            <div className="flex items-center gap-3">
                <span className="block w-3 h-8 rounded-sm" style={{ backgroundColor: `var(--color-${color})` }}></span>
                <h2 className="text-2xl font-black uppercase tracking-tight leading-none text-gray-900">
                    {title}
                </h2>
            </div>
            <button className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-gray-900 transition-colors">
                Ver Tudo +
            </button>
        </div>
    )
}

export function AdPlaceholder({ format, label = "Publicidade" }: { format: 'billboard' | 'skyscraper' | 'rectangle', label?: string }) {
    const size = {
        billboard: 'h-[250px] w-[970px]',
        skyscraper: 'h-[600px] w-[300px]',
        rectangle: 'h-[250px] w-[300px]'
    }[format];

    return (
        <div className={cn("bg-gray-50 border border-gray-100 flex flex-col items-center justify-center text-gray-300 mx-auto overflow-hidden", size)}>
            <span className="text-xs uppercase tracking-widest font-bold opacity-50">{label}</span>
        </div>
    )
}
