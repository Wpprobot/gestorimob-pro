# 🔑 Como Gerar Nova Chave de API do Google Gemini

## Passo a Passo

### 1. Acesse o Google AI Studio
https://aistudio.google.com/app/apikey

### 2. Faça Login
- Use sua conta Google
- Aceite os termos de serviço se solicitado

### 3. Crie a Chave de API

1. Clique no botão **"Create API Key"** ou **"Get API Key"**
2. Selecione um projeto do Google Cloud:
   - Se você já tem um projeto, selecione-o
   - Se não, clique em "Create new project" e dê um nome (ex: "GestorImob")
3. A chave será gerada automaticamente
4. **COPIE a chave completa** (ela começa com `AIza...` e tem cerca de 39 caracteres)

### 4. Cole a Chave no Chat

Depois de copiar a chave, **cole ela no chat** que o sistema configurará automaticamente o arquivo `.env.local` para você!

---

## ⚠️ Importante

- ✅ **Nunca compartilhe** esta chave publicamente
- ✅ **Não comite** a chave no Git (já está protegido pelo .gitignore)
- ✅ A chave antiga será **substituída** pela nova
- ✅ Após configurar, **reinicie o servidor** para a IA funcionar

---

## 🔄 Após Receber a Chave

O sistema irá:
1. Criar o arquivo `.env.local` com sua chave
2. Reiniciar o servidor Netlify Dev
3. Testar a conexão com a API do Gemini
4. Confirmar que a IA está funcionando

---

## Problema Atual

**Erro:** `API key not valid`

**Causa:** A chave antiga que estava exposta no código foi invalidada/revogada

**Solução:** Gerar uma nova chave seguindo os passos acima
