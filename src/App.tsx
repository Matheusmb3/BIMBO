/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { LayoutDashboard } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Canvas, Dashboard, PresentationDeck } from './components/Dashboard';
import { POSApp } from './components/POSApp';
import { RoutesFleet } from './components/RoutesFleet';
import { AlertsPanel } from './components/AlertsPanel';

type ActionFocus = {
  tab: string;
  section?: string;
  key?: string;
  step?: number;
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [actionFocus, setActionFocus] = useState<ActionFocus | null>(null);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setActionFocus(null);
  };

  const handleAction = (tab: string, focus: Omit<ActionFocus, 'tab'> = {}) => {
    setActiveTab(tab);
    setActionFocus({ tab, ...focus });
  };

  return (
    <div className="flex min-h-screen bg-[#f5f5f5] font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />
      
      <main className="flex-1 ml-64 overflow-y-auto">
        {activeTab !== 'dashboard' && (
          <button
            type="button"
            onClick={() => handleTabChange('dashboard')}
            className="fixed right-6 top-6 z-50 inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-bold text-white shadow-[0_10px_30px_rgba(0,0,0,0.2)] transition-colors hover:bg-gray-800"
          >
            <LayoutDashboard size={16} />
            Voltar para Torre de Controle
          </button>
        )}
        {activeTab === 'dashboard' && <Dashboard focusAction={actionFocus} onAction={handleAction} />}
        {activeTab === 'presentation' && <PresentationDeck />}
        {activeTab === 'canvas' && <Canvas />}
        {activeTab === 'pos-app' && <POSApp initialStep={actionFocus?.step ?? 0} focusAction={actionFocus} />}
        {activeTab === 'routes' && <RoutesFleet highlightRouteId={actionFocus?.key} focusAction={actionFocus} />}
        {activeTab === 'alerts' && <AlertsPanel focusStoreId={actionFocus?.key} focusAction={actionFocus} />}
      </main>
    </div>
  );
}

