"use client"

import { useState } from 'react'
import { useTheme, Theme } from '@/contexts/ThemeContext'
import {
    Gamepad2,
    RotateCcw,
    Hammer,
    Skull,
    Zap,
    Box,
    X
} from 'lucide-react'

export function ThemeSwitcher() {
    const { theme, setTheme } = useTheme()
    const [isOpen, setIsOpen] = useState(false)

    const themes: { id: Theme; icon: any; label: string; color: string }[] = [
        { id: 'default', icon: RotateCcw, label: 'Padrão', color: 'bg-zinc-800' },
        { id: 'minecraft', icon: Hammer, label: 'Minecraft', color: 'bg-green-600' },
        { id: 'rdr2', icon: Skull, label: 'Red Dead', color: 'bg-amber-900' },
        { id: 'fortnite', icon: Zap, label: 'Fortnite', color: 'bg-blue-600' },
        { id: 'roblox', icon: Box, label: 'Roblox', color: 'bg-red-600' },
    ]

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
            {/* Menu Radial (Expandido) */}
            {isOpen && (
                <div className="flex flex-col gap-3 mb-2 animate-in slide-in-from-bottom-5 fade-in duration-200">
                    {themes.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => {
                                setTheme(t.id)
                                setIsOpen(false)
                            }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-full shadow-lg hover:scale-105 transition-transform ${theme === t.id ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : ''
                                } ${t.color} text-white`}
                        >
                            <span className="text-sm font-bold uppercase tracking-wider">{t.label}</span>
                            <t.icon className="w-5 h-5" />
                        </button>
                    ))}
                </div>
            )}

            {/* Botão Principal (FAB) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${isOpen ? 'bg-red-500 rotate-90' : 'bg-indigo-600 hover:bg-indigo-500'
                    } text-white`}
            >
                {isOpen ? <X className="w-6 h-6" /> : <Gamepad2 className="w-7 h-7" />}
            </button>
        </div>
    )
}
