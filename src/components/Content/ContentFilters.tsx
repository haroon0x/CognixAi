import React from 'react';
import { ContentItem } from '../../types';

interface ContentFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  contentItems: ContentItem[];
}

export const ContentFilters: React.FC<ContentFiltersProps> = ({
  selectedCategory,
  onCategoryChange,
  contentItems
}) => {
  const categories = ['all', ...new Set(contentItems.flatMap(item => item.categories))];
  
  const getCategoryCount = (category: string) => {
    if (category === 'all') return contentItems.length;
    return contentItems.filter(item => item.categories.includes(category)).length;
  };

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === category
              ? 'bg-primary-500 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          {category === 'all' ? 'All' : category.replace('-', ' ')} ({getCategoryCount(category)})
        </button>
      ))}
    </div>
  );
};