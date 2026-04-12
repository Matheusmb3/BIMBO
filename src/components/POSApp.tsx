import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock3,
  MapPin,
  Package,
  ReceiptText,
  RotateCcw,
  ShoppingCart,
  Sparkles,
  Truck,
  Wallet,
} from 'lucide-react';

const steps = [
  { id: 'inicio', label: 'Inicio', title: 'Painel do PDV', subtitle: 'Resumo rapido do dia com alertas e atalhos.', accent: '#FF4F00' },
  { id: 'venda', label: 'Venda', title: 'Registrar venda', subtitle: 'Selecionar itens, ajustar quantidades e confirmar a operacao.', accent: '#4E18FF' },
  { id: 'estoque', label: 'Estoque', title: 'Monitorar estoque', subtitle: 'Visualizar criticidade e recomendar reposicao.', accent: '#3D7700' },
  { id: 'entrega', label: 'Entrega', title: 'Acompanhar entrega', subtitle: 'Ver a proxima coleta e o status da rota.', accent: '#FECC14' },
] as const;

const stepFlow = [
  { label: 'Inicio', hint: 'Cliente ve o panorama geral', icon: Package },
  { label: 'Venda', hint: 'Ajusta e confirma pedidos', icon: ShoppingCart },
  { label: 'Estoque', hint: 'Acompanha nivel e ruptura', icon: Package },
  { label: 'Entrega', hint: 'Consulta a rota logistica', icon: Truck },
] as const;

const products = [
  { name: 'Pao de Forma Tradicional', price: 'R$ 8,90', qty: 2 },
  { name: 'Bisnaguinha', price: 'R$ 6,40', qty: 1 },
  { name: 'Rap10 Integral', price: 'R$ 12,50', qty: 1 },
];

const stockItems = [
  { name: 'Pao de Forma Tradicional', stock: 2, status: 'critical', note: 'Reposicao urgente em 2h' },
  { name: 'Bisnaguinha', stock: 15, status: 'warning', note: 'Cobertura para o restante do dia' },
  { name: 'Rap10 Integral', stock: 45, status: 'good', note: 'Estoque estavel' },
] as const;

const deliveries = [
  { name: 'CD Vila Mariana', distance: '2,5 km', eta: '10 min', status: 'Disponivel' },
  { name: 'CD Pinheiros', distance: '5,8 km', eta: '25 min', status: 'Em rota' },
  { name: 'CD Mooca', distance: '8,2 km', eta: '40 min', status: 'Sem estoque' },
] as const;

const stepCopy = [
  'Aqui o cliente visualiza o status geral da operacao e identifica os alertas principais.',
  'Ao clicar em Registrar Venda, o sistema simula a captura do pedido e a atualizacao do estoque.',
  'Nesta etapa, o cliente acompanha niveis, riscos de ruptura e a necessidade de reposicao.',
  'Aqui o cliente acompanha a coleta e a rota, entendendo o impacto logistico em tempo real.',
] as const;

export function POSApp({ initialStep = 0, focusAction }: { initialStep?: number; focusAction?: unknown }) {
  const [activeStep, setActiveStep] = useState(initialStep);
  void focusAction;
  const current = steps[activeStep];
  const progress = useMemo(() => ((activeStep + 1) / steps.length) * 100, [activeStep]);

  const goNext = () => setActiveStep((step) => Math.min(step + 1, steps.length - 1));
  const goPrev = () => setActiveStep((step) => Math.max(step - 1, 0));
  const resetFlow = () => setActiveStep(0);

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="text-center mb-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#FF4F00] mb-3">App do Cliente (PDV)</p>
        <h1 className="text-4xl font-bold tracking-tight text-black mb-4">Fluxo interativo do uso diario do PDV</h1>
        <p className="text-gray-500 text-lg">
          Demonstracao manual do app do cliente, com registro de vendas, acompanhamento de estoque e visualizacao de entregas.
        </p>
      </div>

      <div className="w-full max-w-5xl mb-6 space-y-4">
        <div className="bg-white rounded-[24px] border border-gray-200 shadow-sm p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Modo apresentacao manual</p>
              <h2 className="text-2xl font-black text-black">Passo a passo do fluxo</h2>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={resetFlow} className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors">
                <RotateCcw size={16} /> Reiniciar
              </button>
              <button onClick={goPrev} disabled={activeStep === 0} className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors">
                <ArrowLeft size={16} /> Anterior
              </button>
              <button onClick={goNext} disabled={activeStep === steps.length - 1} className="px-4 py-2 rounded-xl bg-black text-white text-sm font-bold flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors">
                Proximo <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="mt-4 h-2 rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: current.accent }} />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-stretch gap-3">
          {stepFlow.map((item, index) => {
            const isActive = index === activeStep;
            const Icon = item.icon;

            return (
              <div key={item.label} className="flex flex-col md:flex-row md:items-center gap-3 md:flex-1">
                <button
                  onClick={() => setActiveStep(index)}
                  className={`relative overflow-hidden rounded-2xl border p-4 text-left transition-all md:flex-1 ${isActive ? 'border-black bg-black text-white shadow-lg' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${isActive ? 'text-white/60' : 'text-gray-400'}`}>Passo 0{index + 1}</p>
                      <h3 className="mt-2 font-black text-lg">{item.label}</h3>
                      <p className={`text-sm mt-1 ${isActive ? 'text-white/75' : 'text-gray-500'}`}>{item.hint}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? 'bg-white text-black' : 'bg-gray-100 text-gray-500'}`}>
                      <Icon size={18} />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#FECC14]' : 'bg-gray-300'}`} />
                    <span className={`text-[11px] font-bold uppercase tracking-wider ${isActive ? 'text-white/75' : 'text-gray-400'}`}>Clique para navegar</span>
                  </div>
                </button>

                {index < stepFlow.length - 1 && (
                  <div className="hidden md:flex items-center justify-center text-gray-300 shrink-0">
                    <div className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center shadow-sm">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-[375px] h-[812px] bg-black rounded-[50px] p-3 shadow-2xl relative overflow-hidden border-4 border-gray-800">
        <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-50">
          <div className="w-40 h-7 bg-black rounded-b-3xl" />
        </div>

        <div className="bg-[#F7F7F4] w-full h-full rounded-[38px] overflow-hidden flex flex-col relative">
          <div className="pt-12 pb-6 px-6 text-black rounded-b-3xl shadow-md relative z-10" style={{ background: `linear-gradient(135deg, ${current.accent}, #111111)` }}>
            <div className="flex justify-between items-start mb-6 gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-80 text-white">Bem-vindo,</p>
                <h2 className="text-xl font-black text-white">Supermercado Silva</h2>
                <p className="text-xs font-medium text-white/70 mt-1">Prototipo interativo do fluxo PDV</p>
              </div>
              <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center relative shadow-lg">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-3 h-3 bg-[#FECC14] border-2 border-black rounded-full" />
              </div>
            </div>

            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between border border-white/10">
              <div>
                <p className="text-xs font-bold uppercase opacity-80 text-white">Proxima entrega</p>
                <p className="font-black text-lg text-white">Hoje, 14:30</p>
              </div>
              <Truck className="text-white" size={24} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 pb-24 space-y-5">
            <div className="flex items-center justify-between gap-3">
              {steps.map((step, index) => {
                const isActive = index === activeStep;
                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(index)}
                    className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${isActive ? 'bg-black text-white' : 'bg-white text-gray-400 border border-gray-200'}`}
                  >
                    {step.label}
                  </button>
                );
              })}
            </div>

            <FlowHint stepNumber={activeStep + 1} text={stepCopy[activeStep]} accent={current.accent} />

            <div key={current.id} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
              {activeStep === 0 && <HomeScene onJump={setActiveStep} />}
              {activeStep === 1 && <SaleScene onJump={setActiveStep} />}
              {activeStep === 2 && <StockScene onJump={setActiveStep} />}
              {activeStep === 3 && <DeliveryScene onJump={setActiveStep} />}
            </div>
          </div>

          <div className="absolute bottom-0 inset-x-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-between items-center pb-8">
            <NavItem icon={Package} label="Inicio" active={activeStep === 0} />
            <NavItem icon={ShoppingCart} label="Venda" active={activeStep === 1} />
            <NavItem icon={MapPin} label="Entrega" active={activeStep === 3} />
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white shadow-lg -mt-8 border-4 border-gray-50">
              <span className="font-bold">B</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FlowHint({ stepNumber, text, accent }: { stepNumber: number; text: string; accent: string }) {
  return (
    <div className="relative bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
      <div className="absolute left-4 -top-2 h-4 w-4 rotate-45 bg-white border-l border-t border-gray-100" />
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white font-black" style={{ background: accent }}>
          0{stepNumber}
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-gray-400">Explicacao do passo</p>
          <p className="text-sm text-gray-700 mt-1 leading-6">{text}</p>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value, accent }: { icon: any; label: string; value: string; accent: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{label}</p>
        <Icon size={16} style={{ color: accent }} />
      </div>
      <p className="text-2xl font-black text-black">{value}</p>
    </div>
  );
}

function QuickAction({ icon: Icon, label, tone, onClick }: { icon: any; label: string; tone: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`rounded-2xl p-3 flex flex-col items-center gap-2 ${tone}`}>
      <Icon size={18} />
      <span className="text-[11px] font-black uppercase tracking-wider">{label}</span>
    </button>
  );
}

function StockRow({ name, stock, status, note }: { name: string; stock: number; status: 'critical' | 'warning' | 'good'; note: string }) {
  const tone =
    status === 'critical'
      ? 'text-red-700 bg-red-50 border-red-100'
      : status === 'warning'
        ? 'text-orange-700 bg-orange-50 border-orange-100'
        : 'text-green-700 bg-green-50 border-green-100';

  const dot = status === 'critical' ? 'bg-red-500' : status === 'warning' ? 'bg-orange-500' : 'bg-green-500';

  return (
    <div className={`p-4 rounded-2xl border flex items-center justify-between ${tone}`}>
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${dot}`} />
        <div>
          <p className="font-bold text-sm text-black">{name}</p>
          <p className="text-xs font-medium opacity-80">Estoque: {stock} unid. - {note}</p>
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

function NavItem({ icon: Icon, label, active }: { icon: any; label: string; active: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-1 ${active ? 'text-[#FF4F00]' : 'text-gray-400'}`}>
      <Icon size={24} strokeWidth={active ? 2.5 : 2} />
      <span className="text-[10px] font-bold">{label}</span>
    </div>
  );
}

function HomeScene({ onJump }: { onJump: (step: number) => void }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <MiniStat icon={ReceiptText} label="Vendas do dia" value="42" accent="#FF4F00" />
        <MiniStat icon={Clock3} label="Proxima coleta" value="14:30" accent="#4E18FF" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Atalhos</p>
            <h3 className="font-bold text-lg text-black">Acesso rapido</h3>
          </div>
          <Sparkles size={18} className="text-[#FF4F00]" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <QuickAction icon={ShoppingCart} label="Venda" tone="bg-black text-white" onClick={() => onJump(1)} />
          <QuickAction icon={Package} label="Estoque" tone="bg-[#FFF2EA] text-[#FF4F00]" onClick={() => onJump(2)} />
          <QuickAction icon={Truck} label="Entrega" tone="bg-[#FEF7DA] text-black" onClick={() => onJump(3)} />
        </div>
      </div>

      <div className="bg-black text-white rounded-2xl p-4 shadow-xl">
        <p className="text-xs font-bold uppercase tracking-wider text-white/60">Alertas</p>
        <div className="flex items-start gap-3 mt-3">
          <div className="w-10 h-10 rounded-full bg-[#FF4F00] flex items-center justify-center shrink-0">
            <Wallet size={18} />
          </div>
          <div>
            <p className="font-black">Produto critico detectado</p>
            <p className="text-sm text-white/70 mt-1">Pao de Forma Tradicional abaixo do limite minimo. Aacao recomendada: registrar venda e solicitar reposicao.</p>
          </div>
        </div>
      </div>
    </>
  );
}

function SaleScene({ onJump }: { onJump: (step: number) => void }) {
  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Fluxo</p>
            <h3 className="font-bold text-lg text-black">Registrar venda</h3>
          </div>
          <ReceiptText size={18} className="text-[#4E18FF]" />
        </div>

        <div className="space-y-3">
          {products.map((product) => (
            <div key={product.name} className="flex items-center justify-between p-3 rounded-2xl border border-gray-100 bg-gray-50">
              <div>
                <p className="font-bold text-sm text-black">{product.name}</p>
                <p className="text-xs text-gray-500">{product.price} - {product.qty} itens</p>
              </div>
              <button onClick={() => onJump(2)} className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center">
                <ChevronRight size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.28em] text-gray-400">
          <ArrowRight size={14} /> Venda atualiza o estoque automaticamente
        </div>

        <button onClick={() => onJump(2)} className="w-full mt-4 bg-[#4E18FF] text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2">
          <CheckCircle2 size={18} /> Confirmar venda do dia
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <MiniStat icon={Package} label="Itens vendidos" value="14" accent="#4E18FF" />
        <MiniStat icon={Wallet} label="Faturamento" value="R$ 128" accent="#FF4F00" />
      </div>
    </>
  );
}

function StockScene({ onJump }: { onJump: (step: number) => void }) {
  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Monitoramento</p>
            <h3 className="font-bold text-lg text-black">Produtos criticos</h3>
          </div>
          <Package size={18} className="text-[#3D7700]" />
        </div>

        <div className="space-y-3">
          {stockItems.map((item) => (
            <div key={item.name}>
              <StockRow name={item.name} stock={item.stock} status={item.status} note={item.note} />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#EDF7E9] rounded-2xl p-4 border border-[#d7ebcf]">
        <p className="text-xs font-bold uppercase tracking-wider text-[#3D7700]">Sugestao</p>
        <p className="font-bold text-black mt-1">Acionar reposicao imediata para o item critico e alertar a torre de controle.</p>
      </div>

      <div className="flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-[0.28em] text-gray-400">
        <span className="flex items-center gap-2"><ArrowLeft size={14} /> Retorna apos a venda</span>
        <button onClick={() => onJump(3)} className="flex items-center gap-2 text-[#3D7700]">
          Seguir para entrega <ArrowRight size={14} />
        </button>
      </div>
    </>
  );
}

function DeliveryScene({ onJump }: { onJump: (step: number) => void }) {
  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Rotas</p>
            <h3 className="font-bold text-lg text-black">Disponiveis para retirada</h3>
          </div>
          <Truck size={18} className="text-[#FECC14]" />
        </div>

        <div className="space-y-3">
          {deliveries.map((delivery) => (
            <div key={delivery.name} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-sm text-black">{delivery.name}</h4>
                  <span className="px-2 py-0.5 bg-black text-white text-[10px] font-bold uppercase rounded-full">{delivery.status}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                  <span className="flex items-center gap-1"><MapPin size={12} /> {delivery.distance}</span>
                  <span>-</span>
                  <span>{delivery.eta}</span>
                </div>
              </div>
              <button onClick={() => onJump(0)} className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                <ChevronRight size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#FEF7DA] rounded-2xl p-4 border border-[#f2e4a2] flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shrink-0">
          <Truck size={18} />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-black/60">Status</p>
          <p className="font-bold text-black mt-1">Proxima coleta confirmada para hoje as 14:30.</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-[0.28em] text-gray-400">
        <button onClick={() => onJump(2)} className="flex items-center gap-2">
          <ArrowLeft size={14} /> Voltar ao estoque
        </button>
        <button onClick={() => onJump(0)} className="flex items-center gap-2 text-[#FF4F00]">
          Reiniciar roteiro <ArrowRight size={14} />
        </button>
      </div>
    </>
  );
}

// helper block removed
