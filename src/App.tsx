import React, { useState } from 'react';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { Dashboard } from './components/Pages/Dashboard';
import { ContentManager } from './components/Pages/ContentManager';
import { ActionPlans } from './components/Pages/ActionPlans';
import { Settings } from './components/Pages/Settings';
import { useAgents } from './hooks/useAgents';

type Page = 'dashboard' | 'content' | 'plans' | 'settings';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
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
    getAnalytics
  } = useAgents();

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
            onFileUpload={processFiles}
            onTextSubmit={processText}
            onYouTubeSubmit={processYouTube}
            onDeleteContent={deleteContent}
            onSearchContent={searchContent}
            onFilterByCategory={filterByCategory}
            onExportData={exportData}
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
          />
        );
      case 'settings':
        return <Settings />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-emerald-500/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <Header
          currentPage={currentPage}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          isProcessing={isProcessing}
        />
        
        <main className="p-6 relative z-10">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;