import React from 'react';
import { UploadProgress } from '../../types';
import { CheckCircle, AlertCircle, Loader, FileText } from 'lucide-react';

interface ProcessingStatusProps {
  uploads: UploadProgress[];
}

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ uploads }) => {
  if (uploads.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
        <FileText className="h-8 w-8 text-gray-300 mx-auto mb-3" />
        <h3 className="font-medium text-black mb-1">Ready to Process</h3>
        <p className="text-sm text-gray-600">Upload content to begin extraction</p>
      </div>
    );
  }

  const getStatusIcon = (status: UploadProgress['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'uploading':
      case 'processing':
        return <Loader className="h-4 w-4 text-blue-600 animate-spin" />;
      default:
        return <div className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: UploadProgress['status']) => {
    switch (status) {
      case 'uploading': return 'Uploading...';
      case 'processing': return 'Processing...';
      case 'completed': return 'Complete';
      case 'error': return 'Error';
      default: return '';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-medium text-black">Processing Status</h3>
      </div>
      
      <div className="max-h-64 overflow-y-auto">
        {uploads.map((upload) => (
          <div key={upload.fileId} className="p-4 border-b border-gray-50 last:border-b-0">
            <div className="flex items-center space-x-3">
              {getStatusIcon(upload.status)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-black truncate">
                  {upload.fileName}
                </p>
                <p className="text-xs text-gray-600">
                  {getStatusText(upload.status)}
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