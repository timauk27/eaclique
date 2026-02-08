'use client'

import { Metadata } from 'next';
import Link from 'next/link';
import { Mail, MapPin, Send } from 'lucide-react';
import { useState } from 'react';

export default function ContatoPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');

        // Simula envio (você pode integrar com uma API real depois)
        setTimeout(() => {
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setStatus('idle'), 3000);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-12 max-w-5xl">
                {/* Breadcrumb */}
                <div className="text-sm text-gray-500 mb-6">
                    <Link href="/" className="hover:text-red-600">Home</Link>
                    <span className="mx-2">›</span>
                    <span>Contato</span>
                </div>

                {/* Header */}
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    Entre em Contato
                </h1>
                <p className="text-xl text-gray-600 mb-12">
                    Estamos aqui para ouvir você. Envie sua mensagem e retornaremos em breve.
                </p>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Formulário */}
                    <div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nome Completo
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                                    placeholder="Seu nome"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                    E-mail
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                                    placeholder="seu@email.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Assunto
                                </label>
                                <select
                                    id="subject"
                                    required
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition"
                                >
                                    <option value="">Selecione um assunto</option>
                                    <option value="duvida">Dúvida</option>
                                    <option value="sugestao">Sugestão</option>
                                    <option value="anuncio">Anunciar no Site</option>
                                    <option value="parceria">Proposta de Parceria</option>
                                    <option value="trabalho">Trabalhe Conosco</option>
                                    <option value="outro">Outro</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Mensagem
                                </label>
                                <textarea
                                    id="message"
                                    required
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    rows={6}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition resize-none"
                                    placeholder="Escreva sua mensagem aqui..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'sending'}
                                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                {status === 'sending' ? (
                                    <>Enviando...</>
                                ) : status === 'success' ? (
                                    <>✓ Mensagem Enviada!</>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        Enviar Mensagem
                                    </>
                                )}
                            </button>

                            {status === 'success' && (
                                <p className="text-green-600 text-sm text-center">
                                    Obrigado! Responderemos em breve.
                                </p>
                            )}
                        </form>
                    </div>

                    {/* Info Lateral */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Outras Formas de Contato
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                    <Mail className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">E-mail</h3>
                                        <a href="mailto:contato@eaclique.com.br" className="text-red-600 hover:underline">
                                            contato@eaclique.com.br
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                    <MapPin className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Endereço</h3>
                                        <p className="text-gray-600">
                                            São Paulo - SP<br />
                                            Brasil
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                            <h3 className="font-bold text-gray-900 mb-2">💡 Dica</h3>
                            <p className="text-sm text-gray-700">
                                Para anúncios e parcerias comerciais, por favor selecione o assunto correspondente
                                para que possamos direcionar sua mensagem à equipe correta.
                            </p>
                        </div>

                        <div className="p-6 bg-gray-50 rounded-lg">
                            <h3 className="font-bold text-gray-900 mb-3">Tempo de Resposta</h3>
                            <p className="text-sm text-gray-600">
                                Normalmente respondemos em até <span className="font-semibold text-gray-900">24-48 horas úteis</span>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
