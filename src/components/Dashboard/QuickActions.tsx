import React from 'react';
import { ContentItem } from '../../types';
import { Target, Sparkles, CheckSquare, Download, Zap, Brain } from 'lucide-react';

interface QuickActionsProps {
  contentItems: ContentItem[];
  onGenerateActionPlan: () => void;
  analytics: {
    totalContent: number;
    avgQuality: number;
    completionRate: number;
    totalTasks: number;
    completedTasks: number;
  };
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  contentItems,
  onGenerateActionPlan,
  analytics
}) => {
  const handleExportData = () => {
    const data = {
      contentItems,
      analytics,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cognix-tasks-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const extractedTasks = contentItems.length * 3; // Mock calculation

  const actions = [
    {
      title: 'Generate Action Plan',
      description: 'Create organized task sequences from extracted items',
      icon: Target,
      color: 'from-blue-500 to-cyan-500',
      onClick: onGenerateActionPlan,
      disabled: contentItems.length === 0,
      stats: `${extractedTasks} tasks ready`
    },
    {
      title: 'Review Extracted Tasks',
      description: 'View and organize AI-identified action items',
      icon: CheckSquare,
      color: 'from-emerald-500 to-teal-500',
      onClick: () => {},
      disabled: contentItems.length === 0,
      stats: `${Math.round(analytics.avgQuality * 100)}% accuracy`
    },
    {
      title: 'Export Task List',
      description: 'Download organized tasks and action plans',
      icon: Download,
      color: 'from-purple-500 to-pink-500',
      onClick: handleExportData,
      disabled: contentItems.length === 0,
      stats: `${analytics.totalContent} sources`
    },
    {
      title: 'AI Task Enhancement',
      description: 'Improve task clarity and add context',
      icon: Brain,
      color: 'from-yellow-500 to-orange-500',
      onClick: () => {},
      disabled: contentItems.length === 0,
      stats: 'Smart suggestions'
    }
  ];

  return (
    <div className="bg-gray-900/30 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
        <Sparkles className="h-5 w-5 text-blue-400" />
        <span>Task Organization Actions</span>
      </h3>
      
      <div className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;
          
          return (
            <button
              key={action.title}
              onClick={action.onClick}
              disabled={action.disabled}
              className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                action.disabled 
                  ? 'bg-gray-800/20 opacity-50 cursor-not-allowed' 
                  : 'bg-gray-800/30 hover:bg-gray-800/50 hover:scale-105 transform'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${action.color} ${action.disabled ? 'opacity-50' : 'shadow-lg'}`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white">{action.title}</h4>
                  <p className="text-sm text-gray-400">{action.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{action.stats}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};