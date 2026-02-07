import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Política de Cookies',
    description: 'Como o EAClique utiliza cookies e tecnologias similares',
};

export default function CookiesPage() {
    return (
        <div className="min-h-screen bg-white py-12">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-gray-900 mb-6">Política de Cookies</h1>
                <p className="text-sm text-gray-500 mb-8">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

                <div className="prose prose-lg max-w-none">
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">O que são Cookies?</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Cookies são pequenos arquivos de texto armazenados no seu dispositivo (computador, smartphone ou tablet)
                            quando você visita um site. Eles permitem que o site reconheça seu dispositivo e lembre de suas preferências
                            e atividades.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Usamos Cookies</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            O <strong>EAClique</strong> utiliza cookies para:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2">
                            <li>Melhorar a experiência de navegação</li>
                            <li>Entender como os visitantes usam nosso site (analytics)</li>
                            <li>Personalizar conteúdo e anúncios</li>
                            <li>Fornecer recursos de redes sociais</li>
                            <li>Garantir a segurança do site</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Tipos de Cookies que Utilizamos</h2>

                        <div className="space-y-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">1. Cookies Essenciais</h3>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    Necessários para o funcionamento básico do site. Sem eles, algumas funcionalidades podem não funcionar corretamente.
                                </p>
                                <p className="text-gray-600 text-xs mt-2"><strong>Duração:</strong> Sessão ou até 1 ano</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">2. Cookies de Performance (Analytics)</h3>
                                <p className="text-gray-700 text-sm leading-relaxed mb-2">
                                    Coletam informações sobre como os visitantes usam o site (páginas visitadas, tempo de permanência, etc.).
                                </p>
                                <p className="text-gray-600 text-xs"><strong>Exemplos:</strong> Google Analytics</p>
                                <p className="text-gray-600 text-xs"><strong>Duração:</strong> Até 2 anos</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">3. Cookies de Publicidade</h3>
                                <p className="text-gray-700 text-sm leading-relaxed mb-2">
                                    Usados para mostrar anúncios relevantes e medir a eficácia de campanhas publicitárias.
                                </p>
                                <p className="text-gray-600 text-xs"><strong>Exemplos:</strong> Google AdSense, Adsterra</p>
                                <p className="text-gray-600 text-xs"><strong>Duração:</strong> Até 2 anos</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">4. Cookies de Terceiros</h3>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    Definidos por serviços de terceiros que aparecem em nossas páginas (vídeos do YouTube, botões de compartilhamento social, etc.).
                                </p>
                                <p className="text-gray-600 text-xs mt-2"><strong>Duração:</strong> Varia conforme o serviço</p>
                            </div>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies Específicos</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-300 text-sm">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border border-gray-300 px-4 py-2 text-left">Nome</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">Finalidade</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">Duração</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2">_ga</td>
                                        <td className="border border-gray-300 px-4 py-2">Google Analytics - Distinguir usuários</td>
                                        <td className="border border-gray-300 px-4 py-2">2 anos</td>
                                    </tr>
                                    <tr className="bg-gray-50">
                                        <td className="border border-gray-300 px-4 py-2">_gid</td>
                                        <td className="border border-gray-300 px-4 py-2">Google Analytics - Distinguir usuários</td>
                                        <td className="border border-gray-300 px-4 py-2">24 horas</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2">__gads</td>
                                        <td className="border border-gray-300 px-4 py-2">Google AdSense - Personalizar anúncios</td>
                                        <td className="border border-gray-300 px-4 py-2">13 meses</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Gerenciar Cookies</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Você pode controlar e gerenciar cookies de várias maneiras:
                        </p>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Configurações do Navegador</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            A maioria dos navegadores permite:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                            <li>Ver quais cookies estão armazenados</li>
                            <li>Excluir cookies existentes</li>
                            <li>Bloquear cookies de sites específicos</li>
                            <li>Bloquear todos os cookies de terceiros</li>
                            <li>Limpar cookies ao fechar o navegador</li>
                        </ul>

                        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-4">
                            <p className="text-sm text-blue-900">
                                <strong>⚠️ Atenção:</strong> Bloquear todos os cookies pode afetar a funcionalidade do site.
                                Algumas áreas podem não funcionar corretamente.
                            </p>
                        </div>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Links para Configurações</h3>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2">
                            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener" className="text-blue-600 hover:underline">Google Chrome</a></li>
                            <li><a href="https://support.mozilla.org/pt-BR/kb/cookies" target="_blank" rel="noopener" className="text-blue-600 hover:underline">Mozilla Firefox</a></li>
                            <li><a href="https://support.microsoft.com/pt-br/microsoft-edge" target="_blank" rel="noopener" className="text-blue-600 hover:underline">Microsoft Edge</a></li>
                            <li><a href="https://support.apple.com/pt-br/guide/safari/sfri11471/mac" target="_blank" rel="noopener" className="text-blue-600 hover:underline">Safari</a></li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Opt-Out de Publicidade</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Você pode desativar anúncios personalizados:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2">
                            <li><a href="https://adssettings.google.com" target="_blank" rel="noopener" className="text-blue-600 hover:underline">Google Ads Settings</a></li>
                            <li><a href="http://optout.aboutads.info/" target="_blank" rel="noopener" className="text-blue-600 hover:underline">Digital Advertising Alliance</a></li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Atualizações</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Podemos atualizar esta Política de Cookies periodicamente. Recomendamos que você revise esta página
                            regularmente para estar ciente de quaisquer mudanças.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Contato</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Para questões sobre cookies:
                        </p>
                        <div className="bg-gray-50 p-4 rounded-lg mt-4">
                            <p className="text-gray-700"><strong>Email:</strong> privacidade@eaclique.com.br</p>
                        </div>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-200">
                    <Link href="/" className="text-blue-600 hover:underline">← Voltar para a página inicial</Link>
                </div>
            </div>
        </div>
    );
}
