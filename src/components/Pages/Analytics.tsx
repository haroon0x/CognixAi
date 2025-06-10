import React from 'react';
import { ContentItem, ActionPlan } from '../../types';
import { BarChart3, TrendingUp, Clock, Target, FileText, Brain } from 'lucide-react';

interface AnalyticsProps {
  contentItems: ContentItem[];
  actionPlans: ActionPlan[];
}

export const Analytics: React.FC<AnalyticsProps> = ({ contentItems, actionPlans }) => {
  const totalContent = contentItems.length;
  const avgRelevanceScore = contentItems.length > 0 
    ? contentItems.reduce((sum, item) => sum + (item.relevanceScore || 0), 0) / contentItems.length
    : 0;

  const categoryDistribution = contentItems.reduce((acc, item) => {
    item.categories.forEach(category => {
      acc[category] = (acc[category] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const completedTasks = actionPlans.reduce((total, plan) => 
    total + plan.steps.filter(step => step.completed).length, 0
  );

  const totalTasks = actionPlans.reduce((total, plan) => total + plan.steps.length, 0);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Content</p>
              <p className="text-2xl font-bold text-white">{totalContent}</p>
            </div>
            <FileText className="h-8 w-8 text-primary-400" />
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg Quality Score</p>
              <p className="text-2xl font-bold text-white">{Math.round(avgRelevanceScore * 100)}%</p>
            </div>
            <Brain className="h-8 w-8 text-secondary-400" />
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Tasks Completed</p>
              <p className="text-2xl font-bold text-white">{completedTasks}/{totalTasks}</p>
            </div>
            <Target className="h-8 w-8 text-accent-400" />
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Completion Rate</p>
              <p className="text-2xl font-bold text-white">
                {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-primary-400" />
            <span>Content Categories</span>
          </h3>
          <div className="space-y-3">
            {Object.entries(categoryDistribution).map(([category, count]) => {
              const percentage = (count / totalContent) * 100;
              return (
                <div key={category} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300 capitalize">{category.replace('-', ' ')}</span>
                    <span className="text-gray-400">{count} ({Math.round(percentage)}%)</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Quality */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Brain className="h-5 w-5 text-secondary-400" />
            <span>Content Quality Distribution</span>
          </h3>
          <div className="space-y-3">
            {[
              { label: 'High Quality (80-100%)', min: 0.8, color: 'from-green-500 to-emerald-500' },
              { label: 'Good Quality (60-79%)', min: 0.6, color: 'from-yellow-500 to-orange-500' },
              { label: 'Average Quality (40-59%)', min: 0.4, color: 'from-orange-500 to-red-500' },
              { label: 'Low Quality (0-39%)', min: 0, color: 'from-red-500 to-red-600' }
            ].map((range, index) => {
              const count = contentItems.filter(item => {
                const score = item.relevanceScore || 0;
                const nextMin = index === 0 ? 1 : [0.8, 0.6, 0.4][index - 1];
                return score >= range.min && score < nextMin;
              }).length;
              const percentage = totalContent > 0 ? (count / totalContent) * 100 : 0;
              
              return (
                <div key={range.label} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">{range.label}</span>
                    <span className="text-gray-400">{count} ({Math.round(percentage)}%)</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`bg-gradient-to-r ${range.color} h-2 rounded-full`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <Clock className="h-5 w-5 text-accent-400" />
          <span>Recent Activity</span>
        </h3>
        <div className="space-y-3">
          {contentItems.slice(0, 5).map((item) => (
            <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-lg">
              <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
              <div className="flex-1">
                <p className="text-white font-medium">{item.title}</p>
                <p className="text-gray-400 text-sm">
                  Added {item.timestamp.toLocaleDateString()} • {item.type.toUpperCase()}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Quality Score</div>
                <div className="text-white font-medium">
                  {Math.round((item.relevanceScore || 0) * 100)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};