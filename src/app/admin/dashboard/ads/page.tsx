'use client';

import { useState } from 'react';
import { Save, Power, AlertCircle, CheckCircle, Edit2, ExternalLink } from 'lucide-react';
import adsConfigData from '@/config/ads.json';

interface AdConfig {
    network: string;
    active: boolean;
    position: string;
    format: string;
    key: string;
}

type AdPosition = 'billboard' | 'skyscraper' | 'in_article' | 'sticky_footer';

export default function AdManager() {
    const [adsConfig, setAdsConfig] = useState<Record<AdPosition, AdConfig>>(
        adsConfigData as Record<AdPosition, AdConfig>
    );
    const [editingPosition, setEditingPosition] = useState<AdPosition | null>(null);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

    const handleToggleActive = (position: AdPosition) => {
        setAdsConfig(prev => ({
            ...prev,
            [position]: {
                ...prev[position],
                active: !prev[position].active
            }
        }));
    };

    const handleUpdateConfig = (position: AdPosition, field: keyof AdConfig, value: string | boolean) => {
        setAdsConfig(prev => ({
            ...prev,
            [position]: {
                ...prev[position],
                [field]: value
            }
        }));
    };

    const handleSaveConfig = async () => {
        setSaveStatus('saving');

        // Simulate API call to save config
        // Em produção, você faria um POST para uma API route que escreve no ads.json
        try {
            const response = await fetch('/api/ads/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(adsConfig)
            });

            if (response.ok) {
                setSaveStatus('success');
                setTimeout(() => setSaveStatus('idle'), 3000);
            } else {
                throw new Error('Failed to save');
            }
        } catch (error) {
            setSaveStatus('error');
            setTimeout(() => setSaveStatus('idle'), 3000);
        }
    };

    const positions: { key: AdPosition; name: string; description: string }[] = [
        { key: 'billboard', name: 'Billboard', description: 'Banner topo 728x90' },
        { key: 'skyscraper', name: 'Skyscraper', description: 'Banner lateral 160x600' },
        { key: 'in_article', name: 'In-Article', description: 'Banner dentro do artigo 300x250' },
        { key: 'sticky_footer', name: 'Sticky Footer', description: 'Banner fixo rodapé' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                📢 Gerenciador de Anúncios
                            </h1>
                            <p className="text-gray-500 mt-1">Gerencie os códigos e status dos anúncios do site</p>
                        </div>
                        <button
                            onClick={handleSaveConfig}
                            disabled={saveStatus === 'saving'}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                            <Save className="w-5 h-5" />
                            {saveStatus === 'saving' ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>

                    {/* Save Status */}
                    {saveStatus === 'success' && (
                        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <p className="text-green-800 font-medium">Configurações salvas com sucesso!</p>
                        </div>
                    )}
                    {saveStatus === 'error' && (
                        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <p className="text-red-800 font-medium">Erro ao salvar. Tente novamente.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {positions.map(({ key, name, description }) => {
                        const config = adsConfig[key];
                        const isEditing = editingPosition === key;

                        return (
                            <div
                                key={key}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                            >
                                {/* Card Header */}
                                <div className={`p-6 border-b ${config.active ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                                {name}
                                                {config.active && (
                                                    <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">ATIVO</span>
                                                )}
                                                {!config.active && (
                                                    <span className="text-xs bg-gray-400 text-white px-2 py-1 rounded-full">INATIVO</span>
                                                )}
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">{description}</p>
                                        </div>
                                        <button
                                            onClick={() => handleToggleActive(key)}
                                            className={`p-2 rounded-lg transition-colors ${config.active
                                                    ? 'bg-green-600 hover:bg-green-700 text-white'
                                                    : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                                                }`}
                                            title={config.active ? 'Desativar' : 'Ativar'}
                                        >
                                            <Power className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-6 space-y-4">
                                    {/* Network */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Rede de Anúncios</label>
                                        <select
                                            value={config.network}
                                            onChange={(e) => handleUpdateConfig(key, 'network', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="adsterra">Adsterra</option>
                                            <option value="google_adsense">Google AdSense</option>
                                            <option value="outros">Outros</option>
                                        </select>
                                    </div>

                                    {/* Position */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Posição</label>
                                        <input
                                            type="text"
                                            value={config.position}
                                            onChange={(e) => handleUpdateConfig(key, 'position', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="ex: top-banner"
                                        />
                                    </div>

                                    {/* Format */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Formato</label>
                                        <input
                                            type="text"
                                            value={config.format}
                                            onChange={(e) => handleUpdateConfig(key, 'format', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="ex: 728x90"
                                        />
                                    </div>

                                    {/* Key */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                            Chave do Anúncio (Key)
                                            <button
                                                onClick={() => setEditingPosition(isEditing ? null : key)}
                                                className="text-blue-600 hover:text-blue-700"
                                                title={isEditing ? 'Fechar editor' : 'Editar key'}
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                        </label>
                                        {isEditing ? (
                                            <textarea
                                                value={config.key}
                                                onChange={(e) => handleUpdateConfig(key, 'key', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                                                rows={4}
                                                placeholder="Cole aqui o código/key do anúncio"
                                            />
                                        ) : (
                                            <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-300">
                                                <code className="text-sm text-gray-600 break-all">{config.key}</code>
                                            </div>
                                        )}
                                    </div>

                                    {/* Test Ad Button */}
                                    <div className="pt-4 border-t border-gray-200">
                                        <a
                                            href={`https://www.${config.network === 'adsterra' ? 'adsterra.com' : 'google.com/adsense'}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            Abrir painel {config.network === 'adsterra' ? 'Adsterra' : 'AdSense'}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Info Box */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-bold text-blue-900 mb-2">Como usar:</h3>
                            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                                <li>Ative/desative anúncios clicando no botão de power</li>
                                <li>Cole a key/código do anúncio no campo correspondente</li>
                                <li>Clique em "Salvar Alterações" para aplicar</li>
                                <li>As mudanças serão refletidas em todo o site automaticamente</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
