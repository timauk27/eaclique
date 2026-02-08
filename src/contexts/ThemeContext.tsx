"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'

export type Theme = 'default' | 'minecraft' | 'rdr2' | 'fortnite' | 'roblox'

interface ThemeContextType {
    theme: Theme
    setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('default')

    // Carregar tema salvo no localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem('eaclique-theme') as Theme
        if (savedTheme) {
            setTheme(savedTheme)
        }
    }, [])

    // Aplicar classe no elemento HTML
    useEffect(() => {
        const root = document.documentElement

        // Remove todas as classes de tema anteriores
        root.classList.remove('theme-minecraft', 'theme-rdr2', 'theme-fortnite', 'theme-roblox')

        // Adiciona a classe do tema se não for default
        if (theme !== 'default') {
            root.classList.add(`theme-${theme}`)
        }

        // Salva no localStorage
        localStorage.setItem('eaclique-theme', theme)
    }, [theme])

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}
