import React from 'react';

/**
 * Standard rotating gradient spinner.
 */
export const Spinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-t-indigo-500 border-r-transparent border-b-purple-500 border-l-transparent`}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

/**
 * Skeleton card placeholder for stats.
 */
export const StatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl animate-pulse"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 w-24 bg-white/20 rounded-md"></div>
            <div className="h-10 w-10 bg-white/20 rounded-full"></div>
          </div>
          <div className="h-10 w-16 bg-white/30 rounded-md mb-2"></div>
          <div className="h-4 w-32 bg-white/20 rounded-md"></div>
        </div>
      ))}
    </div>
  );
};

/**
 * Skeleton table placeholder.
 */
export const TableSkeleton = () => {
  return (
    <div className="w-full animate-pulse">
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex gap-4 p-4 items-center border-b border-white/10">
            <div className="h-5 w-1/4 bg-white/20 rounded-md"></div>
            <div className="h-5 w-1/4 bg-white/20 rounded-md"></div>
            <div className="h-5 w-1/4 bg-white/20 rounded-md"></div>
            <div className="h-5 w-1/6 bg-white/20 rounded-md"></div>
            <div className="h-5 w-1/6 bg-white/20 rounded-md"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Loader = {
  Spinner,
  StatsSkeleton,
  TableSkeleton,
};

export default Loader;
