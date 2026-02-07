import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Política de Privacidade',
    description: 'Política de privacidade do portal EAClique - Como tratamos seus dados pessoais',
};

export default function PrivacidadePage() {
    return (
        <div className="min-h-screen bg-white py-12">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-gray-900 mb-6">Política de Privacidade</h1>
                <p className="text-sm text-gray-500 mb-8">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

                <div className="prose prose-lg max-w-none">
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introdução</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            O <strong>EAClique</strong> valoriza a privacidade dos nossos usuários. Esta Política de Privacidade descreve
                            como coletamos, usamos e protegemos suas informações pessoais quando você visita nosso portal de notícias.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            Ao acessar este site, você concorda com os termos desta política. Se você não concordar, por favor,
                            não utilize nossos serviços.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Informações que Coletamos</h2>
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Informações Fornecidas por Você</h3>
                        <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                            <li>Nome e endereço de e-mail (quando você se inscreve em nossa newsletter)</li>
                            <li>Comentários e feedbacks enviados através do formulário de contato</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 Informações Coletadas Automaticamente</h3>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2">
                            <li>Endereço IP</li>
                            <li>Tipo de navegador e dispositivo</li>
                            <li>Páginas visitadas e tempo de permanência</li>
                            <li>Cookies e tecnologias similares</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Como Usamos Suas Informações</h2>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2">
                            <li>Fornecer e melhorar nossos serviços</li>
                            <li>Enviar newsletters e notificações (se você consentiu)</li>
                            <li>Analisar o uso do site para melhorar a experiência do usuário</li>
                            <li>Exibir anúncios relevantes através de parceiros (Google AdSense, etc.)</li>
                            <li>Cumprir obrigações legais</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Cookies</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Utilizamos cookies para melhorar sua experiência de navegação. Cookies são pequenos arquivos de texto
                            armazenados no seu dispositivo. Você pode configurar seu navegador para recusar cookies, mas isso pode
                            afetar a funcionalidade do site.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            Para mais informações, consulte nossa <Link href="/cookies" className="text-blue-600 hover:underline">Política de Cookies</Link>.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Compartilhamento de Dados</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Não vendemos suas informações pessoais. Podemos compartilhar dados com:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2">
                            <li><strong>Parceiros de Publicidade:</strong> Google AdSense, Adsterra (dados anonimizados)</li>
                            <li><strong>Provedores de Serviços:</strong> Hospedagem, analytics (Vercel, Supabase, Google Analytics)</li>
                            <li><strong>Autoridades Legais:</strong> Quando exigido por lei</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Seus Direitos (LGPD)</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2">
                            <li>Acessar seus dados pessoais</li>
                            <li>Corrigir dados incompletos ou desatualizados</li>
                            <li>Solicitar a exclusão de seus dados</li>
                            <li>Revogar o consentimento a qualquer momento</li>
                            <li>Portabilidade dos dados</li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            Para exercer seus direitos, entre em contato através do e-mail: <strong>privacidade@eaclique.com.br</strong>
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Segurança</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados contra acesso não autorizado,
                            perda ou destruição. No entanto, nenhum método de transmissão pela internet é 100% seguro.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Alterações nesta Política</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Podemos atualizar esta política periodicamente. Recomendamos que você revise esta página regularmente
                            para estar ciente de quaisquer mudanças.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contato</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Para questões sobre esta Política de Privacidade, entre em contato:
                        </p>
                        <div className="bg-gray-50 p-4 rounded-lg mt-4">
                            <p className="text-gray-700"><strong>Email:</strong> contato@eaclique.com.br</p>
                            <p className="text-gray-700"><strong>Endereço:</strong> São Paulo - SP</p>
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
