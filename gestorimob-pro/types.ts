export interface OwnerSettings {
  name: string;
  cpf: string;
  rg: string;
  profession: string;
  phone: string;
  maritalStatus: string;
  address: string;
  email: string;
  // PIX Integration
  pixKey?: string;
  openpixAppId?: string;
}

export interface TenantDocument {
  id: string;
  name: string;
  url: string; // Base64
  type: 'pdf' | 'image';
}

export interface LogEntry {
  id: string;
  date: string; // ISO String
  action: string; // "Created", "Updated", "Approved"
  details: string;
}

export interface Tenant {
  id: string;
  name: string;
  cpf: string;
  rg: string;
  profession: string;
  email: string;
  phone: string;
  income: number;
  documents: TenantDocument[];
  // New fields
  status: 'active' | 'prospect'; // active = current tenant, prospect = potential candidate
  observation?: string;
  interestedPropertyId?: string; // ID of the property the prospect is applying for
  logs: LogEntry[]; // History of actions
}

export interface Property {
  id: string;
  nickname: string; // e.g., "Apto Centro"
  address: string;
  details: {
    bedrooms: number;
    bathrooms: number;
    livingRooms: number; // Sala de Estar
    diningRooms: number; // Sala de Jantar
    kitchens: number; // Cozinha
    laundry: number; // Lavanderia
    area: number;
    furniture: string[]; // List of furniture items
    contractStart?: string; // ISO date
    contractEnd?: string; // ISO date
  };
  fees: {
    iptu: number;
    water: number;
    condo: number;
  };
  rentAmount: number;
  paymentDay: number; // Day of month
  photos: string[]; // Base64 strings
  currentTenantId?: string;
  logs: LogEntry[]; // History of actions
}

export interface Payment {
  id: string;
  propertyId: string;
  tenantId: string;
  date: string;
  amount: number;
  paid: boolean;
  type: 'rent' | 'fee' | 'repair';
  source?: 'manual' | 'pix_auto'; // 'pix_auto' = detected via OpenPix webhook
  pixTransactionId?: string; // OpenPix transaction ID
  observation?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
  images?: string[]; // Base64
}

export type AppView = 'dashboard' | 'properties' | 'tenants' | 'documents' | 'settings' | 'ai-assistant';