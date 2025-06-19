import React, { useEffect, useState } from 'react';
import TextEditor from '../RichTextEditor';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';

const initialFormState = {
  title: '',
  categoryId: '',
  authorId: '',
  publishedAt: '',
  status: '',
  content: '',
  image: '',
};

const NewsForm = ({ selectedArticle, setSelectedArticle, setArticles, onSuccess }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [previewImage, setPreviewImage] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDropdown, setLoadingDropdown] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [authorRes, categoryRes] = await Promise.all([
          axios.get('http://localhost:5000/api/authors'),
          axios.get('http://localhost:5000/api/categories'),
        ]);
        setAuthors(authorRes.data.data);
        setCategories(categoryRes.data.data.data);
      } catch {
        toast.error('Gagal memuat data author & kategori');
      } finally {
        setLoadingDropdown(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedArticle) {
      setFormData({
        title: selectedArticle.title || '',
        categoryId: selectedArticle.categoryId || '',
        authorId: selectedArticle.authorId || '',
        publishedAt: selectedArticle.publishedAt?.split('T')[0] || '',
        status: selectedArticle.status || '',
        content: selectedArticle.content || '',
        image: null,
      });
      setPreviewImage(selectedArticle.imageUrl || null);
    } else {
      setFormData(initialFormState);
      setPreviewImage(null);
    }
  }, [selectedArticle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleCancelEdit = () => {
    setSelectedArticle(null);
    setFormData(initialFormState);
    setPreviewImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'image') {
        if (value) payload.append('image', value);
      } else {
        payload.append(key, value);
      }
    });

    if (!formData.image && selectedArticle?.imageUrl) {
      payload.append('imageUrl', selectedArticle.imageUrl);
    }

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };

    try {
      let response;
      if (selectedArticle) {
        response = await axios.put(
          `http://localhost:5000/api/news/${selectedArticle.newsId}`,
          payload,
          config
        );
        setArticles((prev) =>
          prev.map((item) =>
            item.newsId === selectedArticle.newsId ? response.data.data : item
          )
        );
        toast.success('Artikel berhasil diperbarui!');
      } else {
        response = await axios.post('http://localhost:5000/api/news', payload, config);
        setArticles((prev) => [response.data.data, ...prev]);
        toast.success('Artikel berhasil ditambahkan!');
      }

      setFormData(initialFormState);
      setPreviewImage(null);
      setSelectedArticle(null);
      onSuccess?.();
    } catch (error) {
      if (error.response?.data?.errors) {
        const msg = error.response.data.errors
          .map((e) => `${e.field}: ${e.message}`)
          .join('\n');
        toast.error(`Validasi gagal:\n${msg}`);
      } else {
        toast.error('Terjadi kesalahan saat menyimpan artikel');
        console.error('❌ Submit error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 border rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title */}
        <div>
          <label className="block mb-1 font-medium">Article Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block mb-1 font-medium">Category</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
            className="w-full rounded-md border px-3 py-2 text-sm"
            disabled={loadingDropdown}
          >
            {loadingDropdown ? (
              <option value="">Loading...</option>
            ) : (
              <>
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.name}
                  </option>
                ))}
              </>
            )}
          </select>
        </div>

        {/* Author */}
        <div>
          <label className="block mb-1 font-medium">Author</label>
          <select
            name="authorId"
            value={formData.authorId}
            onChange={handleChange}
            required
            className="w-full rounded-md border px-3 py-2 text-sm"
            disabled={loadingDropdown}
          >
            {loadingDropdown ? (
              <option value="">Loading...</option>
            ) : (
              <>
                <option value="">Select Author</option>
                {authors.map((author) => (
                  <option key={author.authorId} value={author.authorId}>
                    {author.name}
                  </option>
                ))}
              </>
            )}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block mb-1 font-medium">Published Date</label>
          <input
            type="date"
            name="publishedAt"
            value={formData.publishedAt}
            onChange={handleChange}
            required
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block mb-1 font-medium">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="w-full rounded-md border px-3 py-2 text-sm"
          >
            <option value="">Select Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Image */}
        <div className="md:col-span-2">
          <label className="block mb-1 font-medium">Upload Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="mt-2 h-40 object-cover rounded"
            />
          )}
        </div>
      </div>

      {/* Content */}
      <div>
        <label className="block mb-1 font-medium">Article Content</label>
        <div className="border border-gray-300 rounded-md">
          <TextEditor
            content={formData.content}
            onChange={(html) => setFormData((prev) => ({ ...prev, content: html }))}
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-3 pt-2">
        <button
        type="submit"
        disabled={loading}
        className={`px-4 py-2 text-sm rounded text-white ${
          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? <ClipLoader size={20} color="#fff" /> : selectedArticle ? 'Update Article' : 'Add Article'}
      </button>
        {selectedArticle && (
          <button
            type="button"
            onClick={handleCancelEdit}
            className="text-gray-600 hover:underline text-sm"
            disabled={loading}
          >
            Cancel Edit
          </button>
        )}
      </div>
    </form>
  );
};

export default NewsForm;
