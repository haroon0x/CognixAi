import React, { useState } from 'react';
import { ContentItem } from '../../types';
import { Search, Filter, FileText, Image, Youtube, Type, Calendar, Tag, Trash2, Eye } from 'lucide-react';

interface ContentManagerProps {
  contentItems: ContentItem[];
  onDeleteContent: (contentId: string) => void;
  onSearchContent: (query: string) => ContentItem[];
  onFilterByCategory: (category: string) => ContentItem[];
}

export const ContentManager: React.FC<ContentManagerProps> = ({
  contentItems,
  onDeleteContent,
  onSearchContent,
  onFilterByCategory
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);

  const getIcon = (type: ContentItem['type']) => {
    switch (type) {
      case 'pdf': return FileText;
      case 'image': return Image;
      case 'youtube': return Youtube;
      case 'text': return Type;
      default: return FileText;
    }
  };

  const categories = ['all', ...Array.from(new Set(contentItems.flatMap(item => item.categories)))];
  
  const filteredItems = contentItems.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.extractedText.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      item.categories.includes(selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-black">Content</h1>
        <p className="text-gray-600 mt-1">Manage and organize your extracted content</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent appearance-none bg-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content List */}
        <div className="lg:col-span-2">
          {filteredItems.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-black mb-2">No Content Found</h3>
              <p className="text-gray-600">
                {searchQuery || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Upload content to get started'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredItems.map((item) => {
                const Icon = getIcon(item.type);
                
                return (
                  <div
                    key={item.id}
                    className={`bg-white border rounded-lg p-4 transition-all cursor-pointer ${
                      selectedItem?.id === item.id 
                        ? 'border-black shadow-sm' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <Icon className="h-4 w-4 text-gray-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-black truncate">{item.title}</h4>
                        <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                          <span className="uppercase">{item.type}</span>
                          <span>•</span>
                          <Calendar className="h-3 w-3" />
                          <span>{item.timestamp.toLocaleDateString()}</span>
                          {item.relevanceScore && (
                            <>
                              <span>•</span>
                              <span>{Math.round(item.relevanceScore * 100)}% quality</span>
                            </>
                          )}
                        </div>
                        
                        {item.categories.length > 0 && (
                          <div className="flex items-center space-x-1 mt-2">
                            <Tag className="h-3 w-3 text-gray-400" />
                            <div className="flex space-x-1">
                              {item.categories.slice(0, 2).map(category => (
                                <span key={category} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                  {category.replace('-', ' ')}
                                </span>
                              ))}
                              {item.categories.length > 2 && (
                                <span className="text-xs text-gray-500">+{item.categories.length - 2}</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItem(item);
                          }}
                          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                          title="View details"
                        >
                          <Eye className="h-4 w-4 text-gray-500" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteContent(item.id);
                            if (selectedItem?.id === item.id) {
                              setSelectedItem(null);
                            }
                          }}
                          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Content Preview */}
        <div className="lg:col-span-1">
          {selectedItem ? (
            <div className="bg-white border border-gray-200 rounded-lg p-4 sticky top-8">
              <h3 className="font-medium text-black mb-4">Content Preview</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Title</h4>
                  <p className="text-sm text-gray-700">{selectedItem.title}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Type</h4>
                  <p className="text-sm text-gray-700 uppercase">{selectedItem.type}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Categories</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedItem.categories.map(category => (
                      <span key={category} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {category.replace('-', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Extracted Text</h4>
                  <div className="text-xs text-gray-600 bg-gray-50 rounded p-3 max-h-64 overflow-y-auto">
                    {selectedItem.extractedText.substring(0, 500)}
                    {selectedItem.extractedText.length > 500 && '...'}
                  </div>
                </div>
                
                {Object.keys(selectedItem.metadata).length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-1">Metadata</h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      {Object.entries(selectedItem.metadata).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="font-medium">{key}:</span>
                          <span>{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center sticky top-8">
              <FileText className="h-8 w-8 text-gray-400 mx-auto mb-4" />
              <h3 className="font-medium text-black mb-2">Select Content</h3>
              <p className="text-sm text-gray-600">Choose an item to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};