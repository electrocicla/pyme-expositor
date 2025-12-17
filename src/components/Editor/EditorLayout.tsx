import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import Landing from '../Landing/index';
import { ConfigProvider } from '../../contexts/ConfigContext';

export const EditorLayout: React.FC = () => {
  const [previewScale, setPreviewScale] = useState(0.85);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const deviceWidths = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  };

  return (
    <ConfigProvider mode="editor">
      <div className="flex h-screen overflow-hidden bg-slate-950">
        {/* Sidebar with smooth collapse animation */}
        <div className={`transition-all duration-300 ease-out overflow-hidden ${
          isSidebarExpanded ? 'w-80' : 'w-0'
        }`}>
          <Sidebar isExpanded={isSidebarExpanded} onToggleExpand={() => setIsSidebarExpanded(!isSidebarExpanded)} />
        </div>
        
        {/* Preview Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Preview Controls Bar */}
          <div className="h-14 bg-slate-900/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6">
            {/* Device Preview Toggles */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-sm mr-2">Preview:</span>
              <div className="flex bg-slate-800/50 rounded-lg p-1">
                {(['desktop', 'tablet', 'mobile'] as const).map((device) => (
                  <button
                    key={device}
                    onClick={() => setPreviewDevice(device)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                      previewDevice === device
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    {device === 'desktop' && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    )}
                    {device === 'tablet' && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    )}
                    {device === 'mobile' && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-3">
              <span className="text-slate-400 text-sm">Zoom:</span>
              <input
                type="range"
                min="0.5"
                max="1"
                step="0.05"
                value={previewScale}
                onChange={(e) => setPreviewScale(parseFloat(e.target.value))}
                className="w-24 h-1.5 bg-slate-700 rounded-full appearance-none cursor-pointer accent-blue-500"
              />
              <span className="text-slate-300 text-sm font-mono w-12">{Math.round(previewScale * 100)}%</span>
            </div>
          </div>

          {/* Preview Container */}
          <div className="flex-1 overflow-auto p-8 flex justify-center">
            <div 
              className="relative transition-all duration-500 ease-out origin-top"
              style={{ 
                width: deviceWidths[previewDevice],
                maxWidth: '100%',
                transform: `scale(${previewScale})`,
              }}
            >
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-linear-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-2xl blur-2xl opacity-50" />
              
              {/* Browser Frame */}
              <div className="relative bg-slate-800 rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
                {/* Browser Header */}
                <div className="h-8 bg-slate-900/80 flex items-center px-3 gap-2 border-b border-white/5">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-slate-800/80 rounded-md px-3 py-1 text-xs text-slate-400 text-center truncate">
                      yoursite.com
                    </div>
                  </div>
                </div>
                
                {/* Site Preview */}
                <div className="bg-white min-h-[600px]">
                  <Landing previewMode />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};
