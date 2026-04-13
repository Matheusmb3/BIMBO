import { AlertTriangle, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { BackToTopButton } from './BackToTopButton';

export function AlertsPanel({ focusStoreId, focusAction }: { focusStoreId?: string; focusAction?: unknown }) {
  void focusAction;
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-black">Gestão de Rupturas</h1>
          <p className="text-gray-500 mt-2 text-lg">Central de alertas e ações preventivas para pontos de venda críticos.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-200 px-4 py-2 rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors shadow-sm">
            Histórico
          </button>
          <button className="bg-[#4E18FF] text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-opacity-90 transition-colors shadow-[0_4px_14px_0_rgba(78,24,255,0.39)]">
            Resolver Todos
          </button>
        </div>
      </div>

      {focusStoreId && (
        <div className="rounded-2xl border border-[#FF4F00]/20 bg-[#FF4F00]/10 px-4 py-3 text-sm font-medium text-black">
          Ação disparada pela torre: alerta destacado para {focusStoreId}.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="text-[#FF4F00]" /> Alertas Ativos
          </h3>
          
          <AlertCard 
            store="Supermercado Silva" 
            region="Zona Sul" 
            product="Pão de Forma Tradicional" 
            timeRemaining="2h" 
            severity="critical" 
            action="Redirecionar Rota 12" 
            highlighted={focusStoreId === 'Supermercado Silva'}
          />
          <AlertCard 
            store="Mercadinho Dois Irmãos" 
            region="Zona Leste" 
            product="Bisnaguinha" 
            timeRemaining="4h" 
            severity="high" 
            action="Acionar Frota Flex" 
            highlighted={focusStoreId === 'Mercadinho Dois Irmãos'}
          />
          <AlertCard 
            store="Padaria Central" 
            region="Centro" 
            product="Rap10 Integral" 
            timeRemaining="1 dia" 
            severity="medium" 
            action="Notificar CD Próximo" 
            highlighted={focusStoreId === 'Padaria Central'}
          />
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold mb-4">Ações Recentes</h3>
            <div className="space-y-4">
              <ActionLog 
                action="Rota 08 redirecionada" 
                store="Mercado Extra" 
                time="Há 15 min" 
                status="success" 
              />
              <ActionLog 
                action="Frota parceira acionada" 
                store="CD Norte" 
                time="Há 45 min" 
                status="success" 
              />
              <ActionLog 
                action="Alerta de estoque baixo ignorado" 
                store="Padaria São João" 
                time="Há 2h" 
                status="warning" 
              />
            </div>
          </div>

          <div className="bg-[#FECC14] rounded-[20px] shadow-sm p-6 text-black">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              <Clock size={20} /> Previsibilidade
            </h3>
            <p className="text-sm font-medium opacity-90 mb-4">
              Com base nos dados do app, prevemos um pico de consumo de Bisnaguinha na Zona Norte amanhã.
            </p>
            <button className="bg-black text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-gray-800 transition-colors w-full flex items-center justify-center gap-2">
              Ajustar Produção <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <BackToTopButton threshold={220} />
    </div>
  );
}

function AlertCard({ store, region, product, timeRemaining, severity, action, highlighted }: any) {
  const getSeverityColor = () => {
    if (severity === 'critical') return 'bg-red-50 border-red-200';
    if (severity === 'high') return 'bg-orange-50 border-orange-200';
    return 'bg-yellow-50 border-yellow-200';
  };

  const getSeverityBadge = () => {
    if (severity === 'critical') return 'bg-red-100 text-red-800';
    if (severity === 'high') return 'bg-orange-100 text-orange-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className={`p-6 rounded-[20px] border shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:shadow-md ${getSeverityColor()} ${highlighted ? 'ring-2 ring-[#FF4F00] ring-offset-2' : ''}`}>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${getSeverityBadge()}`}>
            Ruptura em {timeRemaining}
          </span>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{region}</span>
        </div>
        <h4 className="text-lg font-bold text-black">{store}</h4>
        <p className="text-sm font-medium text-gray-700 mt-1">Produto Crítico: <span className="font-bold text-black">{product}</span></p>
      </div>
      <div className="flex flex-col gap-2 w-full sm:w-auto">
        <button className="bg-black text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors shadow-sm whitespace-nowrap text-center">
          {action}
        </button>
        <button className="bg-white text-black border border-gray-200 px-4 py-2 rounded-xl font-bold text-xs hover:bg-gray-50 transition-colors text-center">
          Ignorar
        </button>
      </div>
    </div>
  );
}

function ActionLog({ action, store, time, status }: any) {
  return (
    <div className="flex gap-3 items-start">
      <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${status === 'success' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
        {status === 'success' ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
      </div>
      <div>
        <p className="text-sm font-bold text-black">{action}</p>
        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mt-0.5">
          <span>{store}</span>
          <span>•</span>
          <span>{time}</span>
        </div>
      </div>
    </div>
  );
}
