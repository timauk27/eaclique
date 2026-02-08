'use client'

import CookieConsent from 'react-cookie-consent'

export default function CookieBanner() {
    return (
        <CookieConsent
            location="bottom"
            buttonText="Aceitar Todos"
            declineButtonText="Apenas Essenciais"
            enableDeclineButton
            cookieName="eaclique-cookie-consent"
            style={{
                background: 'rgba(0, 0, 0, 0.95)',
                backdropFilter: 'blur(10px)',
                padding: '20px',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '20px',
                borderTop: '2px solid #DC2626',
            }}
            buttonStyle={{
                background: '#DC2626',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '600',
                padding: '12px 32px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
            }}
            declineButtonStyle={{
                background: 'transparent',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '600',
                padding: '12px 32px',
                borderRadius: '8px',
                border: '2px solid #DC2626',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
            }}
            expires={365}
            overlay
            overlayStyle={{
                background: 'rgba(0, 0, 0, 0.5)',
            }}
        >
            <div style={{ maxWidth: '900px', lineHeight: '1.6' }}>
                <span style={{ fontSize: '16px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                    🍪 Este site usa cookies
                </span>
                <span style={{ fontSize: '14px', opacity: '0.9' }}>
                    Utilizamos cookies para melhorar sua experiência, personalizar conteúdo e anúncios, fornecer recursos de mídia social e analisar nosso tráfego.
                    Ao clicar em "Aceitar Todos", você concorda com o uso de cookies conforme nossa{' '}
                    <a href="/privacy" style={{ color: '#DC2626', textDecoration: 'underline' }}>
                        Política de Privacidade
                    </a>
                    {' '}e{' '}
                    <a href="/terms" style={{ color: '#DC2626', textDecoration: 'underline' }}>
                        Termos de Uso
                    </a>
                    . Também compartilhamos informações sobre o uso do nosso site com parceiros de publicidade (Google AdSense).
                </span>
            </div>
        </CookieConsent>
    )
}
