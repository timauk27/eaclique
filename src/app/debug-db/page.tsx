import { createClient } from "@/utils/supabase/server";

export default async function DebugDBPage() {
    const supabase = await createClient();

    // Query exata da Home Page
    const { data, error } = await supabase
        .from("noticias")
        .select("id, titulo_viral, slug, categoria, imagem_capa, resumo_seo, created_at, views_reais")
        .order("created_at", { ascending: false })
        .limit(10);

    return (
        <div className="p-10 font-mono text-sm">
            <h1 className="text-2xl font-bold mb-6 text-blue-600">Teste da Query da Home Page</h1>

            {error && (
                <div className="mb-8 p-4 bg-red-100 border border-red-500 rounded text-red-700">
                    <h2 className="font-bold">Erro Retornado:</h2>
                    <pre>{JSON.stringify(error, null, 2)}</pre>
                </div>
            )}

            {!error && (
                <div className="mb-8 p-4 bg-green-100 border border-green-500 rounded text-green-700">
                    <h2 className="font-bold">Sucesso! Dados Retornados:</h2>
                    <p>Contagem: {data?.length}</p>
                </div>
            )}

            {data && data.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold mb-2">Primeiro Item:</h2>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-auto max-h-[500px]">
                        {JSON.stringify(data[0], null, 2)}
                    </pre>
                </div>
            )}

            {data && data.length === 0 && (
                <div className="text-yellow-600 font-bold">Nenhum dado encontrado com esta query.</div>
            )}
        </div>
    );
}
