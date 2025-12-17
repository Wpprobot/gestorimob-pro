# 🚀 Deploy no Vercel - Gestorimob Pro

## Passo a Passo Completo

### 1️⃣ Instalar Vercel CLI (Opcional, mas recomendado)

```bash
npm install -g vercel
```

---

### 2️⃣ Fazer Deploy

Você tem duas opções:

#### **Opção A: Via Dashboard (Mais Fácil)** ✅ Recomendado

1. **Acesse**: https://vercel.com
2. **Faça login** (pode usar GitHub, GitLab ou Email)
3. **Clique** em **"Add New Project"**
4. **Importe** seu repositório Git do Gestorimob-pro
   - Se ainda não conectou o Git, clique em "Import Git Repository"
   - Autorize o acesso ao GitHub/GitLab
   - Selecione o repositório `gestorimob-pro`

5. **Configure o Projeto**:
   - **Project Name**: `gestorimob-pro` (ou o que preferir)
   - **Framework Preset**: Vite (deve detectar automaticamente)
   - **Build Command**: `npm run build` (já configurado)
   - **Output Directory**: `dist` (já configurado)

6. **NÃO clique em Deploy ainda!** Primeiro vamos configurar a variável de ambiente.

---

### 3️⃣ Configurar Variável de Ambiente

Ainda na tela de configuração do projeto:

1. Expanda a seção **"Environment Variables"**

2. **Adicione a variável**:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: `AIzaSyDYsJUR3BaUdRfNuBJrYGRkel85pSd1gQI`
   - **Environment**: Selecione **todos** (Production, Preview, Development)

3. Clique em **"Add"**

---

### 4️⃣ Fazer Deploy

1. Agora **clique em "Deploy"**
2. Aguarde 2-3 minutos enquanto o Vercel:
   - Instala dependências
   - Faz build do projeto
   - Cria as API routes
   - Publica o site

3. Quando terminar, você verá: **"Congratulations! Your project has been deployed"** 🎉

4. **Copie a URL** do seu site (algo como: `https://gestorimob-pro.vercel.app`)

---

### 5️⃣ Testar o Site

1. **Abra a URL** do seu site
2. Vá para **"Assistente IA"**
3. **Clique** em **"Testar Conexão"**
   - Deve mostrar: ✅ **"Conexão com IA funcionando!"**
4. **Envie uma mensagem** de teste
5. **Teste** análise de imagem e geração de contratos

---

## 🔧 Opção B: Via CLI (Avançado)

Se preferir fazer pelo terminal:

```bash
# 1. Navegue até o projeto
cd e:\ANTHIGRAVITY\gestorimob-pro

# 2. Faça login no Vercel
vercel login

# 3. Configure a variável de ambiente
vercel env add GEMINI_API_KEY production
# Quando pedir, cole: AIzaSyDYsJUR3BaUdRfNuBJrYGRkel85pSd1gQI

vercel env add GEMINI_API_KEY preview
# Cole a mesma chave

vercel env add GEMINI_API_KEY development
# Cole a mesma chave

# 4. Fazer deploy
vercel --prod
```

---

## 🧪 Testar Localmente Antes do Deploy

Para testar localmente com Vercel dev server:

```bash
# 1. Crie o arquivo .env.local
echo GEMINI_API_KEY=AIzaSyDYsJUR3BaUdRfNuBJrYGRkel85pSd1gQI > .env.local

# 2. Inicie o servidor de desenvolvimento Vercel
vercel dev

# 3. Acesse: http://localhost:3000
```

---

## ✅ Validação

### Checklist Pós-Deploy:

- [ ] Site abre sem erros
- [ ] Botão "Testar Conexão" mostra status verde ✅
- [ ] Chat IA responde normalmente
- [ ] Análise de imagem funciona
- [ ] Geração de contratos funciona
- [ ] Não há erros no console do browser (F12)

---

## 📊 Monitoramento

### Ver Logs das Functions:

1. Acesse: https://vercel.com/dashboard
2. Clique no seu projeto
3. Vá em **"Functions"** no menu lateral
4. Veja invocações e logs em tempo real

### Configurações Adicionais:

- **Analytics**: Vercel > Seu Projeto > Analytics
- **Logs**: Vercel > Seu Projeto > Deployments > [último deploy] > Function Log
- **Environment Variables**: Vercel > Seu Projeto > Settings > Environment Variables

---

## 🆘 Problemas Comuns

### "API route not found (404)"

**Solução**: Certifique-se que a pasta `api/` existe e tem os 3 arquivos:
- `gemini-chat.ts`
- `gemini-analyze-image.ts`
- `gemini-generate-contract.ts`

### "GEMINI_API_KEY not set"

**Solução**: 
1. Vá em Settings > Environment Variables
2. Certifique-se que `GEMINI_API_KEY` está configurada para TODOS os ambientes
3. Faça um novo deploy (Deployments > [...] > Redeploy)

### "Build failed"

**Solução**:
1. Verifique os logs de build
2. Rode `npm install` localmente para garantir dependências
3. Rode `npm run build` para ver se há erros de build

---

## 🎯 Próximos Passos

Após deploy bem-sucedido:

1. **Configure Domínio Customizado** (opcional):
   - Vercel > Seu Projeto > Settings > Domains
   - Adicione seu domínio personalizado

2. **Configure GitHub Auto-Deploy**:
   - Todo push na branch main = deploy automático
   - Já está configurado se importou via GitHub!

3. **Monitore Performance**:
   - Vercel Analytics mostra métricas em tempo real
   - Core Web Vitals, tempo de carregamento, etc.

---

**🎉 Pronto! Seu Gestorimob-pro agora está rodando na Vercel!**

Muito mais simples que Netlify, não? 😊
