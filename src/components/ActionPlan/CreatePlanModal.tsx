import React, { useState } from 'react';
import { ContentItem } from '../../types';
import { Plus, X, Target, Sparkles } from 'lucide-react';

interface CreatePlanModalProps {
  contentItems: ContentItem[];
  onClose: () => void;
  onCreatePlan: (goals: string[]) => void;
}

export const CreatePlanModal: React.FC<CreatePlanModalProps> = ({
  contentItems,
  onClose,
  onCreatePlan
}) => {
  const [goals, setGoals] = useState<string[]>([]);
  const [newGoal, setNewGoal] = useState('');

  const handleAddGoal = () => {
    if (newGoal.trim() && !goals.includes(newGoal.trim())) {
      setGoals(prev => [...prev, newGoal.trim()]);
      setNewGoal('');
    }
  };

  const handleRemoveGoal = (goalToRemove: string) => {
    setGoals(prev => prev.filter(goal => goal !== goalToRemove));
  };

  const handleCreatePlan = () => {
    if (goals.length > 0) {
      onCreatePlan(goals);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
            <Target className="h-6 w-6 text-primary-400" />
            <span>Create Action Plan</span>
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>
        
        <div className="mb-6">
          <div className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-4 mb-4">
            <p className="text-sm text-primary-300 flex items-center space-x-2">
              <Sparkles className="h-4 w-4" />
              <span>Define your goals and let AI create an intelligent action plan from your {contentItems.length} content items.</span>
            </p>
          </div>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="Enter a goal..."
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
            />
            <button
              onClick={handleAddGoal}
              className="px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          
          {goals.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-300">Your Goals:</h4>
              {goals.map((goal, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                  <span className="text-white">{goal}</span>
                  <button
                    onClick={() => handleRemoveGoal(goal)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreatePlan}
            disabled={goals.length === 0}
            className="px-6 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:from-primary-600 hover:to-secondary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
          >
            <Sparkles className="h-4 w-4" />
            <span>Generate AI Plan</span>
          </button>
        </div>
      </div>
    </div>
  );
};