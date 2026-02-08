import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Sobre Nós',
    description: 'Conheça o EA Clique - Portal de notícias automatizado com IA, trazendo informações atualizadas sobre tecnologia, economia, entretenimento e muito mais.',
};

export default function SobrePage() {
    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                {/* Breadcrumb */}
                <div className="text-sm text-gray-500 mb-6">
                    <Link href="/" className="hover:text-red-600">Home</Link>
                    <span className="mx-2">›</span>
                    <span>Sobre Nós</span>
                </div>

                {/* Header */}
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                    Sobre o EA Clique
                </h1>

                {/* Content */}
                <div className="prose prose-lg max-w-none">
                    <p className="text-xl text-gray-600 leading-relaxed mb-8">
                        O <strong>EA Clique</strong> é um portal de notícias inovador que utiliza tecnologia de ponta para trazer
                        informações relevantes e atualizadas 24 horas por dia.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Nossa Missão</h2>
                    <p className="text-gray-700 leading-relaxed mb-6">
                        Democratizar o acesso à informação de qualidade, fornecendo notícias de múltiplas fontes respeitadas,
                        organizadas de forma clara e acessível para todos os brasileiros.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">O Que Fazemos</h2>
                    <ul className="space-y-3 text-gray-700 mb-6">
                        <li className="flex items-start">
                            <span className="text-red-600 mr-2">✓</span>
                            <span>Agregamos notícias de mais de 50 fontes confiáveis do Brasil e do mundo</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-red-600 mr-2">✓</span>
                            <span>Monitoramos tendências em tempo real através do Google Trends</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-red-600 mr-2">✓</span>
                            <span>Organizamos conteúdo em categorias para facilitar sua leitura</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-red-600 mr-2">✓</span>
                            <span>Atualizamos nosso conteúdo a cada 15-30 minutos</span>
                        </li>
                    </ul>

                    <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Nossa Cobertura</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                        {['Brasil', 'Mundo', 'Tech', 'Economia', 'Esportes', 'Entretenimento', 'Saúde', 'Ciência'].map((cat) => (
                            <div key={cat} className="bg-gray-50 rounded-lg p-4 text-center font-semibold text-gray-700">
                                {cat}
                            </div>
                        ))}
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Tecnologia & Inovação</h2>
                    <p className="text-gray-700 leading-relaxed mb-6">
                        Utilizamos inteligência artificial e automação para processar grandes volumes de informação,
                        identificar tendências e entregar conteúdo relevante para você. Nossa plataforma é construída
                        com as tecnologias mais modernas do mercado, garantindo velocidade, segurança e disponibilidade.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Transparência</h2>
                    <p className="text-gray-700 leading-relaxed mb-6">
                        Todas as notícias publicadas em nosso portal citam e linkam para as fontes originais.
                        Trabalhamos como agregadores de conteúdo, respeitando os direitos autorais e promovendo
                        o jornalismo de qualidade produzido por veículos tradicionais.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Contato</h2>
                    <p className="text-gray-700 leading-relaxed">
                        Tem alguma dúvida, sugestão ou gostaria de anunciar conosco?{' '}
                        <Link href="/contato" className="text-red-600 hover:underline font-semibold">
                            Entre em contato
                        </Link>
                    </p>
                </div>

                <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 text-center">
                        © {new Date().getFullYear()} EA Clique. Portal de notícias independente.
                    </p>
                </div>
            </div>
        </div>
    );
}
