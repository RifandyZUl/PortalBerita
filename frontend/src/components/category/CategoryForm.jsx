// src/components/category/CategoryForm.jsx
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
  { label: 'Globe', value: 'globe' },
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
  } = useForm({ defaultValues });

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
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow space-y-4">
      <h2 className="text-lg font-semibold">
        {defaultValues?.categoryId ? 'Edit Category' : 'Add New Category'}
      </h2>

      {/* Icon Picker */}
      <div>
        <label htmlFor="icon" className="block text-sm font-medium mb-1">Icon</label>
        <div className="flex flex-wrap gap-2">
          {icons.map((icon) => {
            const IconComponent = iconMap[icon.value];
            return (
              <button
                type="button"
                key={icon.value}
                onClick={() => setValue('icon', icon.value, { shouldValidate: true })}
                className={`border rounded-md p-2 text-sm flex items-center gap-1 transition ${
                  selectedIcon === icon.value ? 'bg-blue-200 border-blue-500' : 'bg-white'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {icon.label}
              </button>
            );
          })}
        </div>
        <input type="hidden" {...register('icon', { required: 'Icon wajib dipilih' })} />
        {errors.icon && <p className="text-red-500 text-sm mt-1">{errors.icon.message}</p>}
      </div>

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">Category Name</label>
        <input
          id="name"
          type="text"
          {...register('name', { required: 'Nama kategori wajib diisi' })}
          className="w-full border px-3 py-2 rounded-md text-sm"
          placeholder="Enter category name"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>

      {/* Slug */}
      <div>
        <label htmlFor="slug" className="block text-sm font-medium mb-1">Slug</label>
        <input
          id="slug"
          type="text"
          {...register('slug')}
          className="w-full border px-3 py-2 rounded-md text-sm bg-gray-100"
          readOnly
        />
      </div>

      {/* Parent */}
      <div>
        <label htmlFor="parentId" className="block text-sm font-medium mb-1">Parent Category</label>
        <select
          id="parentId"
          {...register('parentId')}
          className="w-full border px-3 py-2 rounded-md text-sm"
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
        <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
        <textarea
          id="description"
          {...register('description')}
          rows={3}
          className="w-full border px-3 py-2 rounded-md text-sm"
        ></textarea>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading} className="flex items-center gap-2">
          {loading && (
            <span className="loader w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {defaultValues?.categoryId ? 'Update Category' : 'Add Category'}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
