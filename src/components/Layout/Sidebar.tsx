import React from 'react';
import { 
  CheckSquare, 
  FileText, 
  Target, 
  Settings, 
  X
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
    { id: 'dashboard', label: 'Tasks', icon: CheckSquare },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'plans', label: 'Plans', icon: Target },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-200 z-50 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <CheckSquare className="h-6 w-6 text-black" />
              <span className="text-lg font-medium text-black">Cognix</span>
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            {collapsed ? (
              <CheckSquare className="h-4 w-4 text-gray-600" />
            ) : (
              <X className="h-4 w-4 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-black text-white'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </div>
  );
};