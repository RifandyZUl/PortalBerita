import React from 'react';
import dayjs from 'dayjs';
import { Pencil, Trash2 } from 'lucide-react';

const NewsTable = ({ articles, onEdit, onDelete }) => {
  if (!articles || articles.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500 border border-gray-200">
        Belum ada artikel yang tersedia.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white shadow rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
            <th className="p-4">Judul</th>
            <th className="p-4">Kategori</th>
            <th className="p-4">Penulis</th>
            <th className="p-4">Tanggal</th>
            <th className="p-4">Status</th>
            <th className="p-4 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr key={article.newsId} className="border-t hover:bg-gray-50 transition-colors">
              <td className="p-4 max-w-[250px] truncate" title={article.title}>
                {article.title}
              </td>
              <td className="p-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                  {article.category?.name || '-'}
                </span>
              </td>
              <td className="p-4">{article.author?.name || '-'}</td>
              <td className="p-4">
                {article.publishedAt
                  ? dayjs(article.publishedAt).format('DD MMM YYYY')
                  : '-'}
              </td>
              <td className="p-4">
                <span
                  className={`px-2 py-1 rounded text-xs capitalize ${
                    article.status === 'published'
                      ? 'bg-green-100 text-green-700'
                      : article.status === 'draft'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {article.status || '-'}
                </span>
              </td>
              <td className="p-4 text-center space-x-2">
                <button
                  onClick={() => onEdit(article)}
                  aria-label="Edit Artikel"
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition"
                >
                  <Pencil size={16} className="mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => onDelete(article.newsId)}
                  aria-label="Hapus Artikel"
                  className="inline-flex items-center text-sm text-red-600 hover:text-red-800 transition"
                >
                  <Trash2 size={16} className="mr-1" />
                  Hapus
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
