# FM Tactical Assistant ⚽

**Assistente Técnico Profissional para Football Manager 2024/2026**

Um aplicativo web moderno e poderoso que oferece análise tática profunda, recomendações estratégicas e gestão inteligente de plantel para jogadores de Football Manager.

![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🎯 Funcionalidades

### ✨ Principais Recursos

- **🎭 Assistente Personalizado**: Crie seu próprio assistente técnico com nome, idade, avatar customizado
- **🔍 Análise de Adversários**: Análise detalhada do próximo oponente com recomendações táticas específicas
- **👥 Gestão de Plantel**: Analise seu elenco e receba sugestões do melhor XI para cada formação
- **📚 Biblioteca Tática**: Acesso completo a formações modernas e estilos táticos do futebol atual
- **📊 Recomendações Inteligentes**: Motor de análise baseado em conhecimento real de táticas de futebol
- **📤 Upload de Screenshots**: Carregue capturas de tela do jogo para análise visual
- **💾 Persistência de Dados**: Todos os dados salvos localmente no navegador

### 🎨 Design Moderno

- Interface escura profissional inspirada em aplicativos modernos
- Animações suaves e micro-interações
- Design responsivo para todos os tamanhos de tela
- Paleta de cores temática de futebol (verde campo, tons premium)
- Tipografia moderna (Inter + Roboto Mono)

## 🚀 Como Usar

### Instalação

1. Clone ou baixe este repositório
2. Navegue até a pasta do projeto
3. Instale as dependências:
```bash
npm install
```

4. **Configure a API Key do Ultravox (para Voice Coach):**
   - Crie uma conta em https://app.ultravox.ai

   - Obtenha sua API key em Settings → API Keys
   - Crie um arquivo `.env` na raiz do projeto:
   ```
   ULTRAVOX_API_KEY=sua-chave-aqui
   PORT=3001
   ```

5. **Inicie AMBOS os servidores:**

   **Opção A - Manual (2 terminais):**
   ```bash
   # Terminal 1 - Backend
   npm run server
   
   # Terminal 2 - Frontend  
   npm run dev
   ```

   **Opção B - Automático (1 terminal):**
   ```bash
   npm start
   ```

6. Abra o navegador em `http://localhost:5173`

### Build para Produção

```bash
npm run build
```

Os arquivos otimizados estarão na pasta `dist/`.

## 📖 Guia de Uso

### 1️⃣ Personalizar seu Assistente

- Acesse **"Meu Assistente"** no menu lateral
- Configure nome, idade, nacionalidade e especialidade
- Gere um avatar com IA ou faça upload de uma imagem

### 2️⃣ Analisar Adversário

- Vá para **"Análise do Adversário"**
- Insira informações sobre o próximo oponente:
  - Nome do time
  - Formação principal
  - Estilo de jogo
  - Pontos fortes e fracos
  - Jogadores-chave
- Clique em **"Gerar Análise Tática"**
- Receba recomendações completas:
  - Melhor formação para usar
  - Estilo tático recomendado
  - Instruções de equipe específicas
  - Estratégias para bolas paradas

### 3️⃣ Analisar seu Plantel

- Acesse **"Meu Plantel"**
- Faça upload de screenshots ou carregue demonstração
- Visualize a melhor formação com seus jogadores
- Receba análise de pontos fortes e fracos
- Obtenha recomendações de reforços

### 4️⃣ Biblioteca Tática

- Explore **"Recomendações Táticas"**
- Aprenda sobre:
  - Formações modernas (4-2-3-1, 4-3-3, 3-5-2, etc.)
  - Estilos táticos (Gegenpress, Tiki-Taka, Contra-Ataque)
  - Dicas rápidas e estratégias avançadas

### 5️⃣ Upload de Dados

- Use **"Upload de Dados"** para carregar screenshots
- Arraste e solte ou clique para selecionar arquivos
- Suporte para múltiplas imagens simultâneas

### 6️⃣ Conversar com o Coach (Voz) 🎙️ **NOVO!**

- Procure pelo botão flutuante verde no canto inferior direito
- Clique para abrir o modal de conversa
- Clique em **"Conectar"** para iniciar a conversa por voz
- Fale suas perguntas sobre táticas e Football Manager
- O assistente responderá por voz em tempo real!
- **Dicas**:
  - Fale claramente e aguarde a resposta
  - Seja específico: "Como jogar contra um 4-4-2?"
  - Pergunte sobre formações, estilos táticos, análises
  - Use para tirar dúvidas rápidas durante o jogo

## 🧠 Base de Conhecimento

O assistente foi construído com pesquisa extensa sobre:

### Formações Modernas
- **4-2-3-1**: Formação balanceada e versátil
- **4-3-3**: Base do futebol moderno com controle de meio-campo
- **3-5-2**: Solidez defensiva com largura pelos alas
- **4-4-2**: Clássico reinventado para o futebol moderno

### Estilos Táticos
- **Gegenpress**: Pressão intensa após perda de bola (Klopp)
- **Tiki-Taka**: Posse com passes curtos (Guardiola/Barcelona)
- **Contra-Ataque**: Defesa sólida com transições rápidas
- **Posse de Bola**: Domínio através da manutenção da posse

### Atributos por Posição
- Análise completa de atributos essenciais para cada posição
- Recomendações de funções ideais por formação
- Importância de atributos mentais e físicos

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Design system completo com variáveis CSS
- **JavaScript (ES6+)**: Módulos modernos
- **Vite**: Build tool e dev server
- **Font Awesome**: Ícones
- **Google Fonts**: Tipografia (Inter, Roboto Mono)

## 📁 Estrutura do Projeto

```
fm-assistant/
├── index.html              # Estrutura HTML principal
├── package.json            # Configuração do Node.js
├── styles/
│   ├── design-system.css   # Sistema de design (cores, tipografia, etc.)
│   └── main.css            # Estilos principais da aplicação
├── js/
│   ├── app.js              # Controlador principal da aplicação
│   ├── components/         # Componentes UI
│   │   ├── Dashboard.js
│   │   ├── AssistantProfile.js
│   │   ├── OpponentAnalysis.js
│   │   ├── SquadAnalysis.js
│   │   ├── TacticalRecommendations.js
│   │   └── UploadManager.js
│   ├── engine/             # Motor de análise
│   │   ├── KnowledgeBase.js
│   │   └── TacticalEngine.js
│   └── utils/              # Utilitários
│       ├── ImageGenerator.js
│       └── StorageManager.js
└── assets/
    └── avatars/            # Avatares gerados
```

## 🎯 Roadmap Comercial

### Versão 1.0 (Atual)
- ✅ Interface completa
- ✅ Análise de adversários
- ✅ Recomendações táticas
- ✅ Biblioteca de formações
- ✅ Sistema de personalização

### Versão 1.5 (Próxima)
- [ ] Parser de arquivos .fm (saves)
- [ ] Análise de screenshots com OCR
- [ ] Histórico de análises
- [ ] Exportação de relatórios PDF
- [ ] Integração com bases de dados FM

### Versão 2.0 (Futuro)
- [ ] Análise com IA (GPT-4 Vision)
- [ ] Comparação de jogadores
- [ ] Simulador de formações
- [ ] Análise de bolas paradas
- [ ] Comunidade e compartilhamento

## 💼 Comercialização

Este assistente pode ser comercializado em plataformas como:

- **Fóruns FM**: FM Base, FM Scout, Sortitoutsi
- **Steam Workshop**: Como guia/ferramenta
- **Patreon**: Modelo de assinatura
- **Itch.io**: Vendas diretas
- **Sites próprios**: Com sistema de licenciamento

### Sugestão de Preços
- **Versão Básica**: Gratuita (limitada)
- **Versão Premium**: $4.99 - $9.99 (compra única)
- **Assinatura Mensal**: $2.99/mês
- **Assinatura Anual**: $19.99/ano

## 🤝 Contribuindo

Contribuições são bem-vindas! Para funcionalidades maiores:

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

Desenvolvido com ❤️ para a comunidade Football Manager

## 🙏 Agradecimentos

- Comunidade FM por inspiração e conhecimento
- Sites de análise tática: FM Arena, Passion4FM, FM Scout
- Treinadores modernos cujas táticas inspiraram a base de conhecimento

---

**⚽ Domine o Football Manager com análise profissional! ⚽**
