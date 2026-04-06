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

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex min-h-screen bg-[#f5f5f5] font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-64 overflow-y-auto">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'presentation' && <PresentationDeck />}
        {activeTab === 'canvas' && <Canvas />}
        {activeTab === 'pos-app' && <POSApp />}
        {activeTab === 'routes' && <RoutesFleet />}
        {activeTab === 'alerts' && <AlertsPanel />}
      </main>
    </div>
  );
}

