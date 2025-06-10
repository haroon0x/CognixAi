import React, { useState } from 'react';
import { UploadZone } from '../Upload/UploadZone';
import { StatsOverview } from '../Dashboard/StatsOverview';
import { ProcessingStatus } from '../Dashboard/ProcessingStatus';
import { RecentContent } from '../Dashboard/RecentContent';
import { QuickActions } from '../Dashboard/QuickActions';
import { CreatePlanModal } from '../ActionPlan/CreatePlanModal';
import { ContentItem, ActionPlan, UploadProgress } from '../../types';

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
    <div className="space-y-6">
      {/* Stats Overview */}
      <StatsOverview 
        contentItems={contentItems} 
        projects={[]} 
        processingStats={{
          totalProcessed: contentItems.filter(item => item.status === 'completed').length,
          avgProcessingTime: 2.5,
          successRate: 0.95
        }}
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upload Zone */}
          <UploadZone
            onFileUpload={onFileUpload}
            onTextSubmit={onTextSubmit}
            onYouTubeSubmit={onYouTubeSubmit}
          />

          {/* Recent Content */}
          <RecentContent items={contentItems.slice(0, 5)} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <QuickActions
            contentItems={contentItems}
            onGenerateActionPlan={() => setShowCreatePlanModal(true)}
            analytics={analytics}
          />

          {/* Processing Status */}
          <ProcessingStatus uploads={uploads} />
        </div>
      </div>

      {/* Create Plan Modal */}
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