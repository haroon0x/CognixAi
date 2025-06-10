import { ContentItem, AgentResponse } from '../types';

export class ContextMapperAgent {
  private static instance: ContextMapperAgent;

  static getInstance(): ContextMapperAgent {
    if (!ContextMapperAgent.instance) {
      ContextMapperAgent.instance = new ContextMapperAgent();
    }
    return ContextMapperAgent.instance;
  }

  async categorizeContent(contentItems: ContentItem[]): Promise<AgentResponse> {
    const startTime = Date.now();
    
    try {
      const categorizedItems = contentItems.map(item => {
        const categories = this.extractCategories(item.extractedText);
        const relevanceScore = this.calculateRelevanceScore(item.extractedText);
        
        return {
          ...item,
          categories,
          relevanceScore
        };
      });

      return {
        success: true,
        data: categorizedItems,
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

  async findRelationships(contentItems: ContentItem[]): Promise<AgentResponse> {
    const startTime = Date.now();
    
    try {
      const relationships = [];
      
      for (let i = 0; i < contentItems.length; i++) {
        for (let j = i + 1; j < contentItems.length; j++) {
          const similarity = this.calculateSimilarity(
            contentItems[i].extractedText,
            contentItems[j].extractedText
          );
          
          if (similarity > 0.3) {
            relationships.push({
              item1: contentItems[i].id,
              item2: contentItems[j].id,
              similarity,
              commonTopics: this.findCommonTopics(
                contentItems[i].categories,
                contentItems[j].categories
              )
            });
          }
        }
      }

      return {
        success: true,
        data: relationships,
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

  private extractCategories(text: string): string[] {
    const categories = [];
    const lowercaseText = text.toLowerCase();
    
    // Mock category extraction based on keywords
    const categoryKeywords = {
      'project-management': ['project', 'timeline', 'milestone', 'deadline', 'scope'],
      'meeting-notes': ['meeting', 'agenda', 'attendees', 'action items', 'notes'],
      'planning': ['plan', 'strategy', 'objective', 'goal', 'roadmap'],
      'research': ['research', 'analysis', 'data', 'study', 'findings'],
      'development': ['development', 'code', 'programming', 'technical', 'software'],
      'marketing': ['marketing', 'campaign', 'promotion', 'brand', 'advertising'],
      'finance': ['budget', 'cost', 'revenue', 'financial', 'expense']
    };

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => lowercaseText.includes(keyword))) {
        categories.push(category);
      }
    }

    return categories.length > 0 ? categories : ['general'];
  }

  private calculateRelevanceScore(text: string): number {
    // Mock relevance scoring based on content quality indicators
    const qualityIndicators = [
      'objective', 'goal', 'plan', 'action', 'timeline',
      'deliverable', 'requirement', 'milestone', 'task'
    ];
    
    const lowercaseText = text.toLowerCase();
    const matches = qualityIndicators.filter(indicator => 
      lowercaseText.includes(indicator)
    ).length;
    
    return Math.min(matches / qualityIndicators.length, 1);
  }

  private calculateSimilarity(text1: string, text2: string): number {
    // Simple word overlap similarity calculation
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));
    
    const intersection = new Set([...words1].filter(word => words2.has(word)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size;
  }

  private findCommonTopics(categories1: string[], categories2: string[]): string[] {
    return categories1.filter(cat => categories2.includes(cat));
  }
}