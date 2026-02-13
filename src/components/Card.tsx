import Link from "next/link";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface CardProps {
    category: string;
    categoryColor: string;
    title: string;
    image?: string;
    time?: string;
    slug: string;
    size?: "default" | "small";
}

export function FeatureCard({ category, categoryColor, title, image, time, slug, size = "default" }: CardProps) {
    const titleSize = size === "default" ? "text-3xl md:text-5xl" : "text-xl md:text-3xl";

    return (
        <div className="relative group h-full min-h-[400px] w-full overflow-hidden rounded-xl bg-gray-900 border border-gray-800 shadow-lg">
            {image && (
                <img
                    src={image}
                    alt={title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
                />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 transition-opacity duration-500" />

            <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full z-10 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <span className={cn(
                    "mb-3 inline-block text-white px-3 py-1 text-xs font-black uppercase tracking-widest rounded-sm shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100",
                    `bg-${categoryColor}`
                )} style={{ backgroundColor: `var(--color-${categoryColor})` }}>
                    {category}
                </span>
                <Link href={`/noticia/${slug}`} className="block">
                    <h1 className={cn("font-black text-white leading-none mb-3 shadow-black drop-shadow-2xl group-hover:text-gray-100 transition-colors", titleSize)}>
                        {title}
                    </h1>
                </Link>
                {time && (
                    <div className="flex items-center gap-2 text-white/70 text-xs font-bold uppercase tracking-wider opacity-60 group-hover:opacity-100 transition-opacity">
                        <Clock className="w-3 h-3" />
                        {time}
                    </div>
                )}
            </div>
        </div>
    );
}

export function CompactCard({ category, categoryColor, title, image, time, slug }: CardProps) {
    return (
        <div className="group flex gap-4 items-start border-b border-gray-100 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0 hover:bg-gray-50 p-2 -mx-2 rounded-lg transition-all duration-300">
            <div className="w-32 h-24 bg-gray-100 rounded-lg shrink-0 overflow-hidden relative shadow-sm">
                {image && <img src={image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />}
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-black transition-colors" style={{ color: `var(--color-${categoryColor})` }}>
                    {category}
                </span>
                <Link href={`/noticia/${slug}`}>
                    <h3 className="font-bold text-lg leading-tight text-gray-900 group-hover:text-blue-700 transition-colors">
                        {title}
                    </h3>
                </Link>
                {time && <span className="text-xs text-gray-400 mt-1">{time}</span>}
            </div>
        </div>
    )
}

export function TextCard({ category, categoryColor, title, time, slug }: CardProps) {
    return (
        <div className="group flex flex-col gap-1 border-b border-gray-100 pb-3 mb-3 last:border-0 last:mb-0 last:pb-0 hover:translate-x-2 transition-transform duration-300">
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full ring-2 ring-transparent group-hover:ring-gray-200 transition-all" style={{ backgroundColor: `var(--color-${categoryColor})` }}></span>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-gray-600 transition-colors">
                    {category}
                </span>
            </div>
            <Link href={`/noticia/${slug}`}>
                <h4 className="font-bold text-base leading-snug text-gray-800 group-hover:text-blue-700 transition-colors">
                    {title}
                </h4>
            </Link>
            {time && <span className="text-xs text-gray-400">{time}</span>}
        </div>
    )
}
