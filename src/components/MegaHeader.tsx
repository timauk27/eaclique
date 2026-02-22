'use client';

import Link from "next/link";
import { Search, User, Menu, ChevronDown } from "lucide-react";
import { DynamicHeader } from "./DynamicHeader";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

type MenuLink = {
    id: string;
    nome: string;
    link_url: string;
    parent_id?: string | null;
    ordem: number;
}

export function MegaHeader() {
    const [menus, setMenus] = useState<MenuLink[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMenus = async () => {
            const supabase = createClient();
            const { data } = await supabase.from('menus').select('*').eq('ativo', true).order('ordem');

            if (data) {
                setMenus(data);
            }
            setLoading(false);
        };

        fetchMenus();
    }, []);

    const parentMenus = menus.filter(m => !m.parent_id);

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
                        ) : parentMenus.length === 0 ? (
                            <li className="text-sm text-gray-400">Nenhum menu raiz configurado. O Menu precisa ser restabelecido no Banco.</li>
                        ) : parentMenus.map((menu) => (
                            <MenuItem key={menu.id} menu={menu} allMenus={menus} />
                        ))}
                    </ul>
                </div>
            </nav>
        </header>
    );
}

function MenuItem({ menu, allMenus }: { menu: MenuLink, allMenus: MenuLink[] }) {
    const children = allMenus.filter(m => m.parent_id === menu.id).sort((a, b) => a.ordem - b.ordem);
    const hasChildren = children.length > 0;

    return (
        <li className="group relative">
            <Link
                href={menu.link_url}
                className="text-sm font-black uppercase tracking-widest px-3 py-2 text-gray-600 transition-colors hover:bg-gray-50 rounded-md hover:text-blue-700 flex items-center gap-1"
            >
                {menu.nome}
                {hasChildren && <ChevronDown className="w-4 h-4 opacity-50 transition-transform group-hover:rotate-180" />}
            </Link>

            {hasChildren && (
                <div className="absolute top-full left-0 w-56 bg-white border border-gray-100 shadow-2xl rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-3 translate-y-2 group-hover:translate-y-0 before:content-[''] before:absolute before:-top-4 before:left-0 before:w-full before:h-4">
                    <ul className="flex flex-col">
                        {children.map(child => (
                            <li key={child.id}>
                                <Link
                                    href={child.link_url}
                                    className="block px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                                >
                                    {child.nome}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </li>
    );
}
