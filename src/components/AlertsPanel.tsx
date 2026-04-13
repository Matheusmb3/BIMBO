import { AlertTriangle, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { BackToTopButton } from './BackToTopButton';

export function AlertsPanel({ focusStoreId, focusAction }: { focusStoreId?: string; focusAction?: unknown }) {
  void focusAction;

  const alertCount = 3;
  const criticalCount = 1;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#FF4F00] mb-3">Torre de Controle</p>
          <h1 className="text-4xl font-bold tracking-tight text-black">Gestão de Rupturas</h1>
          <p className="text-gray-500 mt-2 text-lg">Central de monitoramento e ação para evitar rupturas, priorizando riscos e sugerindo decisões em tempo real.</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-black shadow-sm">
            <span className="rounded-full bg-[#FF4F00] px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.25em] text-white">Status</span>
            <span>{alertCount} alertas ativos ({criticalCount} crítico)</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="bg-white border border-gray-200 px-4 py-2 rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors shadow-sm">
            Histórico
          </button>
          <button className="bg-[#4E18FF] text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-opacity-90 transition-colors shadow-[0_4px_14px_0_rgba(78,24,255,0.39)]">
            Aplicar ações recomendadas
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
            impact="perda estimada de 120 unidades" 
            action="Redirecionar rota imediatamente" 
            highlighted={focusStoreId === 'Supermercado Silva'}
          />
          <AlertCard 
            store="Mercadinho Dois Irmãos" 
            region="Zona Leste" 
            product="Bisnaguinha" 
            timeRemaining="4h" 
            severity="attention" 
            impact="risco de ruptura em 80% do estoque" 
            action="Acionar frota adicional" 
            highlighted={focusStoreId === 'Mercadinho Dois Irmãos'}
          />
          <AlertCard 
            store="Padaria Central" 
            region="Centro" 
            product="Rap10 Integral" 
            timeRemaining="1 dia" 
            severity="monitoring" 
            impact="impacto direto no nível de serviço" 
            action="Notificar CD mais próximo" 
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
                detail="→ evitou ruptura no PDV"
              />
              <ActionLog 
                action="Frota parceira acionada" 
                store="CD Norte" 
                time="Há 45 min" 
                status="success" 
                detail="→ cobriu demanda crítica em tempo hábil"
              />
              <ActionLog 
                action="Alerta de estoque baixo ignorado" 
                store="Padaria São João" 
                time="Há 2h" 
                status="warning" 
                detail="→ resultado: risco mantido sob monitoramento"
              />
            </div>
          </div>

          <div className="bg-[#FECC14] rounded-[20px] shadow-sm p-6 text-black">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              <Clock size={20} /> Previsibilidade
            </h3>
            <p className="text-sm font-medium opacity-90 mb-4">
              Previsão: aumento de demanda de +18% na Zona Norte nas próximas 24h.
            </p>
            <button className="bg-black text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-gray-800 transition-colors w-full flex items-center justify-center gap-2">
              Ajustar produção <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <BackToTopButton threshold={220} />
    </div>
  );
}

function AlertCard({ store, region, product, timeRemaining, severity, impact, action, highlighted }: any) {
  const severityStyles = {
    critical: {
      card: 'bg-red-50 border-red-300 shadow-[0_14px_30px_rgba(239,68,68,0.12)]',
      badge: 'bg-red-600 text-white',
      eyebrow: 'text-red-700',
      impact: 'text-red-900',
    },
    attention: {
      card: 'bg-amber-50 border-amber-200 shadow-sm',
      badge: 'bg-amber-200 text-amber-900',
      eyebrow: 'text-amber-700',
      impact: 'text-amber-900',
    },
    monitoring: {
      card: 'bg-emerald-50 border-emerald-200 shadow-sm',
      badge: 'bg-emerald-100 text-emerald-800',
      eyebrow: 'text-emerald-700',
      impact: 'text-emerald-900',
    },
  } as const;

  const current = severityStyles[severity as keyof typeof severityStyles] ?? severityStyles.monitoring;
  const badgeLabel =
    severity === 'critical'
      ? '🚨 CRÍTICO — Ruptura em 2h'
      : severity === 'attention'
        ? '🟡 ATENÇÃO — Ruptura em 4h'
        : '🟢 MONITORAMENTO — Acompanhar evolução';

  return (
    <div className={`p-6 rounded-[20px] border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:shadow-md ${current.card} ${highlighted ? 'ring-2 ring-[#FF4F00] ring-offset-2' : ''}`}>
      <div className="flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.25em] ${current.badge}`}>
            {badgeLabel}
          </span>
          <span className={`text-[11px] font-black uppercase tracking-[0.3em] ${current.eyebrow}`}>{region}</span>
        </div>
        <div>
          <h4 className="text-lg font-bold text-black">{store}</h4>
          <p className="text-sm font-medium text-gray-700 mt-1">Produto crítico: <span className="font-bold text-black">{product}</span></p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-black">
          <span className="rounded-full bg-white/80 px-3 py-1 border border-black/5">Tempo para ruptura: {timeRemaining}</span>
          <span className={`font-semibold ${current.impact}`}>Impacto: {impact}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full sm:w-auto">
        <button className="bg-black text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors shadow-sm whitespace-nowrap text-center">
          {action}
        </button>
        <button className="bg-white/80 text-black border border-gray-200 px-4 py-2 rounded-xl font-bold text-xs hover:bg-white transition-colors text-center opacity-80">
          Ignorar
        </button>
      </div>
    </div>
  );
}

function ActionLog({ action, store, time, status, detail }: any) {
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
        <p className="text-xs font-semibold text-gray-600 mt-1">{detail}</p>
      </div>
    </div>
  );
}
