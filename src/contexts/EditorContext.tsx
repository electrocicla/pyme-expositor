import React, { createContext, useContext, useState, type ReactNode } from 'react';

type SectionType = 'header' | 'hero' | 'features' | 'gallery' | 'media' | 'location' | 'footer' | 'theme' | 'effects' | 'sections';

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
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeSection, setActiveSection] = useState<SectionType | null>('hero');
  const [leftPanelWidth, setLeftPanelWidth] = useState(280);
  const [rightPanelWidth, setRightPanelWidth] = useState(320);
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);

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
