import React from 'react';
import { useViewMode } from '../contexts/ViewModeContext';

interface SplitViewProps {
  clientView: React.ReactNode;
  providerView: React.ReactNode;
}

function SplitView({ clientView, providerView }: SplitViewProps) {
  const { splitView } = useViewMode();

  if (!splitView) {
    return <>{clientView}</>;
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/2 border-r border-gray-200 overflow-auto">
        {clientView}
      </div>
      <div className="w-1/2 overflow-auto">
        {providerView}
      </div>
    </div>
  );
}

export default SplitView;