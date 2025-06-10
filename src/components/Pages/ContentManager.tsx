import React, { useState } from 'react';
import { ContentList } from '../Content/ContentList';
import { UploadZone } from '../Upload/UploadZone';
import { ContentFilters } from '../Content/ContentFilters';
import { ContentItem } from '../../types';
import { Search, Filter, Grid, List, Download, Trash2 } from 'lucide-react';

interface ContentManagerProps {
  contentItems: ContentItem[];
  onFileUpload: (files: FileList) => void;
  onTextSubmit: (text: string, title: string) => void;
  onYouTubeSubmit: (url: string) => void;
  onDeleteContent: (contentId: string) => void;
  onSearchContent: (query: string) => ContentItem[];
  onFilterByCategory: (category: string) => ContentItem[];
  onExportData: () => void;
}

export const ContentManager: React.FC<ContentManagerProps> = ({
  contentItems,
  onFileUpload,
  onTextSubmit,
  onYouTubeSubmit,
  onDeleteContent,
  onExportData
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const filteredItems = contentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.extractedText.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const handleItemSelect = (item: ContentItem) => {
    setSelectedItems(prev => 
      prev.includes(item.id) 
        ? prev.filter(id => id !== item.id)
        : [...prev, item.id]
    );
  };

  const handleBulkDelete = () => {
    selectedItems.forEach(id => onDeleteContent(id));
    setSelectedItems([]);
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-gray-900/30 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Add New Content</h2>
        <UploadZone
          onFileUpload={onFileUpload}
          onTextSubmit={onTextSubmit}
          onYouTubeSubmit={onYouTubeSubmit}
        />
      </div>

      {/* Content Management */}
      <div className="bg-gray-900/30 backdrop-blur-xl border border-gray-800/50 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-800/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Content Library</h2>
            <div className="flex items-center space-x-2">
              {selectedItems.length > 0 && (
                <>
                  <button
                    onClick={handleBulkDelete}
                    className="flex items-center space-x-2 px-3 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete ({selectedItems.length})</span>
                  </button>
                  <button
                    onClick={onExportData}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-all"
                  >
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </button>
                </>
              )}
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-800/50 text-gray-400 hover:text-white'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-800/50 text-gray-400 hover:text-white'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search content..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-300 hover:text-white transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4">
              <ContentFilters
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                contentItems={contentItems}
              />
            </div>
          )}
        </div>

        {/* Content List */}
        <div className="p-6">
          <ContentList 
            items={filteredItems} 
            viewMode={viewMode}
            onItemSelect={handleItemSelect}
            selectedItems={selectedItems}
          />
        </div>
      </div>
    </div>
  );
};