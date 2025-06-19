import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';

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

const icons = [
  { label: 'Gear', value: 'gear' },
  { label: 'Bank', value: 'bank' },
  { label: 'Heart', value: 'heart' },
  { label: 'Chart', value: 'chart' },
  { label: 'Grid', value: 'grid' },
  { label: 'Plus', value: 'plus' },
  { label: 'Globe', value: 'globe' }, // ➕ Tambahan icon globe
];

const CategoryForm = ({
  onSubmit,
  defaultValues = {},
  onCancel,
  allCategories = [],
  loading,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const name = watch('name');
  const selectedIcon = watch('icon');

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  useEffect(() => {
    if (!defaultValues?.slug && name) {
      const generatedSlug = name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '');
      setValue('slug', generatedSlug);
    }
  }, [name, defaultValues, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">
        {defaultValues?.categoryId ? 'Edit Category' : 'Add New Category'}
      </h2>

      <div className="space-y-4">
        {/* Icon Picker */}
        <div>
          <label className="block text-sm font-medium mb-1">Icon</label>
          <div className="flex items-center gap-2 flex-wrap">
            {icons.map((icon) => {
              const IconComponent = iconMap[icon.value];
              return (
                <button
                  type="button"
                  key={icon.value}
                  onClick={() => setValue('icon', icon.value, { shouldValidate: true })}
                  className={`border rounded-md p-2 text-sm flex items-center gap-1 hover:bg-blue-100 transition ${
                    selectedIcon === icon.value
                      ? 'bg-blue-200 border-blue-500'
                      : 'bg-white'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {icon.label}
                </button>
              );
            })}
          </div>
          <input type="hidden" {...register('icon', { required: 'Icon wajib dipilih' })} />
          {errors.icon && (
            <p className="text-red-500 text-sm mt-1">{errors.icon.message}</p>
          )}
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Category Name</label>
          <input
            type="text"
            {...register('name', { required: 'Nama kategori wajib diisi' })}
            className="w-full border px-3 py-2 rounded-md text-sm"
            placeholder="Enter category name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input
            type="text"
            {...register('slug')}
            className="w-full border px-3 py-2 rounded-md text-sm bg-gray-100"
            placeholder="category-slug"
            readOnly
          />
        </div>

        {/* Parent Category */}
        <div>
          <label className="block text-sm font-medium mb-1">Parent Category</label>
          <select
            {...register('parentId')}
            className="w-full border px-3 py-2 rounded-md text-sm"
            defaultValue={defaultValues?.parentId || ''}
          >
            <option value="">None</option>
            {allCategories
              .filter((cat) => cat.categoryId !== defaultValues?.categoryId)
              .map((cat) => (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {cat.name}
                </option>
              ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full border px-3 py-2 rounded-md text-sm"
            placeholder="Enter category description"
          ></textarea>
        </div>

        {/* Buttons */}
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
         <Button type="submit" className="text-sm flex items-center gap-2" disabled={loading}>
          {loading && <span className="loader w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {defaultValues?.categoryId ? 'Update Category' : 'Add Category'}
        </Button>

        </div>
      </div>
    </form>
  );
};

export default CategoryForm;
