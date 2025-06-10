import React from 'react';
import { ContentItem } from '../../types';
import { FileText, Image, Youtube, Type, Clock, Tag, Sparkles, Brain, CheckSquare } from 'lucide-react';

interface ContentListProps {
  items: ContentItem[];
  onItemSelect?: (item: ContentItem) => void;
  selectedItems?: string[];
  viewMode?: 'grid' | 'list';
}

export const ContentList: React.FC<ContentListProps> = ({
  items,
  onItemSelect,
  selectedItems = [],
  viewMode = 'list'
}) => {
  const getIcon = (type: ContentItem['type']) => {
    switch (type) {
      case 'pdf':
        return FileText;
      case 'image':
        return Image;
      case 'youtube':
        return Youtube;
      case 'text':
        return Type;
      default:
        return FileText;
    }
  };

  const getTypeColor = (type: ContentItem['type']) => {
    switch (type) {
      case 'pdf':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'image':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'youtube':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'text':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status: ContentItem['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'processing':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  // Mock function to calculate extracted tasks
  const getExtractedTasksCount = (item: ContentItem) => {
    // In real implementation, this would come from AI analysis
    return Math.floor(Math.random() * 5) + 1; // 1-5 tasks per item
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckSquare className="h-16 w-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">No content processed yet</h3>
        <p className="text-gray-400">Upload documents, notes, or videos to extract actionable tasks</p>
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const Icon = getIcon(item.type);
          const isSelected = selectedItems.includes(item.id);
          const tasksCount = getExtractedTasksCount(item);
          
          return (
            <div
              key={item.id}
              className={`bg-gray-800/30 backdrop-blur-sm rounded-xl border p-4 transition-all hover:bg-gray-800/50 cursor-pointer ${
                isSelected ? 'ring-2 ring-blue-500 border-blue-500/50' : 'border-gray-700'
              }`}
              onClick={() => onItemSelect?.(item)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-gray-700/50 rounded-lg relative">
                  <Icon className="h-5 w-5 text-gray-400" />
                  <CheckSquare className="h-3 w-3 text-emerald-400 absolute -top-1 -right-1" />
                </div>
                <div className="flex space-x-1">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(item.type)}`}>
                    {item.type.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <h3 className="font-medium text-white mb-2 line-clamp-2">
                {item.title}
              </h3>
              
              <p className="text-sm text-gray-400 line-clamp-3 mb-3">
                {item.extractedText.substring(0, 120)}...
              </p>
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1 text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>{item.timestamp.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckSquare className="h-3 w-3 text-emerald-400" />
                  <span className="text-emerald-400">{tasksCount} tasks</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const Icon = getIcon(item.type);
        const isSelected = selectedItems.includes(item.id);
        const hasAIEnhancement = item.metadata?.enhanced_by_ai;
        const tasksCount = getExtractedTasksCount(item);
        
        return (
          <div
            key={item.id}
            className={`bg-gray-800/30 backdrop-blur-sm rounded-xl border p-4 transition-all hover:bg-gray-800/50 cursor-pointer ${
              isSelected ? 'ring-2 ring-blue-500 border-blue-500/50' : 'border-gray-700'
            }`}
            onClick={() => onItemSelect?.(item)}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="p-3 bg-gray-700/50 rounded-xl relative">
                  <Icon className="h-6 w-6 text-gray-400" />
                  {hasAIEnhancement && (
                    <Brain className="h-3 w-3 text-blue-400 absolute -top-1 -right-1 animate-pulse" />
                  )}
                  <CheckSquare className="h-3 w-3 text-emerald-400 absolute -bottom-1 -right-1" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-white truncate flex items-center space-x-2">
                    <span>{item.title}</span>
                    {hasAIEnhancement && (
                      <Brain className="h-3 w-3 text-blue-400" title="AI Enhanced" />
                    )}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(item.type)}`}>
                      {item.type.toUpperCase()}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                  {item.extractedText.substring(0, 200)}...
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{item.timestamp.toLocaleDateString()}</span>
                    </div>
                    {item.relevanceScore && (
                      <div className="flex items-center space-x-1">
                        <Brain className="h-3 w-3 text-blue-400" />
                        <span className="text-blue-400">{Math.round(item.relevanceScore * 100)}% quality</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <CheckSquare className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">{tasksCount} tasks extracted</span>
                    </div>
                    
                    {item.categories.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <Tag className="h-3 w-3 text-gray-500" />
                        <div className="flex space-x-1">
                          {item.categories.slice(0, 2).map((category) => (
                            <span
                              key={category}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                            >
                              {category.replace('-', ' ')}
                            </span>
                          ))}
                          {item.categories.length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{item.categories.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};