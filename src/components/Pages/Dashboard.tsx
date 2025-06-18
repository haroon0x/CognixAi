import React, { useState } from 'react';
import { UploadZone } from '../Upload/UploadZone';
import { StatsOverview } from '../Dashboard/StatsOverview';
import { ProcessingStatus } from '../Dashboard/ProcessingStatus';
import { CreatePlanModal } from '../ActionPlan/CreatePlanModal';
import { ContentItem, ActionPlan, UploadProgress } from '../../types';
import { Target } from 'lucide-react';

interface DashboardProps {
  contentItems: ContentItem[];
  actionPlans: ActionPlan[];
  uploads: UploadProgress[];
  isProcessing: boolean;
  onFileUpload: (files: FileList) => void;
  onTextSubmit: (text: string, title: string) => void;
  onYouTubeSubmit: (url: string) => void;
  onGenerateActionPlan: (goals: string[]) => void;
  analytics: {
    totalContent: number;
    avgQuality: number;
    completionRate: number;
    categoryDistribution: Record<string, number>;
    totalTasks: number;
    completedTasks: number;
  };
}

export const Dashboard: React.FC<DashboardProps> = ({
  contentItems,
  actionPlans,
  uploads,
  isProcessing,
  onFileUpload,
  onTextSubmit,
  onYouTubeSubmit,
  onGenerateActionPlan,
  analytics
}) => {
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);

  return (
    <div className="space-y-8">
      {/* Stats */}
      <StatsOverview 
        contentItems={contentItems} 
        projects={[]} 
        processingStats={{
          totalProcessed: contentItems.filter(item => item.status === 'completed').length,
          avgProcessingTime: 2.5,
          successRate: 0.95
        }}
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload */}
        <div className="lg:col-span-2">
          <UploadZone
            onFileUpload={onFileUpload}
            onTextSubmit={onTextSubmit}
            onYouTubeSubmit={onYouTubeSubmit}
          />
        </div>

        {/* Status */}
        <div>
          <ProcessingStatus uploads={uploads} />
        </div>
      </div>

      {/* Action */}
      {contentItems.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <Target className="h-8 w-8 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-black mb-2">Create Plan</h3>
          <p className="text-gray-500 mb-6">Generate action plan from extracted tasks</p>
          <button
            onClick={() => setShowCreatePlanModal(true)}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Generate Plan
          </button>
        </div>
      )}

      {/* Modal */}
      {showCreatePlanModal && (
        <CreatePlanModal
          contentItems={contentItems}
          onClose={() => setShowCreatePlanModal(false)}
          onCreatePlan={onGenerateActionPlan}
        />
      )}
    </div>
  );
};