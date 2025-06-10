import React, { useState } from 'react';
import { ActionPlanView } from '../ActionPlan/ActionPlanView';
import { CreatePlanModal } from '../ActionPlan/CreatePlanModal';
import { ActionPlan, ContentItem } from '../../types';
import { Plus, Target, Clock, CheckCircle, BarChart3, TrendingUp, Brain, Sparkles } from 'lucide-react';

interface ActionPlansProps {
  actionPlans: ActionPlan[];
  contentItems: ContentItem[];
  onGenerateActionPlan: (goals: string[]) => void;
  onStepToggle: (planId: string, stepId: string) => void;
  analytics: {
    totalContent: number;
    avgQuality: number;
    completionRate: number;
    categoryDistribution: Record<string, number>;
  };
}

export const ActionPlans: React.FC<ActionPlansProps> = ({
  actionPlans,
  contentItems,
  onGenerateActionPlan,
  onStepToggle,
  analytics
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<ActionPlan | null>(
    actionPlans.length > 0 ? actionPlans[0] : null
  );
  const [activeTab, setActiveTab] = useState<'plans' | 'analytics'>('plans');

  const totalTasks = actionPlans.reduce((sum, plan) => sum + plan.steps.length, 0);
  const completedTasks = actionPlans.reduce((sum, plan) => 
    sum + plan.steps.filter(step => step.completed).length, 0
  );

  return (
    <div className="space-y-6">
      {/* Header with Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Action Plans</h1>
            <p className="text-gray-400">AI-generated plans and analytics</p>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex bg-gray-800/30 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('plans')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'plans'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Target className="h-4 w-4 inline mr-2" />
              Plans
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'analytics'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <BarChart3 className="h-4 w-4 inline mr-2" />
              Analytics
            </button>
          </div>
        </div>

        {activeTab === 'plans' && (
          <button
            onClick={() => setShowCreateModal(true)}
            disabled={contentItems.length === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="h-4 w-4" />
            <span>Create Plan</span>
          </button>
        )}
      </div>

      {activeTab === 'plans' ? (
        actionPlans.length === 0 ? (
          /* Empty State */
          <div className="bg-gray-900/30 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-12 text-center">
            <Target className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Action Plans Yet</h3>
            <p className="text-gray-400 mb-6">
              Create your first action plan by setting goals and letting AI generate intelligent steps.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              disabled={contentItems.length === 0}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Sparkles className="h-4 w-4 inline mr-2" />
              Create Your First Plan
            </button>
            {contentItems.length === 0 && (
              <p className="text-sm text-gray-500 mt-3">
                Add some content first to generate meaningful action plans
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Plans List */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900/30 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Your Plans</h3>
                <div className="space-y-2">
                  {actionPlans.map((plan) => {
                    const completedSteps = plan.steps.filter(step => step.completed).length;
                    const totalSteps = plan.steps.length;
                    const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
                    
                    return (
                      <button
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan)}
                        className={`w-full text-left p-3 rounded-xl transition-all ${
                          selectedPlan?.id === plan.id
                            ? 'bg-blue-500/20 border border-blue-500/30'
                            : 'bg-gray-800/30 hover:bg-gray-800/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-white truncate">{plan.title}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            plan.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                            plan.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {plan.priority}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <CheckCircle className="h-3 w-3" />
                          <span>{completedSteps}/{totalSteps}</span>
                          <Clock className="h-3 w-3 ml-2" />
                          <span>{plan.estimatedDuration}</span>
                        </div>
                        <div className="mt-2 w-full bg-gray-700 rounded-full h-1">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-1 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Selected Plan */}
            <div className="lg:col-span-3">
              {selectedPlan && (
                <ActionPlanView
                  actionPlan={selectedPlan}
                  onStepToggle={(stepId) => onStepToggle(selectedPlan.id, stepId)}
                />
              )}
            </div>
          </div>
        )
      ) : (
        /* Analytics Tab */
        <div className="space-y-6">
          {/* Analytics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-900/30 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Tasks</p>
                  <p className="text-2xl font-bold text-white">{totalTasks}</p>
                </div>
                <Target className="h-8 w-8 text-blue-400" />
              </div>
            </div>

            <div className="bg-gray-900/30 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Completed</p>
                  <p className="text-2xl font-bold text-white">{completedTasks}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-emerald-400" />
              </div>
            </div>

            <div className="bg-gray-900/30 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Completion Rate</p>
                  <p className="text-2xl font-bold text-white">
                    {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-cyan-400" />
              </div>
            </div>

            <div className="bg-gray-900/30 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">AI Quality</p>
                  <p className="text-2xl font-bold text-white">{Math.round(analytics.avgQuality * 100)}%</p>
                </div>
                <Brain className="h-8 w-8 text-purple-400" />
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Distribution */}
            <div className="bg-gray-900/30 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-400" />
                <span>Content Categories</span>
              </h3>
              <div className="space-y-3">
                {Object.entries(analytics.categoryDistribution).map(([category, count]) => {
                  const percentage = analytics.totalContent > 0 ? (count / analytics.totalContent) * 100 : 0;
                  return (
                    <div key={category} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300 capitalize">{category.replace('-', ' ')}</span>
                        <span className="text-gray-400">{count} ({Math.round(percentage)}%)</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Plan Progress */}
            <div className="bg-gray-900/30 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <Target className="h-5 w-5 text-emerald-400" />
                <span>Plan Progress</span>
              </h3>
              <div className="space-y-4">
                {actionPlans.map((plan) => {
                  const completedSteps = plan.steps.filter(step => step.completed).length;
                  const totalSteps = plan.steps.length;
                  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
                  
                  return (
                    <div key={plan.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300 truncate">{plan.title}</span>
                        <span className="text-gray-400">{completedSteps}/{totalSteps}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Plan Modal */}
      {showCreateModal && (
        <CreatePlanModal
          contentItems={contentItems}
          onClose={() => setShowCreateModal(false)}
          onCreatePlan={onGenerateActionPlan}
        />
      )}
    </div>
  );
};