// src/components/skeleton/SkeletonNewsTable.jsx
import React from 'react';
import SkeletonBox from '../skeleton/SkeletonBox';

const SkeletonNewsTable = () => {
  const rows = Array(5).fill(null);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow rounded-lg border">
        <thead className="bg-gray-100 text-gray-700 text-sm">
          <tr>
            <th className="py-2 px-4 border-b">Title</th>
            <th className="py-2 px-4 border-b">Category</th>
            <th className="py-2 px-4 border-b">Author</th>
            <th className="py-2 px-4 border-b">Published</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((_, i) => (
            <tr key={i} className="text-sm">
              <td className="py-2 px-4 border-b"><SkeletonBox className="h-4 w-32" /></td>
              <td className="py-2 px-4 border-b"><SkeletonBox className="h-4 w-24" /></td>
              <td className="py-2 px-4 border-b"><SkeletonBox className="h-4 w-28" /></td>
              <td className="py-2 px-4 border-b"><SkeletonBox className="h-4 w-20" /></td>
              <td className="py-2 px-4 border-b"><SkeletonBox className="h-4 w-16" /></td>
              <td className="py-2 px-4 border-b flex justify-center gap-2">
                <SkeletonBox className="h-6 w-12 rounded" />
                <SkeletonBox className="h-6 w-12 rounded" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SkeletonNewsTable;
