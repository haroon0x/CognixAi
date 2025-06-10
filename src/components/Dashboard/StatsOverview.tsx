import React from 'react';
import { ContentItem, Project } from '../../types';
import { CheckSquare, Brain, Target, TrendingUp, Sparkles, Clock } from 'lucide-react';

interface StatsOverviewProps {
  contentItems: ContentItem[];
  projects: Project[];
  processingStats?: {
    totalProcessed: number;
    avgProcessingTime: number;
    successRate: number;
  };
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  contentItems,
  projects,
  processingStats
}) => {
  const completedItems = contentItems.filter(item => item.status === 'completed').length;
  const avgRelevanceScore = contentItems.length > 0 
    ? contentItems.reduce((sum, item) => sum + (item.relevanceScore || 0), 0) / contentItems.length
    : 0;

  // Calculate extracted tasks (mock for now)
  const extractedTasks = contentItems.length * 3; // Assume 3 tasks per content item on average

  const stats = [
    {
      name: 'Content Processed',
      value: contentItems.length.toString(),
      icon: CheckSquare,
      color: 'blue',
      description: `${completedItems} items analyzed`,
      trend: '+12%'
    },
    {
      name: 'Tasks Extracted',
      value: extractedTasks.toString(),
      icon: Target,
      color: 'emerald',
      description: 'AI-identified action items',
      trend: '+24%'
    },
    {
      name: 'Task Quality',
      value: `${Math.round(avgRelevanceScore * 100)}%`,
      icon: Brain,
      color: 'cyan',
      description: 'AI confidence score',
      trend: '+8%'
    },
    {
      name: 'Processing Speed',
      value: `${processingStats?.avgProcessingTime || 2.1}s`,
      icon: Clock,
      color: 'purple',
      description: 'Average extraction time',
      trend: '-15%'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'from-blue-500 to-blue-600';
      case 'emerald':
        return 'from-emerald-500 to-emerald-600';
      case 'cyan':
        return 'from-cyan-500 to-cyan-600';
      case 'purple':
        return 'from-purple-500 to-purple-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const gradientClasses = getColorClasses(stat.color);
        const isImprovement = stat.trend.startsWith('+');
        
        return (
          <div key={stat.name} className="bg-gray-900/30 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6 relative overflow-hidden group hover:bg-gray-900/40 transition-all duration-300">
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradientClasses} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
            
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${gradientClasses} bg-opacity-20 shadow-lg`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className={`flex items-center space-x-1 text-sm font-medium ${
                  isImprovement ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  <TrendingUp className={`h-3 w-3 ${!isImprovement ? 'rotate-180' : ''}`} />
                  <span>{stat.trend}</span>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">{stat.name}</p>
                <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.description}</p>
              </div>
              
              {stat.name === 'Tasks Extracted' && (
                <Sparkles className="absolute top-3 right-3 h-4 w-4 text-emerald-400 animate-pulse" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};