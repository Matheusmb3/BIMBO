import { MapPin, Truck, Users, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as XLSX from 'xlsx';

export function RoutesFleet({ highlightRouteId, focusAction }: { highlightRouteId?: string; focusAction?: unknown }) {
  void focusAction;
  const handleExportReport = () => {
    const workbook = XLSX.utils.book_new();

    const summarySheet = XLSX.utils.aoa_to_sheet([
      ['Relatório Fictício - Rotas & Frota'],
      ['Data de geração', '06/04/2026'],
      ['Status geral', 'Operação estável com prioridade em rotas críticas'],
      ['Frota própria', '45 / 50'],
      ['Parceiros logísticos', '12 / 30'],
      ['Veículos em manutenção', '5'],
      ['Observação', 'Foco em criticidade alta e média para evitar ruptura'],
    ]);

    const routesSheet = XLSX.utils.json_to_sheet([
      { id: 'RT-1042', motorista: 'Carlos Silva', tipo: 'Própria', status: 'Em Rota', criticidade: 'Alta', paradas: 8, progresso: '65%' },
      { id: 'RT-1043', motorista: 'Logística Express (Parceiro)', tipo: 'Terceirizada', status: 'Carregando', criticidade: 'Média', paradas: 12, progresso: '10%' },
      { id: 'RT-1044', motorista: 'João Souza', tipo: 'Própria', status: 'Concluída', criticidade: 'Baixa', paradas: 5, progresso: '100%' },
    ]);

    const alertsSheet = XLSX.utils.json_to_sheet([
      { pdv: 'Supermercado Silva', regiao: 'Zona Sul', produto: 'Pão de Forma Tradicional', estoque: '2 unid. (2h restantes)', acao: 'Redirecionar Rota 12' },
      { pdv: 'Mercadinho Dois Irmãos', regiao: 'Zona Leste', produto: 'Bisnaguinha', estoque: '5 unid. (4h restantes)', acao: 'Acionar Frota Flex' },
      { pdv: 'Padaria Central', regiao: 'Centro', produto: 'Rap10 Integral', estoque: '12 unid. (1 dia)', acao: 'Notificar CD Próximo' },
    ]);

    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumo');
    XLSX.utils.book_append_sheet(workbook, routesSheet, 'Rotas');
    XLSX.utils.book_append_sheet(workbook, alertsSheet, 'Alertas');

    XLSX.writeFile(workbook, 'rotas-frota-relatorio.xlsx');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-black">Rotas & Frota Flexível</h1>
          <p className="text-gray-500 mt-2 text-lg">Gestão de parceiros logísticos e priorização de abastecimento.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExportReport} className="bg-white border border-gray-200 px-4 py-2 rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors shadow-sm">
            Exportar Relatório
          </button>
          <button className="bg-black text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors shadow-sm">
            Alocar Nova Frota
          </button>
        </div>
      </div>

      {highlightRouteId && (
        <div className="rounded-2xl border border-[#FF4F00]/20 bg-[#FF4F00]/10 px-4 py-3 text-sm font-medium text-black">
          Ação disparada pela torre: rota priorizada com foco contextual em {highlightRouteId}.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fleet Status */}
        <div className="lg:col-span-2 bg-white rounded-[20px] shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Truck className="text-[#4E18FF]" /> Status da Frota
          </h3>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <p className="text-sm text-gray-500 font-medium mb-1">Frota Própria</p>
              <p className="text-2xl font-black">45 / 50</p>
              <p className="text-xs text-green-600 font-bold mt-2 flex items-center gap-1"><CheckCircle2 size={12}/> Operando</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
              <p className="text-sm text-orange-800 font-medium mb-1">Parceiros Logísticos</p>
              <p className="text-2xl font-black text-orange-900">12 / 30</p>
              <p className="text-xs text-orange-600 font-bold mt-2 flex items-center gap-1"><Clock size={12}/> Em Standby</p>
            </div>
            <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
              <p className="text-sm text-red-800 font-medium mb-1">Veículos em Manutenção</p>
              <p className="text-2xl font-black text-red-900">5</p>
              <p className="text-xs text-red-600 font-bold mt-2 flex items-center gap-1"><AlertCircle size={12}/> Indisponível</p>
            </div>
          </div>

          <h4 className="font-bold text-lg mb-4">Rotas Ativas (Priorização por Criticidade)</h4>
          <div className="space-y-3">
            <RouteItem 
              id="RT-1042" 
              driver="Carlos Silva" 
              type="Própria" 
              status="Em Rota" 
              criticality="Alta" 
              destinations={8} 
              progress={65} 
              highlighted={highlightRouteId === 'RT-1042'}
            />
            <RouteItem 
              id="RT-1043" 
              driver="Logística Express (Parceiro)" 
              type="Terceirizada" 
              status="Carregando" 
              criticality="Média" 
              destinations={12} 
              progress={10} 
              highlighted={highlightRouteId === 'RT-1043'}
            />
            <RouteItem 
              id="RT-1044" 
              driver="João Souza" 
              type="Própria" 
              status="Concluída" 
              criticality="Baixa" 
              destinations={5} 
              progress={100} 
              highlighted={highlightRouteId === 'RT-1044'}
            />
          </div>
        </div>

        {/* Map */}
        <div className="bg-gray-100 rounded-[20px] border border-gray-200 overflow-hidden relative min-h-[400px]">
          <MapContainer
            center={[-23.55052, -46.633308]}
            zoom={13}
            className="absolute inset-0 h-full w-full"
            zoomControl={false}
            scrollWheelZoom={false}
            dragging={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/en-us/home">Esri</a>'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </MapContainer>

          <div className="absolute top-1/4 left-1/4 z-[1000]">
            <div className="relative">
              <div className="w-4 h-4 bg-[#FF4F00] rounded-full animate-ping absolute"></div>
              <div className="w-4 h-4 bg-[#FF4F00] rounded-full relative border-2 border-white shadow-md"></div>
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 z-[1000]">
            <div className="relative">
              <div className="w-4 h-4 bg-[#4E18FF] rounded-full relative border-2 border-white shadow-md"></div>
            </div>
          </div>
          <div className="absolute bottom-1/3 right-1/4 z-[1000]">
            <div className="relative">
              <div className="w-4 h-4 bg-[#3D7700] rounded-full relative border-2 border-white shadow-md"></div>
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/20">
            <h4 className="font-bold text-sm mb-2 flex items-center gap-2"><MapPin size={16} className="text-[#FF4F00]" /> Visão Geográfica</h4>
            <p className="text-xs text-gray-600 font-medium">Acompanhamento em tempo real da frota e pontos de ruptura iminente.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RouteItem({ id, driver, type, status, criticality, destinations, progress, highlighted }: any) {
  const getCriticalityColor = () => {
    if (criticality === 'Alta') return 'bg-red-100 text-red-800';
    if (criticality === 'Média') return 'bg-orange-100 text-orange-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className={`border rounded-2xl p-4 transition-colors ${highlighted ? 'border-[#FF4F00] bg-[#FF4F00]/5 shadow-md' : 'border-gray-100 hover:bg-gray-50'}`}>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
            <Truck size={20} className={type === 'Própria' ? 'text-black' : 'text-[#4E18FF]'} />
          </div>
          <div>
            <h5 className="font-bold text-sm">{id} • {driver}</h5>
            <p className="text-xs text-gray-500 font-medium">{type} | {destinations} paradas</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${getCriticalityColor()}`}>
            Prioridade {criticality}
          </span>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-gray-100 text-gray-600">
            {status}
          </span>
        </div>
      </div>
      
      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1">
        <div 
          className="bg-[#FF4F00] h-1.5 rounded-full transition-all duration-500" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-[10px] font-bold text-gray-400">
        <span>Progresso</span>
        <span>{progress}%</span>
      </div>
    </div>
  );
}
