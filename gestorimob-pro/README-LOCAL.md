# 🚀 Como Rodar Localmente

## Método Simples (Recomendado)

Basta executar o Vite normalmente:

```bash
npm run dev
```

O app abrirá em: **http://localhost:3002**

> **Nota**: Como as Netlify Functions só funcionam em produção ou com `netlify dev`, localmente a IA não funcionará. Para testar a IA localmente, use o método completo abaixo.

---

## Método Completo (Com Netlify Functions)

### 1. Certifique-se que o arquivo `.env` existe

O arquivo já foi criado com a chave temporária. Para usar a IA, você precisa:
- Gerar uma **NOVA** chave em: https://aistudio.google.com/app/apikey
- Editar o arquivo `.env` e substituir pela nova chave

### 2. Inicie o servidor de desenvolvimento

Opção A - Script automático:
```bash
.\start-local.bat
```

Opção B - Manual (2 terminais):
```bash
# Terminal 1 - Vite
npm run dev

# Terminal 2 - Netlify Dev  
netlify dev --offline
```

### 3. Acesse o app

- Frontend Vite: http://localhost:3002
- Netlify Dev (com Functions): http://localhost:8888

---

## ⚠️ Problemas Comuns

### "Port already in use"
- O Vite escolherá automaticamente outra porta (3001, 3002, etc.)
- Use a porta que o Vite mostrar no terminal

### "Netlify Dev não conecta"
- Verifique se o Vite está rodando primeiro
- Abra o Vite em http://localhost:3002 para confirmar
- Depois inicie `netlify dev`

### "AI não funciona"
- As Netlify Functions só funcionam com `netlify dev`, não com `npm run dev`
- Use http://localhost:8888 (não 3002) para testar a IA
- Verifique se o arquivo `.env` existe e tem a chave de API

---

## 📌 Para Deploy em Produção

Siga as instruções em [`DEPLOYMENT.md`](./DEPLOYMENT.md)
