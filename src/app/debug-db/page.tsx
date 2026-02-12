'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function DebugDB() {
    const [status, setStatus] = useState('Testing...')
    const [data, setData] = useState<any>(null)
    const [error, setError] = useState<any>(null)
    const [envCheck, setEnvCheck] = useState<any>({})

    useEffect(() => {
        checkConnection()
    }, [])

    async function checkConnection() {
        // 1. Check Env Vars (safe to show first few chars)
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        setEnvCheck({
            url_present: !!url,
            url_preview: url ? url.substring(0, 15) + '...' : 'MISSING',
            key_present: !!key,
            key_preview: key ? key.substring(0, 10) + '...' : 'MISSING'
        })

        if (!url || !key) {
            setStatus('FAILED: Missing Environment Variables')
            return
        }

        // 2. Try to fetch 1 row
        try {
            const { data: result, error: fetchError } = await supabase
                .from('noticias')
                .select('*')
                .limit(1)

            if (fetchError) {
                setStatus('FAILED: Supabase Error')
                setError(fetchError)
            } else {
                setStatus(`SUCCESS: Found ${result?.length} rows`)
                setData(result)
            }
        } catch (e: any) {
            setStatus('CRITICAL FAILURE: Exception')
            setError(e.message)
        }
    }

    return (
        <div className="p-10 font-mono text-sm">
            <h1 className="text-2xl font-bold mb-4">Database Connection Debugger</h1>

            <div className={`p-4 mb-4 rounded ${status.startsWith('SUCCESS') ? 'bg-green-100' : 'bg-red-100'}`}>
                <strong>Status:</strong> {status}
            </div>

            <div className="mb-4 border p-4">
                <h3 className="font-bold">Environment Variables Check:</h3>
                <pre>{JSON.stringify(envCheck, null, 2)}</pre>
            </div>

            {error && (
                <div className="mb-4 border p-4 bg-red-50">
                    <h3 className="font-bold text-red-600">Error Details:</h3>
                    <pre className="whitespace-pre-wrap">{JSON.stringify(error, null, 2)}</pre>
                    <p className="mt-2 text-red-700 font-bold">POSSIBLE FIX: Check your .env.local file or Supabase project settings.</p>
                </div>
            )}

            {data && (
                <div className="mb-4 border p-4 bg-gray-50">
                    <h3 className="font-bold">Data Sample (First Row):</h3>
                    <pre className="whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
                </div>
            )}
        </div>
    )
}
