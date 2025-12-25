import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { OwnerSettings, Property, Tenant } from '../types';

let supabase: SupabaseClient | null = null;

// Utility: Retry logic for network failures
const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 2,
  delayMs: number = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      // Don't retry on certain errors
      if (error.code === 'PGRST116' || error.status === 401) {
        throw error;
      }
      
      if (attempt < maxRetries) {
        console.warn(`⚠️ Tentativa ${attempt + 1} falhou, tentando novamente em ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }
  
  throw lastError;
};

export const SupabaseService = {
  initialize: (url: string, key: string) => {
    supabase = createClient(url, key);
  },

  isInitialized: () => !!supabase,

  async testConnection(): Promise<{ success: boolean; message?: string }> {
    if (!supabase) return { success: false, message: "Client not initialized" };
    try {
      const { error } = await supabase.from('owner_settings').select('*', { count: 'exact', head: true });
      
      if (error) {
        return { success: false, message: error.message };
      }
      return { success: true };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  },

  // --- Settings ---
  async loadSettings(): Promise<OwnerSettings | null> {
    if (!supabase) {
      console.error('❌ Supabase client not initialized');
      return null;
    }
    
    try {
      const result = await retryOperation(async () => {
        const { data, error } = await supabase!
          .from('owner_settings')
          .select('data')
          .limit(1)
          .single();
        
        if (error) throw error;
        return data;
      });
      
      if (!result) {
        console.warn('⚠️ Nenhuma configuração encontrada');
        return null;
      }
      
      console.log('✅ Configurações carregadas com sucesso');
      return result.data;
    } catch (error: any) {
      console.error('❌ Erro ao carregar configurações:', error.message);
      return null;
    }
  },

  async saveSettings(settings: OwnerSettings): Promise<{ success: boolean; error?: string }> {
    if (!supabase) {
      console.error('❌ Supabase not initialized');
      return { success: false, error: 'Supabase não inicializado' };
    }

    try {
      const result = await retryOperation(async () => {
        const { data } = await supabase!.from('owner_settings').select('id').limit(1);
        
        let saveResult;
        if (data && data.length > 0) {
          saveResult = await supabase!.from('owner_settings').update({ data: settings }).eq('id', data[0].id);
        } else {
          saveResult = await supabase!.from('owner_settings').insert({ data: settings });
        }

        if (saveResult.error) throw saveResult.error;
        return saveResult;
      });

      console.log('✅ Configurações salvas com sucesso');
      return { success: true };
    } catch (error: any) {
      console.error('❌ Erro ao salvar configurações:', error.message || error);
      return { success: false, error: error.message || 'Erro desconhecido' };
    }
  },

  // --- Properties ---
  async loadProperties(): Promise<Property[]> {
    if (!supabase) {
      console.error('❌ Supabase client not initialized');
      return [];
    }
    
    try {
      const result = await retryOperation(async () => {
        const { data, error } = await supabase!.from('properties').select('data');
        if (error) throw error;
        return data;
      });
      
      console.log(`✅ ${result.length} imóveis carregados com sucesso`);
      return result.map((row: any) => row.data);
    } catch (error: any) {
      console.error('❌ Erro ao carregar imóveis:', error.message);
      return [];
    }
  },

  async saveProperty(property: Property): Promise<{ success: boolean; error?: string }> {
    if (!supabase) {
      console.error('❌ Supabase not initialized');
      return { success: false, error: 'Supabase não inicializado' };
    }

    try {
      await retryOperation(async () => {
        const { error } = await supabase!
          .from('properties')
          .upsert({ id: property.id, data: property }, { onConflict: 'id' });
        
        if (error) throw error;
      });
      
      console.log(`✅ Imóvel salvo com sucesso: ${property.nickname || property.id}`);
      return { success: true };
    } catch (error: any) {
      console.error('❌ Erro ao salvar imóvel:', error.message);
      return { success: false, error: error.message || 'Erro desconhecido' };
    }
  },

  async deleteProperty(id: string): Promise<{ success: boolean; error?: string }> {
    if (!supabase) return { success: false, error: 'Client not initialized' };
    try {
      await retryOperation(async () => {
         const { error } = await supabase!.from('properties').delete().eq('id', id);
         if (error) throw error;
      });
      return { success: true };
    } catch (e: any) {
      console.error('Delete property error:', e);
      return { success: false, error: e.message };
    }
  },

  // --- Tenants ---
  async loadTenants(): Promise<Tenant[]> {
    if (!supabase) {
      console.error('❌ Supabase client not initialized');
      return [];
    }
    
    try {
      const result = await retryOperation(async () => {
        const { data, error } = await supabase!.from('tenants').select('data');
        if (error) throw error;
        return data;
      });
      
      console.log(`✅ ${result.length} inquilinos/candidatos carregados com sucesso`);
      return result.map((row: any) => row.data);
    } catch (error: any) {
      console.error('❌ Erro ao carregar inquilinos:', error.message);
      return [];
    }
  },

  async saveTenant(tenant: Tenant): Promise<{ success: boolean; error?: string }> {
    if (!supabase) {
      console.error('❌ Supabase not initialized');
      return { success: false, error: 'Supabase não inicializado' };
    }

    try {
      await retryOperation(async () => {
        const { error } = await supabase!
          .from('tenants')
          .upsert({ id: tenant.id, data: tenant }, { onConflict: 'id' });
        
        if (error) throw error;
      });
      
      console.log(`✅ Inquilino salvo com sucesso: ${tenant.name}`);
      return { success: true };
    } catch (error: any) {
      console.error('❌ Erro ao salvar inquilino:', error.message);
      return { success: false, error: error.message || 'Erro desconhecido' };
    }
  },

  async deleteTenant(id: string): Promise<{ success: boolean; error?: string }> {
    if (!supabase) return { success: false, error: 'Client not initialized' };
    try {
       await retryOperation(async () => {
         const { error } = await supabase!.from('tenants').delete().eq('id', id);
         if (error) throw error;
       });
       return { success: true };
    } catch (e: any) {
       console.error('Delete tenant error:', e);
       return { success: false, error: e.message };
    }
  }
};