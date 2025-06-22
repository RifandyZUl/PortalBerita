// src/components/category/CategoryTable.jsx
import React, { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import {
  Settings as GearIcon,
  Banknote as BankIcon,
  Heart,
  BarChart2 as ChartIcon,
  Grid as GridIcon,
  Plus as PlusIcon,
  Globe as GlobeIcon,
} from 'lucide-react';

const iconMap = {
  gear: GearIcon,
  bank: BankIcon,
  heart: Heart,
  chart: ChartIcon,
  grid: GridIcon,
  plus: PlusIcon,
  globe: GlobeIcon,
};

const CategoryTable = ({ categories, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">All Categories</h2>
        <input
          type="text"
          placeholder="Search categories..."
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-t border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2 font-medium">Icon</th>
              <th className="text-left px-4 py-2 font-medium">Name</th>
              <th className="text-left px-4 py-2 font-medium">Slug</th>
              <th className="text-left px-4 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => {
                const IconComponent = iconMap[category.icon];
                return (
                  <tr key={category.categoryId} className="border-t">
                    <td className="px-4 py-3">
                      {IconComponent ? (
                        <IconComponent className="w-5 h-5 text-gray-600" />
                      ) : (
                        <span className="text-gray-400 italic">None</span>
                      )}
                    </td>
                    <td className="px-4 py-3">{category.name}</td>
                    <td className="px-4 py-3">{category.slug}</td>
                    <td className="px-4 py-3 space-x-3">
                      <button
                        onClick={() => onEdit(category)}
                        className="text-blue-600 hover:underline inline-flex items-center gap-1"
                        aria-label={`Edit ${category.name}`}
                        title={`Edit ${category.name}`}
                      >
                        <Pencil size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(category.categoryId)}
                        className="text-red-600 hover:underline inline-flex items-center gap-1"
                        aria-label={`Delete ${category.name}`}
                        title={`Delete ${category.name}`}
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="text-center text-gray-500 py-4">
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
