import React from 'react';
import { UploadProgress } from '../../types';
import { CheckCircle, AlertCircle, Loader, FileText, Sparkles } from 'lucide-react';

interface ProcessingStatusProps {
  uploads: UploadProgress[];
}

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ uploads }) => {
  if (uploads.length === 0) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
        <div className="text-center py-8">
          <Sparkles className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">AI Agents Ready</h3>
          <p className="text-gray-400">Upload content to see real-time processing status</p>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: UploadProgress['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      case 'uploading':
      case 'processing':
        return <Loader className="h-5 w-5 text-primary-400 animate-spin" />;
      default:
        return <FileText className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: UploadProgress['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'error':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'uploading':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'processing':
        return 'text-primary-400 bg-primary-500/10 border-primary-500/30';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-gray-800">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-primary-400" />
          <span>AI Processing Status</span>
        </h3>
        <p className="text-sm text-gray-400">Real-time updates from your AI agents</p>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {uploads.map((upload) => (
          <div key={upload.fileId} className="p-4 border-b border-gray-800 last:border-b-0">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {getStatusIcon(upload.status)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-white truncate">
                    {upload.fileName}
                  </p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(upload.status)}`}>
                    {upload.status.toUpperCase()}
                  </span>
                </div>
                
                {upload.status === 'uploading' || upload.status === 'processing' ? (
                  <div className="space-y-2">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${upload.progress}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-400">
                      {upload.status === 'uploading' && 'Uploading file...'}
                      {upload.status === 'processing' && (
                        <span className="flex items-center space-x-1">
                          <Sparkles className="h-3 w-3 animate-pulse" />
                          <span>AI agents analyzing content...</span>
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-xs">
                    {upload.status === 'completed' && (
                      <>
                        <CheckCircle className="h-3 w-3 text-green-400" />
                        <span className="text-green-400">Content extracted and analyzed by AI</span>
                      </>
                    )}
                    {upload.status === 'error' && (
                      <>
                        <AlertCircle className="h-3 w-3 text-red-400" />
                        <span className="text-red-400">Processing failed</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};