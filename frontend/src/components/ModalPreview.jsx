// src/components/ModalPreview.jsx
import React from 'react';

const ModalPreview = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  const { title, content, image, categoryName, authorName, publishedAt } = data;

  return (
    <div className="fixed inset-0 z-[100] bg-white overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6">
        {/* Close Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-800 border px-3 py-1 rounded"
          >
            ✕ Tutup
          </button>
        </div>

       {image && (
        <img
            src={typeof image === 'string' ? image : URL.createObjectURL(image)}
            alt="Preview"
            className="w-full max-h-[390px] object-contain rounded mb-4"
        />
        )}


        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <div className="text-sm text-gray-500 mb-6">
          <span>{authorName}</span> · <span>{categoryName}</span> ·{' '}
          <span>{publishedAt}</span>
        </div>

        <div
          className="prose max-w-none prose-lg"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
};

export default ModalPreview;
