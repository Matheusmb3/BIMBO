import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Package, Truck, AlertTriangle, CheckCircle2, TrendingUp, TrendingDown } from 'lucide-react';

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
