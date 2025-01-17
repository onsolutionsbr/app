import React, { createContext, useContext, useState } from 'react';

interface ViewModeContextType {
  splitView: boolean;
  toggleSplitView: () => void;
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);

export function ViewModeProvider({ children }: { children: React.ReactNode }) {
  const [splitView, setSplitView] = useState(true);

  const toggleSplitView = () => {
    setSplitView(prev => !prev);
  };

  return (
    <ViewModeContext.Provider value={{ splitView, toggleSplitView }}>
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode() {
  const context = useContext(ViewModeContext);
  if (context === undefined) {
    throw new Error('useViewMode must be used within a ViewModeProvider');
  }
  return context;
}

export default ViewModeContext;