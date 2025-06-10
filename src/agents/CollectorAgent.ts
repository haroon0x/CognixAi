import { ContentItem, AgentResponse } from '../types';

export class CollectorAgent {
  private static instance: CollectorAgent;

  static getInstance(): CollectorAgent {
    if (!CollectorAgent.instance) {
      CollectorAgent.instance = new CollectorAgent();
    }
    return CollectorAgent.instance;
  }

  async extractFromPDF(file: File): Promise<AgentResponse> {
    const startTime = Date.now();
    
    try {
      // Mock PDF text extraction
      const mockText = `
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

      const contentItem: ContentItem = {
        id: `pdf-${Date.now()}`,
        type: 'pdf',
        title: file.name,
        content: file.name,
        extractedText: mockText,
        metadata: {
          fileSize: file.size,
          lastModified: file.lastModified,
          mimeType: file.type
        },
        timestamp: new Date(),
        status: 'completed',
        categories: []
      };

      return {
        success: true,
        data: contentItem,
        processingTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        processingTime: Date.now() - startTime
      };
    }
  }

  async extractFromImage(file: File): Promise<AgentResponse> {
    const startTime = Date.now();
    
    try {
      // Mock OCR text extraction
      const mockText = `
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

      const contentItem: ContentItem = {
        id: `img-${Date.now()}`,
        type: 'image',
        title: file.name,
        content: file.name,
        extractedText: mockText,
        metadata: {
          fileSize: file.size,
          dimensions: '1920x1080', // Mock dimensions
          format: file.type
        },
        timestamp: new Date(),
        status: 'completed',
        categories: []
      };

      return {
        success: true,
        data: contentItem,
        processingTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        processingTime: Date.now() - startTime
      };
    }
  }

  async extractFromYouTube(url: string): Promise<AgentResponse> {
    const startTime = Date.now();
    
    try {
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

      const contentItem: ContentItem = {
        id: `yt-${Date.now()}`,
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
        categories: []
      };

      return {
        success: true,
        data: contentItem,
        processingTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        processingTime: Date.now() - startTime
      };
    }
  }

  async extractFromText(text: string, title: string = 'Text Note'): Promise<AgentResponse> {
    const startTime = Date.now();
    
    try {
      const contentItem: ContentItem = {
        id: `text-${Date.now()}`,
        type: 'text',
        title,
        content: text,
        extractedText: text,
        metadata: {
          wordCount: text.split(' ').length,
          characterCount: text.length
        },
        timestamp: new Date(),
        status: 'completed',
        categories: []
      };

      return {
        success: true,
        data: contentItem,
        processingTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        processingTime: Date.now() - startTime
      };
    }
  }
}