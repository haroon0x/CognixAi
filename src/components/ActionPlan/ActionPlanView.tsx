import React, { useState } from 'react';
import { ActionPlan, ActionStep } from '../../types';
import { CheckCircle, Circle, Clock, ChevronDown, ChevronRight, Target, Calendar, User } from 'lucide-react';

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

  const completedSteps = actionPlan.steps.filter(step => step.completed).length;
  const totalSteps = actionPlan.steps.length;
  const progressPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-black mb-2">{actionPlan.title}</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{actionPlan.estimatedDuration}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Target className="h-4 w-4" />
                <span>{completedSteps}/{totalSteps} completed</span>
              </div>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(actionPlan.priority)}`}>
            {actionPlan.priority.toUpperCase()}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium text-black">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-black h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Dependencies */}
        {actionPlan.dependencies.length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Dependencies</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {actionPlan.dependencies.map((dep, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <div className="w-1 h-1 bg-gray-400 rounded-full" />
                  <span>{dep}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Steps */}
      <div className="p-6">
        <h3 className="text-lg font-medium text-black mb-4">Action Steps</h3>
        <div className="space-y-3">
          {actionPlan.steps.map((step, index) => {
            const isExpanded = expandedSteps.has(step.id);
            
            return (
              <div key={step.id} className={`border rounded-lg transition-all ${
                step.completed ? 'border-gray-200 bg-gray-50' : 'border-gray-200 bg-white'
              }`}>
                <div className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-3 flex-1">
                      <button
                        onClick={() => onStepToggle(step.id)}
                        className="flex-shrink-0 transition-colors"
                      >
                        {step.completed ? (
                          <CheckCircle className="h-5 w-5 text-black" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            STEP {index + 1}
                          </span>
                          {step.dueDate && (
                            <span className="text-xs text-gray-500 flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>Due {step.dueDate.toLocaleDateString()}</span>
                            </span>
                          )}
                        </div>
                        <h4 className={`font-medium mt-1 ${
                          step.completed ? 'text-gray-500 line-through' : 'text-black'
                        }`}> 
                          {step.title}
                        </h4>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => toggleStepExpansion(step.id)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  
                  {isExpanded && (
                    <div className="mt-4 pl-8 pt-3 border-t border-gray-100">
                      <p className="text-sm text-gray-700 mb-4 leading-relaxed">{step.description}</p>
                      
                      {step.resources.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-black mb-2 flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>Resources & References</span>
                          </h5>
                          <div className="space-y-2">
                            {step.resources.map((resource, index) => (
                              <div key={index} className="flex items-center space-x-2 text-sm">
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0" />
                                <span className="text-gray-700">{resource}</span>
                              </div>
                            ))}
                          </div>
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