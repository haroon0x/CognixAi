import React, { useCallback, useState } from 'react';
import { Upload, FileText, Youtube, Type, Plus } from 'lucide-react';

interface UploadZoneProps {
  onFileUpload: (files: FileList) => void;
  onTextSubmit: (text: string, title: string) => void;
  onYouTubeSubmit: (url: string) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  onFileUpload,
  onTextSubmit,
  onYouTubeSubmit
}) => {
  const [activeTab, setActiveTab] = useState<'file' | 'text' | 'youtube'>('file');
  const [textContent, setTextContent] = useState('');
  const [textTitle, setTextTitle] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileUpload(files);
    }
  }, [onFileUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileUpload(files);
    }
  }, [onFileUpload]);

  const handleTextSubmit = () => {
    if (textContent.trim()) {
      onTextSubmit(textContent, textTitle || 'Text Note');
      setTextContent('');
      setTextTitle('');
    }
  };

  const handleYouTubeSubmit = () => {
    if (youtubeUrl.trim()) {
      onYouTubeSubmit(youtubeUrl);
      setYoutubeUrl('');
    }
  };

  const tabs = [
    { id: 'file' as const, label: 'Files', icon: FileText },
    { id: 'text' as const, label: 'Text', icon: Type },
    { id: 'youtube' as const, label: 'Video', icon: Youtube }
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      {/* Tab Navigation */}
      <div className="border-b border-gray-100">
        <nav className="flex">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === id
                  ? 'text-black border-b-2 border-black'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'file' && (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver
                ? 'border-black bg-gray-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-black mb-2">Upload Files</h3>
            <p className="text-gray-600 mb-4">
              Drop files here or click to browse
            </p>
            <p className="text-xs text-gray-500 mb-6">
              Supports PDF, images, text files, and documents
            </p>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              multiple
              accept=".pdf,.png,.jpg,.jpeg,.txt,.md,.docx"
              onChange={handleFileSelect}
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer font-medium"
            >
              <Plus className="h-4 w-4 mr-2" />
              Select Files
            </label>
          </div>
        )}

        {activeTab === 'text' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title (optional)
              </label>
              <input
                type="text"
                value={textTitle}
                onChange={(e) => setTextTitle(e.target.value)}
                placeholder="Enter a title for your note..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                rows={6}
                placeholder="Paste notes, emails, or any text content..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
              />
            </div>
            <button
              onClick={handleTextSubmit}
              disabled={!textContent.trim()}
              className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Extract Tasks
            </button>
          </div>
        )}

        {activeTab === 'youtube' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                YouTube URL
              </label>
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <p className="text-xs text-gray-500">
              Extract tasks and insights from video transcripts
            </p>
            <button
              onClick={handleYouTubeSubmit}
              disabled={!youtubeUrl.trim()}
              className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Extract Tasks
            </button>
          </div>
        )}
      </div>
    </div>
  );
};