'use client'

import { useState } from 'react'
import { Clock, CheckCircle, XCircle, Loader, ChevronDown, ChevronRight } from 'lucide-react'

interface Mission {
    id: string
    tipo_missao: 'link_especifico' | 'pesquisa_tematica'
    url_alvo?: string
    termo_busca?: string
    categoria_alvo_nome: string
    subcategoria?: string
    status: 'PENDENTE' | 'EXECUTANDO' | 'CONCLUIDA' | 'ERRO'
    log_resultado?: string
    noticias_salvas: number
    noticias_ignoradas: number
    prioridade: number
    created_at: string
    updated_at: string
    concluido_em?: string
}

export default function MissionsTable({ missoes, onUpdate }: { missoes: Mission[]; onUpdate: () => void }) {
    const [expandedId, setExpandedId] = useState<string | null>(null)

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDENTE':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Clock className="w-3 h-3" />
                        Pendente
                    </span>
                )
            case 'EXECUTANDO':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Loader className="w-3 h-3 animate-spin" />
                        Executando
                    </span>
                )
            case 'CONCLUIDA':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3" />
                        Concluída
                    </span>
                )
            case 'ERRO':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <XCircle className="w-3 h-3" />
                        Erro
                    </span>
                )
            default:
                return <span className="text-gray-500">{status}</span>
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tipo
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Detalhes
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Categoria
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Resultados
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Criado
                        </th>
                        <th className="px-4 py-3"></th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {missoes.map((missao) => (
                        <>
                            <tr key={missao.id} className="hover:bg-gray-50">
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <span className={`text-xs px-2 py-1 rounded ${missao.tipo_missao === 'link_especifico'
                                            ? 'bg-purple-100 text-purple-800'
                                            : 'bg-blue-100 text-blue-800'
                                        }`}>
                                        {missao.tipo_missao === 'link_especifico' ? '🎯 Link' : '🔍 Busca'}
                                    </span>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="text-sm text-gray-900 font-medium max-w-xs truncate">
                                        {missao.tipo_missao === 'link_especifico'
                                            ? missao.url_alvo
                                            : missao.termo_busca}
                                    </div>
                                    {missao.subcategoria && (
                                        <div className="text-xs text-gray-500">
                                            Subcategoria: {missao.subcategoria}
                                        </div>
                                    )}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <span className="text-sm font-medium text-gray-900">
                                        {missao.categoria_alvo_nome}
                                    </span>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    {getStatusBadge(missao.status)}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {missao.status === 'CONCLUIDA' || missao.status === 'ERRO' ? (
                                        <div className="flex gap-2">
                                            <span className="text-green-600">✓ {missao.noticias_salvas}</span>
                                            <span className="text-gray-400">⏭ {missao.noticias_ignoradas}</span>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(missao.created_at)}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-right">
                                    <button
                                        onClick={() => setExpandedId(expandedId === missao.id ? null : missao.id)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        {expandedId === missao.id ? (
                                            <ChevronDown className="w-5 h-5" />
                                        ) : (
                                            <ChevronRight className="w-5 h-5" />
                                        )}
                                    </button>
                                </td>
                            </tr>
                            {expandedId === missao.id && (
                                <tr className="bg-gray-50">
                                    <td colSpan={7} className="px-4 py-4">
                                        <div className="space-y-2 text-sm">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <span className="font-medium text-gray-700">ID:</span>
                                                    <span className="ml-2 text-gray-600 font-mono text-xs">
                                                        {missao.id}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-700">Prioridade:</span>
                                                    <span className="ml-2 text-gray-600">{missao.prioridade}/10</span>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-700">Atualizado:</span>
                                                    <span className="ml-2 text-gray-600">
                                                        {formatDate(missao.updated_at)}
                                                    </span>
                                                </div>
                                                {missao.concluido_em && (
                                                    <div>
                                                        <span className="font-medium text-gray-700">Concluído:</span>
                                                        <span className="ml-2 text-gray-600">
                                                            {formatDate(missao.concluido_em)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            {missao.log_resultado && (
                                                <div>
                                                    <span className="font-medium text-gray-700">Log:</span>
                                                    <pre className="mt-1 p-3 bg-white rounded border border-gray-200 text-xs overflow-x-auto">
                                                        {missao.log_resultado}
                                                    </pre>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
