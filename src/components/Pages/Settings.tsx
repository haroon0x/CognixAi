import React, { useState } from 'react';
import { Settings as SettingsIcon, Brain, Zap, Bell, Shield, Palette } from 'lucide-react';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('ai');

  const tabs = [
    { id: 'ai', label: 'AI Agents', icon: Brain },
    { id: 'performance', label: 'Performance', icon: Zap },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400">Configure your AI agents and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
            {activeTab === 'ai' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">AI Agent Configuration</h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-800/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white">Collector Agent</h4>
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">
                      Extracts and processes content from various sources
                    </p>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-gray-300">Enable OCR enhancement</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-gray-300">Auto-categorize content</span>
                      </label>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-800/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white">Context Mapper Agent</h4>
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">
                      Analyzes relationships and categorizes content
                    </p>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-gray-300">Deep relationship analysis</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-gray-300">Quality scoring</span>
                      </label>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-800/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white">Planner Agent</h4>
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">
                      Generates intelligent action plans
                    </p>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-gray-300">Smart task prioritization</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-gray-300">Deadline suggestions</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Performance Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Processing Quality</label>
                    <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white">
                      <option>High Quality (Slower)</option>
                      <option>Balanced</option>
                      <option>Fast (Lower Quality)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Batch Size</label>
                    <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      defaultValue="5"
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-400 mt-1">
                      <span>1 file</span>
                      <span>10 files</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Notification Preferences</h3>
                
                <div className="space-y-4">
                  <label className="flex items-center justify-between">
                    <span className="text-gray-300">Processing Complete</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-gray-300">New Action Plan Generated</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-gray-300">Task Reminders</span>
                    <input type="checkbox" className="rounded" />
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Security & Privacy</h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <h4 className="font-medium text-green-400 mb-2">Data Encryption</h4>
                    <p className="text-gray-300 text-sm">All your data is encrypted at rest and in transit</p>
                  </div>
                  
                  <label className="flex items-center justify-between">
                    <span className="text-gray-300">Auto-delete processed files</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-gray-300">Anonymous analytics</span>
                    <input type="checkbox" className="rounded" />
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Appearance</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Theme</label>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 bg-gray-800 border-2 border-primary-500 rounded-lg cursor-pointer">
                        <div className="w-full h-8 bg-gray-900 rounded mb-2"></div>
                        <p className="text-xs text-center text-primary-400">Dark (Current)</p>
                      </div>
                      <div className="p-3 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer opacity-50">
                        <div className="w-full h-8 bg-gray-200 rounded mb-2"></div>
                        <p className="text-xs text-center text-gray-400">Light (Soon)</p>
                      </div>
                      <div className="p-3 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer opacity-50">
                        <div className="w-full h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded mb-2"></div>
                        <p className="text-xs text-center text-gray-400">Auto (Soon)</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Accent Color</label>
                    <div className="flex space-x-2">
                      {['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500'].map((color) => (
                        <div key={color} className={`w-8 h-8 ${color} rounded-full cursor-pointer border-2 border-transparent hover:border-white`}></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};