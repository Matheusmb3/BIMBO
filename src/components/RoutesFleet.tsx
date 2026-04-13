import { useEffect, useMemo, useState } from 'react';
import { divIcon, type DivIcon } from 'leaflet';
import { MapContainer, Marker, Polygon, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertCircle, CheckCircle2, Clock, Filter, MapPin, Route, Sparkles, Truck } from 'lucide-react';
import * as XLSX from 'xlsx';

type RouteStatus = 'Em Rota' | 'Atrasado' | 'Crítico';
type RoutePriority = 'Alta' | 'Média' | 'Baixa';
type Region = 'Zona Sul' | 'Zona Leste' | 'Zona Norte' | 'Centro';

type RouteInfo = {
  id: string;
  driver: string;
  type: 'Própria' | 'Terceirizada';
  status: RouteStatus;
  priority: RoutePriority;
  region: Region;
  destination: string;
  eta: string;
  stops: number;
  cargo: string;
  progress: number;
  vehicle: [number, number];
  center: [number, number];
  path: [number, number][];
  routeColor: string;
};

type ZoneOverlay = {
  name: Region;
  tone: 'critical' | 'attention' | 'normal';
  fill: string;
  border: string;
  coords: [number, number][];
  risk: number;
  suggestedVehicles: number;
};

const routes: RouteInfo[] = [
  {
    id: 'RT-1042',
    driver: 'Carlos Silva',
    type: 'Própria',
    status: 'Em Rota',
    priority: 'Alta',
    region: 'Zona Sul',
    destination: 'Supermercado Silva',
    eta: '1h 20m',
    stops: 8,
    cargo: '12 pallets | 3,4 ton',
    progress: 68,
    vehicle: [-23.641, -46.676],
    center: [-23.64, -46.64],
    path: [
      [-23.55052, -46.633308],
      [-23.578, -46.648],
      [-23.607, -46.661],
      [-23.641, -46.676],
    ],
    routeColor: '#3D7700',
  },
  {
    id: 'RT-1043',
    driver: 'Logística Express (Parceiro)',
    type: 'Terceirizada',
    status: 'Atrasado',
    priority: 'Média',
    region: 'Zona Leste',
    destination: 'Mercadinho Dois Irmãos',
    eta: '2h 05m',
    stops: 12,
    cargo: '9 pallets | 2,8 ton',
    progress: 41,
    vehicle: [-23.553, -46.523],
    center: [-23.548, -46.53],
    path: [
      [-23.55052, -46.633308],
      [-23.547, -46.603],
      [-23.545, -46.57],
      [-23.553, -46.523],
    ],
    routeColor: '#FECC14',
  },
  {
    id: 'RT-1044',
    driver: 'João Souza',
    type: 'Própria',
    status: 'Crítico',
    priority: 'Alta',
    region: 'Zona Norte',
    destination: 'Padaria Central Norte',
    eta: '3h 10m',
    stops: 10,
    cargo: '14 pallets | 4,1 ton',
    progress: 23,
    vehicle: [-23.472, -46.629],
    center: [-23.485, -46.63],
    path: [
      [-23.55052, -46.633308],
      [-23.527, -46.637],
      [-23.5, -46.633],
      [-23.472, -46.629],
    ],
    routeColor: '#FF4F00',
  },
];

const zones: ZoneOverlay[] = [
  {
    name: 'Zona Sul',
    tone: 'critical',
    fill: '#FF4F00',
    border: '#FF4F00',
    coords: [
      [-23.604, -46.709],
      [-23.674, -46.676],
      [-23.709, -46.584],
      [-23.646, -46.553],
      [-23.598, -46.611],
    ],
    risk: 92,
    suggestedVehicles: 2,
  },
  {
    name: 'Zona Leste',
    tone: 'attention',
    fill: '#FECC14',
    border: '#FECC14',
    coords: [
      [-23.575, -46.56],
      [-23.507, -46.548],
      [-23.492, -46.478],
      [-23.554, -46.448],
      [-23.604, -46.49],
    ],
    risk: 74,
    suggestedVehicles: 1,
  },
  {
    name: 'Zona Norte',
    tone: 'normal',
    fill: '#3D7700',
    border: '#3D7700',
    coords: [
      [-23.485, -46.69],
      [-23.416, -46.668],
      [-23.42, -46.58],
      [-23.495, -46.58],
      [-23.522, -46.63],
    ],
    risk: 38,
    suggestedVehicles: 0,
  },
];

const baseCenter: [number, number] = [-23.55052, -46.633308];
const lastUpdatedLabel = 'há 6 min';

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, zoom, { animate: true, duration: 1.2 });
  }, [center, map, zoom]);

  return null;
}

function buildVehicleIcon(status: RouteStatus, active: boolean) {
  const palette: Record<RouteStatus, { bg: string; ring: string; text: string }> = {
    'Em Rota': { bg: '#3D7700', ring: 'rgba(61,119,0,0.18)', text: '#ffffff' },
    'Atrasado': { bg: '#FECC14', ring: 'rgba(254,204,20,0.22)', text: '#1a1a1a' },
    'Crítico': { bg: '#FF4F00', ring: 'rgba(255,79,0,0.24)', text: '#ffffff' },
  };

  const tone = palette[status];

  return divIcon({
    className: '',
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    html: `
      <div style="
        width:42px;
        height:42px;
        border-radius:16px;
        display:flex;
        align-items:center;
        justify-content:center;
        background:${tone.bg};
        color:${tone.text};
        box-shadow:0 12px 26px ${tone.ring};
        border:2px solid rgba(255,255,255,0.9);
        transform:${active ? 'scale(1.08)' : 'scale(1)'};
      ">
        <span style="font-size:20px;line-height:1">🚚</span>
      </div>
    `,
  });
}

function buildCdIcon(): DivIcon {
  return divIcon({
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    html: `
      <div style="
        width:40px;
        height:40px;
        border-radius:14px;
        display:flex;
        align-items:center;
        justify-content:center;
        background:#111111;
        color:#fff;
        border:2px solid rgba(255,255,255,0.9);
        box-shadow:0 14px 30px rgba(17,17,17,0.18);
      ">
        <span style="font-size:18px;line-height:1">📦</span>
      </div>
    `,
  });
}

export function RoutesFleet({ highlightRouteId, focusAction }: { highlightRouteId?: string; focusAction?: unknown }) {
  void focusAction;

  const [selectedRouteId, setSelectedRouteId] = useState(highlightRouteId ?? routes[0].id);
  const [selectedRegion, setSelectedRegion] = useState<Region | 'Todas'>('Todas');
  const [selectedStatus, setSelectedStatus] = useState<RouteStatus | 'Todos'>('Todos');
  const [selectedPriority, setSelectedPriority] = useState<RoutePriority | 'Todas'>('Todas');
  const [allocationSuggestion, setAllocationSuggestion] = useState<string | null>(null);

  const activeFilterCount = [selectedRegion !== 'Todas', selectedStatus !== 'Todos', selectedPriority !== 'Todas'].filter(Boolean).length;

  useEffect(() => {
    if (highlightRouteId) {
      setSelectedRouteId(highlightRouteId);
    }
  }, [highlightRouteId]);

  const visibleRoutes = useMemo(() => {
    return routes.filter((route) => {
      const regionMatch = selectedRegion === 'Todas' || route.region === selectedRegion;
      const statusMatch = selectedStatus === 'Todos' || route.status === selectedStatus;
      const priorityMatch = selectedPriority === 'Todas' || route.priority === selectedPriority;

      return regionMatch && statusMatch && priorityMatch;
    });
  }, [selectedPriority, selectedRegion, selectedStatus]);

  useEffect(() => {
    if (!visibleRoutes.some((route) => route.id === selectedRouteId)) {
      setSelectedRouteId(visibleRoutes[0]?.id ?? routes[0].id);
    }
  }, [selectedRouteId, visibleRoutes]);

  const selectedRoute = useMemo(
    () => routes.find((route) => route.id === selectedRouteId) ?? routes[0],
    [selectedRouteId],
  );

  const metrics = useMemo(() => {
    const active = routes.filter((route) => route.status === 'Em Rota').length;
    const delayed = routes.filter((route) => route.status === 'Atrasado').length;
    const critical = routes.filter((route) => route.status === 'Crítico').length;
    const completion = Math.round(routes.reduce((sum, route) => sum + route.progress, 0) / routes.length);

    return [
      { label: 'Veículos em rota', value: active, tone: 'normal' as const, icon: Truck, status: active === 1 ? 'Operação reduzida' : active > 1 ? 'Operação ativa' : 'Sem cobertura', statusTone: active <= 1 ? 'attention' : 'normal' },
      { label: 'Veículos atrasados', value: delayed, tone: 'attention' as const, icon: Clock, status: delayed > 0 ? 'Ação necessária' : 'Sem atraso', statusTone: delayed > 0 ? 'critical' : 'normal' },
      { label: 'Entregas concluídas', value: `${completion}%`, tone: 'normal' as const, icon: CheckCircle2, status: completion < 50 ? 'Abaixo do esperado' : 'Dentro do ritmo', statusTone: completion < 50 ? 'attention' : 'normal' },
      { label: 'Rotas críticas', value: critical, tone: 'critical' as const, icon: AlertCircle, status: critical > 0 ? 'Alta prioridade' : 'Sem criticidade', statusTone: critical > 0 ? 'critical' : 'normal' },
    ];
  }, []);

  const zoneLeader = useMemo(() => [...zones].sort((a, b) => b.risk - a.risk)[0], []);

  const handleAllocateFleet = () => {
    const plusVehicles = Math.max(1, zoneLeader.suggestedVehicles);
    setAllocationSuggestion(`${zoneLeader.name} com risco elevado de ruptura. Sugestão: alocar +${plusVehicles} veículo${plusVehicles > 1 ? 's' : ''}.`);
  };

  const clearFilters = () => {
    setSelectedRegion('Todas');
    setSelectedStatus('Todos');
    setSelectedPriority('Todas');
  };

  const handleExportReport = () => {
    const workbook = XLSX.utils.book_new();

    const summarySheet = XLSX.utils.aoa_to_sheet([
      ['Relatório Fictício - Rotas & Frota'],
      ['Data de geração', '06/04/2026'],
      ['Status geral', 'Operação estável com foco em regiões críticas'],
      ['Frota própria', '45 / 50'],
      ['Parceiros logísticos', '12 / 30'],
      ['Veículos em manutenção', '5'],
      ['Observação', 'Priorizar Zona Sul e Zona Leste para evitar ruptura'],
    ]);

    const routesSheet = XLSX.utils.json_to_sheet(
      routes.map((route) => ({
        id: route.id,
        motorista: route.driver,
        tipo: route.type,
        status: route.status,
        criticidade: route.priority,
        paradas: route.stops,
        progresso: `${route.progress}%`,
      })),
    );

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

  const mapCenter = selectedRoute.center;

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black text-white text-xs font-bold uppercase tracking-[0.28em] mb-4">
            Torre de controle operacional
          </div>
          <h1 className="text-4xl font-black tracking-tight text-black">Rotas & Frota Flexível</h1>
          <p className="text-gray-500 mt-2 text-lg max-w-3xl">
            Visualização em tempo real da frota, rotas e regiões, permitindo monitorar a operação e priorizar decisões logísticas.
          </p>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="px-4 py-2 rounded-full bg-white border border-gray-200 text-xs font-bold uppercase tracking-wider text-gray-500 shadow-sm">
            Última atualização: {lastUpdatedLabel}
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={handleExportReport} className="bg-white border border-gray-200 px-4 py-2 rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors shadow-sm">
              Exportar Relatório
            </button>
            <button onClick={handleAllocateFleet} className="bg-black text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors shadow-sm">
              Alocar nova frota
            </button>
          </div>
        </div>
      </div>

      {highlightRouteId && (
        <div className="rounded-2xl border border-[#FF4F00]/20 bg-[#FF4F00]/10 px-4 py-3 text-sm font-medium text-black">
          Ação disparada pela torre: rota priorizada com foco contextual em {highlightRouteId}.
        </div>
      )}

      {allocationSuggestion && (
        <div className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-medium text-black shadow-sm">
          <span className="inline-flex items-center gap-2 font-black uppercase tracking-[0.22em] text-[10px] text-gray-500 mr-3">
            <Sparkles size={12} /> Sugestão inteligente
          </span>
          {allocationSuggestion}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const toneClass = metric.tone === 'critical' ? 'border-red-100 bg-red-50 text-red-800' : metric.tone === 'attention' ? 'border-yellow-100 bg-yellow-50 text-yellow-800' : 'border-gray-100 bg-white text-black';
          const statusTone = metric.statusTone === 'critical' ? 'bg-red-100 text-red-800' : metric.statusTone === 'attention' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800';

          return (
            <div key={metric.label} className={`rounded-[20px] border p-4 shadow-sm ${toneClass}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium opacity-70">{metric.label}</p>
                  <p className="mt-2 text-3xl font-black tracking-tight">{metric.value}</p>
                  <span className={`mt-3 inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${statusTone}`}>
                    {metric.status}
                  </span>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-black/5 flex items-center justify-center">
                  <Icon size={18} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[420px,1fr] gap-6 items-start">
        <aside className="space-y-4">
          <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-5 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-[#FF4F00]">Filtros operacionais</p>
                <h3 className="text-xl font-black tracking-tight mt-2">Filtrar operação em tempo real</h3>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500">
                <Filter size={18} />
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-3 py-2">
              <span className="text-xs font-bold uppercase tracking-[0.24em] text-gray-500">{activeFilterCount} filtros aplicados</span>
              <button onClick={clearFilters} className="text-xs font-black uppercase tracking-wider text-[#FF4F00] hover:text-[#e64700]">
                Limpar filtros
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-gray-400 mb-2">Região</p>
                <div className="flex flex-wrap gap-2">
                  {(['Todas', 'Zona Sul', 'Zona Leste', 'Zona Norte', 'Centro'] as const).map((region) => (
                    <button
                      key={region}
                      onClick={() => setSelectedRegion(region)}
                      className={`px-3 py-2 rounded-full text-xs font-bold transition-colors ${selectedRegion === region ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      {region}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-gray-400 mb-2">Status</p>
                <div className="flex flex-wrap gap-2">
                  {(['Todos', 'Em Rota', 'Atrasado', 'Crítico'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      className={`px-3 py-2 rounded-full text-xs font-bold transition-colors ${selectedStatus === status ? 'bg-[#FF4F00] text-black' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-gray-400 mb-2">Prioridade</p>
                <div className="flex flex-wrap gap-2">
                  {(['Todas', 'Alta', 'Média', 'Baixa'] as const).map((priority) => (
                    <button
                      key={priority}
                      onClick={() => setSelectedPriority(priority)}
                      className={`px-3 py-2 rounded-full text-xs font-bold transition-colors ${selectedPriority === priority ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      {priority}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-5">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-[#FF4F00]">Rotas ativas</p>
                <h3 className="text-xl font-black tracking-tight mt-2">Rotas priorizadas (sincronizadas com mapa)</h3>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{visibleRoutes.length} rotas</span>
            </div>

            <div className="space-y-3">
              {visibleRoutes.map((route) => (
                <RouteItem
                  key={route.id}
                  route={route}
                  selected={selectedRoute.id === route.id}
                  onSelect={() => setSelectedRouteId(route.id)}
                />
              ))}
            </div>
          </div>
        </aside>

        <section className="bg-white rounded-[28px] shadow-sm border border-gray-100 p-4 md:p-5 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-[#FF4F00]">Mapa operacional</p>
                <h2 className="text-2xl font-black tracking-tight mt-2">Monitoramento em tempo real de rotas, veículos e regiões críticas</h2>
                <p className="text-gray-500 mt-2 max-w-3xl">
                  Centro de distribuição, linhas de entrega e leitura por regiões para acelerar decisões de priorização.
                </p>
              </div>

            <div className="flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">
              <span className="px-3 py-1.5 rounded-full bg-green-50 text-green-800 border border-green-100">Em rota</span>
              <span className="px-3 py-1.5 rounded-full bg-yellow-50 text-yellow-800 border border-yellow-100">Atrasado</span>
              <span className="px-3 py-1.5 rounded-full bg-red-50 text-red-800 border border-red-100">Crítico</span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[24px] border border-gray-100 bg-[#f6f7f9] min-h-[720px]">
            <MapContainer
              center={baseCenter}
              zoom={11}
              className="absolute inset-0 h-full w-full"
              zoomControl={false}
              scrollWheelZoom={false}
              dragging
            >
              <TileLayer
                attribution='&copy; <a href="https://carto.com/attributions">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />

              <MapController center={mapCenter} zoom={12} />

              {zones.map((zone) => (
                <Polygon
                  key={zone.name}
                  positions={zone.coords}
                  pathOptions={{
                    color: zone.border,
                    weight: 2,
                    fillColor: zone.fill,
                    fillOpacity: zone.tone === 'critical' ? 0.16 : zone.tone === 'attention' ? 0.11 : 0.08,
                    dashArray: zone.tone === 'critical' ? '10 8' : zone.tone === 'attention' ? '6 8' : undefined,
                  }}
                />
              ))}

              {visibleRoutes.map((route) => {
                const isSelected = route.id === selectedRoute.id;

                return (
                  <Polyline
                    key={route.id}
                    positions={route.path}
                    eventHandlers={{
                      click: () => setSelectedRouteId(route.id),
                    }}
                    pathOptions={{
                      color: route.routeColor,
                      weight: isSelected ? 7 : 5,
                      opacity: isSelected ? 1 : 0.72,
                      dashArray: route.status === 'Atrasado' ? '8 8' : route.status === 'Crítico' ? '4 8' : undefined,
                    }}
                  />
                );
              })}

              <Marker position={baseCenter} icon={buildCdIcon()}>
                <Popup>
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Centro de distribuição</p>
                    <p className="font-semibold">CD principal da operação</p>
                  </div>
                </Popup>
              </Marker>

              {visibleRoutes.map((route) => (
                <Marker
                  key={route.id}
                  position={route.vehicle}
                  icon={buildVehicleIcon(route.status, route.id === selectedRoute.id)}
                  eventHandlers={{
                    click: () => setSelectedRouteId(route.id),
                  }}
                >
                  <Popup>
                    <div className="space-y-2 min-w-[220px]">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500 font-black">{route.id}</p>
                          <p className="font-semibold text-base">{route.driver}</p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-gray-100 text-gray-700">{route.status}</span>
                      </div>
                      <p className="text-sm text-gray-600">{route.region} · {route.destination}</p>
                      <p className="text-sm text-gray-600">ETA {route.eta} · {route.stops} paradas · {route.cargo}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            <div className="absolute top-4 left-4 right-4 flex flex-col gap-3 pointer-events-none">
              <div className="inline-flex max-w-fit items-center gap-2 rounded-full bg-white/90 backdrop-blur-md px-3 py-2 text-xs font-black uppercase tracking-[0.24em] text-gray-600 shadow-sm border border-white/60">
                <Route size={14} className="text-[#FF4F00]" />
                Rotas conectadas ao mapa
              </div>
              <div className="max-w-2xl rounded-2xl bg-white/92 backdrop-blur-md px-4 py-3 text-sm text-gray-600 shadow-sm border border-white/60">
                Monitoramento em tempo real de rotas, veículos e regiões críticas.
              </div>
            </div>

            <div className="absolute top-4 right-4 rounded-2xl bg-white/95 backdrop-blur-md p-3 shadow-sm border border-white/70 pointer-events-auto">
              <div className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-400 mb-2">Legenda</div>
              <div className="space-y-1.5 text-xs font-semibold text-gray-600">
                <div className="flex items-center gap-2"><span className="text-red-500">🔴</span> Crítico</div>
                <div className="flex items-center gap-2"><span className="text-yellow-500">🟡</span> Atenção</div>
                <div className="flex items-center gap-2"><span className="text-green-500">🟢</span> Normal</div>
                <div className="flex items-center gap-2"><span>🚚</span> Veículo</div>
                <div className="flex items-center gap-2"><span className="text-gray-700">━</span> Rota ativa</div>
              </div>
            </div>

            <div className="absolute bottom-4 left-4 right-4 grid grid-cols-1 lg:grid-cols-[1.1fr,0.9fr] gap-3 pointer-events-none">
              <div className="rounded-2xl bg-white/95 backdrop-blur-md p-4 shadow-lg border border-white/70 pointer-events-auto">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.26em] text-[#FF4F00] font-black">Rota selecionada</p>
                    <h3 className="mt-1 text-lg font-black tracking-tight">{selectedRoute.id}</h3>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${selectedRoute.status === 'Em Rota' ? 'bg-green-100 text-green-800' : selectedRoute.status === 'Atrasado' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {selectedRoute.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <InfoCell label="Motorista" value={selectedRoute.driver} />
                  <InfoCell label="Região / destino" value={`${selectedRoute.region} · ${selectedRoute.destination}`} />
                  <InfoCell label="ETA" value={selectedRoute.eta} />
                  <InfoCell label="Paradas" value={`${selectedRoute.stops}`} />
                  <InfoCell label="Carga" value={selectedRoute.cargo} />
                  <InfoCell label="Prioridade" value={selectedRoute.priority} />
                </div>
              </div>

              <div className="rounded-2xl bg-white/95 backdrop-blur-md p-4 shadow-lg border border-white/70 pointer-events-auto">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.26em] text-[#FF4F00] font-black">Leitura por zonas</p>
                    <h3 className="mt-1 text-lg font-black tracking-tight">Regiões críticas</h3>
                  </div>
                  <MapPin size={18} className="text-gray-500" />
                </div>
                <div className="space-y-2">
                  {zones.map((zone) => (
                    <div key={zone.name} className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-3 py-2 border border-gray-100">
                      <div className="flex items-center gap-3">
                        <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: zone.fill }} />
                        <div>
                          <p className="text-sm font-bold text-black">{zone.name}</p>
                          <p className="text-[11px] text-gray-500 font-medium">Risco {zone.risk}%</p>
                        </div>
                      </div>
                      <span className="text-xs font-black uppercase tracking-wider text-gray-600">{zone.suggestedVehicles} veículos</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function RouteItem({ route, selected, onSelect }: { key?: string | number; route: RouteInfo; selected: boolean; onSelect: () => void }) {
  const statusTone =
    route.status === 'Em Rota'
      ? 'bg-green-100 text-green-800'
      : route.status === 'Atrasado'
        ? 'bg-yellow-100 text-yellow-800'
        : 'bg-red-100 text-red-800';

  const priorityTone = route.priority === 'Alta' ? 'bg-red-50 text-red-800' : route.priority === 'Média' ? 'bg-yellow-50 text-yellow-800' : 'bg-green-50 text-green-800';

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left rounded-2xl border p-4 transition-all duration-200 ${selected ? 'border-[#FF4F00] bg-[#FF4F00]/5 shadow-md' : 'border-gray-100 hover:bg-gray-50 hover:border-gray-200'}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-11 h-11 bg-gray-100 rounded-2xl flex items-center justify-center shrink-0">
            <Truck size={20} className={route.type === 'Própria' ? 'text-black' : 'text-[#4E18FF]'} />
          </div>
          <div className="min-w-0">
            <h5 className="font-black text-sm truncate">{route.id} • {route.driver}</h5>
            <p className="text-xs text-gray-500 font-medium mt-1">{route.region} · {route.destination}</p>
            <p className="mt-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#FF4F00]">ETA: {route.eta}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${statusTone}`}>{route.status}</span>
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${priorityTone}`}>Prioridade {route.priority}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-[11px] text-gray-500 font-medium mb-3">
        <span>{route.stops} paradas</span>
        <span>ETA {route.eta}</span>
        <span>{route.cargo}</span>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1 overflow-hidden">
        <div className="h-1.5 rounded-full transition-all duration-500" style={{ width: `${route.progress}%`, backgroundColor: route.routeColor }} />
      </div>
      <div className="flex justify-between text-[10px] font-bold text-gray-400">
        <span>Progresso</span>
        <span>{route.progress}%</span>
      </div>
    </button>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-black leading-snug">{value}</p>
    </div>
  );
}
