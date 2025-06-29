import { useState, useCallback } from 'react';
import { ContentItem, ActionPlan, UploadProgress, AgentResponse } from '../types';

// IMPORTANT: Set REACT_APP_API_URL in your .env to your backend URL (e.g., http://localhost:8000/api)
// If using a proxy (see vite.config.ts), '/api' will be proxied to the backend.
const API_BASE_URL = import.meta.env.REACT_APP_API_URL || '/api';

const AGENT_NAME = "planner_agent"; // Change to your actual agent folder name
const USER_ID = "u_123";
const SESSION_ID = "s_" + USER_ID; // Or generate a unique session per user

// Use the new /plan endpoint for all agent calls
export function useAgents() {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<ActionPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rawOutput, setRawOutput] = useState<any>(null);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rawPlan, setRawPlan] = useState<string | null>(null);
  const [planGenerated, setPlanGenerated] = useState(false);

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

  // Generate a plan using the /plan endpoint
  const generatePlan = useCallback(async (goals: string[]) => {
    setLoading(true);
    setError(null);
    setPlan(null);
    setRawPlan(null);
    setRawOutput(null);
    setPlanGenerated(false);
    try {
      const response = await fetch(`/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: goals.join("\n") })
      });
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();
      console.log("API /plan response:", data);
      setRawOutput(data);
      if (data && !data.error && data.id && data.title && Array.isArray(data.steps)) {
        setPlan(data);
        setPlanGenerated(true);
      } else if (data && (data.error || data.raw)) {
        setRawPlan(data.raw || data.error);
      } else {
        setError("No plan returned from agent.");
      }
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  // Utility to reset the plan generated flag
  const resetPlanGenerated = useCallback(() => setPlanGenerated(false), []);

  // Process text and extract plan using /plan endpoint
  const processText = useCallback(async (text: string, title: string) => {
    setIsProcessing(true);
    const fileId = `text-${Date.now()}`;
    addUpload(fileId, title);
    setRawPlan(null);
    try {
      updateUpload(fileId, { status: 'processing', progress: 50 });
      const response = await fetch(`/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      if (response.ok) {
        const data = await response.json();
        console.log("API /plan response:", data);
        setRawOutput(data);
        if (data && !data.error && data.id && data.title && Array.isArray(data.steps)) {
          setPlan(data);
          setPlanGenerated(true); // This triggers the notification
          setContentItems(prev => [...prev, {
            id: fileId,
            type: 'text',
            title,
            content: text,
            extractedText: text,
            metadata: {},
            timestamp: new Date(),
            status: 'completed',
            categories: [],
          }]);
          updateUpload(fileId, { status: 'completed', progress: 100 });
        } else if (data && (data.error || data.raw)) {
          setRawPlan(data.raw || data.error);
          updateUpload(fileId, { status: 'completed', progress: 100 });
        } else {
          setError('No plan returned from agent.');
          updateUpload(fileId, { status: 'error' });
        }
      } else {
        setError('Server error');
        updateUpload(fileId, { status: 'error' });
      }
    } catch (error: any) {
      setError(error.message || 'Unknown error');
      updateUpload(fileId, { status: 'error' });
    }
    setIsProcessing(false);
  }, [addUpload, updateUpload]);

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

        // Mock file processing - extract content
        let extractedText = '';
        if (file.type === 'application/pdf') {
          extractedText = `
            Project Planning Document
            
            Objective: Complete the quarterly marketing campaign
            
            Key Components:
            1. Market research and competitor analysis
            2. Creative asset development
            3. Campaign timeline and budget allocation
            4. Performance metrics and KPIs
            
            Resources needed:
            - Design team collaboration
            - Budget approval from finance
            - Content creation timeline
            - Distribution channel strategy
          `;
        } else if (file.type.startsWith('image/')) {
          extractedText = `
            Meeting Notes - Project Kickoff
            Date: December 15, 2024
            
            Attendees: Sarah, Mike, Alex, Jennifer
            
            Agenda Items:
            • Project scope and deliverables
            • Timeline and milestones
            • Resource allocation
            • Risk assessment
            
            Action Items:
            1. Sarah - Finalize project requirements by Dec 20
            2. Mike - Set up development environment
            3. Alex - Create initial wireframes
            4. Jennifer - Schedule stakeholder reviews
            
            Next Meeting: December 22, 2024
          `;
        } else {
          extractedText = await file.text();
        }

        const newItem: ContentItem = {
          id: fileId,
          type: file.type === 'application/pdf' ? 'pdf' : file.type.startsWith('image/') ? 'image' : 'text',
          title: file.name,
          content: file.name,
          extractedText,
          metadata: {
            fileSize: file.size,
            lastModified: file.lastModified,
            mimeType: file.type
          },
          timestamp: new Date(),
          status: 'completed',
          categories: ['project-management']
        };

        setContentItems(prev => [...prev, newItem]);
        updateUpload(fileId, { status: 'completed' });
      } catch (error) {
        console.error('Error processing file:', error);
        updateUpload(fileId, { status: 'error' });
      }
    }

    setIsProcessing(false);
  }, [addUpload, updateUpload]);

  const processYouTube = useCallback(async (url: string) => {
    setIsProcessing(true);
    const fileId = `youtube-${Date.now()}`;
    addUpload(fileId, 'YouTube Video');

    try {
      updateUpload(fileId, { status: 'processing', progress: 50 });

      // Mock YouTube transcript extraction
      const mockTranscript = `
        Welcome to this tutorial on project management best practices.
        
        Today we'll cover:
        - Setting clear objectives and scope
        - Building effective team communication
        - Managing timelines and deadlines
        - Risk mitigation strategies
        - Quality assurance processes
        
        The first step in any successful project is defining clear, measurable objectives.
        Without proper goal setting, teams often lose focus and deliverables become unclear.
        
        Communication is the backbone of project success. Regular check-ins, status updates,
        and transparent reporting help keep everyone aligned and accountable.
        
        Timeline management requires balancing optimism with realism. Build in buffer time
        for unexpected challenges while maintaining momentum toward key milestones.
      `;

      const newItem: ContentItem = {
        id: fileId,
        type: 'youtube',
        title: 'Project Management Best Practices',
        content: url,
        extractedText: mockTranscript,
        metadata: {
          url,
          duration: '15:32',
          publishedDate: '2024-12-01',
          channelName: 'PM Academy'
        },
        timestamp: new Date(),
        status: 'completed',
        categories: ['project-management']
      };

      setContentItems(prev => [...prev, newItem]);
      updateUpload(fileId, { status: 'completed', progress: 100 });
    } catch (error) {
      console.error('Error processing YouTube URL:', error);
      updateUpload(fileId, { status: 'error' });
    }

    setIsProcessing(false);
  }, [addUpload, updateUpload]);

  const toggleActionStep = useCallback(async (planId: string, stepId: string) => {
    // Update the plan in state
    setPlan(prevPlan => {
      if (!prevPlan || prevPlan.id !== planId) return prevPlan;
      
      return {
        ...prevPlan,
        steps: prevPlan.steps.map(step => 
          step.id === stepId ? { ...step, completed: !step.completed } : step
        )
      };
    });
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
      actionPlans: plan ? [plan] : [],
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
  }, [contentItems, plan]);

  const getAnalytics = useCallback(() => {
    const totalContent = contentItems.length;
    const avgQuality = contentItems.length > 0 
      ? contentItems.reduce((sum, item) => sum + (item.relevanceScore || 0.8), 0) / contentItems.length
      : 0;
    
    const totalTasks = plan ? plan.steps.length : 0;
    const completedTasks = plan ? plan.steps.filter(step => step.completed).length : 0;
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
  }, [contentItems, plan]);

  // At the end of the hook, ensure actionPlans is always an array
  const actionPlans = plan ? [plan] : [];

  return {
    contentItems,
    actionPlans,
    rawPlan,
    uploads,
    isProcessing,
    processFiles,
    processText,
    processYouTube,
    generateActionPlan: generatePlan,
    toggleActionStep,
    deleteContent,
    searchContent,
    filterByCategory,
    exportData,
    getAnalytics,
    planGenerated,
    resetPlanGenerated,
  };
}