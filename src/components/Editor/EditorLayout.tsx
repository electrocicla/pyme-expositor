import React, { useState, useEffect, useRef } from 'react';
import { Layout as LayoutIcon, FileText } from 'lucide-react';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';
import Landing from '../Landing/index';
import { ConfigProvider } from '../../contexts/ConfigContext';
import { EditorProvider, useEditor } from '../../contexts/EditorContext';
import { LayoutProvider } from '../../contexts/LayoutContext';
import { LayoutCanvas } from './Layout/LayoutCanvas';
import { LayoutToolbar } from './Layout/LayoutToolbar';

const EditorContent: React.FC = () => {
  const { 
    leftPanelWidth, 
    setLeftPanelWidth, 
    rightPanelWidth, 
    setRightPanelWidth,
    isLeftPanelOpen,
    setIsLeftPanelOpen,
    isRightPanelOpen,
    setIsRightPanelOpen,
    device,
    setDevice,
    editorMode,
    setEditorMode,
  } = useEditor();

  const [previewScale, setPreviewScale] = useState(0.85);
  
  // Resizing logic
  const isResizingLeft = useRef(false);
  const isResizingRight = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingLeft.current) {
        const newWidth = Math.max(200, Math.min(400, e.clientX));
        setLeftPanelWidth(newWidth);
      }
      if (isResizingRight.current) {
        const newWidth = Math.max(250, Math.min(500, window.innerWidth - e.clientX));
        setRightPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      isResizingLeft.current = false;
      isResizingRight.current = false;
      document.body.style.cursor = 'default';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [setLeftPanelWidth, setRightPanelWidth]);

  const startResizeLeft = () => {
    isResizingLeft.current = true;
    document.body.style.cursor = 'col-resize';
  };

  const startResizeRight = () => {
    isResizingRight.current = true;
    document.body.style.cursor = 'col-resize';
  };

  const deviceWidths = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-200">
      {/* Left Sidebar */}
      <div 
        style={{ width: isLeftPanelOpen ? leftPanelWidth : 0 }} 
        className="relative flex-shrink-0 transition-all duration-300 ease-out overflow-hidden"
      >
        <LeftSidebar />
        {/* Resize Handle */}
        <div 
          className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-500/50 transition-colors z-50"
          onMouseDown={startResizeLeft}
        />
      </div>

      {/* Toggle Left Panel Button (when closed) */}
      {!isLeftPanelOpen && (
        <button 
          onClick={() => setIsLeftPanelOpen(true)}
          className="absolute left-4 top-20 z-50 p-2 bg-slate-800 rounded-md shadow-lg border border-white/10 hover:bg-slate-700"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
        </button>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950 relative">
        {/* Toolbar */}
        <div className="h-14 bg-slate-900/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 z-40">
          <div className="flex items-center gap-4">
            {/* Mode Toggle */}
            <div className="flex bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setEditorMode('content')}
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                  ${editorMode === 'content'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                  }
                `}
                aria-pressed={editorMode === 'content'}
              >
                <FileText size={16} />
                Content
              </button>
              <button
                onClick={() => setEditorMode('layout')}
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                  ${editorMode === 'layout'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                  }
                `}
                aria-pressed={editorMode === 'layout'}
              >
                <LayoutIcon size={16} />
                Layout
              </button>
            </div>
            
            <div className="h-6 w-px bg-white/10" />

            <button 
              onClick={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
              className={`p-2 rounded-md hover:bg-white/5 ${!isLeftPanelOpen ? 'text-blue-400' : 'text-slate-400'}`}
              title="Toggle Structure Panel"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            
            <div className="h-6 w-px bg-white/10" />

            {/* Device Toggles - Only in Content Mode */}
            {editorMode === 'content' && (
              <div className="flex bg-slate-800/50 rounded-lg p-1">
                {(['desktop', 'tablet', 'mobile'] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDevice(d)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                      device === d
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
             {/* Zoom Controls - Only in Content Mode */}
             {editorMode === 'content' && (
              <>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-xs uppercase tracking-wider font-medium">Zoom</span>
                  <input
                    type="range"
                    min="0.5"
                    max="1"
                    step="0.05"
                    value={previewScale}
                    onChange={(e) => setPreviewScale(parseFloat(e.target.value))}
                    className="w-24 h-1.5 bg-slate-700 rounded-full appearance-none cursor-pointer accent-blue-500"
                  />
                  <span className="text-slate-300 text-xs font-mono w-10">{Math.round(previewScale * 100)}%</span>
                </div>

                <div className="h-6 w-px bg-white/10" />
              </>
             )}

            <button 
              onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
              className={`p-2 rounded-md hover:bg-white/5 ${!isRightPanelOpen ? 'text-blue-400' : 'text-slate-400'}`}
              title="Toggle Properties Panel"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
            </button>
          </div>
        </div>

        {/* Layout Mode Toolbar */}
        {editorMode === 'layout' && <LayoutToolbar />}

        {/* Canvas */}
        {editorMode === 'content' ? (
          <div className="flex-1 overflow-hidden bg-slate-950/50 relative flex items-center justify-center p-8">
             {/* Background Grid Pattern */}
             <div className="absolute inset-0 opacity-20 pointer-events-none" 
                  style={{ 
                    backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', 
                    backgroundSize: '20px 20px' 
                  }} 
             />

             <div 
                className="relative transition-all duration-500 ease-out origin-center shadow-2xl"
                style={{ 
                  width: deviceWidths[device],
                  height: '100%',
                  maxWidth: '100%',
                  transform: `scale(${previewScale})`,
                }}
              >
                <div className="w-full h-full bg-white rounded-lg overflow-hidden shadow-2xl border border-slate-800/50">
                <div className="w-full h-full overflow-y-auto custom-scrollbar bg-white">
                   <Landing previewMode={true} device={device} />
                </div>
                </div>
              </div>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden">
            <LayoutCanvas />
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      <div 
        style={{ width: isRightPanelOpen ? rightPanelWidth : 0 }} 
        className="relative flex-shrink-0 transition-all duration-300 ease-out overflow-hidden"
      >
        {/* Resize Handle */}
        <div 
          className="absolute top-0 left-0 w-1 h-full cursor-col-resize hover:bg-blue-500/50 transition-colors z-50"
          onMouseDown={startResizeRight}
        />
        <RightSidebar />
      </div>
    </div>
  );
};

export const EditorLayout: React.FC = () => {
  return (
    <ConfigProvider mode="editor">
      <EditorProvider>
        <LayoutProvider>
          <EditorContent />
        </LayoutProvider>
      </EditorProvider>
    </ConfigProvider>
  );
};
