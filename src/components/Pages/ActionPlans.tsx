import React, { useState } from 'react';
import { ActionPlanView } from '../ActionPlan/ActionPlanView';
import { CreatePlanModal } from '../ActionPlan/CreatePlanModal';
import { ActionPlan, ContentItem } from '../../types';
import { Plus, Target, Clock, CheckCircle, BarChart3, TrendingUp, Brain, Sparkles, FileText } from 'lucide-react';

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
  rawPlan?: string | null;
}

export const ActionPlans: React.FC<ActionPlansProps> = ({
  actionPlans: initialActionPlans,
  contentItems,
  onGenerateActionPlan,
  onStepToggle,
  analytics,
  rawPlan
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<ActionPlan | null>(
    initialActionPlans.length > 0 ? initialActionPlans[0] : null
  );
  const [activeTab, setActiveTab] = useState<'plans' | 'analytics'>('plans');
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>(initialActionPlans);

  const totalTasks = actionPlans.reduce((sum, plan) => sum + plan.steps.length, 0);
  const completedTasks = actionPlans.reduce((sum, plan) => 
    sum + plan.steps.filter(step => step.completed).length, 0
  );

  const handlePlanCreated = (goals: string[]) => {
    onGenerateActionPlan(goals);
    setShowCreateModal(false);
  };

  // Update actionPlans when initialActionPlans changes
  React.useEffect(() => {
    setActionPlans(initialActionPlans);
    if (initialActionPlans.length > 0 && !selectedPlan) {
      setSelectedPlan(initialActionPlans[0]);
    }
  }, [initialActionPlans, selectedPlan]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-black">Action Plans</h1>
          <p className="text-gray-600 mt-1">AI-generated plans from your content</p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Tab Navigation */}
          <div className="flex bg-white rounded-lg p-1 border border-gray-200">
            <button
              onClick={() => setActiveTab('plans')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'plans'
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Plans
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'analytics'
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Analytics
            </button>
          </div>

          {activeTab === 'plans' && (
            <button
              onClick={() => setShowCreateModal(true)}
              disabled={contentItems.length === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>New Plan</span>
            </button>
          )}
        </div>
      </div>

      {/* Agent Output */}
      {rawPlan && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Agent Output</h3>
          <pre className="text-xs text-gray-700 whitespace-pre-wrap overflow-x-auto">{rawPlan}</pre>
        </div>
      )}

      {activeTab === 'plans' ? (
        actionPlans.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-black mb-2">No Plans Yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Upload content and create your first action plan to get organized and stay on track.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => setShowCreateModal(true)}
                disabled={contentItems.length === 0}
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Create First Plan
              </button>
              {contentItems.length === 0 && (
                <p className="text-sm text-gray-500">
                  Add content first to generate meaningful plans
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Plans Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-black mb-4">Your Plans</h3>
                <div className="space-y-2">
                  {actionPlans.map((plan) => {
                    const completedSteps = plan.steps.filter(step => step.completed).length;
                    const totalSteps = plan.steps.length;
                    const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
                    
                    return (
                      <button
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan)}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          selectedPlan?.id === plan.id
                            ? 'border-black bg-gray-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-black truncate text-sm">{plan.title}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            plan.priority === 'high' ? 'bg-red-100 text-red-700' :
                            plan.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {plan.priority}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-600 mb-2">
                          <CheckCircle className="h-3 w-3" />
                          <span>{completedSteps}/{totalSteps}</span>
                          <Clock className="h-3 w-3 ml-1" />
                          <span>{plan.estimatedDuration}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div 
                            className="bg-black h-1 rounded-full transition-all"
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
              {selectedPlan ? (
                <ActionPlanView
                  actionPlan={selectedPlan}
                  onStepToggle={(stepId) => onStepToggle(selectedPlan.id, stepId)}
                />
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                  <FileText className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-black mb-2">Select a Plan</h3>
                  <p className="text-gray-600">Choose a plan from the sidebar to view details</p>
                </div>
              )}
            </div>
          </div>
        )
      ) : (
        /* Analytics Tab */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Tasks</p>
                  <p className="text-2xl font-semibold text-black">{totalTasks}</p>
                </div>
                <Target className="h-6 w-6 text-gray-400" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Completed</p>
                  <p className="text-2xl font-semibold text-black">{completedTasks}</p>
                </div>
                <CheckCircle className="h-6 w-6 text-gray-400" />
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

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Content Quality</p>
                  <p className="text-2xl font-semibold text-black">{Math.round(analytics.avgQuality * 100)}%</p>
                </div>
                <Brain className="h-6 w-6 text-gray-400" />
              </div>
            </div>
          </div>

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
        </div>
      )}

      {/* Create Plan Modal */}
      {showCreateModal && (
        <CreatePlanModal
          contentItems={contentItems}
          onClose={() => setShowCreateModal(false)}
          onPlanCreated={handlePlanCreated}
        />
      )}
    </div>
  );
};