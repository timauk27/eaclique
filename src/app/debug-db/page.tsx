import { createClient } from "@/utils/supabase/server";

export default async function DebugDBPage() {
    const supabase = await createClient();

    // Tenta buscar 1 item para ver as colunas retornadas
    const { data, error } = await supabase
        .from("noticias")
        .select("*")
        .limit(1);

    if (error) {
        return (
            <div className="p-10 font-mono text-red-500">
                <h1 className="text-2xl font-bold mb-4">Erro ao acessar Banco de Dados</h1>
                <pre>{JSON.stringify(error, null, 2)}</pre>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="p-10 font-mono text-yellow-600">
                <h1 className="text-2xl font-bold mb-4">Tabela 'noticias' vazia ou inacessível</h1>
                <p>Nenhum dado retornado. Verifique se a tabela existe e tem permissões de leitura (RLS).</p>
            </div>
        );
    }

    const columns = Object.keys(data[0]);

    return (
        <div className="p-10 font-mono text-sm">
            <h1 className="text-2xl font-bold mb-6 text-blue-600">Diagnóstico da Tabela 'noticias'</h1>

            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Colunas Encontradas ({columns.length})</h2>
                <div className="bg-gray-100 p-4 rounded border border-gray-300">
                    <ul className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {columns.map(col => (
                            <li key={col} className="bg-white px-2 py-1 rounded border border-gray-200">
                                {col}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-2">Amostra de Dados (Primeiro Registro)</h2>
                <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-auto max-h-[500px]">
                    {JSON.stringify(data[0], null, 2)}
                </pre>
            </div>
        </div>
    );
}
