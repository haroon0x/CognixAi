import React, { useState } from 'react';
import { ActionPlan, ActionStep } from '../../types';
import { CheckCircle, Circle, Clock, AlertTriangle, ChevronDown, ChevronRight, Sparkles, Target } from 'lucide-react';

interface ActionPlanViewProps {
  actionPlan: ActionPlan;
  onStepToggle: (stepId: string) => void;
}

export const ActionPlanView: React.FC<ActionPlanViewProps> = ({
  actionPlan,
  onStepToggle
}) => {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());

  const toggleStepExpansion = (stepId: string) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId);
    } else {
      newExpanded.add(stepId);
    }
    setExpandedSteps(newExpanded);
  };

  const getPriorityColor = (priority: ActionPlan['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const completedSteps = actionPlan.steps.filter(step => step.completed).length;
  const totalSteps = actionPlan.steps.length;
  const progressPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border-b border-gray-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Target className="h-6 w-6 text-primary-400" />
            <span>{actionPlan.title}</span>
            <Sparkles className="h-5 w-5 text-primary-400 animate-pulse" />
          </h2>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(actionPlan.priority)}`}>
            {actionPlan.priority.toUpperCase()} PRIORITY
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-300">Duration: {actionPlan.estimatedDuration}</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <span className="text-sm text-gray-300">{completedSteps} of {totalSteps} completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            <span className="text-sm text-gray-300">{actionPlan.dependencies.length} dependencies</span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
          <div 
            className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-sm text-gray-400">{Math.round(progressPercentage)}% complete</p>
      </div>

      {/* Dependencies */}
      {actionPlan.dependencies.length > 0 && (
        <div className="p-4 bg-yellow-500/10 border-b border-gray-800">
          <h3 className="text-sm font-medium text-yellow-400 mb-2 flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Dependencies</span>
          </h3>
          <ul className="space-y-1">
            {actionPlan.dependencies.map((dependency, index) => (
              <li key={index} className="text-sm text-yellow-300 flex items-center space-x-2">
                <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                <span>{dependency}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Steps */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-primary-400" />
          <span>AI-Generated Action Steps</span>
        </h3>
        <div className="space-y-3">
          {actionPlan.steps.map((step, index) => {
            const isExpanded = expandedSteps.has(step.id);
            
            return (
              <div key={step.id} className="bg-gray-800/30 border border-gray-700 rounded-xl overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => onStepToggle(step.id)}
                      className="flex-shrink-0 transition-transform hover:scale-110"
                    >
                      {step.completed ? (
                        <CheckCircle className="h-6 w-6 text-green-400" />
                      ) : (
                        <Circle className="h-6 w-6 text-gray-400 hover:text-gray-300" />
                      )}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-medium ${step.completed ? 'text-gray-400 line-through' : 'text-white'}`}>
                          {step.title}
                        </h4>
                        <button
                          onClick={() => toggleStepExpansion(step.id)}
                          className="flex-shrink-0 p-1 hover:bg-gray-700 rounded transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                      
                      {step.dueDate && (
                        <p className="text-sm text-gray-500 mt-1">
                          Due: {step.dueDate.toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="mt-4 pl-9 space-y-3 border-t border-gray-700 pt-3">
                      <p className="text-sm text-gray-300">{step.description}</p>
                      
                      {step.resources.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-white mb-2 flex items-center space-x-1">
                            <Sparkles className="h-3 w-3 text-primary-400" />
                            <span>Related Resources</span>
                          </h5>
                          <ul className="space-y-1">
                            {step.resources.map((resource, resourceIndex) => (
                              <li key={resourceIndex} className="text-sm text-gray-400 flex items-center space-x-2">
                                <div className="h-1 w-1 bg-primary-400 rounded-full" />
                                <span>{resource}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};