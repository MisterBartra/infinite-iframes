import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="loading-indicator">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
};

export default LoadingIndicator;

