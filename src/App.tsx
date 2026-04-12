/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
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

