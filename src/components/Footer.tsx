import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-300 mt-16">
            {/* Main Footer */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

                    {/* Sobre */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4 uppercase tracking-wider">
                            EAClique
                        </h3>
                        <p className="text-sm text-gray-400 leading-relaxed mb-4">
                            Portal de notícias com informações atualizadas sobre tecnologia, economia, esportes, entretenimento e muito mais.
                        </p>
                        <div className="flex gap-3">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                                aria-label="Acesse nosso Facebook"
                                className="bg-gray-800 hover:bg-blue-600 p-2 rounded-full transition-colors">
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                                aria-label="Acesse nosso Twitter"
                                className="bg-gray-800 hover:bg-sky-500 p-2 rounded-full transition-colors">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                                aria-label="Acesse nosso Instagram"
                                className="bg-gray-800 hover:bg-pink-600 p-2 rounded-full transition-colors">
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
                                aria-label="Acesse nosso canal no Youtube"
                                className="bg-gray-800 hover:bg-red-600 p-2 rounded-full transition-colors">
                                <Youtube className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Categorias */}
                    <div>
                        <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">
                            Categorias
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/category/plantao" className="hover:text-white transition-colors">Plantão</Link></li>
                            <li><Link href="/category/brasil" className="hover:text-white transition-colors">Brasil</Link></li>
                            <li><Link href="/category/mundo" className="hover:text-white transition-colors">Mundo</Link></li>
                            <li><Link href="/category/arena" className="hover:text-white transition-colors">Arena</Link></li>
                            <li><Link href="/category/holofote" className="hover:text-white transition-colors">Holofote</Link></li>
                            <li><Link href="/category/pixel" className="hover:text-white transition-colors">Pixel</Link></li>
                        </ul>
                    </div>

                    {/* Institucional */}
                    <div>
                        <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">
                            Institucional
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/sobre" className="hover:text-white transition-colors">Sobre Nós</Link></li>
                            <li><Link href="/contato" className="hover:text-white transition-colors">Contato</Link></li>
                            <li><Link href="/anuncie" className="hover:text-white transition-colors">Anuncie Conosco</Link></li>
                            <li><Link href="/trabalhe-conosco" className="hover:text-white transition-colors">Trabalhe Conosco</Link></li>
                            <li><Link href="/midia-kit" className="hover:text-white transition-colors">Mídia Kit</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">
                            Legal
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/privacidade" className="hover:text-white transition-colors">Política de Privacidade</Link></li>
                            <li><Link href="/termos" className="hover:text-white transition-colors">Termos de Uso</Link></li>
                            <li><Link href="/cookies" className="hover:text-white transition-colors">Política de Cookies</Link></li>
                            <li><Link href="/lgpd" className="hover:text-white transition-colors">LGPD</Link></li>
                        </ul>

                        <div className="mt-6">
                            <h4 className="text-white font-bold text-xs mb-2 uppercase">Newsletter</h4>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Seu e-mail"
                                    aria-label="Digite seu e-mail para receber nossa Newsletter"
                                    className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-xs flex-1 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                                <button aria-label="Inscrever-se na Newsletter" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-xs font-bold transition-colors">
                                    <Mail className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-800 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                        <div className="text-center md:text-left">
                            <p>&copy; {currentYear} EAClique. Todos os direitos reservados.</p>
                            <p className="mt-1">
                                CNPJ: 00.000.000/0001-00 | Endereço: São Paulo - SP
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <Link href="/sitemap.xml" className="hover:text-gray-300 transition-colors">Sitemap</Link>
                            <Link href="/rss" className="hover:text-gray-300 transition-colors">RSS</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Privacy Notice (LGPD) */}
            <div className="bg-gray-950 py-3">
                <div className="container mx-auto px-4">
                    <p className="text-xs text-gray-600 text-center">
                        Este site utiliza cookies para melhorar sua experiência. Ao continuar navegando, você concorda com nossa{' '}
                        <Link href="/cookies" className="text-blue-400 hover:underline">Política de Cookies</Link>
                        {' '}e{' '}
                        <Link href="/privacidade" className="text-blue-400 hover:underline">Política de Privacidade</Link>.
                    </p>
                </div>
            </div>
        </footer>
    );
}
