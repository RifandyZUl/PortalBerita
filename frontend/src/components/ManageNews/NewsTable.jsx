import React from 'react';

const NewsTable = ({ articles, onEdit, onDelete }) => {
  const statusColors = {
    Published: 'bg-blue-100 text-blue-600',
    Draft: 'bg-gray-100 text-gray-600',
    Archived: 'bg-red-100 text-red-600',
  };

  const categoryColors = {
    Technology: 'bg-green-100 text-green-600',
    Politics: 'bg-blue-100 text-blue-600',
    Health: 'bg-red-100 text-red-600',
    Business: 'bg-yellow-100 text-yellow-600',
    Entertainment: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-100 text-gray-700 uppercase">
          <tr>
            <th className="p-4">Title</th>
            <th className="p-4">Category</th>
            <th className="p-4">Author</th>
            <th className="p-4">Date</th>
            <th className="p-4">Status</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr key={article.id} className="border-t">
              <td className="p-4 font-medium text-gray-900">{article.title}</td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${categoryColors[article.category]}`}>
                  {article.category}
                </span>
              </td>
              <td className="p-4">{article.author}</td>
              <td className="p-4">{article.date}</td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[article.status]}`}>
                  {article.status}
                </span>
              </td>
              <td className="p-4 text-right space-x-2">
                <button
                  onClick={() => onEdit(article)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(article.id)}
                  className="text-red-600 hover:underline text-sm"
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
