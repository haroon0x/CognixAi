import React from 'react';
import { 
  Brain, 
  LayoutDashboard, 
  FileText, 
  Target, 
  Settings, 
  ChevronLeft,
  Sparkles,
  Zap,
  CheckSquare
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onPageChange,
  collapsed,
  onToggleCollapse
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Task Organizer', icon: LayoutDashboard, description: 'Extract & organize tasks from data' },
    { id: 'content', label: 'Content Processor', icon: FileText, description: 'Upload & process unstructured data' },
    { id: 'plans', label: 'Action Plans', icon: Target, description: 'AI-generated task sequences' },
    { id: 'settings', label: 'Settings', icon: Settings, description: 'Configure task extraction' },
  ];

  return (
    <div className={`fixed left-0 top-0 h-full bg-gray-950/95 backdrop-blur-xl border-r border-gray-800/50 transition-all duration-300 z-50 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-800/50">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                  <CheckSquare className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg"></div>
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Cognix
                </h1>
                <p className="text-xs text-gray-500">Task Organizer AI</p>
              </div>
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-2 hover:bg-gray-800/50 rounded-lg transition-all duration-200 group"
          >
            <ChevronLeft className={`h-4 w-4 text-gray-400 group-hover:text-white transition-all duration-200 ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* AI Task Extraction Status */}
      {!collapsed && (
        <div className="p-4 border-b border-gray-800/50">
          <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-xl p-3">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-400">AI Task Extraction</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-gray-300">Extract</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-gray-300">Organize</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-gray-300">Plan</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="p-3 space-y-1 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${
                isActive
                  ? 'bg-blue-500/10 text-blue-400 shadow-lg border border-blue-500/20'
                  : 'hover:bg-gray-800/30 text-gray-400 hover:text-gray-200'
              }`}
              title={collapsed ? item.label : undefined}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-r-full"></div>
              )}
              <Icon className={`h-5 w-5 transition-all duration-200 ${isActive ? 'text-blue-400' : 'group-hover:text-gray-200'}`} />
              {!collapsed && (
                <div className="flex-1 text-left">
                  <div className="font-medium text-sm">{item.label}</div>
                  <div className="text-xs text-gray-500 group-hover:text-gray-400">{item.description}</div>
                </div>
              )}
              {isActive && !collapsed && (
                <Sparkles className="h-3 w-3 text-blue-400 animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Status */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-800/50">
          <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-gray-700/50 rounded-xl p-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <CheckSquare className="h-3 w-3 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-white">Task AI Engine</p>
                <p className="text-xs text-gray-400">Ready to organize</p>
              </div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};