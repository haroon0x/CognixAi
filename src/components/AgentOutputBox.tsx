import React from 'react';

interface AgentOutputBoxProps {
  title?: string;
  output: any;
}

export const AgentOutputBox: React.FC<AgentOutputBoxProps> = ({ title = 'Agent Output', output }) => {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(
      typeof output === 'string' ? output : JSON.stringify(output, null, 2)
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="bg-gray-900 text-white rounded-lg p-4 mt-4 shadow-lg border border-gray-700 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold">{title}</span>
        <button
          onClick={handleCopy}
          className="text-xs px-2 py-1 bg-gray-700 rounded hover:bg-gray-600 focus:outline-none"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto whitespace-pre-wrap text-xs bg-gray-800 rounded p-2">
        {typeof output === 'string' ? output : JSON.stringify(output, null, 2)}
      </pre>
    </div>
  );
}; 