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
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <Link href="/" className="text-4xl md:text-5xl font-black tracking-tighter uppercase flex items-center gap-1 hover:opacity-90 transition-opacity">
                        <span className="text-blue-700">EA</span>
                        <span className="font-light text-gray-900">Clique</span>
                    </Link>

                    <div className="hidden md:flex relative w-96 items-center">
                        <input
                            type="text"
                            placeholder="Buscar notícia..."
                            className="w-full bg-gray-100 border-0 rounded-full px-5 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 outline-none placeholder:text-gray-400 font-medium"
                        />
                        <Search className="w-4 h-4 absolute right-4 text-gray-500" />
                    </div>

                    <button className="flex items-center gap-2 text-sm font-bold bg-gray-900 text-white px-5 py-2 rounded-full hover:bg-gray-800 transition-colors">
                        <User className="w-4 h-4" />
                        Entrar
                    </button>
                </div>
            </div>

            {/* NAV BAR */}
            <nav className="bg-white border-b-2 border-gray-100 hidden md:block shadow-[0_2px_10px_rgba(0,0,0,0.05)] relative z-30">
                <div className="container mx-auto px-4">
                    <ul className="flex justify-between items-center">
                        {[
                            { name: "Plantão", color: "plantao" },
                            { name: "Brasil", color: "plantao" }, // Using plantao red
                            { name: "Mundo", color: "plantao" },
                            { name: "Arena", color: "arena" },
                            { name: "Holofote", color: "holofote" },
                            { name: "Mercado", color: "mercado" },
                            { name: "Pixel", color: "pixel" },
                            { name: "Play", color: "play" },
                            { name: "Vital", color: "vital" },
                        ].map((cat) => (
                            <li key={cat.name} className="group relative py-3">
                                <Link href={`/category/${cat.name.toLowerCase()}`} className={`text-sm font-black uppercase tracking-widest px-2 py-1 text-gray-600 transition-colors hover:text-[var(--color-${cat.color})]`}>
                                    {cat.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>

            {/* TICKER */}
            <div className="bg-red-600 text-white py-2 overflow-hidden relative">
                <div className="container mx-auto px-4 flex items-center">
                    <span className="bg-white text-red-600 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest mr-4 animate-pulse rounded-sm shrink-0">
                        URGENTE
                    </span>
                    <div className="whitespace-nowrap overflow-hidden flex-1">
                        <div className="inline-block animate-marquee pl-[100%]">
                            <span className="mx-4 font-bold text-sm">⚠️ Trânsito parado na Marginal Pinheiros após acidente grave.</span>
                            <span className="mx-4 font-bold text-sm">🔥 Novo recorde de temperatura registrado no Rio de Janeiro.</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
