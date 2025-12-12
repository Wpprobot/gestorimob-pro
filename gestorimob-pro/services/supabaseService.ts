import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { OwnerSettings, Property, Tenant } from '../types';

let supabase: SupabaseClient | null = null;

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
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('owner_settings')
      .select('data')
      .limit(1)
      .single();
    
    if (error || !data) return null;
    return data.data;
  },

  async saveSettings(settings: OwnerSettings): Promise<{ success: boolean; error?: string }> {
    if (!supabase) {
      console.error('Supabase not initialized');
      return { success: false, error: 'Supabase não inicializado' };
    }

    try {
      const { data } = await supabase.from('owner_settings').select('id').limit(1);
      
      let result;
      if (data && data.length > 0) {
        result = await supabase.from('owner_settings').update({ data: settings }).eq('id', data[0].id);
      } else {
        result = await supabase.from('owner_settings').insert({ data: settings });
      }

      if (result.error) {
        console.error('Error saving settings:', result.error);
        return { success: false, error: result.error.message };
      }

      console.log('Settings saved successfully');
      return { success: true };
    } catch (e: any) {
      console.error('Exception saving settings:', e);
      return { success: false, error: e.message };
    }
  },

  // --- Properties ---
  async loadProperties(): Promise<Property[]> {
    if (!supabase) return [];
    const { data, error } = await supabase.from('properties').select('data');
    if (error) {
        console.error(error);
        return [];
    }
    return data.map((row: any) => row.data);
  },

  async saveProperty(property: Property): Promise<{ success: boolean; error?: string }> {
    if (!supabase) {
      console.error('Supabase not initialized');
      return { success: false, error: 'Supabase não inicializado' };
    }

    try {
      const { error } = await supabase
        .from('properties')
        .upsert({ id: property.id, data: property }, { onConflict: 'id' });
      
      if (error) {
        console.error('Error saving property:', error);
        return { success: false, error: error.message };
      }
      
      console.log('Property saved successfully:', property.id);
      return { success: true };
    } catch (e: any) {
      console.error('Exception saving property:', e);
      return { success: false, error: e.message };
    }
  },

  async deleteProperty(id: string): Promise<void> {
    if (!supabase) return;
    await supabase.from('properties').delete().eq('id', id);
  },

  // --- Tenants ---
  async loadTenants(): Promise<Tenant[]> {
    if (!supabase) return [];
    const { data, error } = await supabase.from('tenants').select('data');
    if (error) {
        console.error(error);
        return [];
    }
    return data.map((row: any) => row.data);
  },

  async saveTenant(tenant: Tenant): Promise<{ success: boolean; error?: string }> {
    if (!supabase) {
      console.error('Supabase not initialized');
      return { success: false, error: 'Supabase não inicializado' };
    }

    try {
      const { error } = await supabase
        .from('tenants')
        .upsert({ id: tenant.id, data: tenant }, { onConflict: 'id' });
      
      if (error) {
        console.error('Error saving tenant:', error);
        return { success: false, error: error.message };
      }
      
      console.log('Tenant saved successfully:', tenant.id);
      return { success: true };
    } catch (e: any) {
      console.error('Exception saving tenant:', e);
      return { success: false, error: e.message };
    }
  },

  async deleteTenant(id: string): Promise<void> {
    if (!supabase) return;
    await supabase.from('tenants').delete().eq('id', id);
  }
};