'use client'

import { supabase } from '@/lib/supabase'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Lock, Mail, Key, AlertCircle } from 'lucide-react'

import { Suspense } from 'react'

function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password
            })

            if (authError) {
                setError(authError.message)
                setLoading(false)
                return
            }

            if (data.session) {
                console.log('Login bem-sucedido! Sessão:', data.session)
                const redirect = searchParams.get('redirect') || '/admin/dashboard'
                console.log('Redirecionando para:', redirect)

                // Pequeno delay para garantir que cookies sejam salvos
                await new Promise(resolve => setTimeout(resolve, 500))
                window.location.href = redirect
            } else {
                setError('Erro: Sessão não foi criada')
                setLoading(false)
            }
        } catch (err: any) {
            console.error('Erro no login:', err)
            setError(err.message || 'Erro ao fazer login. Tente novamente.')
            setLoading(false)
        }
    }

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-2xl">
            <form onSubmit={handleLogin} className="space-y-6">
                {/* Error Alert */}
                {error && (
                    <div className="bg-red-950 border border-red-800 rounded-lg p-4 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm text-red-200 font-semibold">Erro de Autenticação</p>
                            <p className="text-xs text-red-300 mt-1">{error}</p>
                        </div>
                    </div>
                )}

                {/* Email Input */}
                <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                        E-mail do Administrador
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@eaclique.com"
                            required
                            className="w-full pl-11 pr-4 py-3 bg-black text-white border border-zinc-700 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
                        />
                    </div>
                </div>

                {/* Password Input */}
                <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Senha
                    </label>
                    <div className="relative">
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full pl-11 pr-4 py-3 bg-black text-white border border-zinc-700 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Autenticando...
                        </>
                    ) : (
                        <>
                            <Lock className="w-5 h-5" />
                            Acessar Dashboard
                        </>
                    )}
                </button>
            </form>

            {/* Info */}
            <div className="mt-6 pt-6 border-t border-zinc-800">
                <p className="text-xs text-gray-500 text-center">
                    🔐 Apenas administradores autorizados podem acessar este painel
                </p>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVybkVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>

            <div className="relative z-10 w-full max-w-md px-6">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">EA Clique Admin</h1>
                    <p className="text-gray-400">Acesso Restrito ao Painel de Controle</p>
                </div>

                {/* Login Form Suspended */}
                <Suspense fallback={<div className="text-white text-center">Carregando formulário...</div>}>
                    <LoginForm />
                </Suspense>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <a
                        href="/"
                        className="text-sm text-gray-400 hover:text-white transition"
                    >
                        ← Voltar para o site
                    </a>
                </div>
            </div>
        </div>
    )
}
