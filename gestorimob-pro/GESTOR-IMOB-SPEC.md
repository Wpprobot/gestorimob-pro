# 🏢 Gestor IMOB - Especificação Completa

## 📋 Visão Geral

**Gestor IMOB** é uma plataforma completa de gestão imobiliária para proprietários administrarem seus imóveis, inquilinos, documentos e utilizarem IA para geração de contratos e assistência.

---

## 🎨 Design System

### Paleta de Cores

- **Primary**: Azul (`blue-600`, `blue-500`)
- **Secondary**: Índigo (`indigo-600`, `indigo-500`)
- **Accent**: Verde (`green-500`, `emerald-500`)
- **Warning**: Amarelo (`yellow-500`)
- **Danger**: Vermelho (`red-500`, `red-600`)
- **Neutral**: Cinza (`slate-50` a `slate-800`)
- **Background**: Gradiente (`gradient-to-br from-slate-50 to-blue-50/30`)

### Tipografia

- **Font Family**: System fonts (sans-serif)
- **Tamanhos**:
  - Heading 1: `text-2xl`, `font-bold`
  - Heading 2: `text-xl`, `font-semibold`
  - Body: `text-sm` a `text-base`
  - Small: `text-xs`

### Espaçamento

- Cards: `p-6`, `rounded-xl`
- Gaps: `gap-4`, `gap-6`
- Margins: `mb-4`, `mb-6`

### Componentes Reutilizáveis

#### Botões
```tsx
// Primário
className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"

// Secundário
className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300"

// Perigo
className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"

// Com ícone
<button className="...">
  <IconName size={18} />
  Texto
</button>
```

#### Cards
```tsx
<div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
  {/* Conteúdo */}
</div>
```

#### Inputs
```tsx
className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
```

#### Badges
```tsx
// Verde (Ativo)
<span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Ativo</span>

// Amarelo (Pendente)
<span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">Pendente</span>

// Vermelho (Inativo)
<span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">Inativo</span>
```

---

## 🏗️ Estrutura da Aplicação

### Layout Principal

```
┌─────────────────────────────────────────┐
│  Sidebar (fixo à esquerda, 250px)       │
│  ┌──────────────────────────────────┐   │
│  │ Logo                             │   │
│  │ Menu de Navegação                │   │
│  │  - Dashboard                     │   │
│  │  - Imóveis                       │   │
│  │  - Inquilinos                    │   │
│  │  - Documentos                    │   │
│  │  - Assistente IA                 │   │
│  │  - Configurações                 │   │
│  └──────────────────────────────────┘   │
│                                          │
│  Main Content (flex-1, overflow-auto)   │
└─────────────────────────────────────────┘
```

### Componentes Principais

1. **Sidebar** - Navegação fixa
2. **Dashboard** - Visão geral
3. **PropertiesManager** - Gestão de imóveis
4. **TenantManager** - Gestão de inquilinos
5. **DocumentGenerator** - Gerador de documentos com IA
6. **AIAssistant** - Chat com IA
7. **Settings** - Configurações do proprietário

---

## 📊 Funcionalidades Detalhadas

### 1. Dashboard

**Objetivo**: Visão geral com métricas e gráficos

#### KPIs (Cards superiores)

- **Receita Total**: Soma de todos os aluguéis
- **Imóveis Ativos**: Contador de imóveis ocupados
- **Inquilinos Ativos**: Contador total
- **Taxa de Ocupação**: Percentual de imóveis ocupados

#### Gráfico de Receita Mensal

- **Tipo**: Gráfico de barras (Recharts)
- **Eixo X**: Meses (Jan-Dez)
- **Eixo Y**: Valor em R$
- **Cor**: Gradiente azul (`fill="url(#colorRevenue)")`)

#### Lista de Próximos Vencimentos

- Tabela com:
  - Nome do inquilino
  - Imóvel
  - Valor do aluguel
  - Data de vencimento
  - Status (badge)

---

### 2. Gestão de Imóveis

#### Funcionalidades

##### Listagem de Imóveis

**Tabs**:
- Todos
- Disponíveis (sem inquilino)
- Ocupados (com inquilino)

**Card de Imóvel**:
```tsx
┌─────────────────────────────────┐
│ 📷 Foto (se tiver)              │
│                                 │
│ 🏠 Apelido do Imóvel           │
│ 📍 Endereço completo           │
│                                 │
│ 💰 R$ Aluguel | 📏 XX m²       │
│ 🛏️ X quartos | 🚿 X banheiros  │
│                                 │
│ 👤 Inquilino: Nome (ou vago)   │
│                                 │
│ [Ver Detalhes] [Editar] [🗑️]  │
└─────────────────────────────────┘
```

##### Adicionar Imóvel

**Formulário (Modal)**:
- **Apelido**: Input texto
- **Endereço**: Input texto
- **Aluguel**: Input número (R$)
- **Quartos**: Number input
- **Banheiros**: Number input
- **Salas**: Number input
- **Cozinhas**: Number input
- **Área (m²)**: Number input
- **IPTU**: Input número
- **Água**: Input número
- **Dia de vencimento**: Select (1-31)
- **Lavanderia**: Checkbox
- **Mobília**: Multi-select (checkboxes)
  - Geladeira
  - Fogão
  - Máquina de lavar
  - Micro-ondas
  - Sofá
  - Mesa
  - Cama
  - Armário
  - TV
- **Foto**: Upload de imagem (base64)

##### Editar Imóvel

Mesmo formulário que adicionar, pré-preenchido

##### Deletar Imóvel

- Confirmação: `confirm("Tem certeza?")`
- Remove do banco de dados (Supabase)
- Remove do estado local

---

### 3. Gestão de Inquilinos

#### Funcionalidades

##### Tabs

- **Ativos**: Inquilinos com status 'active'
- **Candidatos**: Inquilinos com status 'prospect'

##### Card de Inquilino

```tsx
┌─────────────────────────────────┐
│ 👤 Nome Completo                │
│ 📧 email@exemplo.com            │
│ 📱 (XX) XXXXX-XXXX             │
│                                 │
│ 🏠 Imóvel: Apelido (se tiver)  │
│ 💰 R$ Aluguel                   │
│ 📅 Vencimento: Dia X            │
│                                 │
│ 🟢 Ativo / 🟡 Candidato        │
│                                 │
│ [Editar] [Docs] [Ativar] [🗑️] │
└─────────────────────────────────┘
```

##### Adicionar Inquilino

**Formulário**:
- **Nome**: Input texto (obrigatório)
- **CPF**: Input texto com máscara (XXX.XXX.XXX-XX)
- **RG**: Input texto (livre, sem máscara)
- **Email**: Input email
- **Telefone**: Input texto com máscara ((XX) XXXXX-XXXX)
- **Profissão**: Input texto
- **Renda Mensal**: Input número (R$)
- **Imóvel**: Select (lista de imóveis disponíveis)
- **Status**: Select
  - Ativo
  - Candidato

##### Upload de Documentos

- **Trigger**: Botão "📄" ao lado do inquilino
- **Tipos aceitos**: PDF, JPEG, PNG
- **Flow**:
  1. Usuário seleciona arquivo
  2. Prompt pergunta: "Nome do documento?"
  3. Gera preview (thumbnail)
  4. Salva com nome customizado

**Estrutura de Documento**:
```typescript
{
  id: string,
  name: string,      // Nome dado pelo usuário
  url: string,       // Base64 ou URL
  type: 'pdf' | 'image',
  uploadedAt: string
}
```

##### Ativar Candidato

- Muda status de 'prospect' para 'active'
- Atualiza no banco
- Move para a tab "Ativos"

---

### 4. Gerador de Documentos com IA

#### Tipos de Documentos

1. **Contrato de Aluguel** (IA Avançada)
2. **Ficha de Proposta de Locação**
3. **Recibo de Pagamento**
4. **Termo de Vistoria**

#### Fluxo de Geração

##### Interface

```tsx
┌─────────────────────────────────┐
│ Tipo de Documento: [Select]    │
│ Imóvel: [Select]                │
│ Inquilino: [Select]             │
│                                 │
│ [Gerar com IA] 🤖              │
│                                 │
│ ┌─────────────────────────┐    │
│ │ Documento gerado        │    │
│ │ aparece aqui...         │    │
│ │ (formatado, pronto      │    │
│ │ para copiar/imprimir)   │    │
│ └─────────────────────────┘    │
└─────────────────────────────────┘
```

##### Contrato de Aluguel (Detalhado)

**Prompt enviado para IA**:
```
GERE APENAS O DOCUMENTO FINAL FORMATADO. NÃO ADICIONE EXPLICAÇÕES.

Use fonte Times New Roman.
Formato pronto para exportação em PDF/DOCX.

CONTRATO DE LOCAÇÃO RESIDENCIAL

LOCADOR:
Nome: {settings.name}
CPF: {settings.cpf}
RG: {settings.rg}
Profissão: {settings.profession}
Estado Civil: {settings.maritalStatus}
Endereço: {settings.address}

LOCATÁRIO:
Nome: {tenant.name}
CPF: {tenant.cpf}
RG: {tenant.rg}
Profissão: {tenant.profession}

IMÓVEL LOCADO:
Endereço: {property.address}
Quartos: {property.bedrooms}
Banheiros: {property.bathrooms}
Área: {property.area}m²
Mobília: {property.furniture}

VALOR E CONDIÇÕES:
Aluguel: R$ {property.rentAmount}
IPTU: R$ {property.fees.iptu}
Água: R$ {property.fees.water}
Vencimento: Dia {property.paymentDay}

Local e Data: {cidade}, {data por extenso}

Inclua cláusulas completas sobre: pagamento, multas, reajuste, vistoria, rescisão, responsabilidades e foro segundo a Lei 8.245/91.
```

**Resposta esperada**: Contrato completo, formatado, com todas as cláusulas

##### Outros Documentos

Seguem estrutura similar, com prompts específicos para cada tipo

---

### 5. Assistente IA (Chat)

#### Interface

```tsx
┌─────────────────────────────────────┐
│ 🌟 Assistente Gemini Pro     v3.0  │
│ ─────────────────────────────────  │
│ 🔵 Status desconhecido              │
│ [Testar Conexão]                    │
├─────────────────────────────────────┤
│                                     │
│  [IA] Olá! Sou sua assistente...   │
│                                     │
│            [Você] Oi, tudo? [User] │
│                                     │
│  [IA] Tudo ótimo! Como posso...    │
│                                     │
│         [Imagem anexada] ✕ [User]  │
│         Analise esta foto [User]    │
│                                     │
│  [IA] Vejo que a foto mostra...    │
│                                     │
├─────────────────────────────────────┤
│ 📷 [Input] Pergunte sobre...  ➤   │
└─────────────────────────────────────┘
```

#### Funcionalidades

##### Indicador de Status de Conexão

**Estados**:
- **Desconhecido** (🔵 cinza): Inicial, mostra botão "Testar Conexão"
- **Testando** (🟡 amarelo): Loader animado "Testando..."
- **Conectado** (🟢 verde): Bolinha verde pulsante, "Conectado"
- **Erro** (🔴 vermelho): Ícone de alerta, "Erro", botão "Testar Novamente"

##### Botão Testar Conexão

- Chama `GeminiService.testConnection()`
- Timeout de 10s
- Atualiza status automaticamente

##### Chat com Mensagens

**Mensagens do Usuário**:
- Alinhadas à direita
- Background azul (`bg-blue-600`)
- Texto branco
- Rounded: `rounded-br-none`

**Mensagens da IA**:
- Alinhadas à esquerda
- Background branco com borda
- Texto cinza escuro
- Rounded: `rounded-bl-none`

##### Anexar Imagens

- Botão com ícone de câmera (📷)
- Input file hidden
- Accept: `image/*`
- Preview: "Imagem anexada ✕"
- Envia junto com mensagem

##### Loading State

```tsx
<div>
  <Loader2 className="animate-spin" />
  Pensando...
</div>
```

##### Casos de Uso Sugeridos

Mensagem inicial da IA sugere:
- Analisar fotos de vistorias
- Tirar dúvidas sobre lei do inquilinato
- Redigir e-mails para inquilinos
- Esclarecer cláusulas contratuais

---

### 6. Configurações

#### Dados do Proprietário

**Formulário**:
- **Nome**: Input texto
- **CPF**: Input com máscara
- **RG**: Input texto
- **Profissão**: Input texto
- **Estado Civil**: Select
  - Solteiro(a)
  - Casado(a)
  - Divorciado(a)
  - Viúvo(a)
- **Endereço**: Input texto
- **Email**: Input email
- **Telefone**: Input com máscara

**Botão**: "Salvar Configurações" (salva no Supabase)

---

## 🗄️ Estrutura de Dados

### Supabase Tables

#### `properties`

```sql
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  nickname TEXT NOT NULL,
  address TEXT NOT NULL,
  rent_amount DECIMAL(10,2),
  bedrooms INTEGER,
  bathrooms INTEGER,
  living_rooms INTEGER,
  kitchens INTEGER,
  area DECIMAL(10,2),
  has_laundry BOOLEAN DEFAULT false,
  furniture TEXT[], -- Array de strings
  photo TEXT, -- Base64
  iptu DECIMAL(10,2),
  water_fee DECIMAL(10,2),
  payment_day INTEGER DEFAULT 5,
  tenant_id UUID REFERENCES tenants(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `tenants`

```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  cpf TEXT NOT NULL,
  rg TEXT,
  email TEXT,
  phone TEXT,
  profession TEXT,
  income DECIMAL(10,2),
  property_id UUID REFERENCES properties(id),
  status TEXT DEFAULT 'active', -- 'active' ou 'prospect'
  documents JSONB[], -- Array de objetos documento
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `owner_settings`

```sql
CREATE TABLE owner_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  name TEXT,
  cpf TEXT,
  rg TEXT,
  profession TEXT,
  marital_status TEXT,
  address TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### TypeScript Interfaces

```typescript
interface Property {
  id: string;
  nickname: string;
  address: string;
  rentAmount: string;
  photo?: string;
  details: {
    bedrooms: number;
    bathrooms: number;
    livingRooms: number;
    kitchens: number;
    area: number;
    laundry: boolean;
    furniture: string[];
  };
  fees: {
    iptu: string;
    water: string;
  };
  paymentDay: number;
  tenantId?: string;
}

interface Tenant {
  id: string;
  name: string;
  cpf: string;
  rg?: string;
  email?: string;
  phone?: string;
  profession?: string;
  income?: string;
  propertyId?: string;
  status: 'active' | 'prospect';
  documents?: TenantDocument[];
}

interface TenantDocument {
  id: string;
  name: string;
  url: string;
  type: 'pdf' | 'image';
  uploadedAt: string;
}

interface OwnerSettings {
  id: string;
  name: string;
  cpf: string;
  rg: string;
  profession: string;
  maritalStatus: string;
  address: string;
  email: string;
  phone: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  images?: string[];
}
```

---

## 🤖 Integrações

### Supabase

#### Configuração

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

#### Operações CRUD

```typescript
// Listar
const { data } = await supabase
  .from('properties')
  .select('*')
  .eq('user_id', userId);

// Criar
await supabase
  .from('properties')
  .insert([{ ...propertyData, user_id: userId }]);

// Atualizar
await supabase
  .from('properties')
  .update(propertyData)
  .eq('id', propertyId);

// Deletar
await supabase
  .from('properties')
  .delete()
  .eq('id', propertyId);
```

### Gemini AI (via Vercel Functions)

#### Vercel API Routes

**Estrutura**:
```
api/
├── gemini-chat.ts
├── gemini-analyze-image.ts
└── gemini-generate-contract.ts
```

#### gemini-chat.ts

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-1.5-flash";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, history, images } = req.body;

  // Build contents para Gemini
  const contents = history.map(h => ({
    role: h.role,
    parts: h.parts
  }));

  const userParts = [{ text: message }];
  
  // Adicionar imagens se houver
  for (const img of images || []) {
    const base64Data = img.split(',')[1] || img;
    userParts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Data
      }
    });
  }

  contents.push({ role: 'user', parts: userParts });

  // Chamar Gemini API
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    }
  );

  const data = await response.json();
  const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Erro';

  return res.status(200).json({ response: aiResponse });
}
```

#### Frontend Service

```typescript
export const GeminiService = {
  async chat(message: string, history, images = []): Promise<string> {
    const response = await fetch('/api/gemini-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history, images })
    });
    
    const data = await response.json();
    return data.response;
  },

  async analyzeImage(base64Image: string, prompt: string): Promise<string> {
    const response = await fetch('/api/gemini-analyze-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base64Image, prompt })
    });
    
    const data = await response.json();
    return data.analysis;
  },

  async generateContract(details: string): Promise<string> {
    const response = await fetch('/api/gemini-generate-contract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ details })
    });
    
    const data = await response.json();
    return data.contract;
  },

  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch('/api/gemini-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'teste',
          history: [],
          images: []
        })
      });

      if (response.ok) {
        return {
          success: true,
          message: '✅ Conexão com IA funcionando!'
        };
      }
      
      return {
        success: false,
        message: '❌ Erro na conexão'
      };
    } catch (error) {
      return {
        success: false,
        message: '❌ Erro de rede'
      };
    }
  }
};
```

---

## 🔐 Autenticação

### Supabase Auth

```typescript
// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password
});

// Signup
const { data, error } = await supabase.auth.signUp({
  email,
  password
});

// Logout
await supabase.auth.signOut();

// Get current user
const { data: { user } } = await supabase.auth.getUser();
```

### Proteção de Rotas

```typescript
useEffect(() => {
  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      // Redirecionar para login
      setCurrentPage('login');
    }
  };
  checkAuth();
}, []);
```

---

## 📱 Responsividade

### Breakpoints

- **Mobile**: `< 640px` - Stack vertical, sidebar oculta
- **Tablet**: `640px - 1024px` - Layout adaptado
- **Desktop**: `> 1024px` - Layout completo com sidebar

### Estratégia Mobile-First

```css
/* Mobile */
.container {
  width: 100%;
  padding: 1rem;
}

/* Tablet */
@media (min-width: 640px) {
  .container {
    padding: 1.5rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    padding: 2rem;
  }
}
```

---

## 🎯 Fluxos Principais

### 1. Cadastrar Novo Imóvel

1. Usuário clica "Adicionar Imóvel"
2. Modal abre com formulário
3. Preenche dados do imóvel
4. (Opcional) Faz upload de foto
5. Clica "Salvar"
6. Sistema salva no Supabase
7. Atualiza lista de imóveis
8. Fecha modal

### 2. Adicionar Inquilino e Gerar Contrato

1. Vai em "Inquilinos" → "Adicionar"
2. Preenche dados pessoais
3. Seleciona imóvel
4. Define como "Candidato" ou "Ativo"
5. Salva inquilino
6. Vai em "Documentos"
7. Seleciona tipo "Contrato de Aluguel"
8. Seleciona imóvel e inquilino
9. Clica "Gerar com IA"
10. IA gera contrato completo
11. Copia e imprime

### 3. Usar Assistente IA

1. Vai em "Assistente IA"
2. Clica "Testar Conexão" (primeira vez)
3. Status fica verde ✅
4. Digita pergunta ou anexa foto
5. Envia mensagem
6. IA responde
7. Continua conversação

---

## 🛠️ Stack Tecnológica

### Frontend

- **Framework**: React 19.2.3
- **Build**: Vite 6.2.0
- **Linguagem**: TypeScript 5.8.2
- **Estilização**: Tailwind CSS (via classes inline)
- **Ícones**: Lucide React 0.561.0
- **Gráficos**: Recharts 3.5.1

### Backend

- **BaaS**: Supabase
  - Database: PostgreSQL
  - Auth: Supabase Auth
  - Storage: Supabase Storage (para fotos)

### Serverless Functions

- **Plataforma**: Vercel
- **Runtime**: Node.js
- **Framework**: `@vercel/node` 3.0.0

### IA

- **Provedor**: Google Gemini AI
- **Modelo**: gemini-1.5-flash
- **SDK**: @google/genai 1.33.0

---

## 📦 Variáveis de Ambiente

### `.env` (Local)

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
GEMINI_API_KEY=AIza...sua-chave-aqui
```

### Vercel (Produção)

Configurar no dashboard:
- `GEMINI_API_KEY` - Para todas as API functions
- `VITE_SUPABASE_URL` - URL do Supabase
- `VITE_SUPABASE_ANON_KEY` - Chave anon do Supabase

---

## 🚀 Deploy

### Vercel

1. Conectar repositório GitHub
2. Configurar environment variables
3. Build command: `npm run build`
4. Output directory: `dist`
5. Deploy automático a cada push

### Supabase

1. Criar projeto no Supabase dashboard
2. Executar migrations (criar tabelas)
3. Configurar Row Level Security (RLS)
4. Copiar credenciais para `.env`

---

## 📚 Documentação Adicional

### Helpers Úteis

#### Formatação de CPF

```typescript
const formatCPF = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};
```

#### Formatação de Telefone

```typescript
const formatPhone = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1');
};
```

#### Formatação de Moeda

```typescript
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};
```

#### Data por Extenso

```typescript
const getDateExtenso = () => {
  const now = new Date();
  return now.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};
```

---

## ✨ Melhorias Futuras

### V2.0 Features

- [ ] Dashboard com filtros por período
- [ ] Exportação de relatórios em PDF
- [ ] Notificações de vencimentos
- [ ] Gestão de pagamentos (recebidos/pendentes)
- [ ] Histórico de manutenções
- [ ] OCR para upload de documentos
- [ ] App mobile (React Native)
- [ ] Múltiplos proprietários (multi-tenancy)
- [ ] Integração com bancos (Open Finance)
- [ ] Assinatura digital de contratos

### Melhorias de UX

- [ ] Dark mode
- [ ] Tutoriais interativos
- [ ] Atalhos de teclado
- [ ] Drag & drop para fotos
- [ ] Busca global
- [ ] Favoritos/tags

---

## 📄 Licença

Proprietário: [Seu Nome/Empresa]
Uso: Interno

---

**Versão**: 1.0  
**Data**: Dezembro 2024  
**Autor**: Especificação completa para recriação do Gestor IMOB
