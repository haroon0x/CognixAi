import React from 'react';
import { ContentItem, ActionPlan } from '../../types';
import { BarChart3, TrendingUp, Clock, Target, FileText, Brain, Activity, Zap } from 'lucide-react';

interface AnalyticsProps {
  contentItems: ContentItem[];
  actionPlans: ActionPlan[];
  analytics: {
    totalContent: number;
    avgQuality: number;
    completionRate: number;
    categoryDistribution: Record<string, number>;
    totalTasks: number;
    completedTasks: number;
  };
}

export const Analytics: React.FC<AnalyticsProps> = ({ 
  contentItems, 
  actionPlans, 
  analytics 
}) => {
  const totalTasks = actionPlans.reduce((sum, plan) => sum + plan.steps.length, 0);
  const completedTasks = actionPlans.reduce((sum, plan) => 
    sum + plan.steps.filter(step => step.completed).length, 0
  );

  const insights = [
    {
      title: 'Most Active Category',
      value: Object.entries(analytics.categoryDistribution).sort(([,a], [,b]) => b - a)[0]?.[0]?.replace('-', ' ') || 'None',
      icon: Target,
      trend: '+12%'
    },
    {
      title: 'Avg Processing Time',
      value: '2.3s',
      icon: Zap,
      trend: '-8%'
    },
    {
      title: 'Weekly Content',
      value: Math.ceil(contentItems.length / 7).toString(),
      icon: Activity,
      trend: '+23%'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-black">Analytics</h1>
        <p className="text-gray-600 mt-1">Insights into your productivity and content patterns</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Content</p>
              <p className="text-2xl font-semibold text-black">{analytics.totalContent}</p>
            </div>
            <FileText className="h-6 w-6 text-gray-400" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Content Quality</p>
              <p className="text-2xl font-semibold text-black">{Math.round(analytics.avgQuality * 100)}%</p>
            </div>
            <Brain className="h-6 w-6 text-gray-400" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Tasks Completed</p>
              <p className="text-2xl font-semibold text-black">{completedTasks}/{totalTasks}</p>
            </div>
            <Target className="h-6 w-6 text-gray-400" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Completion Rate</p>
              <p className="text-2xl font-semibold text-black">
                {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
              </p>
            </div>
            <TrendingUp className="h-6 w-6 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((insight) => {
          const Icon = insight.icon;
          return (
            <div key={insight.title} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Icon className="h-5 w-5 text-gray-400" />
                <span className={`text-xs font-medium px-2 py-1 rounded ${
                  insight.trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {insight.trend}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600">{insight.title}</h3>
              <p className="text-lg font-semibold text-black">{insight.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-black mb-4 flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Content Categories</span>
          </h3>
          <div className="space-y-3">
            {Object.entries(analytics.categoryDistribution).map(([category, count]) => {
              const percentage = analytics.totalContent > 0 ? (count / analytics.totalContent) * 100 : 0;
              return (
                <div key={category} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 capitalize">{category.replace('-', ' ')}</span>
                    <span className="text-gray-500">{count} ({Math.round(percentage)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-black h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Quality Distribution */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-black mb-4 flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>Quality Distribution</span>
          </h3>
          <div className="space-y-3">
            {[
              { label: 'High Quality (80-100%)', min: 0.8, color: 'bg-green-500' },
              { label: 'Good Quality (60-79%)', min: 0.6, color: 'bg-yellow-500' },
              { label: 'Average Quality (40-59%)', min: 0.4, color: 'bg-orange-500' },
              { label: 'Low Quality (0-39%)', min: 0, color: 'bg-red-500' }
            ].map((range, index) => {
              const count = contentItems.filter(item => {
                const score = item.relevanceScore || 0.8;
                const nextMin = index === 0 ? 1 : [0.8, 0.6, 0.4][index - 1];
                return score >= range.min && score < nextMin;
              }).length;
              const percentage = analytics.totalContent > 0 ? (count / analytics.totalContent) * 100 : 0;
              
              return (
                <div key={range.label} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">{range.label}</span>
                    <span className="text-gray-500">{count} ({Math.round(percentage)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${range.color} h-2 rounded-full`}
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
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-black mb-4 flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>Recent Activity</span>
        </h3>
        <div className="space-y-3">
          {contentItems.slice(0, 5).map((item) => (
            <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-black rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-black font-medium">{item.title}</p>
                <p className="text-gray-600 text-sm">
                  Added {item.timestamp.toLocaleDateString()} • {item.type.toUpperCase()}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Quality</div>
                <div className="text-black font-medium">
                  {Math.round((item.relevanceScore || 0.8) * 100)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};