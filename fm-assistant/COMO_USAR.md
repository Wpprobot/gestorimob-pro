# 🎮 FM Tactical Assistant - Como Usar

## 🚀 Início Rápido

### Método 1: Script Automático (Recomendado)

1. Clique duas vezes no arquivo `start.ps1`
   - **OU** clique com botão direito → "Executar com PowerShell"

2. O script vai:
   - Iniciar o servidor HTTP automaticamente
   - Abrir o Firefox em http://localhost:3000
   - Carregar o FM Assistant

### Método 2: Manual

1. Abra o PowerShell na pasta do projeto:
   ```powershell
   cd e:\ANTHIGRAVITY\fm-assistant
   ```

2. Inicie o servidor:
   ```powershell
   npx -y serve -l 3000
   ```

3. Abra o Firefox e acesse:
   ```
   http://localhost:3000
   ```

## 🛑 Como Parar

- Feche a janela do terminal onde o servidor está rodando
- **OU** pressione `Ctrl+C` no terminal

## ℹ️ Informações Importantes

- **Porta**: O servidor roda na porta 3000
- **URL**: http://localhost:3000
- **Requisito**: Node.js precisa estar instalado (para o `npx`)

## 🔧 Solução de Problemas

### Erro "porta já em uso"
Se você ver este erro, significa que o servidor já está rodando. Apenas abra o Firefox em http://localhost:3000

### Módulos não carregam
Certifique-se de estar acessando via `http://localhost:3000` e **não** abrindo o arquivo `index.html` diretamente.

### Firefox não abre automaticamente
Abra manualmente o Firefox e acesse: http://localhost:3000

## 📝 Recursos

- **Dashboard**: Visão geral do seu progresso
- **Meu Assistente**: Personalize seu assistente técnico
- **Análise do Adversário**: Analise táticas adversárias
- **Meu Plantel**: Gerencie e analise seu time
- **Recomendações Táticas**: Receba sugestões táticas
- **Táticas da Comunidade**: Explore táticas compartilhadas
- **Upload de Dados**: Carregue screenshots e dados do FM

## 🎯 Próximos Passos

1. Personalize seu assistente técnico
2. Faça upload de dados do seu time
3. Analise adversários
4. Receba recomendações táticas personalizadas

Bom jogo! ⚽
