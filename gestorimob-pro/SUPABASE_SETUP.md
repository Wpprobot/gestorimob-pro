# 🗄️ Configuração do Supabase - GestorImob Pro

## ⚠️ ATENÇÃO: Execute ANTES de usar a aplicação

As tabelas do banco de dados precisam ser criadas no Supabase antes da aplicação funcionar.

---

## 📋 Passo a Passo

### 1. Acessar o Supabase Dashboard

1. Acesse: **https://umuazkklbwvoxwbyraxi.supabase.co**
2. Faça login na sua conta Supabase
3. Selecione o projeto **GestorImob Pro**

### 2. Abrir o SQL Editor

1. No menu lateral esquerdo, clique em **SQL Editor**
2. Clique em **New Query** (ou **+ New query**)

### 3. Executar o Script SQL

1. **Copie todo o conteúdo** do arquivo [`supabase-schema.sql`](file:///e:/ANTHIGRAVITY/gestorimob-pro/supabase-schema.sql)
2. **Cole no SQL Editor** do Supabase
3. Clique em **Run** (botão no canto inferior direito)

### 4. Verificar a Criação

Após executar, você verá:
- ✅ Mensagem: `Success. No rows returned`
- ✅ Ou: `Schema criado com sucesso!`

### 5. Confirmar Tabelas Criadas

1. No menu lateral, clique em **Table Editor**
2. Você deve ver 3 tabelas:
   - `owner_settings` - Configurações do locador
   - `properties` - Imóveis cadastrados
   - `tenants` - Inquilinos e candidatos

---

## 🎯 Pronto!

Agora você pode:
1. **Recarregar a aplicação** (F5)
2. **Fazer login**
3. **Criar imóveis e inquilinos**
4. **Verificar que os dados persistem** entre navegadores diferentes

---

## 🔍 Como Testar se Funcionou

1. **Criar um imóvel** na aplicação
2. **Abrir F12** (DevTools)
3. **Ver no Console:**
   ```
   Property saved successfully: [ID]
   ```
4. **Verificar no Supabase:**
   - Table Editor → `properties`
   - Deve aparecer 1 registro

---

## 🔒 Segurança (Produção)

> **IMPORTANTE:** Este setup desabilita Row Level Security (RLS) para simplicidade.

Em produção, você deve:
1. Habilitar RLS:
   ```sql
   ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
   ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
   ```

2. Criar políticas de acesso adequadas (baseadas em autenticação)

---

## ❓ Troubleshooting

### Erro: "permission denied for table properties"
**Causa:** RLS habilitado sem políticas  
**Solução:** Execute novamente o script SQL para desabilitar RLS

### Erro: "relation already exists"
**Causa:** Tabelas já foram criadas  
**Solução:** Tudo certo! Apenas ignore este erro

### Tabelas não aparecem
**Causa:** Script não foi executado  
**Solução:** Verifique se clicou em "Run" no SQL Editor
