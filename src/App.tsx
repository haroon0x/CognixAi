import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { Dashboard } from './components/Pages/Dashboard';
import { ContentManager } from './components/Pages/ContentManager';
import { ActionPlans } from './components/Pages/ActionPlans';
import { Analytics } from './components/Pages/Analytics';
import { Settings } from './components/Pages/Settings';
import { useAgents } from './hooks/useAgents';

type Page = 'dashboard' | 'content' | 'plans' | 'analytics' | 'settings';

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
    if (connected === null) return 'Checking...';
    if (connected) return 'Connected';
    return 'Disconnected';
  };

  const getDotColor = () => {
    if (connected === null) return 'bg-gray-400';
    if (connected) return 'bg-green-500';
    return 'bg-red-500';
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${getDotColor()}`} />
      <span className="text-xs font-medium text-gray-700">{getStatus()}</span>
    </div>
  );
}

function PlanGeneratedToast({ show, onClose, onViewPlan }: { show: boolean; onClose: () => void; onViewPlan: () => void }) {
  React.useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onViewPlan(); // Auto-redirect after 3 seconds
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onViewPlan]);

  if (!show) return null;
  
  return (
    <div className="fixed top-20 right-6 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm animate-fade-in">
      <div className="flex items-start space-x-3">
        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-medium text-black">Plan Generated</h4>
          <p className="text-sm text-gray-600 mt-1">Your action plan is ready. Redirecting in 3 seconds...</p>
          <div className="flex space-x-2 mt-3">
            <button
              onClick={onViewPlan}
              className="text-xs px-3 py-1 bg-black text-white rounded hover:bg-gray-800 transition-colors"
            >
              View Now
            </button>
            <button
              onClick={onClose}
              className="text-xs px-3 py-1 text-gray-600 hover:text-black transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
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

  // Show toast and auto-redirect when plan is generated
  React.useEffect(() => {
    if (planGenerated) {
      setShowPlanToast(true);
    }
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
          />
        );
      case 'content':
        return (
          <ContentManager
            contentItems={contentItems}
            onDeleteContent={deleteContent}
            onSearchContent={searchContent}
            onFilterByCategory={filterByCategory}
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
      case 'analytics':
        return (
          <Analytics
            contentItems={contentItems}
            actionPlans={actionPlans}
            analytics={getAnalytics()}
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
        <Sidebar
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
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