import Link from "next/link";
import { Search, User, Menu } from "lucide-react";

export function MegaHeader() {
    return (
        <header className="w-full flex flex-col font-sans z-50">
            {/* TOP BAR */}
            <div className="bg-neutral-900 text-neutral-300 text-[11px] font-bold tracking-wide py-1 border-b border-neutral-800">
                <div className="container mx-auto px-4 flex justify-between items-center h-8">
                    <div className="flex gap-4 uppercase">
                        <span>{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                        <span className="text-green-500">USD 5.87</span>
                        <span className="text-orange-500">28°C SP</span>
                    </div>
                    <div className="flex gap-4">
                        <span>Assine</span>
                        <span>Newsletter</span>
                    </div>
                </div>
            </div>

            {/* MAIN BAR */}
            <div className="bg-white py-4 border-b border-gray-200 sticky top-0 z-40 shadow-sm relative">
                <div className="container mx-auto px-4 flex items-center justify-center">
                    <Link href="/" className="text-4xl md:text-5xl font-black tracking-tighter uppercase flex items-center gap-1 hover:opacity-90 transition-opacity">
                        <span className="text-blue-700">EA</span>
                        <span className="font-light text-gray-900">Clique</span>
                    </Link>
                </div>
            </div>

            {/* NAV BAR */}
            <nav className="bg-white border-b-2 border-gray-100 hidden md:block shadow-[0_2px_10px_rgba(0,0,0,0.05)] relative z-30">
                <div className="container mx-auto px-4">
                    <ul className="flex justify-between items-center">
                        {[
                            { name: "Brasil", slug: "brasil", color: "plantao" },
                            { name: "Mundo", slug: "mundo", color: "plantao" },
                            { name: "Ciência", slug: "ciencia", color: "ciencia" },
                            { name: "Arena", slug: "arena", color: "arena" },
                            { name: "Holofote", slug: "holofote", color: "holofote" },
                            { name: "Mercado", slug: "mercado", color: "mercado" },
                            { name: "Pixel", slug: "pixel", color: "pixel" },
                            { name: "Play", slug: "play", color: "play" },
                            { name: "Vital", slug: "vital", color: "vital" },
                        ].map((cat) => (
                            <li key={cat.name} className="group relative py-3">
                                <Link href={`/category/${cat.slug}`} className={`text-sm font-black uppercase tracking-widest px-2 py-1 text-gray-600 transition-colors hover:text-[var(--color-${cat.color})]`}>
                                    {cat.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </header>
    );
}
