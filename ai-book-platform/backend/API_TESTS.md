# Testes de API - Geração de Capas com IA

Este documento contém exemplos de requisições para testar a API de geração de capas usando curl, Postman ou Insomnia.

---

## Pré-requisitos

1. **Servidor rodando**: `npm run dev` na pasta `backend`
2. **Variáveis de ambiente**: Arquivo `.env` configurado com:
   ```env
   OPENAI_API_KEY=sk-...
   GOOGLE_API_KEY=...
   DATABASE_URL=postgresql://...
   ```
3. **Database**: `npx prisma migrate dev` executado

---

## 1. Autenticação

### Registrar Usuário

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@exemplo.com",
    "name": "Usuário Teste",
    "password": "teste123"
  }'
```

**Resposta esperada**:
```json
{
  "message": "Usuário criado com sucesso",
  "user": {
    "id": "...",
    "email": "teste@exemplo.com",
    "name": "Usuário Teste"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@exemplo.com",
    "password": "teste123"
  }'
```

**⚠️ Importante**: Copie o `token` retornado e use nas próximas requisições!

---

## 2. Criar Projeto

```bash
# Substitua {TOKEN} pelo token recebido acima
curl -X POST http://localhost:3001/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {TOKEN}" \
  -d '{
    "tema": "Ficção Científica - Exploração Espacial",
    "publicoAlvo": "Adultos jovens interessados em sci-fi",
    "idioma": "pt-BR",
    "tamanho": "medio",
    "tomDeVoz": "Inspirador e aventureiro",
    "tipo": "ficcao"
  }'
```

**⚠️ Importante**: Copie o `id` do projeto retornado!

---

## 3. Configurar Informações do Livro

```bash
# Substitua {TOKEN} e {PROJECT_ID}
curl -X POST http://localhost:3001/api/generation/select-idea/{PROJECT_ID} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {TOKEN}" \
  -d '{
    "titulo": "A Última Fronteira",
    "subtitulo": "Uma Jornada Além das Estrelas",
    "sinopse": "Em 2157, a humanidade envia sua primeira missão tripulada além do sistema solar. A tripulação da nave Odisseia deve enfrentar não apenas os perigos do espaço profundo, mas também os mistérios de uma civilização alienígena esquecida.",
    "capitulos": [
      {
        "titulo": "O Chamado das Estrelas",
        "descricao": "A equipe é selecionada e a missão é anunciada ao mundo."
      },
      {
        "titulo": "Partida",
        "descricao": "A nave Odisseia deixa a Terra rumo ao desconhecido."
      },
      {
        "titulo": "O Encontro",
        "descricao": "A descoberta que mudará tudo."
      }
    ]
  }'
```

---

## 4. Gerar Prompt de Capa

```bash
curl -X POST http://localhost:3001/api/generation/cover-prompt/{PROJECT_ID} \
  -H "Authorization: Bearer {TOKEN}"
```

**Resposta esperada**:
```json
{
  "message": "Prompt de capa gerado",
  "prompts": {
    "promptEN": "A stunning sci-fi book cover featuring...",
    "promptPT": "Uma impressionante capa de ficção científica...",
    "styleNotes": "Estilo futurista com cores vibrantes..."
  }
}
```

---

## 5. Gerar Imagem de Capa (DALL-E 3)

```bash
curl -X POST http://localhost:3001/api/generation/cover-image/{PROJECT_ID} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {TOKEN}" \
  -d '{
    "quality": "hd",
    "size": "1024x1792"
  }'
```

**Parâmetros opcionais**:
- `quality`: `"standard"` ou `"hd"` (padrão: `"hd"`)
- `size`: `"1024x1024"`, `"1024x1792"`, ou `"1792x1024"` (padrão: `"1024x1792"`)
- `customPrompt`: String personalizada (opcional, usa o prompt salvo se omitido)

**Resposta esperada**:
```json
{
  "message": "Imagem de capa gerada com sucesso",
  "cover": {
    "imageUrl": "https://oaidalleapiprodscus.blob.core.windows.net/...",
    "imagePath": "./uploads/covers/{PROJECT_ID}/original.png",
    "prompt": "Revised prompt by DALL-E...",
    "quality": "hd",
    "size": "1024x1792"
  }
}
```

**💰 Custo**: ~$0.08 por imagem HD

---

## 6. Consultar Status da Capa

```bash
curl -X GET http://localhost:3001/api/generation/cover-image/{PROJECT_ID} \
  -H "Authorization: Bearer {TOKEN}"
```

**Resposta**:
```json
{
  "cover": {
    "id": "...",
    "prompt": "...",
    "imageUrl": "https://...",
    "imagePath": "./uploads/covers/{PROJECT_ID}/original.png",
    "status": "completed",
    "createdAt": "2025-12-08T23:30:00.000Z",
    "updatedAt": "2025-12-08T23:30:15.000Z"
  }
}
```

---

## 7. Deletar Capa (para regenerar)

```bash
curl -X DELETE http://localhost:3001/api/generation/cover-image/{PROJECT_ID} \
  -H "Authorization: Bearer {TOKEN}"
```

Após deletar, você pode chamar a geração novamente com um prompt diferente.

---

## Testando com Postman/Insomnia

### Importar Collection

Crie uma collection com as seguintes requisições:

1. **POST** `{{base_url}}/api/auth/register` - Registro
2. **POST** `{{base_url}}/api/auth/login` - Login
3. **POST** `{{base_url}}/api/projects` - Criar Projeto
4. **POST** `{{base_url}}/api/generation/select-idea/:projectId` - Configurar Livro
5. **POST** `{{base_url}}/api/generation/cover-prompt/:projectId` - Gerar Prompt
6. **POST** `{{base_url}}/api/generation/cover-image/:projectId` - Gerar Imagem
7. **GET** `{{base_url}}/api/generation/cover-image/:projectId` - Consultar Status
8. **DELETE** `{{base_url}}/api/generation/cover-image/:projectId` - Deletar Capa

### Variáveis de Ambiente

```json
{
  "base_url": "http://localhost:3001",
  "token": "",
  "projectId": ""
}
```

Após login, salve o token retornado na variável `token`.
Após criar projeto, salve o ID na variável `projectId`.

---

## Fluxo Completo Simplificado

```bash
# 1. Login e obter token
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@exemplo.com","password":"teste123"}' \
  | jq -r '.token')

# 2. Criar projeto e obter ID
PROJECT_ID=$(curl -s -X POST http://localhost:3001/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"tema":"Sci-Fi","publicoAlvo":"Adultos","idioma":"pt-BR","tamanho":"medio","tomDeVoz":"Aventureiro","tipo":"ficcao"}' \
  | jq -r '.project.id')

# 3. Configurar livro
curl -X POST http://localhost:3001/api/generation/select-idea/$PROJECT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"titulo":"Teste","subtitulo":"Subtítulo","sinopse":"Sinopse do livro...","capitulos":[{"titulo":"Cap 1","descricao":"Desc 1"}]}'

# 4. Gerar prompt
curl -X POST http://localhost:3001/api/generation/cover-prompt/$PROJECT_ID \
  -H "Authorization: Bearer $TOKEN"

# 5. Gerar imagem
curl -X POST http://localhost:3001/api/generation/cover-image/$PROJECT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"quality":"hd","size":"1024x1792"}'

# 6. Ver resultado
echo "Imagem salva em: uploads/covers/$PROJECT_ID/original.png"
```

---

## Troubleshooting

### Erro: "OpenAI API Key não configurada"
- Verifique se `OPENAI_API_KEY` está no arquivo `.env`
- Reinicie o servidor após adicionar a chave

### Erro: "Nenhum prompt de capa encontrado"
- Execute primeiro `/cover-prompt/:projectId` antes de `/cover-image/:projectId`

### Erro: "Token inválido"
- Faça login novamente e use o novo token
- Verifique se o token está sendo enviado no header `Authorization: Bearer {TOKEN}`

### Erro: "Projeto não encontrado"
- Verifique se o `projectId` está correto
- Verifique se o projeto pertence ao usuário autenticado

---

## Verificar Imagem Gerada

A imagem estará disponível em:
- **Path relativo**: `uploads/covers/{PROJECT_ID}/original.png`
- **URL local**: `http://localhost:3001/uploads/covers/{PROJECT_ID}/original.png`

Abra no navegador ou use um visualizador de imagens!
