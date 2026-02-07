// Debug: verificar quantas notícias de cada categoria temos

import { createClient } from '@/utils/supabase/server';

export default async function DebugPage() {
    const supabase = await createClient();
    const { data: posts } = await supabase
        .from("Noticias")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

    const categorias: Record<string, number> = {};

    posts?.forEach(p => {
        const cat = p.categoria?.toUpperCase() || 'SEM_CATEGORIA';
        categorias[cat] = (categorias[cat] || 0) + 1;
    });

    const holofotePosts = posts?.filter(p =>
        p.categoria?.toUpperCase() === 'HOLOFOTE' ||
        p.categoria?.toUpperCase() === 'FAMOSOS' ||
        p.categoria?.toUpperCase() === 'CINEMA'
    ) || [];

    return (
        <div className="p-8 bg-white min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Debug - Categorias</h1>

            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Total por categoria (últimas 100):</h2>
                <ul className="space-y-1">
                    {Object.entries(categorias)
                        .sort((a, b) => b[1] - a[1])
                        .map(([cat, count]) => (
                            <li key={cat} className="text-sm">
                                <strong>{cat}</strong>: {count}
                            </li>
                        ))}
                </ul>
            </div>

            <div>
                <h2 className="text-xl font-bold mb-4">
                    Posts Holofote/Famosos/Cinema: {holofotePosts.length}
                </h2>
                <div className="grid grid-cols-1 gap-2">
                    {holofotePosts.slice(0, 15).map((post, idx) => (
                        <div key={idx} className="border p-2 text-xs">
                            <strong className="text-pink-600">{post.categoria}</strong> - {post.titulo_viral}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-8">
                <a href="/" className="text-blue-600 underline">← Voltar para home</a>
            </div>
        </div>
    );
}
