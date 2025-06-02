import React, { useState } from 'react';
import NewsForm from '../../components/NewsForm';

const ManageNews = () => {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const handleEdit = (article) => {
    setSelectedArticle(article);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // agar scroll ke form atas saat edit
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this article?');
    if (confirmDelete) {
      setArticles((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Add New Article</h2>
      <NewsForm
        selectedArticle={selectedArticle}
        setSelectedArticle={setSelectedArticle}
        articles={articles}
        setArticles={setArticles}
      />

      <h2 className="text-xl font-bold mt-10 mb-4">Manage Articles</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg border">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="py-2 px-4 border-b">Title</th>
              <th className="py-2 px-4 border-b">Category</th>
              <th className="py-2 px-4 border-b">Author</th>
              <th className="py-2 px-4 border-b">Date</th>
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
                <tr key={article.id} className="text-sm">
                  <td className="py-2 px-4 border-b">{article.title}</td>
                  <td className="py-2 px-4 border-b">{article.category}</td>
                  <td className="py-2 px-4 border-b">{article.author}</td>
                  <td className="py-2 px-4 border-b">{article.date}</td>
                  <td className="py-2 px-4 border-b">{article.status}</td>
                  <td className="py-2 px-4 border-b flex gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(article)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageNews;
