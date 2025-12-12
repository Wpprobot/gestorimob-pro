# GIT SETUP - Deploy Automático

## Situação Atual
✅ Git inicializado localmente
✅ Commit criado com todas as mudanças
✅ Branch renomeado para `main`

## 📝 Próximos Passos (VOCÊ precisa fazer)

### 1. Criar Repositório no GitHub

1. **Acesse:** https://github.com/new
2. **Preencha:**
   - Repository name: `gestorimob-pro`
   - Description: "Sistema de Gestão Imobiliária"
   - **Private** (recomendado - tem API keys)
3. **NÃO marque** "Initialize with README"
4. **Clique:** "Create repository"

### 2. Copiar URL do Repositório

Após criar, GitHub mostrará algo como:
```
https://github.com/SEU-USUARIO/gestorimob-pro.git
```

**Copie essa URL!**

### 3. Conectar Git Local com GitHub

Abra o terminal na pasta do projeto e execute:

```bash
# Substituir SEU-USUARIO pelo seu usuário do GitHub
git remote add origin https://github.com/SEU-USUARIO/gestorimob-pro.git

# Fazer push
git push -u origin main
```

**Ou use o comando que o GitHub mostrar na página.**

### 4. Conectar Netlify com GitHub

1. **Acesse:** https://app.netlify.com
2. **Sites** → **Add new site** → **Import an existing project**
3. **Escolha:** GitHub
4. **Autorize** Netlify a acessar seus repositórios
5. **Selecione:** gestorimob-pro
6. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
7. **Deploy!**

### 5. Configurar API Key no Netlify

**IMPORTANTE:** A API key está no código, mas para segurança:

1. **Site settings** → **Environment variables**
2. **Add variable:**
   - Key: `VITE_GEMINI_API_KEY`
   - Value: `AIzaSyArveX__r4_cof2l-CUTJQYO-lfqr2irLc`

---

## 🚀 Depois Disso (Deploy Automático)

Toda vez que fizer mudanças:

```bash
git add .
git commit -m "Descrição da mudança"
git push
```

**Netlify rebuilda e deploya automaticamente!** ✨

---

## ⚠️ IMPORTANTE - Segurança

A API key está hardcoded no código. Para produção:

1. Remova a key do código
2. Use variável de ambiente
3. Configure no Netlify

### Como fazer isso:

**arquivo `.env.local`:**
```
VITE_GEMINI_API_KEY=AIzaSyArveX__r4_cof2l-CUTJQYO-lfqr2irLc
```

**No código (geminiService.ts):**
```typescript
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
```

**No .gitignore:** (já está)
```
.env.local
```

---

## ✅ Checklist Rápido

- [ ] Criar repo no GitHub (https://github.com/new)
- [ ] Copiar URL do repo
- [ ] `git remote add origin URL`
- [ ] `git push -u origin main`
- [ ] Conectar Netlify com GitHub
- [ ] Configurar build settings
- [ ] Deploy automático funcionando! 🎉

**Tempo estimado:** 5-10 minutos
