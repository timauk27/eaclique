'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default function LogoutButton() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleLogout = async () => {
        setLoading(true)
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <button
            onClick={handleLogout}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
        >
            <LogOut className="w-4 h-4" />
            {loading ? 'Saindo...' : 'Sair'}
        </button>
    )
}
