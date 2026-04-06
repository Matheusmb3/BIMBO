import { LayoutDashboard, Smartphone, Truck, AlertTriangle, Presentation } from "lucide-react";
import { cn } from "../lib/utils";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const navItems = [
    { id: "dashboard", label: "Torre de Controle", icon: LayoutDashboard },
    { id: "presentation", label: "Apresentação Executiva", icon: Presentation },
    { id: "pos-app", label: "App do Cliente (PDV)", icon: Smartphone },
    { id: "routes", label: "Rotas & Frota", icon: Truck },
    { id: "alerts", label: "Alertas de Ruptura", icon: AlertTriangle },
  ];

  return (
    <div className="w-64 bg-black text-white h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FF4F00] rounded-sm flex items-center justify-center font-bold text-xl">
            B
          </div>
          <h1 className="font-bold text-xl tracking-tight">BimboLog</h1>
        </div>
        <p className="text-gray-400 text-xs mt-2 font-medium">Torre de Controle Logística</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium",
                isActive
                  ? "bg-[#FF4F00] text-black shadow-[0_0_20px_rgba(255,79,0,0.3)]"
                  : "text-gray-400 hover:bg-gray-900 hover:text-white"
              )}
            >
              <Icon size={20} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
            <span className="text-xs font-bold">MM</span>
          </div>
          <div className="text-left">
            <p className="text-sm font-medium">Matheus Menezes</p>
            <p className="text-xs text-gray-500">Operações</p>
          </div>
        </div>
      </div>
    </div>
  );
}
