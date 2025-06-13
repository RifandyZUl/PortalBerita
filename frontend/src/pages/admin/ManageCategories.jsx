// src/pages/ManageCategories.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CategoryForm from '../../components/category/CategoryForm';
import CategoryTable from '../../components/category/CategoryTable';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/categories');
      setCategories(res.data.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Manage Categories</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CategoryTable
            categories={categories}
            onEdit={setSelectedCategory}
            onRefresh={fetchCategories}
          />
        </div>
        <div>
          <CategoryForm
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onRefresh={fetchCategories}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageCategories;
