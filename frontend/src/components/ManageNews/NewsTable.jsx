import React from 'react';
import dayjs from 'dayjs';

const NewsTable = ({ articles, onEdit, onDelete }) => {
  if (!articles || articles.length === 0) {
    return (
      <div className="bg-white p-4 rounded shadow text-center text-gray-500">
        No articles found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white shadow rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
            <th className="p-4">Title</th>
            <th className="p-4">Category</th>
            <th className="p-4">Author</th>
            <th className="p-4">Date</th>
            <th className="p-4">Status</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr key={article.newsId} className="border-t hover:bg-gray-50 transition-colors">
              <td className="p-4">{article.title}</td>
              <td className="p-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                  {article.category?.name || 'Unknown'}
                </span>
              </td>
              <td className="p-4">{article.author?.name || 'Unknown'}</td>
              <td className="p-4">{dayjs(article.publishedAt).format('DD MMM YYYY')}</td>
              <td className="p-4">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    article.status === 'Published'
                      ? 'bg-green-100 text-green-700'
                      : article.status === 'Draft'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {article.status}
                </span>
              </td>
              <td className="p-4 text-center space-x-2">
                <button
                  onClick={() => onEdit(article)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(article.newsId)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NewsTable;
