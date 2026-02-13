'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export function DynamicHeader() {
    const [date, setDate] = useState<string>('')
    const [currencies, setCurrencies] = useState({
        usd: { value: 5.87, change: 0.05 },
        eur: { value: 6.32, change: -0.02 },
        btc: { value: 345000, change: 1.2 }
    })

    useEffect(() => {
        // Set initial date on client to avoid hydration mismatch
        setDate(new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }))

        const interval = setInterval(() => {
            // Simulate live currency updates
            setCurrencies(prev => ({
                usd: { value: prev.usd.value + (Math.random() - 0.5) * 0.01, change: (Math.random() - 0.5) },
                eur: { value: prev.eur.value + (Math.random() - 0.5) * 0.01, change: (Math.random() - 0.5) },
                btc: { value: prev.btc.value + (Math.random() - 0.5) * 100, change: (Math.random() - 0.5) }
            }))
        }, 5000)

        return () => clearInterval(interval)
    }, [])

    if (!date) return <div className="h-4 w-32 bg-neutral-800 animate-pulse rounded"></div>

    return (
        <div className="flex items-center gap-6 text-[10px] md:text-[11px] font-bold tracking-wide uppercase">
            <span className="text-neutral-400 border-r border-neutral-700 pr-4 hidden md:inline">{date}</span>

            <div className="flex gap-4 overflow-hidden">
                <div className="flex items-center gap-1">
                    <span className="text-neutral-500">USD</span>
                    <span className={currencies.usd.change >= 0 ? 'text-green-500' : 'text-red-500'}>
                        R$ {currencies.usd.value.toFixed(2)}
                    </span>
                    {currencies.usd.change >= 0 ? <TrendingUp className="w-3 h-3 text-green-500" /> : <TrendingDown className="w-3 h-3 text-red-500" />}
                </div>

                <div className="flex items-center gap-1 hidden sm:flex">
                    <span className="text-neutral-500">EUR</span>
                    <span className={currencies.eur.change >= 0 ? 'text-green-500' : 'text-red-500'}>
                        R$ {currencies.eur.value.toFixed(2)}
                    </span>
                </div>

                <div className="flex items-center gap-1 hidden sm:flex">
                    <span className="text-neutral-500">BTC</span>
                    <span className={currencies.btc.change >= 0 ? 'text-green-500' : 'text-red-500'}>
                        R$ {(currencies.btc.value / 1000).toFixed(1)}k
                    </span>
                </div>
            </div>
        </div>
    )
}
