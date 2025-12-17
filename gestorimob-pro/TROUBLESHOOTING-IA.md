# 🔧 Troubleshooting - IA não funciona

Este guia ajuda a diagnosticar e resolver problemas com a funcionalidade de IA no Gestorimob Pro.

## 🚨 Sintomas Comuns

- ❌ Mensagens da IA não aparecem
- ❌ Erro "Servidor não responde"
- ❌ Análise de imagem não funciona
- ❌ Geração de contrato falha
- ❌ Erro 500 ou 403 no console do browser

---

## 🔍 Diagnóstico Rápido

### 1. Execute o Script de Diagnóstico

```bash
cd e:\ANTHIGRAVITY\gestorimob-pro
node diagnostic-script.js
```

Este script verifica automaticamente:
- ✅ Estrutura do projeto
- ✅ Presença das Netlify Functions
- ✅ Variáveis de ambiente
- ✅ Conectividade com API Gemini

Se **todas** as verificações passarem, o problema pode estar na configuração do Netlify em produção.

---

## 🛠️ Soluções por Problema

### Problema 1: "GEMINI_API_KEY não está definida"

**Causa**: Variável de ambiente não configurada localmente.

**Solução Local**:
```bash
# 1. Copie o arquivo de exemplo
cp .env.example .env

# 2. Edite o arquivo .env
# No Windows: notepad .env
# Altere a linha:
GEMINI_API_KEY=your-google-gemini-api-key-here

# Para sua chave real:
GEMINI_API_KEY=AIza...sua-chave-aqui
```

**Solução em Produção (Netlify)**:
1. Acesse: [Netlify Dashboard](https://app.netlify.com)
2. Selecione seu site → **Site configuration** → **Environment variables**
3. Clique **"Add a variable"**
4. Adicione:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: Sua chave da API (começa com `AIza`)
   - **Scopes**: Selecione todos
5. Clique **"Create variable"**
6. **Importante**: Faça redeploy → **Deploys** → **Trigger deploy**

---

### Problema 2: "API key ainda está com o valor de exemplo"

**Causa**: Você não substituiu a chave de exemplo pela sua chave real.

**Solução**: Gere uma nova chave da API Gemini

#### Passo a Passo para Gerar Nova Chave

1. **Acesse**: https://aistudio.google.com/app/apikey

2. **Faça login** com sua conta Google

3. **Crie uma chave**:
   - Clique em **"Create API Key"**
   - Escolha **"Create API key in new project"** (recomendado)
   - Copie a chave gerada (formato: `AIza...`)

4. **Configure localmente**:
   ```bash
   # Edite o arquivo .env
   GEMINI_API_KEY=AIzaSua...Chave...Aqui
   ```

5. **Configure no Netlify** (veja Problema 1)

> [!CAUTION]
> **NUNCA** compartilhe sua API key publicamente ou faça commit dela no Git!

---

### Problema 3: "API retornou erro 500"

**Causa**: Chave da API inválida, expirada ou não configurada no servidor.

**Diagnóstico**:
1. Verifique os logs no Netlify:
   - Dashboard → **Functions** → Clique em `gemini-chat`
   - Veja a aba **"Function log"**
   
2. Procure por msgs como:
   - `"GEMINI_API_KEY environment variable not set"`
   - `"API_KEY_INVALID"`

**Solução**:
- Se a chave não está configurada → Veja Problema 1
- Se a chave está inválida → Gere uma nova (veja Problema 2)
- Revogue a chave antiga em: https://console.cloud.google.com/apis/credentials

---

### Problema 4: "Erro 429 - Limite de requisições excedido"

**Causa**: Você atingiu o limite de requisições da API Gemini.

**Limites do Free Tier**:
- 60 requisições por minuto
- 1.500 requisições por dia

**Solução**:
1. **Aguarde**: Os limites resetam após 1 minuto (RPM) ou 24h (RPD)
2. **Monitore uso**: https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas
3. **Upgrade** (opcional): Configure billing para aumentar limites

---

### Problema 5: "Functions não encontradas (404)"

**Causa**: Netlify Functions não foram deployadas corretamente.

**Verificação**:
1. Netlify Dashboard → Seu site → **Functions**
2. Deve listar 3 functions:
   - `gemini-chat`
   - `gemini-analyze-image`
   - `gemini-generate-contract`

**Solução**:
1. Verifique se `netlify.toml` existe e contém:
   ```toml
   [functions]
     directory = "netlify/functions"
   ```

2. Verifique se as 3 functions existem em `netlify/functions/`:
   ```bash
   ls netlify/functions/
   # Deve listar:
   # gemini-chat.ts
   # gemini-analyze-image.ts
   # gemini-generate-contract.ts
   ```

3. Faça redeploy:
   - Netlify → **Deploys** → **Trigger deploy** → **Clear cache and deploy site**

---

### Problema 6: "Erro de CORS"

**Causa**: Tentativa de chamar API do Gemini diretamente do frontend.

**Verificação**:
Abra DevTools → Network:
- ❌ **ERRADO**: Requisições para `generativelanguage.googleapis.com`
- ✅ **CORRETO**: Requisições para `/.netlify/functions/gemini-*`

**Solução**:
- Verifique se está usando o arquivo **NOVO** `services/geminiService.ts`
- Não chame a API do Gemini diretamente
- Sempre use as Netlify Functions

---

### Problema 7: "Request timeout"

**Causa**: Requisição demorou mais de 30 segundos.

**Soluções**:
- Use mensagens/prompts mais curtos
- Para imagens: reduza o tamanho/resolução
- Verifique sua conexão de internet
- Tente novamente (pode ser instabilidade temporária da API)

---

## 🧪 Testes para Validação

### Teste Local (com Netlify Dev)

```bash
# 1. Certifique-se que .env está configurado
cat .env
# Deve mostrar: GEMINI_API_KEY=AIza...

# 2. Inicie Netlify Dev
netlify dev

# 3. Acesse
http://localhost:8888

# 4. Teste:
# - Vá para "Assistente IA"
# - Digite: "Olá, você está funcionando?"
# - Aguarde resposta
```

### Teste em Produção

```bash
# 1. Abra seu site no Netlify
https://seu-site.netlify.app

# 2. Abra DevTools (F12)
# 3. Vá para aba "Network"
# 4. Teste o Assistente IA
# 5. Verifique:
#    - Request para /.netlify/functions/gemini-chat
#    - Status 200 (sucesso)
#    - Response com JSON contendo "response" field
```

---

## 📊 Monitoramento

### Logs das Functions (Netlify)

1. Dashboard → Seu site → **Functions**
2. Clique em uma function (ex: `gemini-chat`)
3. Veja:
   - **Invocations**: Quantas vezes foi chamada
   - **Average duration**: Tempo médio de execução
   - **Error rate**: Taxa de erros
4. Clique **"View logs"** para detalhes

### Quota da API Gemini

1. Acesse: https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas
2. Veja uso atual vs limites
3. Configure alertas (opcional)

---

## 🆘 Ainda com Problemas?

Se nada funcionou:

### 1. Colete Informações de Debug

```bash
# Execute diagnóstico
node diagnostic-script.js > diagnostico.txt

# Verifique logs do browser
# F12 → Console → Copie erros
```

### 2. Verifique Deploy Logs (Netlify)

1. Dashboard → **Deploys** → Clique no último deploy
2. Veja **"Deploy log"**
3. Procure por erros de build das functions

### 3. Force Redeploy Completo

```bash
# Via CLI
netlify deploy --prod --build

# Ou via UI:
# Deploys → Trigger deploy → Clear cache and deploy site
```

### 4. Teste com Nova Chave

Às vezes a chave pode ter sido revogada sem você saber:

1. Gere uma nova chave: https://aistudio.google.com/app/apikey
2. Atualize no `.env` local
3. Atualize no Netlify (Environment variables)
4. Faça redeploy

---

## ✅ Checklist Final

Antes de desistir, certifique-se:

- [ ] ✅ Arquivo `.env` existe localmente com chave válida
- [ ] ✅ Variável `GEMINI_API_KEY` configurada no Netlify
- [ ] ✅ Chave começa com `AIza` e tem ~40 caracteres
- [ ] ✅ As 3 Netlify Functions aparecem no dashboard
- [ ] ✅ Fez redeploy após configurar variável
- [ ] ✅ Script `diagnostic-script.js` passa todas verificações
- [ ] ✅ Não há erros no console do browser (F12)
- [ ] ✅ Requests vão para `/.netlify/functions/*` (não direto para Google)

---

## 📚 Recursos Adicionais

- [Documentação Gemini API](https://ai.google.dev/docs)
- [Netlify Functions Docs](https://docs.netlify.com/functions/overview/)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)
- [Google Cloud Console](https://console.cloud.google.com)

---

**Última atualização**: 2025-12-17
