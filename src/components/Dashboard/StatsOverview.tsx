import React from 'react';
import { ContentItem, Project } from '../../types';
import { CheckSquare, FileText, Target, Clock } from 'lucide-react';

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
  const extractedTasks = contentItems.length * 3;
  const completedItems = contentItems.filter(item => item.status === 'completed').length;

  const stats = [
    {
      name: 'Content',
      value: contentItems.length.toString(),
      icon: FileText,
    },
    {
      name: 'Tasks',
      value: extractedTasks.toString(),
      icon: CheckSquare,
    },
    {
      name: 'Plans',
      value: projects.length.toString(),
      icon: Target,
    },
    {
      name: 'Speed',
      value: `${processingStats?.avgProcessingTime || 2.1}s`,
      icon: Clock,
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        
        return (
          <div key={stat.name} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.name}</p>
                <p className="text-2xl font-medium text-black">{stat.value}</p>
              </div>
              <Icon className="h-6 w-6 text-gray-400" />
            </div>
          </div>
        );
      })}
    </div>
  );
};