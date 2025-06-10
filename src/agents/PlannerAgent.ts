import { ContentItem, ActionPlan, ActionStep, AgentResponse } from '../types';

export class PlannerAgent {
  private static instance: PlannerAgent;

  static getInstance(): PlannerAgent {
    if (!PlannerAgent.instance) {
      PlannerAgent.instance = new PlannerAgent();
    }
    return PlannerAgent.instance;
  }

  async generateActionPlan(
    contentItems: ContentItem[],
    userGoals: string[]
  ): Promise<AgentResponse> {
    const startTime = Date.now();
    
    try {
      const actionPlan = this.createActionPlan(contentItems, userGoals);
      
      return {
        success: true,
        data: actionPlan,
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

  async suggestNextSteps(
    contentItems: ContentItem[],
    completedSteps: string[]
  ): Promise<AgentResponse> {
    const startTime = Date.now();
    
    try {
      const suggestions = this.analyzeContentForSuggestions(contentItems, completedSteps);
      
      return {
        success: true,
        data: suggestions,
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

  private createActionPlan(contentItems: ContentItem[], userGoals: string[]): ActionPlan {
    const steps: ActionStep[] = [];
    const categories = this.extractUniqueCategories(contentItems);
    
    // Generate steps based on content analysis
    if (categories.includes('project-management')) {
      steps.push({
        id: 'step-1',
        title: 'Define Project Scope',
        description: 'Based on your documents, clearly define project boundaries and deliverables',
        completed: false,
        resources: this.getRelevantResources(contentItems, 'project-management')
      });
    }

    if (categories.includes('meeting-notes')) {
      steps.push({
        id: 'step-2',
        title: 'Follow Up on Action Items',
        description: 'Review meeting notes and ensure all action items are tracked and assigned',
        completed: false,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        resources: this.getRelevantResources(contentItems, 'meeting-notes')
      });
    }

    if (categories.includes('planning')) {
      steps.push({
        id: 'step-3',
        title: 'Create Detailed Timeline',
        description: 'Develop a comprehensive timeline with milestones based on your planning documents',
        completed: false,
        resources: this.getRelevantResources(contentItems, 'planning')
      });
    }

    if (categories.includes('research')) {
      steps.push({
        id: 'step-4',
        title: 'Synthesize Research Findings',
        description: 'Compile and analyze research data to inform decision making',
        completed: false,
        resources: this.getRelevantResources(contentItems, 'research')
      });
    }

    // Add goal-specific steps
    userGoals.forEach((goal, index) => {
      steps.push({
        id: `goal-step-${index + 1}`,
        title: `Work towards: ${goal}`,
        description: `Take specific actions to achieve this goal based on your content`,
        completed: false,
        resources: this.getRelevantResourcesForGoal(contentItems, goal)
      });
    });

    return {
      id: `plan-${Date.now()}`,
      title: 'Intelligent Action Plan',
      steps,
      priority: this.calculatePriority(userGoals.length, contentItems.length),
      estimatedDuration: this.estimateDuration(steps.length),
      dependencies: this.identifyDependencies(steps)
    };
  }

  private analyzeContentForSuggestions(
    contentItems: ContentItem[],
    completedSteps: string[]
  ): string[] {
    const suggestions = [];
    const categories = this.extractUniqueCategories(contentItems);
    
    if (categories.includes('project-management') && !completedSteps.includes('timeline-review')) {
      suggestions.push('Review and update project timelines based on recent progress');
    }
    
    if (categories.includes('meeting-notes') && !completedSteps.includes('followup-complete')) {
      suggestions.push('Schedule follow-up meetings for unresolved action items');
    }
    
    if (categories.includes('research') && !completedSteps.includes('analysis-complete')) {
      suggestions.push('Conduct deeper analysis on research findings');
    }
    
    return suggestions;
  }

  private extractUniqueCategories(contentItems: ContentItem[]): string[] {
    const categories = new Set<string>();
    contentItems.forEach(item => {
      item.categories.forEach(category => categories.add(category));
    });
    return Array.from(categories);
  }

  private getRelevantResources(contentItems: ContentItem[], category: string): string[] {
    return contentItems
      .filter(item => item.categories.includes(category))
      .map(item => item.title);
  }

  private getRelevantResourcesForGoal(contentItems: ContentItem[], goal: string): string[] {
    const goalKeywords = goal.toLowerCase().split(' ');
    return contentItems
      .filter(item => 
        goalKeywords.some(keyword => 
          item.extractedText.toLowerCase().includes(keyword)
        )
      )
      .map(item => item.title);
  }

  private calculatePriority(goalCount: number, contentCount: number): 'low' | 'medium' | 'high' {
    const score = goalCount * 2 + contentCount;
    if (score >= 8) return 'high';
    if (score >= 4) return 'medium';
    return 'low';
  }

  private estimateDuration(stepCount: number): string {
    const days = Math.max(stepCount * 2, 7); // Minimum 1 week
    if (days <= 7) return '1 week';
    if (days <= 14) return '2 weeks';
    if (days <= 30) return '1 month';
    return `${Math.ceil(days / 30)} months`;
  }

  private identifyDependencies(steps: ActionStep[]): string[] {
    // Simple dependency logic based on step types
    const dependencies = [];
    const stepTitles = steps.map(step => step.title);
    
    if (stepTitles.some(title => title.includes('Timeline'))) {
      dependencies.push('Project scope definition must be completed first');
    }
    
    return dependencies;
  }
}