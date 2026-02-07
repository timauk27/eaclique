'use client'

import { ShoppingBag, ExternalLink } from 'lucide-react'

interface AmazonProductCardProps {
    productName: string
    affiliateLink: string
}

export default function AmazonProductCard({ productName, affiliateLink }: AmazonProductCardProps) {
    return (
        <div className="my-8 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-amber-600/30 p-6 shadow-2xl">
            <div className="flex items-start gap-4">
                <div className="rounded-full bg-amber-600/20 p-3">
                    <ShoppingBag className="h-6 w-6 text-amber-500" />
                </div>
                <div className="flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-amber-500 mb-2">
                        Oferta Especial Amazon
                    </p>
                    <h3 className="text-lg font-bold text-white mb-3">
                        {productName}
                    </h3>
                    <a
                        href={affiliateLink}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-bold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-amber-500/50"
                    >
                        Ver Oferta na Amazon
                        <ExternalLink className="h-4 w-4" />
                    </a>
                </div>
            </div>
            <p className="text-xs text-slate-400 mt-4 border-t border-slate-700 pt-3">
                * Link de afiliado. Ao comprar através deste link, você apoia o EAClique sem pagar nada a mais.
            </p>
        </div>
    )
}
