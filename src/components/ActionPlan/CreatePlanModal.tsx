import React, { useState } from 'react';
import { ContentItem } from '../../types';
import { Plus, X, Target, Lightbulb } from 'lucide-react';

interface CreatePlanModalProps {
  contentItems: ContentItem[];
  onClose: () => void;
  onPlanCreated: (goals: string[]) => void;
}

export const CreatePlanModal: React.FC<CreatePlanModalProps> = ({
  contentItems,
  onClose,
  onPlanCreated
}) => {
  const [goals, setGoals] = useState<string[]>([]);
  const [newGoal, setNewGoal] = useState('');

  const suggestedGoals = [
    'Complete project deliverables',
    'Improve team communication',
    'Organize meeting follow-ups',
    'Streamline workflow processes'
  ];

  const handleAddGoal = () => {
    if (newGoal.trim() && !goals.includes(newGoal.trim())) {
      setGoals(prev => [...prev, newGoal.trim()]);
      setNewGoal('');
    }
  };

  const handleAddSuggestedGoal = (goal: string) => {
    if (!goals.includes(goal)) {
      setGoals(prev => [...prev, goal]);
    }
  };

  const handleRemoveGoal = (goalToRemove: string) => {
    setGoals(prev => prev.filter(goal => goal !== goalToRemove));
  };

  const handleCreatePlan = () => {
    if (goals.length > 0) {
      onPlanCreated(goals);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-black flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Create Action Plan</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Goal Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Goals
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="Enter a goal..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
              />
              <button
                onClick={handleAddGoal}
                disabled={!newGoal.trim()}
                className="px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Suggested Goals */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Lightbulb className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Suggested Goals</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestedGoals.map((goal) => (
                <button
                  key={goal}
                  onClick={() => handleAddSuggestedGoal(goal)}
                  disabled={goals.includes(goal)}
                  className="text-xs px-3 py-1 border border-gray-300 rounded-full hover:border-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>
          
          {/* Current Goals */}
          {goals.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Your Goals:</h4>
              <div className="space-y-2">
                {goals.map((goal, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-black">{goal}</span>
                    <button
                      onClick={() => handleRemoveGoal(goal)}
                      className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content Summary */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Using {contentItems.length} content item{contentItems.length !== 1 ? 's' : ''} to generate your plan
            </p>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreatePlan}
            disabled={goals.length === 0}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Generate Plan
          </button>
        </div>
      </div>
    </div>
  );
};