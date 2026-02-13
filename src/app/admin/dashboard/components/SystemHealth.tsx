'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CheckCircle, AlertTriangle, Database, Server, RefreshCw } from 'lucide-react'

export default function SystemHealth() {
    const [dbStatus, setDbStatus] = useState<'ok' | 'error'>('ok')
    const [lastSync, setLastSync] = useState<string | null>(null)
    const [storageUsage, setStorageUsage] = useState<number>(45) // Mock percentage

    useEffect(() => {
        async function checkHealth() {
            setLastSync(new Date().toLocaleTimeString())

            try {
                const { error } = await supabase.from('noticias').select('id').limit(1)
                if (error) throw error
                setDbStatus('ok')
            } catch (e) {
                console.error(e)
                setDbStatus('error')
            }
        }

        const interval = setInterval(checkHealth, 30000) // Check every 30s
        checkHealth()

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">Status do Sistema</h3>

            <div className="space-y-4">
                {/* Database Status */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">Banco de Dados</span>
                    </div>
                    {dbStatus === 'ok' ? (
                        <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            <CheckCircle className="w-3 h-3" /> Operacional
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                            <AlertTriangle className="w-3 h-3" /> Erro
                        </span>
                    )}
                </div>

                {/* API Latency (Mock) */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Server className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">API Latency</span>
                    </div>
                    <span className="text-xs font-medium text-gray-900">42ms</span>
                </div>

                {/* Last Backup/Sync */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">Última Sync</span>
                    </div>
                    <span className="text-xs text-gray-500">{lastSync}</span>
                </div>

                {/* Storage Meter */}
                <div className="pt-2 border-t mt-2">
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">Storage (Supabase)</span>
                        <span className="font-medium text-gray-900">{storageUsage}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div
                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${storageUsage}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
