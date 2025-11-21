import React, { useEffect, useState, useCallback } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

import CategoryForm from '../../components/category/CategoryForm';
import CategoryTable from '../../components/category/CategoryTable';
import ModalConfirm from '../../components/ModalConfirm';
import LoadingSpinner from '../../components/LoadingSpinner';
import PageWrapper from '../../components/PageWrapper';
import SkeletonCategoryTable from '../../components/skeleton/SkeletonCategoryTable'; // ✅

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [pendingEditCategory, setPendingEditCategory] = useState(null);
  const [showEditConfirm, setShowEditConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/categories?page=${page}&limit=${limit}`);
      setCategories(res.data.data.data || []);
      setTotalPages(res.data.data.totalPages || 1);
    } catch (err) {
      toast.error('Gagal memuat kategori');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      if (selectedCategory?.categoryId) {
        await api.put(`/api/categories/${selectedCategory.categoryId}`, data);
        toast.success('Kategori berhasil diperbarui!');
      } else {
        await api.post('/api/categories', data);
        toast.success('Kategori berhasil ditambahkan!');
      }

      setSelectedCategory(null);
      await fetchCategories();
    } catch (err) {
      toast.error('Gagal menyimpan kategori');
      console.error('Error submitting category:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setPendingEditCategory(category);
    setShowEditConfirm(true);
  };

  const handleDelete = (id) => {
    setConfirmDelete({ open: true, id });
  };

  const confirmDeleteCategory = async () => {
    const id = confirmDelete.id;
    if (!id) return;

    try {
      setLoading(true);
      await api.delete(`/api/categories/${id}`);
      toast.success('Kategori berhasil dihapus!');
      await fetchCategories();
    } catch (err) {
      toast.error('Gagal menghapus kategori');
      console.error('Error deleting category:', err);
    } finally {
      setLoading(false);
      setConfirmDelete({ open: false, id: null });
    }
  };

  if (loading && categories.length === 0) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <PageWrapper>
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Manage Categories</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {loading ? (
              <SkeletonCategoryTable />
            ) : (
              <CategoryTable
                categories={categories}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}

            {/* Pagination */}
            <div className="flex justify-between items-center text-sm">
              <button
                disabled={page === 1 || loading}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages || loading}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

          <div>
            <CategoryForm
              defaultValues={selectedCategory}
              onSubmit={handleSubmit}
              onCancel={() => setSelectedCategory(null)}
              allCategories={categories}
              loading={loading}
            />
          </div>
        </div>

        {/* Modal Konfirmasi Hapus */}
        <ModalConfirm
          isOpen={confirmDelete.open}
          title="Konfirmasi Hapus"
          message="Apakah kamu yakin ingin menghapus kategori ini?"
          onCancel={() => setConfirmDelete({ open: false, id: null })}
          onConfirm={confirmDeleteCategory}
          loading={loading}
        />

        {/* Modal Konfirmasi Edit */}
        <ModalConfirm
          isOpen={showEditConfirm}
          title="Konfirmasi Edit"
          message="Apakah kamu yakin ingin mengedit kategori ini?"
          confirmText="Edit"
          onCancel={() => {
            setShowEditConfirm(false);
            setPendingEditCategory(null);
          }}
          onConfirm={() => {
            setSelectedCategory(pendingEditCategory);
            setPendingEditCategory(null);
            setShowEditConfirm(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>
    </PageWrapper>
  );
};

export default ManageCategories;
