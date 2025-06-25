import React, { useState } from 'react';
import { UploadZone } from '../Upload/UploadZone';
import { StatsOverview } from '../Dashboard/StatsOverview';
import { ProcessingStatus } from '../Dashboard/ProcessingStatus';
import { CreatePlanModal } from '../ActionPlan/CreatePlanModal';
import { ContentItem, ActionPlan, UploadProgress } from '../../types';
import { Target, FileText, Sparkles } from 'lucide-react';

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
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-black">Tasks</h1>
        <p className="text-gray-600 mt-1">Extract and organize tasks from unstructured content</p>
      </div>

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
        {/* Upload Zone */}
        <div className="lg:col-span-2">
          <UploadZone
            onFileUpload={onFileUpload}
            onTextSubmit={onTextSubmit}
            onYouTubeSubmit={onYouTubeSubmit}
          />
        </div>

        {/* Processing Status */}
        <div>
          <ProcessingStatus uploads={uploads} />
        </div>
      </div>

      {/* Recent Content */}
      {contentItems.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-medium text-black">Recent Content</h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {contentItems.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-black truncate">{item.title}</p>
                    <p className="text-xs text-gray-500">
                      {item.type.toUpperCase()} • {item.timestamp.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.categories.length > 0 && item.categories[0]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Action */}
      {contentItems.length > 0 && actionPlans.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <div className="max-w-md mx-auto">
            <Sparkles className="h-8 w-8 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-black mb-2">Ready to Plan</h3>
            <p className="text-gray-600 mb-6">
              You have {contentItems.length} content item{contentItems.length !== 1 ? 's' : ''} ready. 
              Generate an action plan to organize your tasks.
            </p>
            <button
              onClick={() => setShowCreatePlanModal(true)}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Generate Action Plan
            </button>
          </div>
        </div>
      )}

      {/* Create Plan Modal */}
      {showCreatePlanModal && (
        <CreatePlanModal
          contentItems={contentItems}
          onClose={() => setShowCreatePlanModal(false)}
          onPlanCreated={(goals) => {
            onGenerateActionPlan(goals);
            setShowCreatePlanModal(false);
          }}
        />
      )}
    </div>
  );
};