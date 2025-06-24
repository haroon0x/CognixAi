import React, { useState } from 'react';
import { ActionPlan, ActionStep } from '../../types';
import { CheckCircle, Circle, Clock, ChevronDown, ChevronRight } from 'lucide-react';

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

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-medium text-black mb-4">{actionPlan.title}</h2>
        
        <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
          <div>
            <span className="text-gray-500">Duration</span>
            <p className="font-medium text-black">{actionPlan.estimatedDuration}</p>
          </div>
          <div>
            <span className="text-gray-500">Progress</span>
            <p className="font-medium text-black">{completedSteps}/{totalSteps}</p>
          </div>
          <div>
            <span className="text-gray-500">Priority</span>
            <p className="font-medium text-black capitalize">{actionPlan.priority}</p>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="p-6">
        <div className="space-y-3">
          {actionPlan.steps.map((step) => {
            const isExpanded = expandedSteps.has(step.id);
            
            return (
              <div key={step.id} className="border border-gray-200 rounded-lg bg-white">
                <div className="p-4">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => onStepToggle(step.id)}
                      className="flex-shrink-0"
                    >
                      {step.completed ? (
                        <CheckCircle className="h-5 w-5 text-blue-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                    
                    <div className="flex-1">
                      <h4 className={`font-medium ${step.completed ? 'text-gray-500 line-through' : 'text-black'}`}> 
                        {step.title}
                      </h4>
                      {step.dueDate && (
                        <p className="text-sm text-gray-500 mt-1">
                          Due: {step.dueDate.toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    
                    <button
                      onClick={() => toggleStepExpansion(step.id)}
                      className="p-1"
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
                      <p className="text-sm text-gray-700 mb-3">{step.description}</p>
                      
                      {step.resources.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-black mb-2">Resources</h5>
                          <ul className="space-y-1">
                            {step.resources.map((resource, index) => (
                              <li key={index} className="text-sm text-gray-700">
                                • {resource}
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