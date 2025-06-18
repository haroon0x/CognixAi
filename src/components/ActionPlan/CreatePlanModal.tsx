import React, { useState } from 'react';
import { ContentItem } from '../../types';
import { Plus, X, Target } from 'lucide-react';

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-medium text-black flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Create Plan</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="Enter goal..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
            />
            <button
              onClick={handleAddGoal}
              className="px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          
          {goals.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-black">Goals:</h4>
              {goals.map((goal, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-black">{goal}</span>
                  <button
                    onClick={() => handleRemoveGoal(goal)}
                    className="text-gray-500 hover:text-gray-700 text-sm"
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
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreatePlan}
            disabled={goals.length === 0}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Create Plan
          </button>
        </div>
      </div>
    </div>
  );
};