import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, Users, FileText, Settings, MessageSquare, 
  Plus, Trash2, Save, Upload, Camera, DollarSign,
  CheckCircle, AlertCircle, Loader2, Sparkles, X, File, Image as ImageIcon, Calendar, Clock, TrendingUp, ArrowUp, ArrowDown, Download, UserPlus, Check, XCircle, History, Cloud, LogOut, AlertTriangle
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { OwnerSettings, Property, Tenant, Payment, ChatMessage, AppView, TenantDocument, LogEntry } from './types';
import { GeminiService } from './services/geminiService';
import { SupabaseService } from './services/supabaseService';

// --- CONFIGURAÇÃO DO SUPABASE E LOGIN ---
const SUPABASE_URL = "https://umuazkklbwvoxwbyraxi.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtdWF6a2tsYnd2b3h3YnlyYXhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1NDU4NDYsImV4cCI6MjA4MTEyMTg0Nn0.emBkqMb456D-yYXweqVPSLfxtwMR3_AcUD4QcDVP1hY";
const LOGIN_USERNAME = "Joyce Tupper";
const LOGIN_PASSWORD = "227564";

// --- MOCK DATA / DEFAULTS ---
const DEFAULT_SETTINGS: OwnerSettings = {
  name: "Maria Silva",
  cpf: "",
  rg: "",
  profession: "",
  phone: "",
  maritalStatus: "Casado(a)",
  address: "",
  email: ""
};

const INPUT_CLASS = "mt-1 w-full p-2 border border-slate-300 rounded-md bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none placeholder-slate-400";
const LABEL_CLASS = "block text-sm font-medium text-slate-700";

// --- UTILS: INPUT MASKS ---

const formatCPF = (value: string) => {
  return value
    .replace(/\D/g, '') // Remove non-digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1'); // Limit length
};

const formatRG = (value: string) => {
  // Pattern: XX.XXX.XXX-X (Basic logic, RG length varies by state, but dots and dash are standard)
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1})$/, '$1-$2');
};

const formatPhone = (value: string) => {
  // Pattern: (XX) XXXXX-XXXX
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1');
};

const createLog = (action: string, details: string): LogEntry => ({
  id: Date.now().toString() + Math.random().toString().slice(2),
  date: new Date().toISOString(),
  action,
  details
});

// --- COMPONENTS ---

// 1. Sidebar
const Sidebar = ({ currentView, setView, onLogout }: { currentView: AppView, setView: (v: AppView) => void, onLogout: () => void }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Painel', icon: Home },
    { id: 'properties', label: 'Imóveis', icon: Home },
    { id: 'tenants', label: 'Pessoas (Loc/Cand)', icon: Users },
    { id: 'documents', label: 'Documentos', icon: FileText },
    { id: 'ai-assistant', label: 'Assistente IA', icon: Sparkles },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 flex flex-col shadow-xl z-10 hidden md:flex">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Cloud className="text-blue-400" />
          GestorImob
        </h1>
        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> Conectado à Nuvem
        </p>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id as AppView)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                active ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-700">
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-800 rounded-lg transition-colors">
            <LogOut size={20} />
            <span>Desconectar</span>
        </button>
      </div>
    </div>
  );
};

// 2. Financial Ticker (Live Data from BrasilAPI/BACEN)
const FinancialTicker = () => {
  const [indices, setIndices] = useState([
    { name: 'Carregando...', value: '...', trend: 'neutral' }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const selicRes = await fetch('https://brasilapi.com.br/api/taxas/v1/selic');
        const selicData = await selicRes.json();
        
        const exchangeRes = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL');
        const exchangeData = await exchangeRes.json();

        setIndices([
          { name: 'SELIC (BACEN)', value: `${selicData.valor}%`, trend: 'neutral' },
          { name: 'IPCA (12m)', value: '+4.62%', trend: 'up' }, 
          { name: 'IGP-M (12m)', value: '-3.32%', trend: 'down' },
          { name: 'Dólar (USD)', value: `R$ ${parseFloat(exchangeData.USDBRL.bid).toFixed(2)}`, trend: parseFloat(exchangeData.USDBRL.pctChange) > 0 ? 'up' : 'down' },
          { name: 'Euro (EUR)', value: `R$ ${parseFloat(exchangeData.EURBRL.bid).toFixed(2)}`, trend: parseFloat(exchangeData.EURBRL.pctChange) > 0 ? 'up' : 'down' },
          { name: 'CDI', value: '11.15%', trend: 'neutral' }
        ]);

      } catch (e) {
        console.error("Erro ao buscar índices financeiros", e);
        setIndices([
           { name: 'SELIC', value: '11.25%', trend: 'neutral' },
           { name: 'IPCA', value: '+4.50%', trend: 'up' },
           { name: 'Dólar', value: 'R$ 5.00', trend: 'up' }
        ]);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 600000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 w-full h-10 bg-slate-900 z-50 flex items-center shadow-lg border-t border-slate-700">
      <div className="bg-blue-700 text-white px-4 h-full flex items-center font-bold text-xs uppercase z-20 shadow-lg shrink-0">
        Mercado & Índices
      </div>
      <div className="ticker-wrap flex-1 flex items-center overflow-hidden relative">
        <div className="animate-ticker flex items-center pl-4">
          {indices.map((idx, i) => (
            <div key={i} className="flex items-center gap-2 text-sm mr-8 shrink-0">
              <span className="font-semibold text-slate-400">{idx.name}:</span>
              <span className={`font-mono font-bold flex items-center ${
                idx.trend === 'up' ? 'text-green-400' : idx.trend === 'down' ? 'text-red-400' : 'text-white'
              }`}>
                {idx.value}
                {idx.trend === 'up' && <ArrowUp size={12} className="ml-1" />}
                {idx.trend === 'down' && <ArrowDown size={12} className="ml-1" />}
              </span>
            </div>
          ))}
           {indices.map((idx, i) => (
            <div key={`dup-${i}`} className="flex items-center gap-2 text-sm mr-8 shrink-0">
              <span className="font-semibold text-slate-400">{idx.name}:</span>
              <span className={`font-mono font-bold flex items-center ${
                idx.trend === 'up' ? 'text-green-400' : idx.trend === 'down' ? 'text-red-400' : 'text-white'
              }`}>
                {idx.value}
                {idx.trend === 'up' && <ArrowUp size={12} className="ml-1" />}
                {idx.trend === 'down' && <ArrowDown size={12} className="ml-1" />}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 3. Dashboard
const Dashboard = ({ properties, payments, tenants, settings }: { properties: Property[], payments: Payment[], tenants: Tenant[], settings: OwnerSettings }) => {
  const totalRent = properties.reduce((acc, curr) => acc + curr.rentAmount, 0);
  const occupied = properties.filter(p => p.currentTenantId).length;
  
  const getNextDueDate = (day: number) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    let targetDate = new Date(currentYear, currentMonth, day);
    if (today.getDate() > day) {
       targetDate = new Date(currentYear, currentMonth + 1, day);
    }
    return targetDate;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    const firstName = settings.name.split(' ')[0] || 'Locador';
    if (hour < 12) return `Bom dia, ${firstName}!`;
    if (hour < 18) return `Boa tarde, ${firstName}!`;
    return `Boa noite, ${firstName}!`;
  };

  const upcomingRents = properties
    .filter(p => p.currentTenantId)
    .map(p => {
      const nextDate = getNextDueDate(p.paymentDay);
      const tenant = tenants.find(t => t.id === p.currentTenantId);
      return {
        ...p,
        tenantName: tenant?.name || 'Desconhecido',
        nextDueDate: nextDate,
        daysRemaining: Math.ceil((nextDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24))
      };
    })
    .sort((a, b) => a.nextDueDate.getTime() - b.nextDueDate.getTime())
    .slice(0, 5);

  const revenueData = payments.slice(0, 6).map(p => ({
    name: new Date(p.date).toLocaleDateString('pt-BR', { month: 'short' }),
    amount: p.amount
  }));

  if (revenueData.length === 0) {
      revenueData.push({ name: 'Atual', amount: 0 });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
           <h2 className="text-3xl font-bold text-slate-800">{getGreeting()}</h2>
           <p className="text-slate-500">Resumo geral das suas locações</p>
        </div>
        <div className="text-right text-xs text-slate-400">
           {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Receita Mensal Potencial</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {totalRent.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </h3>
            </div>
            <div className="p-3 bg-green-100 rounded-lg text-green-600">
              <DollarSign size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Taxa de Ocupação</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {occupied} / {properties.length}
              </h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
              <Home size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Pagamentos Pendentes</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {payments.filter(p => !p.paid).length}
              </h3>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg text-orange-600">
              <AlertCircle size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold mb-4 text-slate-800 flex items-center gap-2">
              <Clock size={20} className="text-blue-500"/> Próximos Vencimentos
            </h3>
            <div className="space-y-3">
              {upcomingRents.length > 0 ? (
                upcomingRents.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                     <div>
                       <p className="font-semibold text-slate-800">{item.nickname}</p>
                       <p className="text-xs text-slate-500">{item.tenantName}</p>
                     </div>
                     <div className="text-right">
                       <p className="font-bold text-blue-600">
                         {item.nextDueDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                       </p>
                       <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                         Em {item.daysRemaining} dias
                       </span>
                     </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-sm text-center py-4">Nenhum imóvel alugado no momento.</p>
              )}
            </div>
         </div>

         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold mb-4 text-slate-800 flex items-center gap-2">
               <Calendar size={20} className="text-green-500" /> Histórico de Pagamentos
            </h3>
            <div className="overflow-y-auto max-h-60">
              <table className="w-full text-left text-sm">
                <thead className="text-xs text-slate-500 bg-slate-50 uppercase sticky top-0">
                   <tr>
                     <th className="px-3 py-2">Data</th>
                     <th className="px-3 py-2">Imóvel</th>
                     <th className="px-3 py-2 text-right">Valor</th>
                     <th className="px-3 py-2 text-center">Status</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.length > 0 ? (
                    payments.slice().reverse().map(p => {
                      const prop = properties.find(prop => prop.id === p.propertyId);
                      return (
                        <tr key={p.id}>
                          <td className="px-3 py-2 text-slate-600">{new Date(p.date).toLocaleDateString('pt-BR')}</td>
                          <td className="px-3 py-2 font-medium text-slate-800">{prop?.nickname || 'N/A'}</td>
                          <td className="px-3 py-2 text-right text-slate-600">
                            {p.amount.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}
                          </td>
                          <td className="px-3 py-2 text-center">
                            {p.paid ? (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Pago</span>
                            ) : (
                              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">Pendente</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center py-4 text-slate-400">Nenhum pagamento registrado.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
         </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-80">
        <h3 className="text-lg font-semibold mb-4 text-slate-800">Fluxo de Caixa</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <RechartsTooltip 
              formatter={(value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            />
            <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// 4. Properties Manager
const PropertiesManager = ({ 
  properties, 
  setProperties, 
  tenants 
}: { 
  properties: Property[], 
  setProperties: React.Dispatch<React.SetStateAction<Property[]>>,
  tenants: Tenant[]
}) => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Property>>({});
  const [furnitureText, setFurnitureText] = useState('');
  const [viewHistory, setViewHistory] = useState<string | null>(null);

  useEffect(() => {
    if (formData.details?.furniture) {
      setFurnitureText(formData.details.furniture.join(', '));
    } else {
      setFurnitureText('');
    }
  }, [formData.id, isEditing]);

  const handleSave = async () => {
    if (formData.address && formData.rentAmount) {
      const furnitureArray = furnitureText.split(',').map(s => s.trim()).filter(Boolean);
      
      const fees = {
        iptu: Number(formData.fees?.iptu) || 0,
        water: Number(formData.fees?.water) || 0,
        condo: Number(formData.fees?.condo) || 0
      };

      const details = {
        bedrooms: Number(formData.details?.bedrooms) || 0,
        bathrooms: Number(formData.details?.bathrooms) || 0,
        livingRooms: Number(formData.details?.livingRooms) || 0,
        diningRooms: Number(formData.details?.diningRooms) || 0,
        kitchens: Number(formData.details?.kitchens) || 0,
        laundry: Number(formData.details?.laundry) || 0,
        area: Number(formData.details?.area) || 0,
        furniture: furnitureArray
      };

      const action = isEditing === 'new' ? 'Criação' : 'Edição';
      const log = createLog(action, `Imóvel ${isEditing === 'new' ? 'criado' : 'atualizado'}. Aluguel: R$${formData.rentAmount}`);

      let propertyToSave: Property;

      if (isEditing === 'new') {
        propertyToSave = {
          id: Date.now().toString(),
          nickname: formData.nickname || 'Novo Imóvel',
          address: formData.address || '',
          rentAmount: Number(formData.rentAmount),
          paymentDay: Number(formData.paymentDay) || 5,
          details,
          fees,
          photos: formData.photos || [],
          currentTenantId: formData.currentTenantId,
          logs: [log]
        };
        setProperties([...properties, propertyToSave]);
      } else {
        const existing = properties.find(p => p.id === isEditing);
        propertyToSave = { 
          ...existing, 
          ...formData, 
          details, 
          fees,
          logs: [...(existing?.logs || []), log]
        } as Property;
        
        setProperties(properties.map(p => p.id === isEditing ? propertyToSave : p));
      }

      const result = await SupabaseService.saveProperty(propertyToSave);
      
      if (result.success) {
        alert('✅ Imóvel salvo com sucesso na nuvem!');
      } else {
        alert(`❌ Erro ao salvar no Supabase: ${result.error}\n\nVerifique o console para mais detalhes.`);
        console.error('Supabase save failed:', result.error);
      }
      
      setIsEditing(null);
      setFormData({});
    }
  };

  const handleDelete = async (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    
    if (!property) return;
    
    const confirmMessage = `Tem certeza que deseja apagar o imóvel "${property.nickname}"?\n\nEsta ação não pode ser desfeita.`;
    
    if (window.confirm(confirmMessage)) {
      try {
        // Remove from state
        setProperties(properties.filter(p => p.id !== propertyId));
        
        // Delete from localStorage
        await SupabaseService.deleteProperty(propertyId);
        
        alert('Imóvel removido com sucesso!');
      } catch (error) {
        console.error('Erro ao deletar imóvel:', error);
        alert('Erro ao remover imóvel. Tente novamente.');
      }
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, propId?: string) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        if(ev.target?.result) {
           const imageBase64 = ev.target.result as string;
           
           if (isEditing && !propId) {
             setFormData(prev => ({
               ...prev,
               photos: [...(prev.photos || []), imageBase64]
             }));
           } else if (propId) {
             const log = createLog("Foto", "Nova foto adicionada à galeria");
             const prop = properties.find(p => p.id === propId);
             if (prop) {
                const updatedProp = { 
                   ...prop, 
                   photos: [...prop.photos, imageBase64],
                   logs: [...(prop.logs || []), log]
                };
                // Optimistic UI update
                setProperties(properties.map(p => p.id === propId ? updatedProp : p));
                // Persist
                const result = await SupabaseService.saveProperty(updatedProp);
                if (!result.success) {
                  console.error('Failed to save property photo:', result.error);
                  alert(`⚠️ Foto adicionada localmente, mas erro ao salvar na nuvem: ${result.error}`);
                }
             }
           }
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  if (viewHistory) {
    const prop = properties.find(p => p.id === viewHistory);
    return (
       <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
         <div className="flex justify-between items-center mb-6">
           <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
             <History /> Histórico: {prop?.nickname}
           </h2>
           <button onClick={() => setViewHistory(null)} className="text-slate-500 hover:text-slate-800"><X size={24}/></button>
         </div>
         <div className="space-y-4">
            {prop?.logs && prop.logs.length > 0 ? (
               prop.logs.slice().reverse().map(log => (
                 <div key={log.id} className="border-l-2 border-blue-200 pl-4 py-1">
                    <div className="text-xs text-slate-400">{new Date(log.date).toLocaleString('pt-BR')}</div>
                    <div className="font-semibold text-slate-700">{log.action}</div>
                    <div className="text-sm text-slate-600">{log.details}</div>
                 </div>
               ))
            ) : <p className="text-slate-400">Sem histórico registrado.</p>}
         </div>
       </div>
    );
  }

  if (isEditing) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">{isEditing === 'new' ? 'Novo Imóvel' : 'Editar Imóvel'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={LABEL_CLASS}>Apelido do Imóvel</label>
            <input 
              className={INPUT_CLASS} 
              value={formData.nickname || ''} 
              onChange={e => setFormData({...formData, nickname: e.target.value})}
              placeholder="Ex: Apto Praia"
            />
          </div>
          <div>
            <label className={LABEL_CLASS}>Endereço Completo</label>
            <input 
              className={INPUT_CLASS} 
              value={formData.address || ''} 
              onChange={e => setFormData({...formData, address: e.target.value})}
            />
          </div>
          
          <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
             <div className="col-span-2 md:col-span-4 font-semibold text-slate-700">Valores</div>
             <div>
                <label className={LABEL_CLASS}>Aluguel (R$)</label>
                <input 
                  type="number"
                  className={INPUT_CLASS} 
                  value={formData.rentAmount || ''} 
                  onChange={e => setFormData({...formData, rentAmount: Number(e.target.value)})}
                />
             </div>
             <div>
                <label className={LABEL_CLASS}>Dia Vencimento</label>
                <input 
                  type="number"
                  className={INPUT_CLASS} 
                  value={formData.paymentDay || ''} 
                  onChange={e => setFormData({...formData, paymentDay: Number(e.target.value)})}
                />
             </div>
             <div>
                <label className={LABEL_CLASS}>IPTU (R$)</label>
                <input 
                  type="number"
                  className={INPUT_CLASS} 
                  value={formData.fees?.iptu || ''} 
                  onChange={e => setFormData({...formData, fees: {...formData.fees!, iptu: Number(e.target.value)}})}
                />
             </div>
             <div>
                <label className={LABEL_CLASS}>Taxa Água (R$)</label>
                <input 
                  type="number"
                  className={INPUT_CLASS} 
                  value={formData.fees?.water || ''} 
                  onChange={e => setFormData({...formData, fees: {...formData.fees!, water: Number(e.target.value)}})}
                />
             </div>
          </div>

          <div className="col-span-2">
            <h3 className="font-semibold mt-4 mb-2 text-slate-700">Detalhes & Cômodos</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className={LABEL_CLASS}>Área (m²)</label>
                <input 
                  type="number" className={INPUT_CLASS}
                  value={formData.details?.area || ''}
                  onChange={e => setFormData({...formData, details: {...formData.details!, area: Number(e.target.value)}})}
                />
              </div>
              <div>
                <label className={LABEL_CLASS}>Quartos</label>
                <input 
                  type="number" className={INPUT_CLASS}
                  value={formData.details?.bedrooms || ''}
                  onChange={e => setFormData({...formData, details: {...formData.details!, bedrooms: Number(e.target.value)}})}
                />
              </div>
              <div>
                <label className={LABEL_CLASS}>Banheiros</label>
                <input 
                  type="number" className={INPUT_CLASS}
                  value={formData.details?.bathrooms || ''}
                  onChange={e => setFormData({...formData, details: {...formData.details!, bathrooms: Number(e.target.value)}})}
                />
              </div>
              <div>
                <label className={LABEL_CLASS}>Cozinhas</label>
                <input 
                  type="number" className={INPUT_CLASS}
                  value={formData.details?.kitchens || ''}
                  onChange={e => setFormData({...formData, details: {...formData.details!, kitchens: Number(e.target.value)}})}
                />
              </div>
              <div>
                <label className={LABEL_CLASS}>Salas de Estar</label>
                <input 
                  type="number" className={INPUT_CLASS}
                  value={formData.details?.livingRooms || ''}
                  onChange={e => setFormData({...formData, details: {...formData.details!, livingRooms: Number(e.target.value)}})}
                />
              </div>
              <div>
                <label className={LABEL_CLASS}>Salas de Jantar</label>
                <input 
                  type="number" className={INPUT_CLASS}
                  value={formData.details?.diningRooms || ''}
                  onChange={e => setFormData({...formData, details: {...formData.details!, diningRooms: Number(e.target.value)}})}
                />
              </div>
              <div>
                <label className={LABEL_CLASS}>Lavanderia</label>
                <input 
                  type="number" className={INPUT_CLASS}
                  value={formData.details?.laundry || ''}
                  onChange={e => setFormData({...formData, details: {...formData.details!, laundry: Number(e.target.value)}})}
                />
              </div>
            </div>
            <div>
               <label className={LABEL_CLASS}>Mobília e Outros Itens (separar por vírgula)</label>
               <textarea 
                 className={INPUT_CLASS}
                 rows={3}
                 value={furnitureText}
                 onChange={e => setFurnitureText(e.target.value)}
                 placeholder="Ex: Armário cozinha, Cama box casal, Sofá 2 lugares..."
               />
            </div>
          </div>

          <div className="col-span-2">
            <h3 className="font-semibold mt-4 mb-2 text-slate-700">Fotos do Imóvel</h3>
            <div className="flex flex-wrap gap-4">
               {formData.photos?.map((photo, idx) => (
                 <div key={idx} className="w-24 h-24 relative rounded overflow-hidden border border-slate-300">
                    <img src={photo} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => setFormData(prev => ({...prev, photos: prev.photos?.filter((_, i) => i !== idx)}))}
                      className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl"
                    >
                      <X size={12} />
                    </button>
                 </div>
               ))}
               <label className="w-24 h-24 border-2 border-dashed border-slate-300 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 text-slate-400">
                  <Plus size={24} />
                  <span className="text-xs">Add Foto</span>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handlePhotoUpload(e)} />
               </label>
            </div>
          </div>

          <div className="col-span-2">
             <label className={LABEL_CLASS}>Inquilino Atual</label>
             <select 
                className={INPUT_CLASS}
                value={formData.currentTenantId || ''}
                onChange={e => setFormData({...formData, currentTenantId: e.target.value})}
             >
                <option value="">Vacante (Sem inquilino)</option>
                {tenants.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
             </select>
          </div>
        </div>
        <div className="mt-6 flex gap-4">
          <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
            <Save size={18} /> Salvar Imóvel
          </button>
          <button onClick={() => setIsEditing(null)} className="bg-slate-200 text-slate-700 px-6 py-2 rounded-lg hover:bg-slate-300">
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-slate-800">Meus Imóveis</h2>
        <button onClick={() => { setIsEditing('new'); setFormData({ details: { bedrooms: 0, bathrooms: 0, area: 0, livingRooms: 0, diningRooms: 0, kitchens: 0, laundry: 0, furniture: [] }, fees: { iptu: 0, water: 0, condo: 0}, photos: [] }); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={20} /> Novo Imóvel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map(property => (
          <div key={property.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="h-56 bg-slate-200 relative group">
               {property.photos.length > 0 ? (
                 <img src={property.photos[0]} alt={property.nickname} className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100">
                   <Home size={48} />
                   <span className="text-sm mt-2">Sem fotos</span>
                 </div>
               )}
               <label className="absolute bottom-2 right-2 bg-black/60 text-white p-2 rounded-full cursor-pointer hover:bg-black/80 transition-opacity opacity-0 group-hover:opacity-100">
                  <Camera size={18} />
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handlePhotoUpload(e, property.id)} />
               </label>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-slate-800">{property.nickname}</h3>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${property.currentTenantId ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {property.currentTenantId ? 'Alugado' : 'Vago'}
                </span>
              </div>
              <p className="text-slate-500 text-sm mb-4 line-clamp-2 h-10">{property.address}</p>
              
              <div className="flex flex-wrap gap-2 text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="font-semibold bg-white px-2 py-1 rounded border border-slate-200">{property.details.bedrooms} Quarto(s)</span>
                  <span className="font-semibold bg-white px-2 py-1 rounded border border-slate-200">{property.details.bathrooms} Banheiro(s)</span>
                  {property.details.kitchens > 0 && <span className="bg-white px-2 py-1 rounded border border-slate-200">{property.details.kitchens} Cozinha(s)</span>}
                  {property.details.livingRooms > 0 && <span className="bg-white px-2 py-1 rounded border border-slate-200">{property.details.livingRooms} Sala(s)</span>}
                  <span className="bg-white px-2 py-1 rounded border border-slate-200 font-bold">{property.details.area} m²</span>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                 <div>
                   <span className="block text-xs text-slate-400">Aluguel</span>
                   <span className="font-bold text-lg text-blue-600">
                     {property.rentAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                   </span>
                 </div>
                 <div className="flex gap-2">
                    <button onClick={() => setViewHistory(property.id)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full" title="Ver Histórico">
                      <History size={20} />
                    </button>
                    <button onClick={() => { setIsEditing(property.id); setFormData(property); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full" title="Editar Imóvel">
                      <Settings size={20} />
                    </button>
                    <button onClick={() => handleDelete(property.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full" title="Apagar Imóvel">
                      <Trash2 size={20} />
                    </button>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 5. Tenant Manager
const TenantManager = ({ 
  tenants, 
  setTenants, 
  properties, 
  setProperties 
}: { 
  tenants: Tenant[], 
  setTenants: React.Dispatch<React.SetStateAction<Tenant[]>>,
  properties: Property[],
  setProperties: React.Dispatch<React.SetStateAction<Property[]>>
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentTenant, setCurrentTenant] = useState<Partial<Tenant>>({});
  const [activeTab, setActiveTab] = useState<'active' | 'prospect'>('active');
  const [viewHistory, setViewHistory] = useState<string | null>(null);

  const filteredTenants = tenants.filter(t => 
    activeTab === 'active' ? (t.status === 'active' || !t.status) : t.status === 'prospect'
  );

  const handleEdit = (tenant: Tenant) => {
    setCurrentTenant(tenant);
    setIsEditing(true);
  };

  const handleCreate = () => {
    setCurrentTenant({ documents: [], status: activeTab, logs: [] });
    setIsEditing(true);
  };

  const handleApprove = async (candidate: Tenant) => {
    if (!candidate.interestedPropertyId) {
       alert("Erro: Este candidato não tem um imóvel de interesse selecionado. Edite o cadastro e selecione um imóvel.");
       return;
    }

    const targetProperty = properties.find(p => p.id === candidate.interestedPropertyId);

    if (!targetProperty) {
      alert("Erro: Imóvel de interesse não encontrado.");
      return;
    }

    if (targetProperty.currentTenantId) {
       alert("Erro: Ainda existe morador no imóvel solicitado! Não é possível aprovar no momento.");
       return;
    }

    if (confirm(`Confirmar aprovação de ${candidate.name} para o imóvel ${targetProperty.nickname}?`)) {
       const tenantLog = createLog('Aprovação', `Aprovado para o imóvel ${targetProperty.nickname}`);
       const propLog = createLog('Ocupação', `Novo inquilino aprovado: ${candidate.name}`);

       const updatedTenant: Tenant = { 
         ...candidate, 
         status: 'active',
         logs: [...(candidate.logs || []), tenantLog]
       };
       
       const updatedProperty: Property = { 
         ...targetProperty, 
         currentTenantId: candidate.id,
         logs: [...(targetProperty.logs || []), propLog]
       };

       setTenants(prev => prev.map(t => t.id === candidate.id ? updatedTenant : t));
       setProperties(prev => prev.map(p => p.id === targetProperty.id ? updatedProperty : p));
       
       const tenantResult = await SupabaseService.saveTenant(updatedTenant);
       const propertyResult = await SupabaseService.saveProperty(updatedProperty);

       if (tenantResult.success && propertyResult.success) {
         alert("✅ Candidato aprovado com sucesso! Movido para Locatários Atuais.");
       } else {
         const errors = [];
         if (!tenantResult.success) errors.push(`Inquilino: ${tenantResult.error}`);
         if (!propertyResult.success) errors.push(`Imóvel: ${propertyResult.error}`);
         alert(`⚠️ Aprovação realizada localmente, mas houve erro ao salvar na nuvem:\n${errors.join('\n')}`);
         console.error('Save errors:', { tenantResult, propertyResult });
       }
       
       setActiveTab('active');
    }
  };

  const handleReject = async (candidate: Tenant) => {
     if(confirm(`Tem certeza que deseja reprovar e remover o candidato ${candidate.name}?`)) {
        setTenants(prev => prev.filter(t => t.id !== candidate.id));
        await SupabaseService.deleteTenant(candidate.id);
     }
  };

  const handleSave = async () => {
    if (!currentTenant.name) {
      alert("Nome é obrigatório");
      return;
    }

    const isNew = !currentTenant.id;
    const action = isNew ? 'Criação' : 'Edição';
    const log = createLog(action, isNew ? 'Cadastro criado' : 'Cadastro atualizado');

    const tenantToSave: Tenant = {
      id: currentTenant.id || Date.now().toString(),
      name: currentTenant.name,
      cpf: currentTenant.cpf || '',
      rg: currentTenant.rg || '',
      profession: currentTenant.profession || '',
      email: currentTenant.email || '',
      phone: currentTenant.phone || '',
      income: Number(currentTenant.income) || 0,
      documents: currentTenant.documents || [],
      status: currentTenant.status || activeTab,
      observation: currentTenant.observation || '',
      interestedPropertyId: currentTenant.interestedPropertyId || '',
      logs: currentTenant.logs ? [...currentTenant.logs, log] : [log]
    };

    if (currentTenant.id) {
       setTenants(tenants.map(t => t.id === tenantToSave.id ? tenantToSave : t));
    } else {
       setTenants([...tenants, tenantToSave]);
    }

    const result = await SupabaseService.saveTenant(tenantToSave);

    if (result.success) {
      alert('✅ Dados salvos com sucesso na Nuvem!');
    } else {
      alert(`❌ Erro ao salvar no Supabase: ${result.error}\n\nDados salvos localmente. Verifique o console.`);
      console.error('Supabase save failed:', result.error);
    }
    setIsEditing(false);
    setCurrentTenant({});
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files && e.target.files[0]) {
       const file = e.target.files[0];
       
       // Prompt for custom document name
       const customName = prompt(`Dê um nome para este documento:\n\n(Arquivo original: ${file.name})`, file.name.replace(/\.[^/.]+$/, ""));
       
       if (!customName) {
         alert('Upload cancelado. É necessário dar um nome ao documento.');
         return;
       }
       
       const reader = new FileReader();
       reader.onload = async (ev) => {
          if(ev.target?.result) {
            const newDoc: TenantDocument = {
              id: Date.now().toString(),
              name: customName, // Use custom name
              url: ev.target.result as string,
              type: file.type.includes('image') ? 'image' : 'pdf'
            };
            const log = createLog('Documento', `Documento anexado: ${customName}`);
            
            setCurrentTenant(prev => ({
              ...prev,
              documents: [...(prev.documents || []), newDoc],
              logs: prev.logs ? [...prev.logs, log] : [log]
            }));
          }
       };
       reader.readAsDataURL(file);
       
       // Reset input value so same file can be uploaded again
       e.target.value = '';
    }
  };

   if (viewHistory) {
    const t = tenants.find(t => t.id === viewHistory);
    return (
       <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
         <div className="flex justify-between items-center mb-6">
           <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
             <History /> Histórico: {t?.name}
           </h2>
           <button onClick={() => setViewHistory(null)} className="text-slate-500 hover:text-slate-800"><X size={24}/></button>
         </div>
         <div className="space-y-4">
            {t?.logs && t.logs.length > 0 ? (
               t.logs.slice().reverse().map(log => (
                 <div key={log.id} className="border-l-2 border-orange-200 pl-4 py-1">
                    <div className="text-xs text-slate-400">{new Date(log.date).toLocaleString('pt-BR')}</div>
                    <div className="font-semibold text-slate-700">{log.action}</div>
                    <div className="text-sm text-slate-600">{log.details}</div>
                 </div>
               ))
            ) : <p className="text-slate-400">Sem histórico registrado.</p>}
         </div>
       </div>
    );
  }

  if (isEditing) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-md border border-slate-200">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">
          {currentTenant.id ? 'Editar Cadastro' : activeTab === 'active' ? 'Novo Locatário' : 'Novo Candidato'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="col-span-2 md:col-span-1">
              <label className={LABEL_CLASS}>Nome Completo</label>
              <input className={INPUT_CLASS} value={currentTenant.name || ''} onChange={e => setCurrentTenant({...currentTenant, name: e.target.value})} />
           </div>
           <div className="col-span-2 md:col-span-1">
              <label className={LABEL_CLASS}>Profissão</label>
              <input className={INPUT_CLASS} value={currentTenant.profession || ''} onChange={e => setCurrentTenant({...currentTenant, profession: e.target.value})} />
           </div>
           
           <div>
              <label className={LABEL_CLASS}>CPF</label>
              <input 
                className={INPUT_CLASS} 
                value={currentTenant.cpf || ''} 
                onChange={e => setCurrentTenant({...currentTenant, cpf: formatCPF(e.target.value)})} 
                placeholder="000.000.000-00"
                maxLength={14}
              />
           </div>
           <div>
              <label className={LABEL_CLASS}>RG</label>
              <input 
                className={INPUT_CLASS} 
                value={currentTenant.rg || ''} 
                onChange={e => setCurrentTenant({...currentTenant, rg: e.target.value})} 
                placeholder="Digite o RG livremente"
              />
           </div>
           
           <div>
              <label className={LABEL_CLASS}>Email</label>
              <input type="email" className={INPUT_CLASS} value={currentTenant.email || ''} onChange={e => setCurrentTenant({...currentTenant, email: e.target.value})} />
           </div>
           <div>
              <label className={LABEL_CLASS}>Telefone</label>
              <input 
                className={INPUT_CLASS} 
                value={currentTenant.phone || ''} 
                onChange={e => setCurrentTenant({...currentTenant, phone: formatPhone(e.target.value)})} 
                placeholder="(00) 00000-0000"
                maxLength={15}
              />
           </div>

           <div>
              <label className={LABEL_CLASS}>Renda Mensal (R$)</label>
              <input type="number" className={INPUT_CLASS} value={currentTenant.income || ''} onChange={e => setCurrentTenant({...currentTenant, income: Number(e.target.value)})} />
           </div>
           
           <div>
              <label className={LABEL_CLASS}>Imóvel de Interesse / Vinculado</label>
              <select 
                 className={INPUT_CLASS}
                 value={currentTenant.interestedPropertyId || ''}
                 onChange={e => setCurrentTenant({...currentTenant, interestedPropertyId: e.target.value})}
              >
                 <option value="">Selecione um imóvel...</option>
                 {properties.map(p => (
                   <option key={p.id} value={p.id}>
                      {p.nickname} {p.currentTenantId ? '(Ocupado)' : '(Vago)'}
                   </option>
                 ))}
              </select>
              {activeTab === 'prospect' && (
                 <p className="text-xs text-orange-600 mt-1">Necessário selecionar para aprovação futura.</p>
              )}
           </div>

           <div className="col-span-2">
              <label className={LABEL_CLASS}>Observações</label>
              <textarea 
                className={INPUT_CLASS} 
                rows={3}
                value={currentTenant.observation || ''} 
                onChange={e => setCurrentTenant({...currentTenant, observation: e.target.value})} 
                placeholder="Ex: Possui animal de estimação, fiador pendente..."
              />
           </div>
        </div>

        <div className="mt-8">
           <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
             <FileText size={20} /> Documentos Anexados
           </h3>
           <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {currentTenant.documents?.map(doc => (
                     <div key={doc.id} className="relative bg-white rounded-lg border border-slate-200 overflow-hidden group">
                         {doc.type === 'image' ? (
                           <div className="relative">
                             <img 
                               src={doc.url} 
                               alt={doc.name}
                               className="w-full h-32 object-cover"
                             />
                             <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                               <a 
                                 href={doc.url} 
                                 target="_blank" 
                                 rel="noopener noreferrer"
                                 className="opacity-0 group-hover:opacity-100 bg-white text-slate-800 px-3 py-1 rounded text-xs font-medium"
                               >
                                 Ver
                               </a>
                             </div>
                           </div>
                         ) : (
                           <div className="h-32 bg-red-50 flex flex-col items-center justify-center">
                             <File className="text-red-500 mb-2" size={32}/>
                             <span className="text-xs text-red-600 font-medium">PDF</span>
                           </div>
                         )}
                         <div className="p-2 bg-slate-50">
                           <span className="text-xs text-slate-700 truncate block" title={doc.name}>{doc.name}</span>
                         </div>
                         <button 
                            onClick={() => setCurrentTenant(prev => ({...prev, documents: prev.documents?.filter(d => d.id !== doc.id)}))}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                         >
                            <X size={14} />
                         </button>
                     </div>
                  ))}
                 <label className="border-2 border-dashed border-slate-300 rounded flex flex-col items-center justify-center h-24 cursor-pointer hover:bg-white transition-colors">
                    <Upload size={20} className="text-slate-400"/>
                    <span className="text-xs text-slate-500 mt-1">Upload PDF/JPG</span>
                    <input type="file" className="hidden" accept=".pdf,image/*" onChange={handleFileUpload} />
                 </label>
              </div>
           </div>
        </div>

        <div className="mt-8 flex gap-4">
           <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2">
             <Save size={18} /> Salvar
           </button>
           <button onClick={() => setIsEditing(false)} className="bg-slate-200 text-slate-700 px-6 py-2 rounded-lg font-medium hover:bg-slate-300">
             Cancelar
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-slate-800">
           {activeTab === 'active' ? 'Locatários Atuais' : 'Candidatos em Análise'}
        </h2>
        
        <div className="flex gap-4 items-center">
             <div className="flex bg-slate-100 p-1 rounded-lg">
                <button 
                  onClick={() => setActiveTab('active')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                     activeTab === 'active' 
                     ? 'bg-white shadow text-blue-700 ring-1 ring-black/5' 
                     : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Locatários
                </button>
                <button 
                   onClick={() => setActiveTab('prospect')}
                   className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      activeTab === 'prospect' 
                      ? 'bg-white shadow text-orange-700 ring-1 ring-black/5' 
                      : 'text-slate-500 hover:text-slate-700'
                   }`}
                >
                  Candidatos (Propostas)
                </button>
             </div>
             
             <button 
               onClick={handleCreate}
               className={`${activeTab === 'active' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-orange-600 hover:bg-orange-700'} text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium shadow-sm`}
             >
               <UserPlus size={20} /> {activeTab === 'active' ? 'Novo Locatário' : 'Novo Candidato'}
             </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/50">
              <th className="py-3 px-3 text-slate-500 font-medium text-sm">Nome / Profissão</th>
              <th className="py-3 px-3 text-slate-500 font-medium text-sm">
                 {activeTab === 'active' ? 'Imóvel Alugado' : 'Imóvel de Interesse'}
              </th>
              <th className="py-3 px-3 text-slate-500 font-medium text-sm">Contato</th>
              <th className="py-3 px-3 text-slate-500 font-medium text-sm">Renda</th>
              <th className="py-3 px-3 text-slate-500 font-medium text-sm text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTenants.map(t => {
               const prop = properties.find(p => p.id === t.interestedPropertyId || p.currentTenantId === t.id);
               return (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3">
                     <p className="font-bold text-slate-800">{t.name}</p>
                     <p className="text-xs text-slate-500">{t.profession}</p>
                     {t.observation && <p className="text-xs text-slate-400 italic mt-1 truncate max-w-[200px]">{t.observation}</p>}
                  </td>
                  <td className="py-3 px-3">
                     {prop ? (
                        <div className="flex flex-col">
                           <span className="text-sm font-medium text-slate-700">{prop.nickname}</span>
                           <span className="text-xs text-slate-500">{prop.address}</span>
                           {activeTab === 'prospect' && prop.currentTenantId && (
                              <span className="text-[10px] text-red-500 bg-red-50 px-1 rounded w-fit mt-1">Ocupado</span>
                           )}
                        </div>
                     ) : (
                        <span className="text-slate-400 text-sm italic">Não selecionado</span>
                     )}
                  </td>
                  <td className="py-3 px-3 text-sm text-slate-600">
                     <div>{t.email}</div>
                     <div>{t.phone}</div>
                  </td>
                  <td className="py-3 px-3 text-sm text-slate-600">
                     {t.income ? t.income.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-'}
                  </td>
                  <td className="py-3 px-3 text-right">
                     <div className="flex justify-end gap-2 items-center">
                        <button onClick={() => setViewHistory(t.id)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Ver Histórico">
                           <History size={18} />
                        </button>
                        {activeTab === 'prospect' && (
                           <>
                              <button 
                                 onClick={() => handleApprove(t)}
                                 className="p-1.5 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
                                 title="Aprovar Candidato"
                              >
                                 <Check size={18} />
                              </button>
                              <button 
                                 onClick={() => handleReject(t)}
                                 className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors"
                                 title="Reprovar Candidato"
                              >
                                 <XCircle size={18} />
                              </button>
                              <div className="w-px h-6 bg-slate-200 mx-1"></div>
                           </>
                        )}
                        <button onClick={() => handleEdit(t)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                           <Settings size={18} />
                        </button>
                        {activeTab === 'active' && (
                           <button 
                           onClick={async () => { 
                             if(confirm('Excluir este locatário?')) {
                               setTenants(tenants.filter(x => x.id !== t.id));
                               await SupabaseService.deleteTenant(t.id);
                             } 
                           }} 
                           className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                           >
                           <Trash2 size={18} />
                           </button>
                        )}
                     </div>
                  </td>
                  </tr>
               );
            })}
          </tbody>
        </table>
        {filteredTenants.length === 0 && (
          <div className="text-center py-12 bg-slate-50/30 rounded-lg mt-4 border border-dashed border-slate-200">
             <div className="flex flex-col items-center text-slate-400">
               {activeTab === 'active' ? <Users size={48} className="mb-2 opacity-20"/> : <UserPlus size={48} className="mb-2 opacity-20"/>}
               <p>{activeTab === 'active' ? 'Nenhum locatário ativo.' : 'Nenhuma proposta ou candidato em análise.'}</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 6. Document Generator with AI
const DocumentGenerator = ({ properties, tenants, settings, setTenants }: { properties: Property[], tenants: Tenant[], settings: OwnerSettings, setTenants: React.Dispatch<React.SetStateAction<Tenant[]>> }) => {
  const [selectedPropId, setSelectedPropId] = useState('');
  const [selectedTenantId, setSelectedTenantId] = useState('');
  const [docType, setDocType] = useState('contract');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const activeTenants = tenants.filter(t => t.status === 'active' || !t.status);
  const prospectTenants = tenants.filter(t => t.status === 'prospect');

  const handleGenerate = async () => {
    if (!selectedTenantId) return;

    setIsGenerating(true);
    setGeneratedContent('');

    const prop = properties.find(p => p.id === selectedPropId);
    const tenant = tenants.find(t => t.id === selectedTenantId);

    if (!tenant) return;

    let prompt = "";
    
    if (docType === 'contract') {
      const details = `
        Locador: ${settings.name}, CPF: ${settings.cpf}, RG: ${settings.rg}, Profissão: ${settings.profession}, Estado Civil: ${settings.maritalStatus}, Endereço: ${settings.address}.
        Locatário: ${tenant.name}, CPF: ${tenant.cpf}, RG: ${tenant.rg || 'N/A'}, Profissão: ${tenant.profession || 'N/A'}.
        Imóvel: ${prop?.address || 'ENDEREÇO DO IMÓVEL AQUI'}. 
        Características: ${prop?.details.bedrooms || 0} quartos, ${prop?.details.bathrooms || 0} banheiros, 
        ${prop?.details.livingRooms ? prop.details.livingRooms + ' Sala(s) de Estar, ' : ''}
        ${prop?.details.diningRooms ? prop.details.diningRooms + ' Sala(s) de Jantar, ' : ''}
        ${prop?.details.kitchens ? prop.details.kitchens + ' Cozinha(s), ' : ''}
        ${prop?.details.laundry ? prop.details.laundry + ' Lavanderia(s), ' : ''}
        Área: ${prop?.details.area || 0}m².
        Mobília: ${prop?.details.furniture.join(', ') || 'Sem mobília'}.
        Valor do Aluguel: R$ ${prop?.rentAmount || '0,00'}.
        Taxas Extras: IPTU (R$ ${prop?.fees.iptu || '0'}), Água (R$ ${prop?.fees.water || '0'}).
        Dia do Pagamento: ${prop?.paymentDay || '5'}.
      `;
      const content = await GeminiService.generateContract(details);
      setGeneratedContent(content);
    } else if (docType === 'proposal') {
        const task = "Ficha de Proposta de Locação";
        prompt = `Crie uma "${task}" estruturada e profissional para ser preenchida ou assinada.
        
        Se houver dados abaixo, já deixe preenchido, caso contrário deixe linha para preencher:
        Candidato: ${tenant.name}, CPF: ${tenant.cpf}, RG: ${tenant.rg}, Email: ${tenant.email}, Tel: ${tenant.phone}.
        Profissão: ${tenant.profession}, Renda: R$ ${tenant.income}.
        Observações já anotadas: ${tenant.observation || 'Nenhuma'}.
        Imóvel de interesse: ${prop?.address || '_______________'}.

        A ficha DEVE conter obrigatoriamente as seguintes seções detalhadas:

        1. Identificação do Pretendente (Locatário)
           - Nome, CPF, RG (emissor/data), Estado Civil (dados do cônjuge se houver), Endereço atual (se aluguel, contato do proprietário), Contatos (Tel/Email).

        2. Dados Profissionais e Financeiros
           - Profissão, Cargo, Empresa (CNPJ, contato RH), Tempo de serviço, Salário, Outras rendas comprováveis.

        3. Modalidade de Garantia (Art. 37 Lei 8.245/91)
           - Opções para assinalar: Fiador (com espaço para dados completos e renda > 3x), Caução (3 meses), Seguro Fiança.

        4. Checklist de Documentos Necessários (Listar para o cliente saber o que entregar)
           - RG/CPF (casal), Comprovante residência.
           - Assalariados: 3 últimos holerites + CTPS.
           - Autônomos: IR Completo + Extratos bancários (3 meses).

        Formatação: Use linhas (______) para campos vazios. Tom formal e claro.
        `;
        const content = await GeminiService.chat(prompt, [], []);
        setGeneratedContent(content);
    } else {
      const task = docType === 'receipt' ? 'Recibo de Pagamento' : 'Laudo de Vistoria Inicial';
      prompt = `Gere um documento de "${task}" profissional.
        Dados:
        Proprietário: ${settings.name}
        Inquilino: ${tenant.name}
        Imóvel: ${prop?.address || 'Imóvel'}
        Valor Aluguel: R$ ${prop?.rentAmount || '0,00'}
        Taxas (Água/IPTU): R$ ${(prop?.fees.iptu || 0) + (prop?.fees.water || 0)}
        Mobília: ${prop?.details.furniture.join(', ') || ''}
        Data: ${new Date().toLocaleDateString('pt-BR')}
      `;
      const content = await GeminiService.chat(prompt, [], []);
      setGeneratedContent(content);
    }

    setIsGenerating(false);
  };

  const handleDownload = () => {
    if (!generatedContent) return;
    const element = document.createElement("a");
    const file = new Blob([generatedContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    const fileName = `${docType === 'contract' ? 'Contrato' : docType === 'proposal' ? 'Ficha_Proposta' : 'Doc'} - ${new Date().toLocaleDateString('pt-BR')}.txt`;
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSaveToTenant = async () => {
    if (!generatedContent || !selectedTenantId) {
       alert("Gere um documento primeiro e selecione um locatário/candidato.");
       return;
    }

    const blob = new Blob([generatedContent], { type: 'text/plain' });
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = async (e) => {
       if (e.target?.result) {
          const docUrl = e.target.result as string;
          const fileName = `${docType === 'contract' ? 'Contrato' : docType === 'proposal' ? 'Ficha_Proposta' : 'Doc'} - ${new Date().toLocaleDateString('pt-BR')}.txt`;
          
          const newDoc: TenantDocument = {
             id: Date.now().toString(),
             name: fileName,
             url: docUrl,
             type: 'pdf'
          };
          const log = createLog('Documento', `Documento gerado e salvo: ${fileName}`);

          const tenant = tenants.find(t => t.id === selectedTenantId);
          if (tenant) {
              const updatedTenant = { 
                  ...tenant, 
                  documents: [...tenant.documents, newDoc],
                  logs: tenant.logs ? [...tenant.logs, log] : [log]
              };
              setTenants(prev => prev.map(t => t.id === selectedTenantId ? updatedTenant : t));
              const result = await SupabaseService.saveTenant(updatedTenant);
              if (result.success) {
                alert("Documento salvo com sucesso no perfil!");
              } else {
                console.error('Failed to save tenant document:', result.error);
                alert(`⚠️ Documento adicionado localmente, mas erro ao salvar na nuvem: ${result.error}`);
              }
          }
       }
    };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-100px)]">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-800">
          <FileText className="text-blue-500" /> Gerador Inteligente
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className={LABEL_CLASS + " mb-1"}>Tipo de Documento</label>
            <select 
              className={INPUT_CLASS}
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
            >
              <option value="contract">Contrato de Aluguel (IA Avançada)</option>
              <option value="proposal">Ficha de Proposta de Locação</option>
              <option value="receipt">Recibo de Pagamento</option>
              <option value="inspection">Termo de Vistoria</option>
            </select>
          </div>

          <div>
            <label className={LABEL_CLASS + " mb-1"}>Imóvel (Opcional para Propostas)</label>
            <select 
              className={INPUT_CLASS}
              value={selectedPropId}
              onChange={(e) => setSelectedPropId(e.target.value)}
            >
              <option value="">Selecione o imóvel...</option>
              {properties.map(p => <option key={p.id} value={p.id}>{p.nickname}</option>)}
            </select>
          </div>

          <div>
            <label className={LABEL_CLASS + " mb-1"}>Locatário ou Candidato</label>
            <select 
              className={INPUT_CLASS}
              value={selectedTenantId}
              onChange={(e) => setSelectedTenantId(e.target.value)}
            >
              <option value="">Selecione...</option>
              <optgroup label="Locatários Ativos">
                {activeTenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </optgroup>
              <optgroup label="Candidatos">
                {prospectTenants.map(t => <option key={t.id} value={t.id}>{t.name} (Candidato)</option>)}
              </optgroup>
            </select>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={!selectedTenantId || isGenerating}
            className={`w-full py-3 rounded-lg flex justify-center items-center gap-2 font-semibold text-white transition-all
              ${!selectedTenantId ? 'bg-slate-300' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg'}
            `}
          >
            {isGenerating ? (
              <><Loader2 className="animate-spin" /> Gerando com IA...</>
            ) : (
              <><Sparkles size={18} /> Gerar Documento</>
            )}
          </button>
          
          <p className="text-xs text-slate-500 mt-2">
             * Contratos utilizam o modelo Gemini 3 Pro (Thinking Mode) para maior precisão jurídica.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col h-full border border-slate-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-slate-700">Pré-visualização</h3>
          <div className="flex gap-2">
            {generatedContent && (
               <>
                 <button onClick={handleDownload} className="text-slate-600 text-sm hover:underline flex items-center gap-1 font-medium bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
                   <Download size={14} /> Baixar Arquivo
                 </button>
                 <button onClick={handleSaveToTenant} className="text-blue-600 text-sm hover:underline flex items-center gap-1 font-medium bg-blue-50 px-3 py-1 rounded-md border border-blue-100">
                   <Save size={14} /> Salvar no Perfil
                 </button>
               </>
            )}
          </div>
        </div>
        <div className="flex-1 bg-white p-4 rounded-lg border border-slate-300 overflow-y-auto font-mono text-sm whitespace-pre-wrap text-slate-800">
          {generatedContent || <span className="text-slate-400 italic">O documento gerado aparecerá aqui...</span>}
        </div>
      </div>
    </div>
  );
};

// 7. AI Assistant Component (Same as before)
const AIAssistant = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'Olá! Sou sua assistente virtual de imóveis. Posso ajudar a analisar fotos de vistorias, tirar dúvidas sobre a lei do inquilinato ou redigir e-mails.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if ((!input.trim() && !attachedImage) || isLoading) return;

    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      images: attachedImage ? [attachedImage] : undefined
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    const currentImage = attachedImage;
    setAttachedImage(null); 
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
         role: m.role === 'model' ? 'model' : 'user',
         parts: [{ text: m.text }] 
      }));

      const responseText = await GeminiService.chat(
        newUserMsg.text, 
        history, 
        currentImage ? [currentImage] : []
      );

      const newModelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText
      };

      setMessages(prev => [...prev, newModelMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) setAttachedImage(ev.target.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
      <div className="bg-indigo-600 p-4 text-white flex items-center justify-between">
         <div className="flex items-center gap-2">
            <Sparkles size={20} />
            <h2 className="font-semibold">Assistente Gemini Pro</h2>
         </div>
         <span className="text-xs bg-indigo-500 px-2 py-1 rounded">Versão 3.0 Preview</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-white text-slate-800 shadow-sm border border-slate-200 rounded-bl-none'
            }`}>
              {msg.images && msg.images.map((img, i) => (
                <img key={i} src={img} alt="Attachment" className="max-w-full h-auto rounded mb-2 border border-white/20" />
              ))}
              <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2 border border-slate-200">
                <Loader2 size={16} className="animate-spin text-indigo-600" />
                <span className="text-xs text-slate-500">Pensando...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-200">
        {attachedImage && (
          <div className="mb-2 inline-flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-xs text-slate-600 border border-slate-200">
            <span>Imagem anexada</span>
            <button onClick={() => setAttachedImage(null)} className="hover:text-red-500"><Trash2 size={12}/></button>
          </div>
        )}
        <div className="flex gap-2">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
            title="Anexar Imagem"
          >
            <Camera size={20} />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleImageSelect}
          />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Pergunte sobre contratos, envie fotos de reparos..."
            className="flex-1 border border-slate-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-slate-900"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || (!input && !attachedImage)}
            className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 disabled:bg-slate-300 transition-colors"
          >
            <MessageSquare size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

// 8. Settings
const SettingsForm = ({ settings, setSettings }: { settings: OwnerSettings, setSettings: (s: OwnerSettings) => void }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle');

  const handleSave = async () => {
    setSaveStatus('saving');
    
    // Optimistic
    setSettings(localSettings);
    
    // Persist
    const result = await SupabaseService.saveSettings(localSettings);

    if (result.success) {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } else {
      setSaveStatus('idle');
      alert(`❌ Erro ao salvar configurações no Supabase: ${result.error}\n\nDados salvos localmente. Verifique o console.`);
      console.error('Settings save failed:', result.error);
    }
  };


  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-800">
        <Settings size={24} /> Configurações do Locador
      </h2>
      <p className="text-slate-500 mb-6">Estes dados serão usados para preencher automaticamente os contratos.</p>
      
      {/* Visual Feedback for Saving */}
      {saveStatus === 'success' && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-pulse">
           <CheckCircle size={20} />
           <span className="font-semibold">Configurações salvas com sucesso na Nuvem!</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={LABEL_CLASS}>Nome Completo</label>
          <input 
            className={INPUT_CLASS} 
            value={localSettings.name}
            onChange={e => setLocalSettings({...localSettings, name: e.target.value})}
          />
        </div>
        <div>
          <label className={LABEL_CLASS}>CPF</label>
          <input 
            className={INPUT_CLASS} 
            value={localSettings.cpf}
            onChange={e => setLocalSettings({...localSettings, cpf: formatCPF(e.target.value)})}
            placeholder="000.000.000-00"
            maxLength={14}
          />
        </div>
        <div>
          <label className={LABEL_CLASS}>RG</label>
          <input 
            className={INPUT_CLASS} 
            value={localSettings.rg}
            onChange={e => setLocalSettings({...localSettings, rg: e.target.value})}
            placeholder="Digite o RG"
          />
        </div>
        <div>
          <label className={LABEL_CLASS}>Profissão</label>
          <input 
            className={INPUT_CLASS} 
            value={localSettings.profession}
            onChange={e => setLocalSettings({...localSettings, profession: e.target.value})}
          />
        </div>
        <div>
          <label className={LABEL_CLASS}>Estado Civil</label>
           <select 
             className={INPUT_CLASS}
             value={localSettings.maritalStatus}
             onChange={e => setLocalSettings({...localSettings, maritalStatus: e.target.value})}
           >
              <option value="Solteiro(a)">Solteiro(a)</option>
              <option value="Casado(a)">Casado(a)</option>
              <option value="Divorciado(a)">Divorciado(a)</option>
              <option value="Viúvo(a)">Viúvo(a)</option>
              <option value="União Estável">União Estável</option>
           </select>
        </div>
        <div>
          <label className={LABEL_CLASS}>Telefone</label>
          <input 
            className={INPUT_CLASS} 
            value={localSettings.phone}
            onChange={e => setLocalSettings({...localSettings, phone: formatPhone(e.target.value)})}
            placeholder="(00) 00000-0000"
            maxLength={15}
          />
        </div>
        <div className="md:col-span-2">
          <label className={LABEL_CLASS}>Endereço Residencial</label>
          <input 
            className={INPUT_CLASS} 
            value={localSettings.address}
            onChange={e => setLocalSettings({...localSettings, address: e.target.value})}
          />
        </div>
        <div className="md:col-span-2">
          <label className={LABEL_CLASS}>Email de Contato</label>
          <input 
            type="email"
            className={INPUT_CLASS} 
            value={localSettings.email}
            onChange={e => setLocalSettings({...localSettings, email: e.target.value})}
          />
        </div>
      </div>
      
      <button 
        onClick={handleSave} 
        disabled={saveStatus === 'saving'}
        className={`mt-6 w-full py-3 rounded-lg font-semibold transition-colors flex justify-center items-center gap-2
          ${saveStatus === 'saving' ? 'bg-slate-300 text-slate-500' : 'bg-blue-600 text-white hover:bg-blue-700'}
        `}
      >
        {saveStatus === 'saving' ? (
           <><Loader2 className="animate-spin" size={20} /> Salvando...</>
        ) : (
           <><Cloud size={20} /> Salvar Configurações</>
        )}
      </button>
    </div>
  );
};

// 9. Login Screen
const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleLogin = () => {
        setErrorMsg(null);
        
        if (username === LOGIN_USERNAME && password === LOGIN_PASSWORD) {
            onLogin();
        } else {
            setErrorMsg("Usuário ou senha incorretos.");
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-slate-900 p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full">
                <div className="flex justify-center mb-6">
                    <div className="bg-blue-100 p-4 rounded-full">
                        <Home size={48} className="text-blue-600"/>
                    </div>
                </div>
                <h2 className="text-3xl font-bold text-center text-slate-800 mb-2">GestorImob Pro</h2>
                <p className="text-center text-slate-500 mb-8 text-sm">
                    Sistema de Gestão de Imóveis
                </p>

                {errorMsg && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm flex items-start gap-2">
                        <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                        <span>{errorMsg}</span>
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className={LABEL_CLASS}>Usuário</label>
                        <input 
                            className={INPUT_CLASS} 
                            value={username} 
                            onChange={e => setUsername(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Digite seu usuário"
                            autoFocus
                        />
                    </div>
                    <div>
                        <label className={LABEL_CLASS}>Senha</label>
                        <input 
                            className={INPUT_CLASS} 
                            value={password} 
                            onChange={e => setPassword(e.target.value)}
                            onKeyPress={handleKeyPress}
                            type="password" 
                            placeholder="Digite sua senha" 
                        />
                    </div>
                    <button 
                        onClick={handleLogin}
                        disabled={!username || !password}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                        <LogOut size={20} /> Entrar
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- MAIN APP ---

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState<AppView>('dashboard');
  
  const [settings, setSettings] = useState<OwnerSettings>(DEFAULT_SETTINGS);
  const [properties, setProperties] = useState<Property[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  // AUTO-INITIALIZE SUPABASE AND LOGIN
  useEffect(() => {
     // Initialize Supabase with credentials
     SupabaseService.initialize(SUPABASE_URL, SUPABASE_KEY);
     
     // Check if user was previously authenticated
     const wasAuthenticated = localStorage.getItem('gestorimob_auth') === 'true';
     setIsAuthenticated(wasAuthenticated);
  }, []);

  // Fetch Data on Auth
  useEffect(() => {
    if (isAuthenticated) {
        const loadData = async () => {
            const s = await SupabaseService.loadSettings();
            if (s) setSettings(s);

            const p = await SupabaseService.loadProperties();
            setProperties(p);

            const t = await SupabaseService.loadTenants();
            setTenants(t);
        };
        loadData();
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
      localStorage.setItem('gestorimob_auth', 'true');
      setIsAuthenticated(true);
  };

  const handleLogout = () => {
      if (confirm('Tem certeza que deseja sair? Seus dados estão salvos na nuvem e estarão disponíveis quando você fizer login novamente.')) {
        localStorage.removeItem('gestorimob_auth');
        setIsAuthenticated(false);
        setProperties([]);
        setTenants([]);
        setPayments([]);
      }
  };

  if (!isAuthenticated) {
      return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 relative">
      <Sidebar currentView={view} setView={setView} onLogout={handleLogout} />
      
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-x-hidden mb-10">
        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center mb-6">
           <h1 className="text-xl font-bold text-slate-800">GestorImob</h1>
           <button onClick={() => setView('dashboard')}><Home size={24} /></button>
        </div>

        {/* Dynamic View Rendering */}
        {view === 'dashboard' && <Dashboard properties={properties} payments={payments} tenants={tenants} settings={settings} />}
        {view === 'properties' && <PropertiesManager properties={properties} setProperties={setProperties} tenants={tenants} />}
        {view === 'tenants' && <TenantManager tenants={tenants} setTenants={setTenants} properties={properties} setProperties={setProperties} />}
        {view === 'documents' && <DocumentGenerator properties={properties} tenants={tenants} settings={settings} setTenants={setTenants} />}
        {view === 'settings' && <SettingsForm settings={settings} setSettings={setSettings} />}
        {view === 'ai-assistant' && <AIAssistant />}

      </main>

      {/* Ticker at the bottom */}
      <FinancialTicker />
    </div>
  );
};

export default App;

