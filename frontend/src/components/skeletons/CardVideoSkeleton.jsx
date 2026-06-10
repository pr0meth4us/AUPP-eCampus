import React from 'react';

const CardVideoSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="relative h-[320px] bg-brutal-bg border-4 border-brutal-black shadow-brutal brutal-card overflow-hidden">
          {/* Skeleton Image Area */}
          <div className="w-full h-48 bg-gray-300 border-b-4 border-brutal-black animate-pulse"></div>
          
          {/* Skeleton Content */}
          <div className="p-4 space-y-4">
            <div className="h-6 bg-gray-300 w-3/4 border-2 border-brutal-black animate-pulse"></div>
            <div className="h-4 bg-gray-300 w-1/2 border-2 border-brutal-black animate-pulse"></div>
          </div>

          {/* Skeleton Footer */}
          <div className="absolute bottom-0 w-full h-14 bg-gray-200 border-t-4 border-brutal-black animate-pulse"></div>
        </div>
      ))}
    </div>
  );
};

export default CardVideoSkeleton;
