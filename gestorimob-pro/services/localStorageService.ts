import { OwnerSettings, Property, Tenant, Payment } from '../types';

const STORAGE_KEYS = {
  AUTH: 'gestorimob_auth',
  SETTINGS: 'gestorimob_settings',
  PROPERTIES: 'gestorimob_properties',
  TENANTS: 'gestorimob_tenants',
  PAYMENTS: 'gestorimob_payments'
};

export const LocalStorageService = {
  // --- Authentication ---
  isAuthenticated(): boolean {
    const auth = localStorage.getItem(STORAGE_KEYS.AUTH);
    return auth === 'true';
  },

  setAuthenticated(value: boolean): void {
    localStorage.setItem(STORAGE_KEYS.AUTH, String(value));
  },

  // --- Settings ---
  loadSettings(): OwnerSettings | null {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  saveSettings(settings: OwnerSettings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  // --- Properties ---
  loadProperties(): Property[] {
    const data = localStorage.getItem(STORAGE_KEYS.PROPERTIES);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveProperty(property: Property): void {
    const properties = this.loadProperties();
    const index = properties.findIndex(p => p.id === property.id);
    
    if (index >= 0) {
      properties[index] = property;
    } else {
      properties.push(property);
    }
    
    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(properties));
  },

  deleteProperty(id: string): void {
    const properties = this.loadProperties();
    const filtered = properties.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(filtered));
  },

  // --- Tenants ---
  loadTenants(): Tenant[] {
    const data = localStorage.getItem(STORAGE_KEYS.TENANTS);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveTenant(tenant: Tenant): void {
    const tenants = this.loadTenants();
    const index = tenants.findIndex(t => t.id === tenant.id);
    
    if (index >= 0) {
      tenants[index] = tenant;
    } else {
      tenants.push(tenant);
    }
    
    localStorage.setItem(STORAGE_KEYS.TENANTS, JSON.stringify(tenants));
  },

  deleteTenant(id: string): void {
    const tenants = this.loadTenants();
    const filtered = tenants.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TENANTS, JSON.stringify(filtered));
  },

  // --- Payments ---
  loadPayments(): Payment[] {
    const data = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  savePayment(payment: Payment): void {
    const payments = this.loadPayments();
    const index = payments.findIndex(p => p.id === payment.id);
    
    if (index >= 0) {
      payments[index] = payment;
    } else {
      payments.push(payment);
    }
    
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  },

  // --- Clear All Data ---
  clearAll(): void {
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.PROPERTIES);
    localStorage.removeItem(STORAGE_KEYS.TENANTS);
    localStorage.removeItem(STORAGE_KEYS.PAYMENTS);
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  }
};
