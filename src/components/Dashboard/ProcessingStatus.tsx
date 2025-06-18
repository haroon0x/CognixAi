import React from 'react';
import { UploadProgress } from '../../types';
import { CheckCircle, AlertCircle, Loader, CheckSquare } from 'lucide-react';

interface ProcessingStatusProps {
  uploads: UploadProgress[];
}

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ uploads }) => {
  if (uploads.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <CheckSquare className="h-8 w-8 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-black mb-2">Ready</h3>
        <p className="text-gray-500">Upload content to extract tasks</p>
      </div>
    );
  }

  const getStatusIcon = (status: UploadProgress['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-black" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
      case 'uploading':
      case 'processing':
        return <Loader className="h-4 w-4 text-gray-600 animate-spin" />;
      default:
        return <div className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-black">Processing</h3>
      </div>
      
      <div className="max-h-64 overflow-y-auto">
        {uploads.map((upload) => (
          <div key={upload.fileId} className="p-4 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center space-x-3">
              {getStatusIcon(upload.status)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-black truncate">
                  {upload.fileName}
                </p>
                {(upload.status === 'uploading' || upload.status === 'processing') && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-black h-1 rounded-full transition-all duration-300"
                        style={{ width: `${upload.progress}%` }}
                      />
                    </div>
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