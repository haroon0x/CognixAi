import React, { useCallback, useState } from 'react';
import { Upload, FileText, Youtube, Type, Sparkles, Plus, CheckSquare, Brain } from 'lucide-react';

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
    { id: 'file' as const, label: 'Documents', icon: FileText, description: 'PDFs, images, text files' },
    { id: 'text' as const, label: 'Notes', icon: Type, description: 'Raw text content' },
    { id: 'youtube' as const, label: 'Videos', icon: Youtube, description: 'YouTube transcripts' }
  ];

  return (
    <div className="bg-gray-900/30 backdrop-blur-xl border border-gray-800/50 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-800/50">
        <div className="flex items-center space-x-2 mb-2">
          <CheckSquare className="h-5 w-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Extract Tasks from Unstructured Data</h3>
        </div>
        <p className="text-sm text-gray-400">Upload any content and AI will identify actionable tasks</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-800/50">
        <nav className="flex">
          {tabs.map(({ id, label, icon: Icon, description }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex flex-col items-center justify-center py-3 px-4 text-sm font-medium transition-all duration-200 ${
                activeTab === id
                  ? 'text-blue-400 border-b-2 border-blue-500 bg-blue-500/5'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/30'
              }`}
            >
              <Icon className="h-4 w-4 mb-1" />
              <span>{label}</span>
              <span className="text-xs text-gray-500">{description}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'file' && (
          <div
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
              isDragOver
                ? 'border-blue-400 bg-blue-500/5 scale-105'
                : 'border-gray-700/50 hover:border-gray-600/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="relative inline-block mb-4">
              <Upload className="h-12 w-12 text-gray-500 mx-auto" />
              <Brain className="h-4 w-4 text-blue-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Drop files to extract tasks
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              Meeting notes, project docs, emails • AI finds actionable items
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
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <CheckSquare className="h-4 w-4 mr-2" />
              Select Files
            </label>
          </div>
        )}

        {activeTab === 'text' && (
          <div className="space-y-4">
            <input
              type="text"
              value={textTitle}
              onChange={(e) => setTextTitle(e.target.value)}
              placeholder="Title (optional)"
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
            />
            <textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              rows={6}
              placeholder="Paste meeting notes, project ideas, or any unstructured text..."
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none transition-all duration-200"
            />
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
              <p className="text-sm text-blue-300 flex items-center">
                <Brain className="h-4 w-4 mr-2" />
                AI will scan for tasks, deadlines, and action items
              </p>
            </div>
            <button
              onClick={handleTextSubmit}
              disabled={!textContent.trim()}
              className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
            >
              <CheckSquare className="h-4 w-4 mr-2" />
              Extract Tasks
            </button>
          </div>
        )}

        {activeTab === 'youtube' && (
          <div className="space-y-4">
            <input
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
            />
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
              <p className="text-sm text-blue-300 flex items-center mb-2">
                <Brain className="h-4 w-4 mr-2" />
                AI will extract transcript and identify:
              </p>
              <ul className="text-xs text-blue-200 space-y-1 ml-6">
                <li>• Action items mentioned</li>
                <li>• Deadlines and timelines</li>
                <li>• Key decisions and next steps</li>
              </ul>
            </div>
            <button
              onClick={handleYouTubeSubmit}
              disabled={!youtubeUrl.trim()}
              className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
            >
              <Youtube className="h-4 w-4 mr-2" />
              Extract Tasks from Video
            </button>
          </div>
        )}
      </div>
    </div>
  );
};