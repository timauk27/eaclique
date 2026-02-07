# 📝 Como Trocar Códigos de Anúncios

## 🎯 Visão Geral

O sistema de gerenciamento de anúncios do portal EAClique usa um arquivo JSON centralizado (`config/ads.json`) que permite ativar/desativar e trocar códigos de anúncios sem modificar o código React.

---

## 📁 Localização do Arquivo

```
J:/site_auto_2/eaclique-portal/config/ads.json
```

---

## 🔧 Estrutura do Arquivo

O arquivo `ads.json` contém 4 posições de anúncios:

```json
{
  "billboard": {
    "network": "adsterra",
    "active": true,
    "position": "top-banner",
    "format": "728x90",
    "description": "Banner horizontal topo (Desktop)",
    "key": "ad80144040dc1bf67996553ea5bf90a2",
    "renderType": "iframe"
  },
  "skyscraper": { ... },
  "in_article": { ... },
  "sticky_footer": { ... }
}
```

---

## 📋 Como Trocar um Anúncio

### 1. Ativar/Desativar Anúncio

Para **desativar** um anúncio temporariamente:

```json
{
  "billboard": {
    "active": false,  // ← Mude para false
    ...
  }
}
```

### 2. Trocar a Rede de Anúncios

Para trocar de **Adsterra** para **Google Ads**:

```json
{
  "billboard": {
    "network": "google",  // ← Era "adsterra"
    "active": true,
    "key": "ca-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY",  // ← Nova key do Google
    ...
  }
}
```

### 3. Atualizar a Key do Anúncio

Se você receber uma nova key da Adsterra:

```json
{
  "in_article": {
    "key": "NOVA_KEY_AQUI",  // ← Substitua a key antiga
    ...
  }
}
```

---

## 🚀 Após Fazer Mudanças

**IMPORTANTE:** Após editar o `ads.json`, você precisa:

1. **Salvar o arquivo**
2. **Reiniciar o servidor** (se estiver rodando localmente):
   ```bash
   # Ctrl+C para parar
   npm run dev
   ```

3. **OU fazer deploy** se estiver em produção:
   ```bash
   git add config/ads.json
   git commit -m "Atualizar configuração de ads"
   git push
   ```

---

## 📍 Posições Disponíveis

| Posição | ID | Onde Aparece | Formato |
|---------|-----|--------------|---------|
| **Billboard** | `billboard` | Topo das páginas (desktop) | 728x90 |
| **Skyscraper** | `skyscraper` | Lateral direita (desktop) | 160x600 |
| **In-Article** | `in_article` | Dentro dos artigos, a cada 3 parágrafos | 300x250 |
| **Sticky Footer** | `sticky_footer` | Fixo na parte inferior (mobile) | 320x50 |

---

## 🔍 Exemplo Completo

### Cenário: Trocar Billboard de Adsterra para Google Ads

**Antes:**
```json
{
  "billboard": {
    "network": "adsterra",
    "active": true,
    "key": "ad80144040dc1bf67996553ea5bf90a2",
    "format": "728x90"
  }
}
```

**Depois:**
```json
{
  "billboard": {
    "network": "google",
    "active": true,
    "key": "ca-pub-1234567890123456/9876543210",
    "format": "728x90"
  }
}
```

---

## ⚠️ Dicas Importantes

1. **Não quebre a sintaxe JSON**
   - Use aspas duplas `"` (não simples `'`)
   - Sempre coloque vírgula entre itens (exceto o último)
   - Valide em [jsonlint.com](https://jsonlint.com/) se tiver dúvida

2. **Teste localmente primeiro**
   - Sempre teste mudanças localmente antes de fazer deploy

3. **Backup**
   - Faça backup do arquivo antes de grandes mudanças:
     ```bash
     cp config/ads.json config/ads.json.backup
     ```

4. **Formatos suportados**
   - Para Adsterra: todos os formatos funcionam automaticamente
   - Para outras redes: você pode precisar ajustar o componente

---

## 🐛 Solução de Problemas

### Anúncio não aparece após mudar para `active: true`

1. Limpe o cache do navegador (Ctrl+Shift+R)
2. Verifique se a key está correta
3. Confira o console do navegador (F12) para erros

### Erro "Cannot find module ads.json"

1. Verifique se o arquivo está em `J:/site_auto_2/eaclique-portal/config/ads.json`
2. Reinicie o servidor de desenvolvimento

### Anúncio mostra código em vez de renderizar

Isso pode indicar problema com a key ou rede. Verifique:
- A key está correta?
- A conta na rede de anúncios está ativa?

---

## 📞 Suporte

Se precisar de ajuda para integrar uma nova rede de anúncios (PropellerAds, Monetag, etc.), entre em contato com o desenvolvedor.

**Arquivo de configuração:** `J:/site_auto_2/eaclique-portal/config/ads.json`  
**Componentes:** `J:/site_auto_2/eaclique-portal/src/components/ads/`
