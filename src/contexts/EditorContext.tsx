/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, type ReactNode } from 'react';

export type SectionType = 'header' | 'hero' | 'features' | 'gallery' | 'media' | 'location' | 'footer' | 'theme' | 'effects' | 'sections' | 'layouts' | 'elements';
export type DeviceType = 'desktop' | 'tablet' | 'mobile';
export type EditorMode = 'content' | 'layout';

interface EditorContextType {
  activeSection: SectionType | null;
  setActiveSection: (section: SectionType | null) => void;
  leftPanelWidth: number;
  setLeftPanelWidth: (width: number) => void;
  rightPanelWidth: number;
  setRightPanelWidth: (width: number) => void;
  isLeftPanelOpen: boolean;
  setIsLeftPanelOpen: (isOpen: boolean) => void;
  isRightPanelOpen: boolean;
  setIsRightPanelOpen: (isOpen: boolean) => void;
  device: DeviceType;
  setDevice: (device: DeviceType) => void;
  editorMode: EditorMode;
  setEditorMode: (mode: EditorMode) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeSection, setActiveSection] = useState<SectionType | null>('hero');
  const [leftPanelWidth, setLeftPanelWidth] = useState(280);
  const [rightPanelWidth, setRightPanelWidth] = useState(320);
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [editorMode, setEditorMode] = useState<EditorMode>('content');

  return (
    <EditorContext.Provider
      value={{
        activeSection,
        setActiveSection,
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
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};
