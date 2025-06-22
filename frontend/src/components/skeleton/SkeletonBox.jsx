import React from 'react';

const SkeletonBox = ({ width = 'w-full', height = 'h-4', className = '' }) => {
  return (
    <div
      className={`bg-gray-200 animate-pulse rounded ${width} ${height} ${className}`}
    />
  );
};

export default SkeletonBox;
