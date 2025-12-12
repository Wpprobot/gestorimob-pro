# 🚀 Guia de Deploy no Netlify - GestorImob Pro

Este guia explica como fazer o deploy da aplicação GestorImob Pro no Netlify.

## 📋 Pré-requisitos

- Conta no [Netlify](https://www.netlify.com/) (gratuita)
- Conta no [GitHub](https://github.com/) (ou GitLab/Bitbucket)
- Chave API do Gemini

## 🎯 Método 1: Deploy via GitHub (Recomendado)

### Passo 1: Preparar o Repositório

1. **Criar um repositório no GitHub:**
   ```bash
   # Inicializar git (se ainda não foi feito)
   git init
   
   # Adicionar todos os arquivos
   git add .
   
   # Fazer o primeiro commit
   git commit -m "Initial commit - GestorImob Pro"
   
   # Adicionar o repositório remoto (substitua com seu usuário)
   git remote add origin https://github.com/SEU-USUARIO/gestorimob-pro.git
   
   # Enviar para o GitHub
   git push -u origin main
   ```

### Passo 2: Conectar ao Netlify

1. Acesse [https://app.netlify.com/](https://app.netlify.com/)
2. Clique em **"Add new site"** → **"Import an existing project"**
3. Selecione **GitHub** e autorize o acesso
4. Escolha o repositório `gestorimob-pro`

### Passo 3: Configurar Build Settings

O Netlify deve detectar automaticamente as configurações do `netlify.toml`, mas confirme:

- **Base directory:** `/` (raiz)
- **Build command:** `npm run build`
- **Publish directory:** `dist`

### Passo 4: Configurar Variáveis de Ambiente

1. No painel do Netlify, vá em **Site configuration** → **Environment variables**
2. Adicione a seguinte variável:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** `sua-chave-api-do-gemini`
   
   > ⚠️ **IMPORTANTE:** Você pode obter sua chave API em [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

3. Clique em **Save**

### Passo 5: Deploy

1. Clique em **"Deploy site"**
2. Aguarde o build completar (2-3 minutos)
3. Seu site estará disponível em `https://SEU-SITE.netlify.app`

### Passo 6: Customizar Domínio (Opcional)

1. Vá em **Site configuration** → **Domain management**
2. Clique em **"Add custom domain"** para usar seu próprio domínio
3. Ou clique em **"Change site name"** para personalizar o subdomínio do Netlify

---

## 🎯 Método 2: Deploy via Netlify CLI

### Passo 1: Instalar Netlify CLI

```bash
npm install -g netlify-cli
```

### Passo 2: Login no Netlify

```bash
netlify login
```

### Passo 3: Inicializar o Site

```bash
# Na raiz do projeto
netlify init
```

Responda às perguntas:
- **What would you like to do?** → `Create & configure a new site`
- **Team:** → Selecione sua equipe
- **Site name:** → `gestorimob-pro` (ou escolha um nome)
- **Your build command:** → `npm run build`
- **Directory to deploy:** → `dist`

### Passo 4: Configurar Variável de Ambiente

```bash
netlify env:set GEMINI_API_KEY "sua-chave-api-do-gemini"
```

### Passo 5: Deploy

```bash
# Deploy de produção
netlify deploy --prod
```

---

## 🎯 Método 3: Deploy Manual (Drag & Drop)

### Passo 1: Build Local

```bash
# Instalar dependências
npm install

# Criar build de produção
npm run build
```

Isso criará a pasta `dist/` com os arquivos prontos para deploy.

### Passo 2: Deploy Manual

1. Acesse [https://app.netlify.com/drop](https://app.netlify.com/drop)
2. Arraste a pasta `dist/` para a área de drop
3. Aguarde o upload completar

> ⚠️ **LIMITAÇÃO:** Este método NÃO permite configurar variáveis de ambiente facilmente. Use apenas para testes rápidos.

---

## 🔧 Configurações Adicionais

### Variáveis de Ambiente no Código

O projeto já está configurado para usar variáveis de ambiente no `vite.config.ts`:

```typescript
define: {
  'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
  'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
}
```

### Arquivo netlify.toml

O arquivo `netlify.toml` já foi criado na raiz do projeto com as configurações necessárias:

- ✅ Build command configurado
- ✅ Publish directory configurado
- ✅ Redirects para SPA (Single Page Application)

---

## 🔍 Troubleshooting

### Erro: "Build failed"

1. Verifique se todas as dependências estão no `package.json`
2. Execute `npm run build` localmente para ver se há erros
3. Verifique os logs de build no Netlify

### Erro: "API key not found"

1. Confirme que a variável `GEMINI_API_KEY` foi configurada no Netlify
2. Faça um novo deploy após adicionar a variável

### Erro: "Page not found" ao navegar

- O arquivo `netlify.toml` deve estar na raiz do projeto
- Verifique se os redirects estão configurados corretamente

### Build demorado

- Primeira build pode demorar mais (3-5 minutos)
- Builds subsequentes usam cache e são mais rápidas (1-2 minutos)

---

## 📊 Monitoramento

Após o deploy, você pode:

1. **Ver Analytics:** Netlify → Analytics (tráfego, visitantes)
2. **Ver Logs:** Netlify → Functions → Logs
3. **Ver Build Logs:** Netlify → Deploys → [Deploy] → Deploy log

---

## 🔄 Atualizações Automáticas

Com o **Método 1 (GitHub)**, toda vez que você fizer `git push`:

1. O Netlify detecta automaticamente
2. Inicia um novo build
3. Faz deploy automático da nova versão

```bash
# Fazer mudanças no código
git add .
git commit -m "feat: adicionar nova funcionalidade"
git push

# Deploy automático iniciará no Netlify!
```

---

## 📱 Recursos do Netlify (Gratuito)

✅ 100 GB de bandwidth/mês  
✅ Deploy automático via Git  
✅ HTTPS gratuito  
✅ CDN global  
✅ Deploy previews (branches)  
✅ Rollback instantâneo  
✅ Domínio customizado  

---

## 🎉 Pronto!

Sua aplicação GestorImob Pro agora está rodando no Netlify! 🚀

**URL de exemplo:** `https://gestorimob-pro.netlify.app`

Para mais informações, visite a [documentação oficial do Netlify](https://docs.netlify.com/).
