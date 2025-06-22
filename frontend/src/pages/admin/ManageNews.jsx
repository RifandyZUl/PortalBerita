import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import NewsForm from '../../components/ManageNews/NewsForm';
import ModalConfirm from '../../components/ModalConfirm';
import LoadingSpinner from '../../components/LoadingSpinner';
import PageWrapper from '../../components/PageWrapper';
import SkeletonNewsTable from '../../components/skeleton/SkeletonNewsTable';

const ManageNews = () => {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [pendingEditArticle, setPendingEditArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [sortBy, setSortBy] = useState('publishedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/news', {
        params: {
          page,
          limit,
          status: statusFilter || undefined,
          sort: sortBy,
          order: sortOrder,
        },
      });

      const result = res.data?.data;
      if (Array.isArray(result)) {
        setArticles(result);
        setTotalItems(result.length);
      } else {
        setArticles(result?.articles || []);
        setTotalItems(result?.total || 0);
      }
    } catch {
      toast.error('Gagal memuat artikel.');
    } finally {
      setLoading(false);
    }
  }, [page, limit, statusFilter, sortBy, sortOrder]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleEdit = (article) => {
    setPendingEditArticle(article);
    setShowEditConfirm(true);
  };

  const confirmDelete = (id) => {
    setPendingDeleteId(id);
    setShowConfirm(true);
  };

  const handleDelete = async () => {
    try {
      setDeletingId(pendingDeleteId);
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/news/${pendingDeleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Artikel berhasil dihapus.');
      fetchArticles();
    } catch {
      toast.error('Gagal menghapus artikel.');
    } finally {
      setDeletingId(null);
      setShowConfirm(false);
      setPendingDeleteId(null);
    }
  };

  const totalPages = Math.ceil(totalItems / limit);

  // Saat first load kosong
  if (loading && articles.length === 0) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <PageWrapper>
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-gray-700">Add New Article</h2>

        <NewsForm
          selectedArticle={selectedArticle}
          setSelectedArticle={setSelectedArticle}
          articles={articles}
          setArticles={setArticles}
          onSuccess={fetchArticles}
        />

        <div className="flex items-center justify-between mt-10 mb-4 flex-wrap gap-4">
          <h2 className="text-xl font-bold">Manage Articles</h2>
          <div className="flex gap-2 text-sm">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border rounded px-2 py-1">
              <option value="">Semua Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border rounded px-2 py-1">
              <option value="publishedAt">Sort by Date</option>
              <option value="title">Sort by Title</option>
            </select>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="border rounded px-2 py-1">
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>

        {/* Tabel */}
        {loading ? (
          <SkeletonNewsTable />
        ) : (
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
                {articles.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-500">
                      No articles found.
                    </td>
                  </tr>
                ) : (
                  articles.map((article) => (
                    <tr key={article.newsId} className="text-sm">
                      <td className="py-2 px-4 border-b">{article.title}</td>
                      <td className="py-2 px-4 border-b">{article.categoryName}</td>
                      <td className="py-2 px-4 border-b">{article.authorName}</td>
                      <td className="py-2 px-4 border-b">
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4 border-b capitalize">{article.status}</td>
                      <td className="py-2 px-4 border-b flex gap-2 justify-center">
                        <button
                          onClick={() => handleEdit(article)}
                          disabled={deletingId === article.newsId}
                          className="px-3 py-1 rounded text-xs bg-yellow-500 hover:bg-yellow-600 text-white disabled:bg-yellow-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => confirmDelete(article.newsId)}
                          disabled={deletingId === article.newsId}
                          className="px-3 py-1 rounded text-xs bg-red-500 hover:bg-red-600 text-white disabled:bg-red-300"
                        >
                          {deletingId === article.newsId ? (
                            <LoadingSpinner size={16} />
                          ) : (
                            'Delete'
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages || 1}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {/* Modals */}
        <ModalConfirm
          isOpen={showConfirm}
          loading={deletingId !== null}
          title="Konfirmasi Hapus"
          message="Apakah kamu yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan."
          onCancel={() => setShowConfirm(false)}
          onConfirm={handleDelete}
        />

        <ModalConfirm
          isOpen={showEditConfirm}
          loading={false}
          title="Konfirmasi Edit"
          message="Apakah kamu yakin ingin mengedit artikel ini? Data di form akan tergantikan."
          confirmText="Edit"
          onCancel={() => {
            setShowEditConfirm(false);
            setPendingEditArticle(null);
          }}
          onConfirm={() => {
            setSelectedArticle(pendingEditArticle);
            setShowEditConfirm(false);
            setPendingEditArticle(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>
    </PageWrapper>
  );
};

export default ManageNews;
