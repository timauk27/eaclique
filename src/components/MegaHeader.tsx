'use client';

import Link from "next/link";
import { Search, User, Menu, ChevronDown } from "lucide-react";
import { DynamicHeader } from "./DynamicHeader";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

type Category = {
    id: string;
    nome: string;
    slug: string;
    parent_id: string | null;
    children?: Category[];
}

export function MegaHeader() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            const supabase = createClient();
            const { data } = await supabase.from('categorias').select('*').eq('ativo', true).order('nome');

            if (data) {
                const map: Record<string, Category> = {};
                const roots: Category[] = [];

                data.forEach(cat => {
                    map[cat.id] = { ...cat, children: [] };
                });

                data.forEach(cat => {
                    if (cat.parent_id && map[cat.parent_id]) {
                        map[cat.parent_id].children?.push(map[cat.id]);
                    } else {
                        roots.push(map[cat.id]);
                    }
                });

                setCategories(roots);
            }
            setLoading(false);
        };

        fetchCategories();
    }, []);

    return (
        <header className="w-full flex flex-col font-sans z-50">
            {/* TOP BAR */}
            <div className="bg-neutral-900 text-neutral-300 text-[11px] font-bold tracking-wide py-1 border-b border-neutral-800">
                <div className="container mx-auto px-4 flex justify-between items-center h-8">
                    <DynamicHeader />
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
                    <ul className="flex justify-center items-center flex-wrap gap-6 py-2">
                        {loading ? (
                            <li className="text-sm text-gray-400 animate-pulse">Carregando menu...</li>
                        ) : categories.map((cat) => (
                            <MenuItem key={cat.id} category={cat} />
                        ))}
                    </ul>
                </div>
            </nav>
        </header>
    );
}

function MenuItem({ category }: { category: Category }) {
    const hasChildren = category.children && category.children.length > 0;

    return (
        <li className="group relative">
            <Link
                href={hasChildren ? '#' : `/category/${category.slug}`}
                className={`text-sm font-black uppercase tracking-widest px-3 py-2 text-gray-600 transition-colors hover:bg-gray-50 rounded-md hover:text-blue-700 flex items-center gap-1`}
            >
                {category.nome}
                {hasChildren && <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-blue-700" />}
            </Link>

            {/* DROPDOWN */}
            {hasChildren && (
                <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-[200px]">
                    <div className="bg-white border border-gray-100 shadow-xl rounded-lg overflow-hidden py-1">
                        {category.children?.map(child => (
                            <Link
                                key={child.id}
                                href={`/category/${child.slug}`}
                                className="block px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-blue-700 uppercase tracking-wide border-l-2 border-transparent hover:border-blue-700"
                            >
                                {child.nome}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </li>
    );
}
