import React from 'react';
import SkeletonBox from '../skeleton/SkeletonBox';

const SkeletonCategoryTable = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow w-full space-y-4">
      <SkeletonBox width="w-1/3" height="h-5" />
      <SkeletonBox width="w-full" height="h-10" />

      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <SkeletonBox width="w-6" height="h-6" />
            <SkeletonBox width="w-1/4" />
            <SkeletonBox width="w-1/3" />
            <SkeletonBox width="w-16" height="h-6" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonCategoryTable;
