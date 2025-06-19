import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import NewsForm from '../../components/ManageNews/NewsForm';
import ModalConfirm from '../../components/ModalConfirm';
import { ClipLoader } from 'react-spinners';

const ManageNews = () => {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/news');
      setArticles(res.data?.data || []);
    } catch {
      toast.error('Gagal memuat artikel.');
    }
  };

  const handleEdit = (article) => {
    setSelectedArticle(article);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

      setArticles((prev) => prev.filter((item) => item.newsId !== pendingDeleteId));
      toast.success('Artikel berhasil dihapus.');
    } catch (error) {
      console.error('❌ Failed to delete article:', error);
      toast.error('Gagal menghapus artikel.');
    } finally {
      setDeletingId(null);
      setShowConfirm(false);
      setPendingDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-700">Add New Article</h2>

      <NewsForm
        selectedArticle={selectedArticle}
        setSelectedArticle={setSelectedArticle}
        articles={articles}
        setArticles={setArticles}
        onSuccess={fetchArticles}
      />

      <h2 className="text-xl font-bold mt-10 mb-4">Manage Articles</h2>
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
                  No articles added yet.
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
                    className={`px-3 py-1 rounded text-xs ${
                      deletingId === article.newsId
                        ? 'bg-yellow-400 text-white cursor-not-allowed'
                        : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                    }`}
                  >
                    Edit
                  </button>

                    <button
                    onClick={() => confirmDelete(article.newsId)}
                    disabled={deletingId === article.newsId}
                    className={`px-3 py-1 rounded text-xs ${
                      deletingId === article.newsId
                        ? 'bg-red-400 cursor-not-allowed'
                        : 'bg-red-500 hover:bg-red-600'
                    }`}
                  >
                    {deletingId === article.newsId ? <ClipLoader size={12} color="#fff" /> : 'Delete'}
                  </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ModalConfirm
        isOpen={showConfirm}
        loading={deletingId !== null}
        title="Konfirmasi Hapus"
        message="Apakah kamu yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan."
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default ManageNews;
