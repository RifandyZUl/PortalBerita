import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';

const icons = [
  { label: 'Gear', value: 'gear' },
  { label: 'Bank', value: 'bank' },
  { label: 'Heart', value: 'heart' },
  { label: 'Chart', value: 'chart' },
  { label: 'Grid', value: 'grid' },
  { label: 'Plus', value: 'plus' },
];

const CategoryForm = ({ onSubmit, defaultValues, onCancel }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({ defaultValues });

  const selectedIcon = watch('icon');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">{defaultValues ? 'Edit Category' : 'Add New Category'}</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Category Name</label>
          <input
            type="text"
            {...register('name', { required: 'Nama kategori wajib diisi' })}
            className="w-full border px-3 py-2 rounded-md text-sm"
            placeholder="Enter category name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input
            type="text"
            {...register('slug')}
            className="w-full border px-3 py-2 rounded-md text-sm bg-gray-100"
            placeholder="category-slug"
            readOnly
          />
          <p className="text-xs text-gray-500 mt-1">
            The "slug" is the URL-friendly version of the name.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Parent Category</label>
          <select {...register('parentId')} className="w-full border px-3 py-2 rounded-md text-sm">
            <option value="">None</option>
            {/* Tambahkan opsi parent category jika perlu */}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full border px-3 py-2 rounded-md text-sm"
            placeholder="Enter category description"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Icon</label>
          <div className="flex items-center gap-2 flex-wrap">
            {icons.map((icon) => (
              <button
                type="button"
                key={icon.value}
                onClick={() => setValue('icon', icon.value)}
                className={`border rounded-md p-2 text-sm hover:bg-blue-100 transition ${
                  selectedIcon === icon.value ? 'bg-blue-200 border-blue-500' : 'bg-white'
                }`}
              >
                {icon.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-sm text-gray-600 hover:underline"
            >
              Cancel
            </button>
          )}
          <Button type="submit" className="text-sm">
            {defaultValues ? 'Update Category' : 'Add Category'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CategoryForm;
