-- GestorImob Pro - Supabase Database Schema
-- Execute este script no Supabase SQL Editor para criar as tabelas necessárias

-- 1. Tabela de Configurações do Locador
CREATE TABLE IF NOT EXISTS owner_settings (
  id BIGSERIAL PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela de Imóveis (Properties)
CREATE TABLE IF NOT EXISTS properties (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabela de Inquilinos e Candidatos (Tenants)
CREATE TABLE IF NOT EXISTS tenants (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_properties_created ON properties(created_at);
CREATE INDEX IF NOT EXISTS idx_tenants_created ON tenants(created_at);

-- 5. DESABILITAR Row Level Security (RLS) para simplicidade
-- IMPORTANTE: Em produção, você deve configurar políticas adequadas
ALTER TABLE owner_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE properties DISABLE ROW LEVEL SECURITY;
ALTER TABLE tenants DISABLE ROW LEVEL SECURITY;

-- Mensagem de confirmação
DO $$
BEGIN
  RAISE NOTICE 'Schema criado com sucesso! Tabelas: owner_settings, properties, tenants';
END $$;
