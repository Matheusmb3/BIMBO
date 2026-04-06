import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Package, Truck, AlertTriangle, CheckCircle2, TrendingUp, TrendingDown, ArrowRight, BarChart3, Boxes, Clock3, Network, ShieldCheck, Sparkles, Target } from 'lucide-react';

const consumptionData = [
  { time: '08:00', paoForma: 120, bisnaguinha: 80, rap10: 40 },
  { time: '10:00', paoForma: 250, bisnaguinha: 150, rap10: 90 },
  { time: '12:00', paoForma: 380, bisnaguinha: 210, rap10: 160 },
  { time: '14:00', paoForma: 420, bisnaguinha: 290, rap10: 220 },
  { time: '16:00', paoForma: 550, bisnaguinha: 380, rap10: 310 },
  { time: '18:00', paoForma: 680, bisnaguinha: 450, rap10: 400 },
];

const regionData = [
  { name: 'Zona Sul', abastecido: 85, ruptura: 15 },
  { name: 'Zona Norte', abastecido: 92, ruptura: 8 },
  { name: 'Zona Leste', abastecido: 78, ruptura: 22 },
  { name: 'Zona Oeste', abastecido: 88, ruptura: 12 },
  { name: 'Centro', abastecido: 95, ruptura: 5 },
];

export function Dashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-black">Visão Geral da Operação</h1>
          <p className="text-gray-500 mt-2 text-lg">Monitoramento em tempo real de estoques, rotas e entregas.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-200 px-4 py-2 rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors shadow-sm">
            Exportar Relatório
          </button>
          <button className="bg-[#FF4F00] text-black px-4 py-2 rounded-xl font-bold text-sm hover:bg-[#e64700] transition-colors shadow-[0_4px_14px_0_rgba(255,79,0,0.39)]">
            Atualizar Dados
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Entregas em Andamento" 
          value="142" 
          trend="+12%" 
          trendUp={true} 
          icon={Truck} 
          color="bg-[#4E18FF]" 
        />
        <MetricCard 
          title="Risco de Ruptura (PDVs)" 
          value="28" 
          trend="-5%" 
          trendUp={false} 
          icon={AlertTriangle} 
          color="bg-[#FF4F00]" 
        />
        <MetricCard 
          title="Eficiência da Frota" 
          value="94%" 
          trend="+2%" 
          trendUp={true} 
          icon={CheckCircle2} 
          color="bg-[#3D7700]" 
        />
        <MetricCard 
          title="Volume Entregue (Ton)" 
          value="18.5" 
          trend="+8%" 
          trendUp={true} 
          icon={Package} 
          color="bg-[#FECC14]" 
          iconColor="text-black"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-6">Consumo Registrado via App (Tempo Real)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={consumptionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontWeight: 500 }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Line type="monotone" dataKey="paoForma" name="Pão de Forma" stroke="#FF4F00" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                <Line type="monotone" dataKey="bisnaguinha" name="Bisnaguinha" stroke="#4E18FF" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} />
                <Line type="monotone" dataKey="rap10" name="Rap10" stroke="#F577ED" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-6">Status de Abastecimento por Região (%)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#333', fontSize: 12, fontWeight: 500}} />
                <Tooltip 
                  cursor={{fill: '#f5f5f5'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="abastecido" name="Abastecido" stackId="a" fill="#3D7700" radius={[0, 0, 0, 0]} barSize={24} />
                <Bar dataKey="ruptura" name="Risco de Ruptura" stackId="a" fill="#FF4F00" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-xl font-bold">Alertas Críticos de Ruptura</h3>
          <button className="text-sm font-bold text-[#4E18FF] hover:underline">Ver todos</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Ponto de Venda</th>
                <th className="p-4 font-semibold">Região</th>
                <th className="p-4 font-semibold">Produto Crítico</th>
                <th className="p-4 font-semibold">Estoque Estimado</th>
                <th className="p-4 font-semibold">Ação Recomendada</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium">Supermercado Silva</td>
                <td className="p-4 text-gray-600">Zona Sul</td>
                <td className="p-4"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Pão de Forma Tradicional</span></td>
                <td className="p-4 font-mono text-red-600 font-bold">2 unid. (2h restantes)</td>
                <td className="p-4"><button className="text-xs font-bold bg-black text-white px-3 py-1.5 rounded-lg hover:bg-gray-800">Redirecionar Rota 12</button></td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium">Mercadinho Dois Irmãos</td>
                <td className="p-4 text-gray-600">Zona Leste</td>
                <td className="p-4"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">Bisnaguinha</span></td>
                <td className="p-4 font-mono text-orange-600 font-bold">5 unid. (4h restantes)</td>
                <td className="p-4"><button className="text-xs font-bold bg-black text-white px-3 py-1.5 rounded-lg hover:bg-gray-800">Acionar Frota Flex</button></td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium">Padaria Central</td>
                <td className="p-4 text-gray-600">Centro</td>
                <td className="p-4"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Rap10 Integral</span></td>
                <td className="p-4 font-mono text-yellow-600 font-bold">12 unid. (1 dia)</td>
                <td className="p-4"><button className="text-xs font-bold bg-gray-200 text-black px-3 py-1.5 rounded-lg hover:bg-gray-300">Notificar CD Próximo</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend, trendUp, icon: Icon, color, iconColor = "text-white" }: any) {
  return (
    <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center shadow-sm`}>
          <Icon className={iconColor} size={24} />
        </div>
        <div className={`flex items-center gap-1 text-sm font-bold ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
          {trendUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          {trend}
        </div>
      </div>
      <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-black tracking-tight">{value}</p>
    </div>
  );
}

type PresentationSlide = {
  number: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  layout?: 'hero' | 'canvas' | 'compare' | 'closing';
  bullets?: string[];
};

const canvasBlocks = [
  { title: 'Segmentos de clientes', text: 'Pontos de venda de alto giro, centros de distribuição e áreas internas de logística, comercial e planejamento.', accent: 'bg-[#FF4F00]' },
  { title: 'Proposta de valor', text: 'Abastecimento preditivo com dados em tempo real, redução de ruptura e de desperdício, e eliminação de decisões emergenciais.', accent: 'bg-[#4E18FF]' },
  { title: 'Canais', text: 'Torre de controle logística, integração com ERP e pedidos, painéis operacionais e roteirização inteligente.', accent: 'bg-[#3D7700]' },
  { title: 'Relacionamento', text: 'Gestão por alertas de criticidade, resposta rápida a ocorrências e comunicação integrada entre as áreas.', accent: 'bg-[#FECC14]' },
  { title: 'Fontes de receita', text: 'Aumento de vendas pela menor ruptura, maior disponibilidade de produto e preservação da receita por melhor nível de serviço.', accent: 'bg-[#F577ED]' },
  { title: 'Recursos principais', text: 'Dados em tempo real, torre de controle, analytics, frota flexível e integração entre demanda e abastecimento.', accent: 'bg-black' },
  { title: 'Atividades-chave', text: 'Monitoramento em tempo real, priorização de abastecimento, previsão de demanda e roteirização inteligente.', accent: 'bg-[#FF4F00]' },
  { title: 'Parcerias', text: 'Operadores logísticos, fornecedores de tecnologia e fornecedores integrados de pedidos e visibilidade.', accent: 'bg-[#4E18FF]' },
  { title: 'Estrutura de custos', text: 'Frete emergencial, perdas por ruptura e desperdício no cenário atual; investimento em tecnologia, dados e torre de controle no cenário futuro.', accent: 'bg-[#3D7700]' },
];

const presentationSlides: PresentationSlide[] = [
  {
    number: '01',
    eyebrow: 'Capa',
    title: 'Transformação da Logística: do modelo reativo para o preditivo',
    subtitle: 'Otimização do abastecimento e eficiência operacional',
    layout: 'hero',
  },
  {
    number: '02',
    eyebrow: 'Contexto e Problema',
    title: 'O cenário atual combina urgência, baixa visibilidade e custo alto',
    bullets: [
      'Planejamento reativo e decisões tardias',
      'Falta de integração entre áreas',
      'Baixa visibilidade da operação',
      'Frete emergencial pressionando a margem',
    ],
  },
  {
    number: '03',
    eyebrow: 'Persona',
    title: 'Mariana Souza, Coordenadora Administrativa',
    bullets: [
      'Precisa enxergar a operação em tempo real',
      'Enfrenta dificuldade para alinhar áreas',
      'Tem pressão constante por eficiência e resposta rápida',
    ],
  },
  {
    number: '04',
    eyebrow: 'Insight Estratégico',
    title: 'O problema central não é a logística, e sim a falta de previsibilidade',
    bullets: [
      'Dados dispersos geram decisões tardias',
      'Integração limitada impede priorização correta',
      'A operação reage ao problema em vez de antecipá-lo',
    ],
  },
  {
    number: '05',
    eyebrow: 'Soluções Propostas',
    title: 'Quatro alavancas para migrar do reativo ao preditivo',
    bullets: [
      'Torre de Controle Logística',
      'Priorização por Criticidade',
      'Frota Flexível em modelo híbrido',
      'Previsão de demanda e roteirização inteligente',
    ],
  },
  {
    number: '06',
    eyebrow: 'Conexão com SWOT',
    title: 'As soluções atacam diretamente a fraqueza de requisições de última hora',
    bullets: [
      'Menos improviso e mais antecipação',
      'Resposta estruturada às urgências',
      'Redução da dependência de frete emergencial',
    ],
  },
  {
    number: '07',
    eyebrow: 'Business Model Canvas',
    title: 'Canvas da solução logística preditiva',
    layout: 'canvas',
  },
  {
    number: '08',
    eyebrow: 'Antes vs Depois',
    title: 'A operação passa de reativa para orientada por dados',
    layout: 'compare',
  },
  {
    number: '09',
    eyebrow: 'Impacto Esperado',
    title: 'Resultados tangíveis em custo, serviço e desperdício',
    bullets: [
      'Redução de custos logísticos',
      'Menos desperdício e ruptura',
      'Maior eficiência operacional',
      'Melhor nível de serviço ao cliente',
    ],
  },
  {
    number: '10',
    eyebrow: 'Conclusão',
    title: 'Transformação da operação por meio de dados e integração',
    subtitle: 'A logística deixa de apagar incêndios e passa a antecipar a demanda.',
    layout: 'closing',
  },
];

export function PresentationDeck() {
  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">
      <div className="flex justify-between items-end gap-6 flex-wrap">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#FF4F00]">Apresentação Executiva</p>
          <h1 className="text-4xl font-bold tracking-tight text-black mt-2">Logística preditiva para o Grupo Bimbo</h1>
          <p className="text-gray-500 mt-2 text-lg">Slides prontos para uma narrativa clara, objetiva e profissional.</p>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <div className="px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm">Estilo consultoria estratégica</div>
          <div className="px-4 py-2 rounded-full bg-black text-white shadow-sm">10 slides</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {presentationSlides.map((slide) => (
          <SlideCard slide={slide} />
        ))}
      </div>
    </div>
  );
}

function SlideCard({ slide }: { slide: PresentationSlide }) {
  const base = 'bg-white rounded-[28px] border border-gray-100 shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden';

  if (slide.layout === 'hero') {
    return (
      <section className={`${base} min-h-[420px] p-8 bg-[linear-gradient(135deg,#000000_0%,#111111_55%,#FF4F00_220%)] text-white flex flex-col justify-between`}>
        <div className="flex justify-between items-start gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-orange-300 font-bold">{slide.eyebrow}</p>
            <div className="mt-3 inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-white/10 border border-white/10">
              <Sparkles size={14} />
              Grupo Bimbo
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center font-black text-2xl">B</div>
        </div>

        <div className="max-w-xl space-y-5">
          <h2 className="text-4xl font-black leading-tight tracking-tight">{slide.title}</h2>
          <p className="text-lg text-white/80">{slide.subtitle}</p>
        </div>

        <div className="flex items-center justify-between text-sm text-white/70">
          <span>Modelo reativo vs preditivo</span>
          <span className="inline-flex items-center gap-2 text-white font-medium"><ArrowRight size={16} /> Eficiência operacional</span>
        </div>
      </section>
    );
  }

  if (slide.layout === 'canvas') {
    return (
      <section className={`${base} p-6 xl:col-span-2`}>
        <SlideHeader slide={slide} />
        <p className="text-sm text-gray-500 mb-5 max-w-3xl leading-relaxed">
          O Canvas conecta o problema de ruptura e frete emergencial com a proposta de valor, as atividades operacionais e a geração de receita.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {canvasBlocks.map((block) => (
            <div key={block.title} className="rounded-2xl border border-gray-100 p-4 bg-gray-50/80 min-h-[140px]">
              <div className={`w-10 h-10 rounded-xl ${block.accent} text-white flex items-center justify-center font-bold mb-3`}>
                <Boxes size={18} />
              </div>
              <h3 className="font-bold text-base leading-tight">{block.title}</h3>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">{block.text}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (slide.layout === 'compare') {
    return (
      <section className={`${base} p-6 xl:col-span-2`}>
        <SlideHeader slide={slide} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-red-50 border border-red-100 p-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold">REATIVO</div>
            <div className="mt-4 space-y-3 text-sm text-gray-700">
              <Row icon={Clock3} text="Decisões tardias e urgências constantes" />
              <Row icon={Network} text="Falta de dados integrados" />
              <Row icon={Truck} text="Custos altos com frete emergencial" />
            </div>
          </div>
          <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold">PREDITIVO</div>
            <div className="mt-4 space-y-3 text-sm text-gray-700">
              <Row icon={Target} text="Antecipação por demanda e criticidade" />
              <Row icon={BarChart3} text="Dados em tempo real para decisão" />
              <Row icon={ShieldCheck} text="Eficiência com melhor nível de serviço" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (slide.layout === 'closing') {
    return (
      <section className={`${base} min-h-[320px] p-8 bg-black text-white xl:col-span-2 flex flex-col justify-between`}>
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-orange-300 font-bold">{slide.eyebrow}</p>
          <h2 className="text-4xl font-black tracking-tight mt-3 max-w-2xl">{slide.title}</h2>
        </div>
        <p className="text-lg text-white/75 max-w-2xl">{slide.subtitle}</p>
      </section>
    );
  }

  return (
    <section className={`${base} p-6`}>
      <SlideHeader slide={slide} />
      <ul className="space-y-3">
        {slide.bullets?.map((bullet: string) => (
          <li key={bullet} className="flex items-start gap-3 text-gray-700">
            <span className="mt-2 h-2 w-2 rounded-full bg-[#FF4F00] shrink-0" />
            <span className="text-base leading-relaxed">{bullet}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SlideHeader({ slide }: { slide: any }) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-[#FF4F00] font-bold">{slide.eyebrow}</p>
        <h2 className="text-2xl font-black tracking-tight mt-2 text-black">{slide.title}</h2>
      </div>
      <div className="text-right shrink-0">
        <div className="text-xs font-bold text-gray-400">Slide</div>
        <div className="text-2xl font-black text-black">{slide.number}</div>
      </div>
    </div>
  );
}

function Row({ icon: Icon, text }: { icon: any; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={16} className="mt-1 text-gray-500 shrink-0" />
      <p>{text}</p>
    </div>
  );
}
