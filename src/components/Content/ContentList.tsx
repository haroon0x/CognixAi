import React from 'react';
import { ContentItem } from '../../types';
import { FileText, Image, Youtube, Type, Clock } from 'lucide-react';

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
      case 'pdf': return FileText;
      case 'image': return Image;
      case 'youtube': return Youtube;
      case 'text': return Type;
      default: return FileText;
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-black mb-2">No Content</h3>
        <p className="text-gray-500">Upload files to extract tasks</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const Icon = getIcon(item.type);
        const isSelected = selectedItems.includes(item.id);
        const tasksCount = Math.floor(Math.random() * 5) + 1;
        
        return (
          <div
            key={item.id}
            className={`bg-white border rounded-lg p-4 transition-all cursor-pointer hover:border-gray-300 ${
              isSelected ? 'border-black' : 'border-gray-200'
            }`}
            onClick={() => onItemSelect?.(item)}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg">
                <Icon className="h-5 w-5 text-gray-600" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-black truncate">
                    {item.title}
                  </h3>
                  <span className="text-xs text-gray-500 font-mono">
                    {item.type.toUpperCase()}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {item.extractedText.substring(0, 120)}...
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{item.timestamp.toLocaleDateString()}</span>
                  </div>
                  <span className="font-mono">{tasksCount} tasks</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};