import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { Dashboard } from './components/Pages/Dashboard';
import { ContentManager } from './components/Pages/ContentManager';
import { ActionPlans } from './components/Pages/ActionPlans';
import { Settings } from './components/Pages/Settings';
import { useAgents } from './hooks/useAgents';

type Page = 'dashboard' | 'plans' | 'settings';

function BackendStatusIndicator() {
  const [connected, setConnected] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/status', {
      method: 'GET',
    })
      .then(res => res.ok ? setConnected(true) : setConnected(false))
      .catch(() => setConnected(false));
  }, []);

  const getStatus = () => {
    if (connected === null) return 'Checking backend...';
    if (connected) return 'Backend Connected';
    return 'Backend Disconnected';
  };

  const getDotColor = () => {
    if (connected === null) return 'bg-gradient-to-r from-gray-400 to-gray-300';
    if (connected) return 'bg-gradient-to-r from-green-400 to-emerald-500';
    return 'bg-gradient-to-r from-red-400 to-pink-500';
  };

  return (
    <div
      className="fixed top-4 right-4 z-50 flex items-center shadow-lg rounded-xl px-3 py-1"
      style={{
        background: 'rgba(255,255,255,0.18)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(200,200,200,0.18)',
        boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.10)',
        minWidth: 120,
      }}
    >
      <span
        className={`inline-block w-2.5 h-2.5 rounded-full mr-2 relative ${getDotColor()}`}
        style={{
          boxShadow: connected === null
            ? '0 0 0 0 rgba(156,163,175,0.7)'
            : connected
            ? '0 0 6px 1px #34d399, 0 0 0 0 #34d399'
            : '0 0 6px 1px #f87171, 0 0 0 0 #f87171',
          animation: 'pulse 1.2s infinite',
        }}
      />
      <span
        style={{
          fontWeight: 500,
          fontFamily: 'Inter, sans-serif',
          fontSize: 12,
          color: connected === null ? '#6b7280' : connected ? '#059669' : '#dc2626',
          letterSpacing: 0.1,
        }}
      >
        {getStatus()}
      </span>
      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(52,211,153,0.7); }
          70% { box-shadow: 0 0 0 6px rgba(52,211,153,0); }
          100% { box-shadow: 0 0 0 0 rgba(52,211,153,0); }
        }
      `}</style>
    </div>
  );
}

function PlanGeneratedToast({ show, onClose, onViewPlan }: { show: boolean; onClose: () => void; onViewPlan: () => void }) {
  React.useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 6000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;
  return (
    <div className="fixed top-20 right-6 z-50 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center space-x-4 animate-fade-in">
      <span className="font-semibold">Plan generated successfully!</span>
      <button
        onClick={onViewPlan}
        className="ml-2 px-3 py-1 bg-white text-green-700 rounded hover:bg-gray-100 font-medium transition-colors"
      >
        View Plan
      </button>
      <button onClick={onClose} className="ml-2 text-white hover:text-gray-200 focus:outline-none text-xl">&times;</button>
    </div>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showPlanToast, setShowPlanToast] = useState(false);
  
  const {
    contentItems,
    actionPlans,
    uploads,
    isProcessing,
    processFiles,
    processText,
    processYouTube,
    generateActionPlan,
    toggleActionStep,
    deleteContent,
    searchContent,
    filterByCategory,
    exportData,
    getAnalytics,
    rawPlan,
    planGenerated,
    resetPlanGenerated
  } = useAgents();

  // Show toast when planGenerated becomes true
  React.useEffect(() => {
    if (planGenerated) setShowPlanToast(true);
  }, [planGenerated]);

  const handleViewPlan = () => {
    setCurrentPage('plans');
    setShowPlanToast(false);
    resetPlanGenerated();
  };

  const handleCloseToast = () => {
    setShowPlanToast(false);
    resetPlanGenerated();
  };

  // New: handler to navigate to plans after plan creation
  const handlePlanCreatedAndNavigate = () => {
    setCurrentPage('plans');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard
            contentItems={contentItems}
            actionPlans={actionPlans}
            uploads={uploads}
            isProcessing={isProcessing}
            onFileUpload={processFiles}
            onTextSubmit={processText}
            onYouTubeSubmit={processYouTube}
            onGenerateActionPlan={generateActionPlan}
            analytics={getAnalytics()}
            onPlanCreatedAndNavigate={handlePlanCreatedAndNavigate}
          />
        );
      case 'plans':
        return (
          <ActionPlans
            actionPlans={actionPlans}
            contentItems={contentItems}
            onGenerateActionPlan={generateActionPlan}
            onStepToggle={toggleActionStep}
            analytics={getAnalytics()}
            rawPlan={rawPlan}
          />
        );
      case 'settings':
        return <Settings />;
      default:
        return null;
    }
  };

  return (
    <>
      <BackendStatusIndicator />
      <PlanGeneratedToast show={showPlanToast} onClose={handleCloseToast} onViewPlan={handleViewPlan} />
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        {/* Main Content */}
        <div className={`transition-all duration-200 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
          <Header
            currentPage={currentPage}
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
            isProcessing={isProcessing}
          />
          
          <main className="p-8">
            {renderPage()}
          </main>
        </div>
      </div>
    </>
  );
}

export default App;