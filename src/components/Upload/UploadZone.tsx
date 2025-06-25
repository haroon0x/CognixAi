import React, { useCallback, useState } from 'react';
import { Upload, FileText, Youtube, Type } from 'lucide-react';

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
      onTextSubmit(textContent, 'Note');
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
      <div className="border-b border-gray-200">
        <nav className="flex">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center py-4 px-4 text-sm font-medium transition-colors ${
                activeTab === id
                  ? 'text-black border-b-2 border-black'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-8">
        {activeTab === 'file' && (
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              isDragOver
                ? 'border-black bg-gray-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-black mb-2">
              Drop Files
            </h3>
            <p className="text-gray-500 mb-6">
              Extract tasks from documents
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
              className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer font-medium"
            >
              Select Files
            </label>
          </div>
        )}

        {activeTab === 'text' && (
          <div className="space-y-6">
            <textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              rows={8}
              placeholder="Paste notes, emails, or any text..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
            />
            <button
              onClick={handleTextSubmit}
              disabled={!textContent.trim()}
              className="w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Extract Tasks
            </button>
          </div>
        )}

        {activeTab === 'youtube' && (
          <div className="space-y-6">
            <input
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <button
              onClick={handleYouTubeSubmit}
              disabled={!youtubeUrl.trim()}
              className="w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Extract Tasks
            </button>
          </div>
        )}
      </div>
    </div>
  );
};