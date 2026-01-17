# 🧪 Testando a Geração de Capas com IA

Existem 3 formas de testar a funcionalidade de geração de capas:

---

## 🚀 Opção 1: Script Automatizado (Recomendado)

Execute o script de teste completo que faz todo o fluxo automaticamente:

### 1. Instalar dependências de teste
```bash
npm install
```

### 2. Configurar variáveis de ambiente
Certifique-se de que o arquivo `.env` tem estas configurações:
```env
OPENAI_API_KEY=sk-...                    # Obrigatório
GOOGLE_API_KEY=...                       # Obrigatório
DATABASE_URL=postgresql://...            # Obrigatório
COVERS_DIR=./uploads/covers
DEFAULT_COVER_QUALITY=hd
DEFAULT_COVER_SIZE=1024x1792
```

### 3. Rodar as migrações do banco
```bash
npx prisma migrate dev
```

### 4. Iniciar o servidor
```bash
npm run dev
```

### 5. Em outro terminal, executar o teste
```bash
node test-cover-generation.js
```

O script irá:
- ✅ Criar/autenticar usuário
- ✅ Criar projeto de teste
- ✅ Gerar prompt de capa
- ✅ Gerar imagem com DALL-E 3
- ✅ Mostrar todos os resultados no console

**Resultado**: A imagem gerada estará em `uploads/covers/{PROJECT_ID}/original.png`

---

## 📝 Opção 2: Requisições Manuais (curl)

Use os exemplos do arquivo `API_TESTS.md`:

### Fluxo rápido:
```bash
# 1. Registrar/Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@exemplo.com","password":"teste123"}'

# 2. Copiar o token e criar projeto
# 3. Configurar informações do livro
# 4. Gerar prompt de capa
# 5. Gerar imagem
```

**Veja todos os detalhes em**: [`API_TESTS.md`](API_TESTS.md)

---

## 🎯 Opção 3: Postman/Insomnia

1. Importe as requisições do arquivo `API_TESTS.md`
2. Configure variáveis de ambiente:
   - `base_url`: `http://localhost:3001`
   - `token`: (será preenchido após login)
   - `projectId`: (será preenchido após criar projeto)
3. Execute as requisições em ordem

---

## ✅ Verificando o Resultado

Após executar qualquer opção acima:

1. **Console**: Verá a URL da imagem gerada
2. **Arquivo local**: `uploads/covers/{PROJECT_ID}/original.png`
3. **Navegador**: `http://localhost:3001/uploads/covers/{PROJECT_ID}/original.png`

---

## 🎨 Exemplo de Resposta

```json
{
  "message": "Imagem de capa gerada com sucesso",
  "cover": {
    "imageUrl": "https://oaidalleapiprodscus.blob.core.windows.net/...",
    "imagePath": "./uploads/covers/abc123/original.png",
    "prompt": "A breathtaking sci-fi book cover featuring a sleek spacecraft...",
    "quality": "hd",
    "size": "1024x1792"
  }
}
```

---

## ⚠️ Troubleshooting

### "Erro ao gerar imagem: OpenAI API Key não configurada"
- Adicione `OPENAI_API_KEY=sk-...` no arquivo `.env`
- Reinicie o servidor

### "Erro ao conectar ao banco de dados"
- Execute `npx prisma migrate dev`
- Verifique `DATABASE_URL` no `.env`

### "Limite de requisições atingido"
- Aguarde alguns minutos (rate limit da OpenAI)
- Verifique créditos na sua conta OpenAI

### Script travou no passo de geração
- A geração pode levar 10-30 segundos
- Verifique sua conexão com internet
- Veja logs do servidor para mais detalhes

---

## 💰 Custos

Cada geração de capa custa aproximadamente:
- **Standard 1024x1024**: $0.040
- **HD 1024x1792**: $0.080 (recomendado para KDP)

---

## 🎉 Resultado Esperado

Se tudo funcionar corretamente, você verá:

```
✅ Login realizado com sucesso
✅ Projeto criado com sucesso
✅ Informações do livro configuradas
✅ Prompt de capa gerado
✅ Imagem de capa gerada com sucesso
   URL: https://oaidalleapiprodscus.blob.core.windows.net/...
   Caminho Local: ./uploads/covers/abc-123/original.png
```

E poderá abrir a imagem gerada! 🖼️
