import React from 'react';
import { Menu, Search, Sparkles, Loader, Bell, Brain } from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  onToggleSidebar: () => void;
  isProcessing: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentPage, 
  onToggleSidebar, 
  isProcessing 
}) => {
  const getPageTitle = (page: string) => {
    switch (page) {
      case 'dashboard': return 'Task Organizer';
      case 'content': return 'Content Processor';
      case 'plans': return 'Action Plans';
      case 'settings': return 'Settings';
      default: return 'Cognix';
    }
  };

  const getPageDescription = (page: string) => {
    switch (page) {
      case 'dashboard': return 'Transform unstructured data into organized tasks';
      case 'content': return 'Extract tasks from documents, notes, and media';
      case 'plans': return 'AI-generated action plans from your content';
      case 'settings': return 'Configure AI task extraction';
      default: return 'AI-powered task organization';
    }
  };

  return (
    <header className="bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50 sticky top-0 z-40">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onToggleSidebar}
              className="p-2 hover:bg-gray-800/50 rounded-lg transition-all duration-200 lg:hidden"
            >
              <Menu className="h-5 w-5 text-gray-400" />
            </button>
            
            <div>
              <h1 className="text-xl font-bold text-white flex items-center space-x-2">
                <span>{getPageTitle(currentPage)}</span>
                {isProcessing && (
                  <div className="flex items-center space-x-1">
                    <Brain className="h-4 w-4 text-blue-400 animate-pulse" />
                    <Loader className="h-3 w-3 text-blue-400 animate-spin" />
                  </div>
                )}
              </h1>
              <p className="text-sm text-gray-500">{getPageDescription(currentPage)}</p>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search tasks..."
                className="pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 w-64 transition-all duration-200"
              />
            </div>

            {/* AI Processing Status */}
            {isProcessing && (
              <div className="flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-xl px-3 py-2">
                <Brain className="h-4 w-4 text-blue-400 animate-pulse" />
                <span className="text-sm text-blue-300 font-medium">Extracting tasks...</span>
              </div>
            )}

            {/* Notifications */}
            <button className="relative p-2 hover:bg-gray-800/50 rounded-xl transition-all duration-200 group">
              <Bell className="h-5 w-5 text-gray-400 group-hover:text-gray-200" />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            </button>

            {/* Profile */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-sm font-bold text-white">U</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};