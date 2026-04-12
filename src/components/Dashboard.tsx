import { useEffect, useMemo, useState, type ComponentType } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Truck, TrendingUp, TrendingDown, ArrowRight, BarChart3, Boxes, Clock3, Network, ShieldCheck, Sparkles, Target, Users, Bell, ArrowUpRight, ArrowUp, Route, PackageCheck, LineChart as LineChartIcon, Eye, Brain, Zap, CheckCircle2 } from 'lucide-react';
import jsPDF from 'jspdf';

const consumptionData = [
  { time: '08:00', paoForma: 120, bisnaguinha: 80, rap10: 40 },
  { time: '10:00', paoForma: 250, bisnaguinha: 150, rap10: 90 },
  { time: '12:00', paoForma: 380, bisnaguinha: 210, rap10: 160 },
  { time: '14:00', paoForma: 420, bisnaguinha: 290, rap10: 220 },
  { time: '16:00', paoForma: 550, bisnaguinha: 380, rap10: 310 },
  { time: '18:00', paoForma: 680, bisnaguinha: 450, rap10: 400 },
];

type Severity = 'critical' | 'attention' | 'normal';

type RegionRow = {
  name: string;
  abastecido: number;
  ruptura: number;
  severity: Severity;
  trend: string;
  insight: string;
  action: string;
};

const regionData: RegionRow[] = [
  { name: 'Zona Sul', abastecido: 85, ruptura: 15, severity: 'critical', trend: 'Risco em 3h', insight: '+15% de demanda', action: 'Redirecionar rota 12' },
  { name: 'Zona Norte', abastecido: 92, ruptura: 8, severity: 'normal', trend: 'Estável', insight: 'Estoque equilibrado', action: 'Monitorar' },
  { name: 'Zona Leste', abastecido: 78, ruptura: 22, severity: 'critical', trend: 'Risco em 4h', insight: 'Demanda +12%', action: 'Acionar frota flex' },
  { name: 'Zona Oeste', abastecido: 88, ruptura: 12, severity: 'attention', trend: 'Monitorar', insight: 'Tendência de queda', action: 'Revisar previsão' },
  { name: 'Centro', abastecido: 95, ruptura: 5, severity: 'normal', trend: 'Estável', insight: 'Operação controlada', action: 'Sem ação' },
];

const kpiData = [
  { title: 'Eficiência da frota', value: '94%', meta: '97%', delta: '+2%', trendUp: true, note: '2 p.p. abaixo da meta', severity: 'attention', signal: 'Meta em recuperação' },
  { title: 'Ruptura', value: '28 PDVs', meta: '<10', delta: '-5%', trendUp: false, note: 'Acima do limite desejado', severity: 'critical', signal: 'Risco alto' },
  { title: 'Volume entregue', value: '18.5 ton', meta: '20 ton', delta: '+8%', trendUp: true, note: 'Próximo da meta', severity: 'attention', signal: 'Tendência positiva' },
  { title: 'Nível de serviço', value: '96%', meta: '>98%', delta: '+1%', trendUp: true, note: 'Estável, mas com margem', severity: 'normal', signal: 'Operação estável' },
];

const predictiveSignals = [
  { label: 'Risco de ruptura', value: 'em 4h', tone: 'critical' },
  { label: 'Demanda', value: '+12% em 3h', tone: 'attention' },
  { label: 'Estoque', value: 'tendência de queda', tone: 'normal' },
];

type NavigationStep = {
  id: string;
  label: string;
  title: string;
  icon: ComponentType<{ size?: number; className?: string }>;
};

const navigationSteps: NavigationStep[] = [
  { id: 'kpis', label: 'Visualizar', title: 'Visão geral da operação', icon: Eye },
  { id: 'graficos', label: 'Entender', title: 'Análise de tendências', icon: BarChart3 },
  { id: 'acoes', label: 'Decidir', title: 'Ações recomendadas', icon: Brain },
  { id: 'prioridades', label: 'Agir', title: 'Execução priorizada', icon: Zap },
  { id: 'insights', label: 'Validar', title: 'Monitoramento e insights', icon: CheckCircle2 },
];

const lastUpdatedLabel = 'há 8 min';

type RecommendationItem = {
  title: string;
  action: string;
  detail: string;
  impact: string;
  targetTab: string;
  targetKey?: string;
  section?: string;
  step?: number;
  icon: ComponentType<{ size?: number; className?: string }>;
};

const recommendations: RecommendationItem[] = [
  {
    title: 'PDV Zona Sul com risco de ruptura em 3h',
    action: 'Redirecionar rota 12',
    detail: 'Cobertura baixa e consumo acelerando pedem ação imediata.',
    impact: '↓ ruptura em até 30%',
    targetTab: 'routes',
    targetKey: 'RT-1042',
    icon: Route,
  },
  {
    title: 'Estoque elevado na Zona Leste',
    action: 'Gerar pedido automático',
    detail: 'Converter excesso de leitura em pedido e revisão imediata da previsão.',
    impact: '↓ excesso em 20%',
    targetTab: 'pos-app',
    step: 2,
    icon: PackageCheck,
  },
  {
    title: 'Atraso na entrega identificado',
    action: 'Notificar cliente automaticamente',
    detail: 'Reduz atrito e mantém o PDV informado enquanto a rota é ajustada.',
    impact: '↓ chamadas manuais em 40%',
    targetTab: 'alerts',
    targetKey: 'Supermercado Silva',
    icon: Bell,
  },
  {
    title: 'Demanda subindo acima da previsão',
    action: 'Ajustar previsão',
    detail: 'Atualizar leitura de consumo para evitar reação tardia.',
    impact: '↑ acurácia da previsão',
    targetTab: 'dashboard',
    section: 'insights',
    icon: LineChartIcon,
  },
];

const automaticInsights = [
  { title: 'Aumento de demanda na região Sul (+15%) eleva risco de ruptura nas próximas horas', tone: 'critical' },
  { title: 'Zona Norte opera com excesso de estoque e saída abaixo do esperado', tone: 'attention' },
  { title: 'Produtos de alto giro concentram o maior risco operacional no momento', tone: 'critical' },
];

const alertRows = [
  { store: 'Supermercado Silva', region: 'Zona Sul', product: 'Pão de Forma Tradicional', stock: '2 unid. (2h)', severity: 'critical', action: 'Redirecionar rota 12', targetTab: 'routes', targetKey: 'RT-1042' },
  { store: 'Mercadinho Dois Irmãos', region: 'Zona Leste', product: 'Bisnaguinha', stock: '5 unid. (4h)', severity: 'attention', action: 'Acionar frota flex', targetTab: 'routes', targetKey: 'RT-1043' },
  { store: 'Padaria Central', region: 'Centro', product: 'Rap10 Integral', stock: '12 unid. (1 dia)', severity: 'normal', action: 'Notificar PDV', targetTab: 'alerts', targetKey: 'Padaria Central' },
];

type ActionFocus = {
  tab: string;
  section?: string;
  key?: string;
  step?: number;
};

type DashboardProps = {
  focusAction?: ActionFocus | null;
  onAction: (tab: string, focus?: Omit<ActionFocus, 'tab'>) => void;
};

const rankedRegions = [...regionData].sort((a, b) => b.ruptura - a.ruptura);

const decisionRules = [
  {
    title: 'Cobertura abaixo de 80%',
    text: 'Antecipar entrega e acionar frota flex para evitar ruptura nas próximas horas.',
  },
  {
    title: 'Ruptura acima de 15%',
    text: 'Priorizar a região na fila da torre e comunicar o centro de distribuição mais próximo.',
  },
  {
    title: 'Consumo em alta contínua',
    text: 'Revisar reposição e ajustar a rota antes que o estoque crítico esgote.',
  },
];

export function Dashboard({ focusAction, onAction }: DashboardProps) {
  const [activeSection, setActiveSection] = useState('kpis');
  const [showBackToTop, setShowBackToTop] = useState(false);

  const activeStepIndex = useMemo(() => navigationSteps.findIndex((step) => step.id === activeSection), [activeSection]);

  useEffect(() => {
    if (focusAction?.tab !== 'dashboard' || !focusAction.section) return;
    setActiveSection(focusAction.section);
    document.getElementById(focusAction.section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [focusAction]);

  useEffect(() => {
    const sections = navigationSteps
      .map((step) => document.getElementById(step.id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveSection(visible.target.id);
        }
      },
      {
        root: null,
        rootMargin: '-15% 0px -60% 0px',
        threshold: [0.15, 0.3, 0.5, 0.7],
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 420);

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goToSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const goToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveSection('kpis');
  };

  const handleExportReport = () => {
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 16;
    const contentWidth = pageWidth - margin * 2;

    const addSectionTitle = (title: string, y: number) => {
      doc.setFillColor(255, 79, 0);
      doc.roundedRect(margin, y, 42, 8, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(title.toUpperCase(), margin + 3, y + 5.5);
      doc.setTextColor(0, 0, 0);
    };

    const addWrappedText = (text: string, x: number, y: number, width: number, fontSize = 10) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(fontSize);
      const lines = doc.splitTextToSize(text, width);
      doc.text(lines, x, y);
      return y + lines.length * (fontSize * 0.5 + 2);
    };

    const addMetricBox = (x: number, y: number, w: number, h: number, label: string, value: string, detail: string) => {
      doc.setDrawColor(230, 230, 230);
      doc.setFillColor(250, 250, 250);
      doc.roundedRect(x, y, w, h, 3, 3, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text(label, x + 4, y + 6);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.text(value, x + 4, y + 15);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(90, 90, 90);
      doc.text(detail, x + 4, y + 21);
    };

    doc.setFillColor(0, 0, 0);
    doc.rect(0, 0, pageWidth, 34, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('Torre de Controle Logística', margin, 14);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Relatório fictício de visão geral da operação', margin, 22);
    doc.setFontSize(9);
    doc.text('Período de referência: 06/04/2026 | Status: consolidado para diretoria', margin, 29);

    let y = 44;
    addSectionTitle('Resumo Executivo', y);
    y += 14;
    y = addWrappedText(
      'A operação está estável no consolidado, mas o risco se concentra na Zona Leste e na Zona Sul. A recomendação é agir nas próximas 2 horas com redirecionamento de rota, frota flex e comunicação direta com os CDs próximos.',
      margin,
      y,
      contentWidth,
      10,
    ) + 4;

    addSectionTitle('Indicadores-Chave', y);
    y += 12;
    const boxW = (contentWidth - 8) / 2;
    addMetricBox(margin, y, boxW, 28, 'Entregas em andamento', '142', '+12% vs. período anterior');
    addMetricBox(margin + boxW + 8, y, boxW, 28, 'Eficiência da frota', '94%', '+2% de melhoria');
    y += 34;
    addMetricBox(margin, y, boxW, 28, 'Risco de ruptura', '28', '-5% no acumulado');
    addMetricBox(margin + boxW + 8, y, boxW, 28, 'Volume entregue', '18.5 ton', '+8% de crescimento');
    y += 38;

    addSectionTitle('Leitura Operacional', y);
    y += 13;
    y = addWrappedText(
      'O quadro operacional mostra pressão de demanda ao longo do dia, com o Centro e a Zona Norte mais protegidos e a Zona Leste em condição crítica. O apoio à decisão prioriza a região mais exposta, recomenda ação imediata e orienta o time sobre o que fazer primeiro.',
      margin,
      y,
      contentWidth,
      10,
    ) + 4;

    addSectionTitle('Alertas Críticos', y);
    y += 12;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    const alerts = [
      ['Supermercado Silva', 'Zona Sul', 'Pão de Forma Tradicional', '2 unid. | 2h restantes', 'Redirecionar Rota 12'],
      ['Mercadinho Dois Irmãos', 'Zona Leste', 'Bisnaguinha', '5 unid. | 4h restantes', 'Acionar Frota Flex'],
      ['Padaria Central', 'Centro', 'Rap10 Integral', '12 unid. | 1 dia', 'Notificar CD Próximo'],
    ];
    const colWidths = [42, 28, 42, 34, 40];
    const starts = [margin, margin + 42, margin + 70, margin + 112, margin + 146];
    doc.setFillColor(245, 245, 245);
    doc.rect(margin, y, contentWidth, 8, 'F');
    ['PDV', 'Região', 'Produto', 'Estoque', 'Ação'].forEach((header, idx) => doc.text(header, starts[idx] + 2, y + 5.5));
    y += 10;
    doc.setFont('helvetica', 'normal');
    alerts.forEach((row, rowIndex) => {
      const rowY = y + rowIndex * 10;
      if (rowIndex % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(margin, rowY - 3, contentWidth, 9, 'F');
      }
      row.forEach((cell, idx) => {
        const text = doc.splitTextToSize(String(cell), colWidths[idx] - 4);
        doc.text(text, starts[idx] + 2, rowY + 3);
      });
    });

    doc.save('torre-de-controle-relatorio.pdf');
  };

  return (
    <div className="p-8 max-w-[1480px] mx-auto space-y-6">
      <div className="flex justify-between items-end gap-6 flex-wrap">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black text-white text-xs font-bold uppercase tracking-[0.28em] mb-4">
            Torre de controle executiva
          </div>
          <h1 className="text-4xl font-black tracking-tight text-black">Visão Geral da Operação</h1>
          <p className="text-gray-500 mt-2 text-lg max-w-2xl">Monitoramento, decisão e execução em uma única leitura.</p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="px-4 py-2 rounded-full bg-white border border-gray-200 text-xs font-bold uppercase tracking-wider text-gray-500 shadow-sm">
            Última atualização: {lastUpdatedLabel}
          </div>
          <div className="flex gap-3">
          <button onClick={handleExportReport} className="bg-white border border-gray-200 px-4 py-2 rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors shadow-sm">
            Exportar Relatório
          </button>
          <button className="bg-[#FF4F00] text-black px-4 py-2 rounded-xl font-bold text-sm hover:bg-[#e64700] transition-colors shadow-[0_4px_14px_0_rgba(255,79,0,0.39)]">
            Atualizar Dados
          </button>
          </div>
        </div>
      </div>

      <section className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-4 md:p-5">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#FF4F00]">Fluxo de decisão</p>
            <h2 className="text-xl font-black tracking-tight mt-2">Navegação guiada pela leitura da torre</h2>
          </div>
          <div className="text-sm font-medium text-gray-500">
            Etapa {activeStepIndex + 1} de {navigationSteps.length}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {navigationSteps.map((step, index) => {
            const Icon = step.icon;
            const isActive = activeSection === step.id;

            return (
              <button
                key={step.id}
                onClick={() => goToSection(step.id)}
                className={`text-left rounded-2xl border p-4 transition-all duration-200 ${isActive ? 'bg-black text-white border-black shadow-lg shadow-black/10 scale-[1.01]' : 'bg-white border-gray-100 hover:border-gray-300 hover:-translate-y-0.5'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${isActive ? 'text-white/60' : 'text-gray-400'}`}>0{index + 1}</p>
                    <h3 className="mt-2 font-black text-base leading-tight">{step.title}</h3>
                    <p className={`text-sm mt-1 ${isActive ? 'text-white/75' : 'text-gray-500'}`}>{step.label}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isActive ? 'bg-white text-black' : 'bg-gray-100 text-gray-600'}`}>
                    <Icon size={18} />
                  </div>
                </div>
                <div className="mt-4 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${isActive ? 'bg-[#FECC14] w-full' : 'bg-gray-300 w-1/3'}`} />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <div id="kpis" className="scroll-mt-6 bg-white rounded-[24px] shadow-sm border border-gray-100 p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#FF4F00]">Leitura executiva</p>
            <h2 className="text-2xl font-black tracking-tight mt-2">O que a operação está dizendo agora</h2>
            <p className="text-gray-500 mt-2 max-w-2xl">Interpretação curta para abrir a apresentação: onde está o risco, o que fazer e o que muda na operação.</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider">
            {predictiveSignals.map((signal) => (
              <span key={signal.label} className={`px-3 py-1.5 rounded-full ${signal.tone === 'critical' ? 'bg-red-100 text-red-800' : signal.tone === 'attention' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                {signal.label}: {signal.value}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {kpiData.map((kpi) => (
            <KpiCard key={kpi.title} {...kpi} />
          ))}
        </div>
      </div>

      <div id="graficos" className="scroll-mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <h3 className="text-xl font-bold">Evolução de consumo</h3>
              <p className="text-sm text-gray-500 mt-1">Tendência de crescimento de demanda ao longo do dia.</p>
            </div>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-yellow-100 text-yellow-800">Entendimento</span>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={consumptionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} dx={-10} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} itemStyle={{ fontWeight: 500 }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Line type="monotone" dataKey="paoForma" name="Pão de Forma" stroke="#FF4F00" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="bisnaguinha" name="Bisnaguinha" stroke="#4E18FF" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
                <Line type="monotone" dataKey="rap10" name="Rap10" stroke="#F577ED" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <h3 className="text-xl font-bold">Status por região</h3>
              <p className="text-sm text-gray-500 mt-1">Cobertura e risco para localizar os pontos sensíveis.</p>
            </div>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-yellow-100 text-yellow-800">Entendimento</span>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#333', fontSize: 12, fontWeight: 500 }} />
                <Tooltip cursor={{ fill: '#f5f5f5' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="abastecido" name="Abastecido" stackId="a" fill="#3D7700" radius={[0, 0, 0, 0]} barSize={24} />
                <Bar dataKey="ruptura" name="Risco de Ruptura" stackId="a" fill="#FF4F00" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <section id="acoes" className={`scroll-mt-6 bg-white rounded-[24px] shadow-sm border p-6 space-y-6 ${focusAction?.section === 'acoes' ? 'border-[#FF4F00] ring-2 ring-[#FF4F00]/20' : 'border-gray-100'}`}>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#FF4F00]">Ações recomendadas</p>
            <h2 className="text-2xl font-black tracking-tight mt-2">Transformar dados em decisão prática</h2>
            <p className="text-gray-500 mt-2 max-w-3xl">Ações recomendadas com base em dados em tempo real.</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider">
            <span className="px-3 py-1.5 rounded-full bg-black text-white">Prioridade máxima</span>
            <span className="px-3 py-1.5 rounded-full bg-[#FECC14] text-black">Ação imediata</span>
            <span className="px-3 py-1.5 rounded-full bg-[#3D7700] text-white">Apoio à decisão</span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {recommendations.map((item) => (
            <RecommendationCard
              key={item.title}
              title={item.title}
              action={item.action}
              detail={item.detail}
              impact={item.impact}
              icon={item.icon}
              onExecute={() => onAction(item.targetTab, { key: item.targetKey, section: item.section, step: item.step })}
            />
          ))}
        </div>
      </section>

      <div id="prioridades" className="scroll-mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-[20px] border border-gray-100 bg-gray-50/80 p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h3 className="text-lg font-bold">Fila de prioridades</h3>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Alta / Média / Baixa</span>
          </div>
          <div className="space-y-3">
            {rankedRegions.slice(0, 3).map((region, index) => {
              const severityClasses = getSeverityClasses(region.severity);
              const urgency = index === 0 ? 'Alta' : index === 1 ? 'Média' : 'Baixa';

              return (
                <div key={region.name} className={`flex items-start justify-between gap-4 rounded-2xl border p-4 ${region.severity === 'critical' ? 'border-red-200 bg-red-50' : region.severity === 'attention' ? 'border-yellow-200 bg-yellow-50' : 'border-green-100 bg-white'}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black ${severityClasses.badge}`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-bold text-black">{region.name}</p>
                      <p className="text-sm text-gray-500 mt-1">{region.abastecido}% abastecido | {region.ruptura}% em risco | {region.trend}</p>
                      <p className="text-xs text-gray-500 mt-1">{region.insight}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase ${severityClasses.pill}`}>{urgency}</span>
                    <span className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black text-white">{region.action}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

          <div className="rounded-[20px] border border-gray-100 bg-white p-5">
            <h3 className="text-lg font-bold mb-4">Tabela detalhada de alertas</h3>
            <p className="text-sm text-gray-500 mb-4">Detalhe operacional para validar as decisões e acionar a execução rapidamente.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-3 font-semibold">Ponto de Venda</th>
                  <th className="p-3 font-semibold">Região</th>
                  <th className="p-3 font-semibold">Produto Crítico</th>
                  <th className="p-3 font-semibold">Estoque</th>
                  <th className="p-3 font-semibold">Prioridade</th>
                  <th className="p-3 font-semibold">Ação Rápida</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {alertRows.map((row) => {
                  const severityClasses = getSeverityClasses(row.severity as Severity);
                  const isCritical = row.severity === 'critical';

                  return (
                    <tr key={row.store} className={`${isCritical ? 'bg-red-50' : 'hover:bg-gray-50'} transition-colors`}>
                      <td className="p-3 font-medium">{row.store}</td>
                      <td className="p-3 text-gray-600">{row.region}</td>
                      <td className="p-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${severityClasses.badge}`}>{row.product}</span>
                      </td>
                      <td className="p-3 font-mono font-bold text-gray-700">{row.stock}</td>
                      <td className="p-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${severityClasses.pill}`}>{row.severity === 'critical' ? 'Crítico' : row.severity === 'attention' ? 'Atenção' : 'Normal'}</span>
                      </td>
                      <td className="p-3">
                        <button onClick={() => onAction(row.targetTab, { key: row.targetKey })} className="text-xs font-bold bg-black text-white px-3 py-1.5 rounded-lg hover:bg-gray-800">
                          {row.action}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <section id="insights" className={`scroll-mt-6 rounded-[20px] border bg-white p-5 ${focusAction?.section === 'insights' ? 'border-[#FF4F00] ring-2 ring-[#FF4F00]/20' : 'border-gray-100'}`}>
        <div className="flex items-center justify-between gap-3 mb-4">
          <h3 className="text-lg font-bold">Insights automáticos</h3>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Interpretação final do cenário</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {automaticInsights.map((item) => (
            <div key={item.title} className="rounded-2xl border border-gray-100 p-4 bg-gray-50/70">
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shrink-0 ${item.tone === 'critical' ? 'bg-red-600 text-white' : item.tone === 'attention' ? 'bg-yellow-500 text-black' : 'bg-black text-white'}`}>
                  <ArrowUpRight size={14} />
                </div>
                <div>
                  <p className="font-bold text-black leading-snug">{item.title}</p>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">Análise executiva para explicar o cenário após visualização, decisão e execução.</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {showBackToTop && (
        <button
          onClick={goToTop}
          className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-black px-4 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(0,0,0,0.25)] transition-all hover:bg-gray-800"
        >
          <ArrowUp size={16} />
          Voltar ao topo
        </button>
      )}

    </div>
  );
}

function getSeverityClasses(severity: Severity) {
  if (severity === 'critical') return { badge: 'bg-red-100 text-red-700', pill: 'bg-red-100 text-red-800' };
  if (severity === 'attention') return { badge: 'bg-yellow-100 text-yellow-800', pill: 'bg-yellow-100 text-yellow-800' };
  return { badge: 'bg-green-100 text-green-800', pill: 'bg-green-100 text-green-800' };
}

function KpiCard({ title, value, meta, delta, trendUp, note, severity, signal }: any) {
  const classes = getSeverityClasses(severity);

  return (
    <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-gray-400">Meta vs real</p>
          <h3 className="text-gray-500 text-sm font-medium mt-2">{title}</h3>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${classes.pill}`}>{signal}</span>
      </div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-3xl font-black tracking-tight">{value}</p>
          <p className="text-sm text-gray-500 mt-1">Meta: {meta}</p>
        </div>
        <div className={`flex items-center gap-1 text-sm font-bold ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
          {trendUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          {delta}
        </div>
      </div>
      <div className={`rounded-2xl px-3 py-2 text-sm font-medium ${classes.badge}`}>
        {note}
      </div>
    </div>
  );
}

function RecommendationCard({ title, action, detail, impact, icon: Icon, onExecute }: any) {
  return (
    <article className="rounded-[22px] border border-gray-100 bg-gray-50/70 p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FF4F00]">Recomendação</p>
          <h3 className="text-lg font-black tracking-tight mt-2 leading-snug">{title}</h3>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-black text-white flex items-center justify-center shrink-0">
          <Icon size={20} />
        </div>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{detail}</p>
      <div className="rounded-2xl bg-white px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-500">Impacto estimado: {impact}</div>
      <button onClick={onExecute} className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-800">
        {action} <ArrowUpRight size={16} />
      </button>
    </article>
  );
}

function DecisionCard({ title, icon: Icon, tone, badge, primary, secondary, footer }: any) {
  return (
    <article className={`rounded-[22px] p-5 shadow-sm border border-gray-100 ${tone}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70">{badge}</p>
          <h3 className="text-xl font-black tracking-tight mt-2">{title}</h3>
        </div>
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${tone.includes('white') ? 'bg-white text-black' : 'bg-black text-white'}`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="mt-5 space-y-2">
        <p className="text-base font-bold">{primary}</p>
        <p className={`text-sm leading-relaxed ${tone.includes('white') ? 'text-white/75' : 'text-black/75'}`}>{secondary}</p>
      </div>
      <div className="mt-5 pt-4 border-t border-white/10 text-sm font-medium opacity-90">
        {footer}
      </div>
    </article>
  );
}

type PresentationSlide = {
  number: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  layout?: 'hero' | 'flow' | 'canvas' | 'compare' | 'closing';
  bullets?: string[];
  paragraphs?: string[];
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
    eyebrow: 'Como a solução funciona',
    title: 'A operação integra dados e transforma sinais em decisão e ação',
    layout: 'flow',
  },
  {
    number: '08',
    eyebrow: 'Business Model Canvas',
    title: 'Canvas da solução logística preditiva',
    layout: 'canvas',
  },
  {
    number: '09',
    eyebrow: 'Antes vs Depois',
    title: 'A operação passa de reativa para orientada por dados',
    layout: 'compare',
  },
  {
    number: '10',
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
    number: '11',
    eyebrow: 'Conclusão',
    title: 'Da reação à antecipação',
    paragraphs: [
      'Os principais desafios estão na falta de integração, visibilidade e previsibilidade da operação, e não apenas na execução logística.',
      'A solução transforma o modelo reativo em preditivo, com dados em tempo real, integração entre áreas, previsão de demanda, roteirização inteligente e gestão ativa de exceções.',
      'O impacto é claro: redução de custos logísticos, menos desperdício e ruptura, mais eficiência operacional e melhor nível de serviço.',
    ],
    subtitle: 'A logística deixa de reagir ao problema e passa a antecipar o futuro.',
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
          <div className="px-4 py-2 rounded-full bg-black text-white shadow-sm">{presentationSlides.length} slides</div>
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

  if (slide.layout === 'flow') {
    return (
      <section className={`${base} p-6 xl:col-span-2`}>
        <SlideHeader slide={slide} />
        <p className="text-sm text-gray-500 mb-5 max-w-3xl leading-relaxed">
          Os dados circulam em tempo real, são consolidados na torre de controle e viram alertas, decisão e execução operacional.
        </p>

        <div className="rounded-[24px] bg-gray-50 border border-gray-100 p-5 overflow-x-auto">
          <div className="min-w-[980px] flex items-center gap-3">
            <FlowNode label="Vendas / PDV" tone="bg-[#FF4F00] text-white" />
            <FlowArrow />
            <FlowNode label="Estoque" tone="bg-white text-black border border-gray-200" />
            <FlowArrow />
            <FlowNode label="Logística" tone="bg-white text-black border border-gray-200" />
            <FlowArrow />
            <FlowNode label="Integração de dados" tone="bg-[#4E18FF] text-white" />
            <FlowArrow />
            <FlowNode label="Torre de controle" tone="bg-black text-white" />
            <FlowArrow />
            <FlowNode label="Alertas" tone="bg-white text-black border border-gray-200" />
            <FlowArrow />
            <FlowNode label="Decisão" tone="bg-white text-black border border-gray-200" />
            <FlowArrow />
            <FlowNode label="Ação operacional" tone="bg-[#3D7700] text-white" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          <div className="rounded-2xl bg-white border border-gray-100 p-5">
            <h3 className="font-bold text-base mb-3">Como funciona</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Os dados são integrados em tempo real e convertidos em decisões operacionais automáticas ou assistidas pela equipe.
            </p>
          </div>
          <div className="rounded-2xl bg-white border border-gray-100 p-5">
            <h3 className="font-bold text-base mb-3">Exemplos de ação</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-[#FF4F00] shrink-0" />Ruptura iminente → priorização de entrega</li>
              <li className="flex items-start gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-[#FF4F00] shrink-0" />Atraso → replanejamento de rota</li>
              <li className="flex items-start gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-[#FF4F00] shrink-0" />Excesso → redistribuição ou ação comercial</li>
            </ul>
          </div>
        </div>

        <div className="mt-5 rounded-2xl bg-black text-white p-5">
          <p className="text-lg font-bold">A operação deixa de reagir e passa a antecipar.</p>
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
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-orange-300 font-bold">{slide.eyebrow}</p>
              <h2 className="text-4xl font-black tracking-tight mt-3 max-w-2xl">{slide.title}</h2>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xs font-bold text-white/50">Slide</div>
              <div className="text-2xl font-black text-white">{slide.number}</div>
            </div>
          </div>
          <div className="mt-6 space-y-4 max-w-3xl text-sm text-white/78 leading-relaxed">
            {slide.paragraphs?.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <p className="text-lg font-semibold text-white max-w-2xl">{slide.subtitle}</p>
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

function FlowNode({ label, tone }: { label: string; tone: string }) {
  return (
    <div className={`px-4 py-3 rounded-2xl text-sm font-bold whitespace-nowrap ${tone}`}>
      {label}
    </div>
  );
}

function FlowArrow() {
  return <div className="text-2xl font-black text-gray-300 shrink-0">→</div>;
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

type ClassicCanvasBlock = {
  title: string;
  items: string[];
  tone: string;
  icon: ComponentType<{ size?: number; className?: string }>;
};

const classicCanvasBlocks: ClassicCanvasBlock[] = [
  {
    title: 'Parcerias Principais',
    tone: 'bg-[#4E18FF] text-white',
    icon: Users,
    items: [
      'Operadores logísticos para frota flexível',
      'Fornecedores de tecnologia, dados e analytics',
      'Fornecedores com integração de pedidos e visibilidade da cadeia',
    ],
  },
  {
    title: 'Atividades-Chave',
    tone: 'bg-white text-black border border-gray-200',
    icon: BarChart3,
    items: [
      'Integração de dados entre áreas e sistemas',
      'Monitoramento em tempo real pela torre de controle',
      'Análise de KPIs, previsão de demanda e gestão de exceções',
    ],
  },
  {
    title: 'Recursos Principais',
    tone: 'bg-[#3D7700] text-white',
    icon: Boxes,
    items: [
      'Sistemas de dados integrados',
      'Base de dados centralizada e sistemas de BI',
      'Dashboards operacionais e frota própria e de parceiros',
    ],
  },
  {
    title: 'Relacionamento',
    tone: 'bg-white text-black border border-gray-200',
    icon: ShieldCheck,
    items: [
      'Suporte em tempo real para a operação interna',
      'Alertas automatizados e tomada de decisão assistida por dados',
      'Uso contínuo via dashboard com acompanhamento de KPIs',
    ],
  },
  {
    title: 'Proposta de Valor',
    tone: 'bg-[linear-gradient(135deg,#000000_0%,#111111_55%,#FF4F00_220%)] text-white',
    icon: Target,
    items: [
      'Visibilidade em tempo real para a Mariana decidir com segurança',
      'Redução de ruptura, desperdício e decisões emergenciais',
      'Melhora do nível de serviço, da taxa de ruptura e da eficiência logística',
    ],
  },
  {
    title: 'Canais',
    tone: 'bg-white text-black border border-gray-200',
    icon: Network,
    items: [
      'Dashboards em Power BI e torre de controle logística',
      'Integração com ERP e CRM para consolidar demanda e abastecimento',
      'Alertas via push e e-mail com acesso a KPIs em tempo real',
    ],
  },
  {
    title: 'Segmentos de Clientes',
    tone: 'bg-white text-black border border-gray-200',
    icon: Users,
    items: [
      'Pontos de venda de alto giro com risco recorrente de ruptura',
      'Centros de distribuição e unidades de apoio logístico',
      'Áreas internas de logística, comercial e planejamento, com Mariana como usuária decisora',
    ],
  },
  {
    title: 'Estrutura de Custos',
    tone: 'bg-white text-black border border-gray-200',
    icon: Truck,
    items: [
      'Frete emergencial no cenário atual',
      'Investimento em tecnologia e integração',
      'Custos operacionais e logísticos da solução com foco em redução futura',
    ],
  },
  {
    title: 'Fontes de Receita',
    tone: 'bg-[#F577ED] text-black',
    icon: ArrowRight,
    items: [
      'Aumento de vendas pela redução de ruptura',
      'Maior disponibilidade de produtos nos PDVs',
      'Impacto direto na receita e redução de perdas operacionais',
    ],
  },
];

export function Canvas() {
  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">
      <div className="flex justify-between items-end gap-6 flex-wrap">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#FF4F00]">Business Model Canvas</p>
          <h1 className="text-4xl font-bold tracking-tight text-black mt-2">Canvas da solução logística preditiva</h1>
          <p className="text-gray-500 mt-2 text-lg max-w-3xl">
            Canvas centrado na Mariana Souza, com foco em KPIs, visibilidade operacional e tomada de decisão orientada por dados.
          </p>
        </div>
        <div className="px-4 py-2 rounded-full bg-black text-white text-sm font-medium shadow-sm">
          Modelo 3x3 executivo
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <CanvasCard block={classicCanvasBlocks[0]} />
        <CanvasCard block={classicCanvasBlocks[1]} />
        <CanvasCard block={classicCanvasBlocks[2]} />

        <CanvasCard block={classicCanvasBlocks[3]} />
        <div className="rounded-[28px] bg-white border border-gray-200 shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-6 flex flex-col justify-between min-h-[320px]">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#FF4F00] font-bold">Centro do Canvas</p>
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black text-white text-xs font-semibold">
              <Target size={14} />
              Proposta de Valor
            </div>
            <h2 className="text-3xl font-black tracking-tight mt-4">Abastecimento preditivo com dados em tempo real</h2>
            <p className="text-gray-600 mt-4 leading-relaxed">
              A solução conecta dados, previsão e execução para antecipar rupturas, reduzir desperdícios e transformar exceções em ação operacional.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 text-sm">
            <MiniMetric label="Ruptura" value="Menor" />
            <MiniMetric label="Eficiência" value="Maior" />
            <MiniMetric label="Serviço" value="Melhor" />
          </div>
        </div>
        <CanvasCard block={classicCanvasBlocks[5]} />

        <CanvasCard block={classicCanvasBlocks[6]} />
        <CanvasCard block={classicCanvasBlocks[7]} />
        <CanvasCard block={classicCanvasBlocks[8]} />
      </div>
    </div>
  );
}

function CanvasCard({ block }: { block: ClassicCanvasBlock }) {
  const Icon = block.icon;

  return (
    <section className={`rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-6 min-h-[320px] ${block.tone}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] opacity-70 font-bold">Bloco</p>
          <h2 className="text-2xl font-black tracking-tight mt-2 leading-tight">{block.title}</h2>
        </div>
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${block.tone.includes('white') ? 'bg-black text-white' : 'bg-white text-black'}`}>
          <Icon size={20} />
        </div>
      </div>

      <ul className="mt-5 space-y-3 text-sm leading-relaxed">
        {block.items.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span className={`mt-2 h-2 w-2 rounded-full ${block.tone.includes('white') ? 'bg-[#FF4F00]' : 'bg-current'} shrink-0`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3">
      <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-bold">{label}</p>
      <p className="text-base font-black text-black mt-1">{value}</p>
    </div>
  );
}
