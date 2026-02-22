import React from 'react';
import Image from 'next/image';
import { ShoppingBag, Star, TrendingUp } from 'lucide-react';

interface ShopeeCardProps {
    titulo: string;
    preco: string;
    imagem_url: string;
    link_afiliado: string;
}

export default function ShopeeCard({ titulo, preco, imagem_url, link_afiliado }: ShopeeCardProps) {
    return (
        <div className="my-10 max-w-sm mx-auto sm:max-w-md w-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 overflow-hidden hover:shadow-[0_8px_30px_rgb(238,77,45,0.2)] transition-all duration-300 group">
            {/* Etiqueta de Recomendação */}
            <div className="bg-gradient-to-r from-[#ee4d2d] to-[#ff7337] text-white text-[10px] md:text-xs font-black uppercase tracking-widest py-1.5 px-4 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    Achado do Editor
                </span>
                <span className="flex items-center gap-1 opacity-90">
                    <TrendingUp className="w-3 h-3" /> Em Alta
                </span>
            </div>

            {/* Container da Imagem */}
            <div className="relative aspect-square w-full bg-slate-50 p-6 flex justify-center items-center overflow-hidden">
                <img
                    src={imagem_url}
                    alt={titulo}
                    className="object-contain w-full h-full mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                />
            </div>

            {/* Conteúdo do Card */}
            <div className="p-5 md:p-6 bg-white">
                <h3 className="text-slate-800 font-bold text-sm md:text-base line-clamp-2 leading-relaxed mb-3 group-hover:text-[#ee4d2d] transition-colors">
                    {titulo}
                </h3>

                <div className="flex items-end gap-2 mb-5">
                    <span className="text-2xl md:text-3xl font-black text-[#ee4d2d] tracking-tight">
                        {preco}
                    </span>
                </div>

                {/* Botão de Conversão (CTA) */}
                <a
                    href={link_afiliado}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="w-full bg-[#ee4d2d] hover:bg-[#d73f22] text-white font-black py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md shadow-orange-500/30 active:scale-[0.98]"
                >
                    <ShoppingBag className="w-5 h-5" />
                    VER OFERTA NA SHOPEE
                </a>

                <p className="text-[10px] text-center text-slate-400 mt-3 uppercase tracking-wider font-semibold">
                    Link Seguro • Shopee Brasil
                </p>
            </div>
        </div>
    );
}
