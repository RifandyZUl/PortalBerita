import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

const CategoryTable = ({ categories, onEdit, onDelete }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">All Categories</h2>
        <input
          type="text"
          placeholder="Search categories..."
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-t border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2 font-medium">Name</th>
              <th className="text-left px-4 py-2 font-medium">Slug</th>
              <th className="text-left px-4 py-2 font-medium">Articles</th>
              <th className="text-left px-4 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.categoryId} className="border-t">
                <td className="px-4 py-3 flex items-center gap-2">
                  {category.icon && (
                    <span className="text-xl">{category.icon}</span>
                  )}
                  {category.name}
                </td>
                <td className="px-4 py-3">{category.slug}</td>
                <td className="px-4 py-3">{category.articleCount || 0}</td>
                <td className="px-4 py-3 space-x-3">
                  <button
                    onClick={() => onEdit(category)}
                    className="text-blue-600 hover:underline inline-flex items-center gap-1"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(category.categoryId)}
                    className="text-red-600 hover:underline inline-flex items-center gap-1"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {categories.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center text-gray-500 py-4">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryTable;
