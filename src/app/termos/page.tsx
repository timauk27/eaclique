import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Termos de Uso',
    description: 'Termos e condições de uso do portal EAClique',
};

export default function TermosPage() {
    return (
        <div className="min-h-screen bg-white py-12">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-gray-900 mb-6">Termos de Uso</h1>
                <p className="text-sm text-gray-500 mb-8">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

                <div className="prose prose-lg max-w-none">
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Aceitação dos Termos</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Ao acessar e usar o portal <strong>EAClique</strong>, você concorda em cumprir e estar vinculado a estes
                            Termos de Uso. Se você não concorda com estes termos, não utilize nosso site.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Uso do Conteúdo</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Todo o conteúdo publicado no EAClique, incluindo textos, imagens, vídeos e gráficos, é protegido por
                            direitos autorais e outras leis de propriedade intelectual.
                        </p>
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Uso Permitido</h3>
                        <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                            <li>Visualizar e ler o conteúdo para uso pessoal e não comercial</li>
                            <li>Compartilhar links para artigos em redes sociais</li>
                            <li>Citar trechos com a devida atribuição e link para a fonte</li>
                        </ul>
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 Uso Proibido</h3>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2">
                            <li>Copiar, reproduzir ou redistribuir conteúdo sem autorização</li>
                            <li>Usar conteúdo para fins  comerciais sem permissão expressa</li>
                            <li>Modificar ou criar obras derivadas do nosso conteúdo</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Responsabilidades do Usuário</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">Ao usar o EAClique, você concorda em:</p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2">
                            <li>Fornecer informações precisas e atualizadas (quando aplicável)</li>
                            <li>Não violar leis ou regulamentos aplicáveis</li>
                            <li>Não transmitir vírus, malware ou códigos maliciosos</li>
                            <li>Não interferir no funcionamento do site</li>
                            <li>Não tentar acessar áreas restritas sem autorização</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Conteúdo de Terceiros</h2>
                        <p className="text-gray-700 leading-relaxed">
                            O EAClique pode conter links para sites de terceiros. Não somos responsáveis pelo conteúdo, políticas
                            de privacidade ou práticas de sites externos. O acesso a esses sites é por sua conta e risco.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Publicidade</h2>
                        <p className="text-gray-700 leading-relaxed">
                            O site exibe anúncios de terceiros (Google AdSense, Adsterra, etc.). Não somos responsáveis pelo
                            conteúdo dos anúncios ou pelos produtos/serviços anunciados.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Isenção de Responsabilidade</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            O conteúdo do EAClique é fornecido "como está" para fins informativos. Não garantimos:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2">
                            <li>A precisão, completude ou atualidade das informações</li>
                            <li>Que o site estará sempre disponível ou livre de erros</li>
                            <li>Que o uso do site atenderá suas expectativas</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitação de Responsabilidade</h2>
                        <p className="text-gray-700 leading-relaxed">
                            O EAClique não será responsável por quaisquer danos diretos, indiretos, incidentais ou consequenciais
                            resultantes do uso ou incapacidade de usar nosso site.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Modificações</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. As alterações entrarão em
                            vigor imediatamente após a publicação. O uso continuado do site após as alterações constitui aceitação
                            dos novos termos.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Lei Aplicável</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. Qualquer disputa será
                            resolvida nos tribunais da comarca de São Paulo - SP.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contato</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Para questões sobre estes Termos de Uso:
                        </p>
                        <div className="bg-gray-50 p-4 rounded-lg mt-4">
                            <p className="text-gray-700"><strong>Email:</strong> contato@eaclique.com.br</p>
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
