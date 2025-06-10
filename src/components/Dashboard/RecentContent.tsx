import React from 'react';
import { ContentItem } from '../../types';
import { FileText, Image, Youtube, Type, Clock, Sparkles } from 'lucide-react';

interface RecentContentProps {
  items: ContentItem[];
}

export const RecentContent: React.FC<RecentContentProps> = ({ items }) => {
  const getIcon = (type: ContentItem['type']) => {
    switch (type) {
      case 'pdf': return FileText;
      case 'image': return Image;
      case 'youtube': return Youtube;
      case 'text': return Type;
      default: return FileText;
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Content</h3>
        <div className="text-center py-8">
          <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No content uploaded yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
        <Clock className="h-5 w-5 text-primary-400" />
        <span>Recent Content</span>
      </h3>
      
      <div className="space-y-3">
        {items.map((item) => {
          const Icon = getIcon(item.type);
          const hasAIEnhancement = item.metadata?.enhanced_by_ai;
          
          return (
            <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors">
              <div className="flex-shrink-0 relative">
                <div className="p-2 bg-gray-700/50 rounded-lg">
                  <Icon className="h-4 w-4 text-gray-400" />
                </div>
                {hasAIEnhancement && (
                  <Sparkles className="h-3 w-3 text-primary-400 absolute -top-1 -right-1 animate-pulse" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{item.title}</p>
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <span>{item.type.toUpperCase()}</span>
                  <span>•</span>
                  <span>{item.timestamp.toLocaleDateString()}</span>
                  {item.relevanceScore && (
                    <>
                      <span>•</span>
                      <span className="text-primary-400">{Math.round(item.relevanceScore * 100)}% quality</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};