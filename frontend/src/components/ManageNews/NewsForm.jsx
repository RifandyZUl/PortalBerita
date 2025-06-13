import React, { useEffect, useState } from 'react';
import TextEditor from '../RichTextEditor';
import axios from 'axios';

const initialFormState = {
  title: '',
  category: '',
  author: '',
  date: '',
  status: '',
  content: '',
  image: '',
};

const NewsForm = ({ selectedArticle, setSelectedArticle, setArticles }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/authors');
        setAuthors(response.data.data); // ✅ perbaikan di sini
      } catch (error) {
        console.error('❌ Failed to fetch authors:', error);
        setAuthors([]); // fallback
      }
    };

    fetchAuthors();
  }, []);

  useEffect(() => {
    if (selectedArticle) {
      setFormData(selectedArticle);
    } else {
      setFormData(initialFormState);
    }
  }, [selectedArticle]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image' && files.length > 0) {
      const imageUrl = URL.createObjectURL(files[0]);
      setFormData((prev) => ({
        ...prev,
        image: imageUrl,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCancelEdit = () => {
    setSelectedArticle(null);
    setFormData(initialFormState);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedArticle) {
      setArticles((prev) =>
        prev.map((article) =>
          article.id === selectedArticle.id ? { ...formData } : article
        )
      );
    } else {
      const newArticle = {
        ...formData,
        id: Date.now(),
      };
      setArticles((prev) => [newArticle, ...prev]);
    }

    setFormData(initialFormState);
    setSelectedArticle(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 border rounded-lg shadow"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Article Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Category</option>
            <option value="Technology">Technology</option>
            <option value="Politics">Politics</option>
            <option value="Health">Health</option>
            <option value="Business">Business</option>
            <option value="Entertainment">Entertainment</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Author</label>
          <select
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Author</option>
            {authors.map((author) => (
              <option key={author.authorId} value={author.authorId}>
                {author.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="Archived">Archived</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block mb-1 font-medium">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            name="image"
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          {formData.image && (
            <img
              src={formData.image}
              alt="Preview"
              className="mt-2 h-40 object-cover rounded"
            />
          )}
        </div>
      </div>

      <div>
        <label className="block mb-1 font-medium">Article Content</label>
        <div className="border border-gray-300 rounded-md">
          <TextEditor
            content={formData.content}
            onChange={(html) =>
              setFormData((prev) => ({ ...prev, content: html }))
            }
          />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
        >
          {selectedArticle ? 'Update Article' : 'Add Article'}
        </button>
        {selectedArticle && (
          <button
            type="button"
            onClick={handleCancelEdit}
            className="text-gray-600 hover:underline text-sm"
          >
            Cancel Edit
          </button>
        )}
      </div>
    </form>
  );
};

export default NewsForm;
