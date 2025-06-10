export interface ContentItem {
  id: string;
  type: 'pdf' | 'image' | 'youtube' | 'text';
  title: string;
  content: string;
  extractedText: string;
  metadata: Record<string, any>;
  timestamp: Date;
  status: 'processing' | 'completed' | 'error';
  categories: string[];
  relevanceScore?: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  goals: string[];
  contentItems: ContentItem[];
  actionPlan: ActionPlan;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActionPlan {
  id: string;
  title: string;
  steps: ActionStep[];
  priority: 'low' | 'medium' | 'high';
  estimatedDuration: string;
  dependencies: string[];
}

export interface ActionStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: Date;
  resources: string[];
}

export interface AgentResponse {
  success: boolean;
  data?: any;
  error?: string;
  processingTime: number;
}

export interface UploadProgress {
  fileId: string;
  fileName: string;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
}