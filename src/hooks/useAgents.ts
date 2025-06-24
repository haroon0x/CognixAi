import { useState, useCallback } from 'react';
import { ContentItem, ActionPlan, UploadProgress, AgentResponse } from '../types';

// IMPORTANT: Set REACT_APP_API_URL in your .env to your backend URL (e.g., http://localhost:8000/api)
// If using a proxy (see vite.config.ts), '/api' will be proxied to the backend.
const API_BASE_URL = import.meta.env.REACT_APP_API_URL || '/api';

export const useAgents = () => {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>([]);
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const addUpload = useCallback((fileId: string, fileName: string) => {
    const upload: UploadProgress = {
      fileId,
      fileName,
      progress: 0,
      status: 'uploading'
    };
    setUploads(prev => [...prev, upload]);
    return upload;
  }, []);

  const updateUpload = useCallback((fileId: string, updates: Partial<UploadProgress>) => {
    setUploads(prev => prev.map(upload => 
      upload.fileId === fileId ? { ...upload, ...updates } : upload
    ));
  }, []);

  const processFiles = useCallback(async (files: FileList) => {
    setIsProcessing(true);
    
    for (const file of Array.from(files)) {
      const fileId = `${Date.now()}-${Math.random()}`;
      addUpload(fileId, file.name);

      try {
        // Simulate upload progress
        for (let i = 0; i <= 100; i += 20) {
          updateUpload(fileId, { progress: i, status: 'uploading' });
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        updateUpload(fileId, { status: 'processing', progress: 100 });

        // Create FormData for file upload
        const formData = new FormData();
        formData.append('files', file);

        const response = await fetch(`${API_BASE_URL}/upload/files`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const newItems = await response.json();
          setContentItems(prev => [...prev, ...newItems.map((item: any) => ({
            ...item,
            timestamp: new Date(item.timestamp)
          }))]);
          updateUpload(fileId, { status: 'completed' });
        } else {
          updateUpload(fileId, { status: 'error' });
        }
      } catch (error) {
        console.error('Error processing file:', error);
        updateUpload(fileId, { status: 'error' });
      }
    }

    setIsProcessing(false);
  }, [addUpload, updateUpload]);

  const processText = useCallback(async (text: string, title: string) => {
    setIsProcessing(true);
    const fileId = `text-${Date.now()}`;
    addUpload(fileId, title);

    try {
      updateUpload(fileId, { status: 'processing', progress: 50 });

      const response = await fetch(`${API_BASE_URL}/upload/text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, title }),
      });

      if (response.ok) {
        const newItem = await response.json();
        setContentItems(prev => [...prev, {
          ...newItem,
          timestamp: new Date(newItem.timestamp)
        }]);
        updateUpload(fileId, { status: 'completed', progress: 100 });
      } else {
        updateUpload(fileId, { status: 'error' });
      }
    } catch (error) {
      console.error('Error processing text:', error);
      updateUpload(fileId, { status: 'error' });
    }

    setIsProcessing(false);
  }, [addUpload, updateUpload]);

  const processYouTube = useCallback(async (url: string) => {
    setIsProcessing(true);
    const fileId = `youtube-${Date.now()}`;
    addUpload(fileId, 'YouTube Video');

    try {
      updateUpload(fileId, { status: 'processing', progress: 50 });

      const response = await fetch(`${API_BASE_URL}/upload/youtube`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (response.ok) {
        const newItem = await response.json();
        setContentItems(prev => [...prev, {
          ...newItem,
          timestamp: new Date(newItem.timestamp)
        }]);
        updateUpload(fileId, { status: 'completed', progress: 100 });
      } else {
        updateUpload(fileId, { status: 'error' });
      }
    } catch (error) {
      console.error('Error processing YouTube URL:', error);
      updateUpload(fileId, { status: 'error' });
    }

    setIsProcessing(false);
  }, [addUpload, updateUpload]);

  const generateActionPlan = useCallback(async (goals: string[]) => {
    if (contentItems.length === 0) return;

    setIsProcessing(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/generate-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goals,
          content_ids: contentItems.map(item => item.id)
        }),
      });

      if (response.ok) {
        const newPlan = await response.json();
        setActionPlans(prev => [...prev, newPlan]);
      }
    } catch (error) {
      console.error('Failed to generate action plan:', error);
    }

    setIsProcessing(false);
  }, [contentItems]);

  const toggleActionStep = useCallback(async (planId: string, stepId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/action-plans/${planId}/steps/${stepId}/toggle`, {
        method: 'PUT',
      });

      if (response.ok) {
        const result = await response.json();
        setActionPlans(prev => prev.map(plan => {
          if (plan.id === planId) {
            return {
              ...plan,
              steps: plan.steps.map(step => 
                step.id === stepId ? { ...step, completed: result.completed } : step
              )
            };
          }
          return plan;
        }));
      }
    } catch (error) {
      console.error('Failed to toggle step:', error);
    }
  }, []);

  // New functionality
  const deleteContent = useCallback((contentId: string) => {
    setContentItems(prev => prev.filter(item => item.id !== contentId));
  }, []);

  const searchContent = useCallback((query: string) => {
    return contentItems.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.extractedText.toLowerCase().includes(query.toLowerCase())
    );
  }, [contentItems]);

  const filterByCategory = useCallback((category: string) => {
    if (category === 'all') return contentItems;
    return contentItems.filter(item => item.categories.includes(category));
  }, [contentItems]);

  const exportData = useCallback(() => {
    const data = {
      contentItems,
      actionPlans,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cognix-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [contentItems, actionPlans]);

  const getAnalytics = useCallback(() => {
    const totalContent = contentItems.length;
    const avgQuality = contentItems.length > 0 
      ? contentItems.reduce((sum, item) => sum + (item.relevanceScore || 0), 0) / contentItems.length
      : 0;
    
    const totalTasks = actionPlans.reduce((sum, plan) => sum + plan.steps.length, 0);
    const completedTasks = actionPlans.reduce((sum, plan) => 
      sum + plan.steps.filter(step => step.completed).length, 0
    );
    const completionRate = totalTasks > 0 ? completedTasks / totalTasks : 0;

    const categoryDistribution = contentItems.reduce((acc, item) => {
      item.categories.forEach(category => {
        acc[category] = (acc[category] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    return {
      totalContent,
      avgQuality,
      completionRate,
      categoryDistribution,
      totalTasks,
      completedTasks
    };
  }, [contentItems, actionPlans]);

  return {
    contentItems,
    actionPlans,
    uploads,
    isProcessing,
    processFiles,
    processText,
    processYouTube,
    generateActionPlan,
    toggleActionStep,
    deleteContent,
    searchContent,
    filterByCategory,
    exportData,
    getAnalytics
  };
};