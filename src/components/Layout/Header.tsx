import React from 'react';
import { Menu } from 'lucide-react';

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
      case 'dashboard': return 'Tasks';
      case 'content': return 'Content';
      case 'plans': return 'Plans';
      case 'settings': return 'Settings';
      default: return 'Tasks';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onToggleSidebar}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
            
            <h1 className="text-xl font-medium text-black">
              {getPageTitle(currentPage)}
            </h1>
          </div>

          {isProcessing && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 font-mono">Processing</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};