import React from 'react';

export const ProjectSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse bg-paper-white p-4 rounded-lg shadow-sm border border-sage-muted/10 h-80 flex flex-col">
      <div className="bg-forest-deep/10 h-64 rounded-t-lg mb-4" />
      <div className="h-4 bg-forest-deep/10 rounded w-3/4 mb-2" />
      <div className="h-3 bg-forest-deep/10 rounded w-1/2" />
    </div>
  );
};
