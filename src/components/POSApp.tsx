import { useState } from 'react';
import { Smartphone, Package, MapPin, CheckCircle, ChevronRight, Bell, Search } from 'lucide-react';

export function POSApp() {
  const [activeTab, setActiveTab] = useState('estoque');
  
  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="text-center mb-8 max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-black mb-4">Aplicativo do Ponto de Venda</h1>
        <p className="text-gray-500 text-lg">
          Simulação do aplicativo utilizado pelos clientes (PDVs) para registrar vendas diárias, 
          garantindo visibilidade em tempo real para a Torre de Controle.
        </p>
      </div>

      {/* Mobile Device Mockup */}
      <div className="w-[375px] h-[812px] bg-black rounded-[50px] p-3 shadow-2xl relative overflow-hidden border-4 border-gray-800">
        {/* Notch */}
        <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-50">
          <div className="w-40 h-7 bg-black rounded-b-3xl"></div>
        </div>

        {/* Screen */}
        <div className="bg-gray-50 w-full h-full rounded-[38px] overflow-hidden flex flex-col relative">
          
          {/* App Header */}
          <div className="bg-[#FF4F00] pt-12 pb-6 px-6 text-black rounded-b-3xl shadow-md relative z-10">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-80">Bem-vindo,</p>
                <h2 className="text-xl font-black">Supermercado Silva</h2>
              </div>
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center relative">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-3 h-3 bg-[#FECC14] border-2 border-black rounded-full"></span>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase opacity-80">Próxima Entrega</p>
                <p className="font-black text-lg">Hoje, 14:30</p>
              </div>
              <TruckIcon />
            </div>
          </div>

          {/* App Content */}
          <div className="flex-1 overflow-y-auto p-6 pb-24 space-y-6">
            
            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setActiveTab('estoque')}
                className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${activeTab === 'estoque' ? 'bg-black text-white shadow-lg' : 'bg-white text-black shadow-sm border border-gray-100'}`}
              >
                <Package size={24} className={activeTab === 'estoque' ? 'text-[#FF4F00]' : 'text-gray-400'} />
                <span className="text-xs font-bold">Registrar Venda</span>
              </button>
              <button 
                onClick={() => setActiveTab('cd')}
                className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${activeTab === 'cd' ? 'bg-black text-white shadow-lg' : 'bg-white text-black shadow-sm border border-gray-100'}`}
              >
                <MapPin size={24} className={activeTab === 'cd' ? 'text-[#FECC14]' : 'text-gray-400'} />
                <span className="text-xs font-bold">Retirada Rápida</span>
              </button>
            </div>

            {activeTab === 'estoque' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex justify-between items-end">
                  <h3 className="font-bold text-lg">Produtos Críticos</h3>
                  <span className="text-xs font-bold text-[#FF4F00]">Atualizar Estoque</span>
                </div>

                <div className="space-y-3">
                  <ProductItem name="Pão de Forma Tradicional" stock={2} status="critical" />
                  <ProductItem name="Bisnaguinha" stock={15} status="warning" />
                  <ProductItem name="Rap10 Integral" stock={45} status="good" />
                </div>

                <button className="w-full bg-[#4E18FF] text-white font-bold py-4 rounded-2xl mt-4 shadow-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-2">
                  <CheckCircle size={20} />
                  Confirmar Vendas do Dia
                </button>
              </div>
            )}

            {activeTab === 'cd' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="text" 
                    placeholder="Buscar CD mais próximo..." 
                    className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>

                <h3 className="font-bold text-lg mt-6">Disponíveis para Retirada</h3>

                <div className="space-y-3">
                  <CDItem name="CD Vila Mariana" distance="2.5 km" time="10 min" available={true} />
                  <CDItem name="CD Pinheiros" distance="5.8 km" time="25 min" available={true} />
                  <CDItem name="CD Mooca" distance="8.2 km" time="40 min" available={false} />
                </div>
              </div>
            )}
          </div>

          {/* Bottom Navigation */}
          <div className="absolute bottom-0 inset-x-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-between items-center pb-8">
            <NavItem icon={Smartphone} label="Início" active={true} />
            <NavItem icon={Package} label="Estoque" active={false} />
            <NavItem icon={MapPin} label="Rotas" active={false} />
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white shadow-lg -mt-8 border-4 border-gray-50">
              <span className="font-bold">B</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductItem({ name, stock, status }: { name: string, stock: number, status: 'critical' | 'warning' | 'good' }) {
  const getStatusColor = () => {
    if (status === 'critical') return 'text-red-600 bg-red-50 border-red-100';
    if (status === 'warning') return 'text-orange-600 bg-orange-50 border-orange-100';
    return 'text-green-600 bg-green-50 border-green-100';
  };

  const getStatusDot = () => {
    if (status === 'critical') return 'bg-red-500';
    if (status === 'warning') return 'bg-orange-500';
    return 'bg-green-500';
  };

  return (
    <div className={`p-4 rounded-2xl border flex items-center justify-between ${getStatusColor()}`}>
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${getStatusDot()}`}></div>
        <div>
          <p className="font-bold text-sm text-black">{name}</p>
          <p className="text-xs font-medium opacity-80">Estoque atual: {stock} unid.</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-black border border-gray-200">-</button>
        <span className="font-mono font-bold w-6 text-center text-black">{stock}</span>
        <button className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-black border border-gray-200">+</button>
      </div>
    </div>
  );
}

function CDItem({ name, distance, time, available }: { name: string, distance: string, time: string, available: boolean }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-bold text-sm">{name}</h4>
          {available ? (
            <span className="px-2 py-0.5 bg-green-100 text-green-800 text-[10px] font-bold uppercase rounded-full">Disponível</span>
          ) : (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase rounded-full">Sem Estoque</span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
          <span className="flex items-center gap-1"><MapPin size={12} /> {distance}</span>
          <span>•</span>
          <span>{time}</span>
        </div>
      </div>
      <button 
        disabled={!available}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${available ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-100 text-gray-400'}`}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}

function NavItem({ icon: Icon, label, active }: { icon: any, label: string, active: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-1 ${active ? 'text-[#FF4F00]' : 'text-gray-400'}`}>
      <Icon size={24} strokeWidth={active ? 2.5 : 2} />
      <span className="text-[10px] font-bold">{label}</span>
    </div>
  );
}

function TruckIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13"></rect>
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
      <circle cx="5.5" cy="18.5" r="2.5"></circle>
      <circle cx="18.5" cy="18.5" r="2.5"></circle>
    </svg>
  );
}
