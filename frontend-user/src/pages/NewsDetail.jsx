import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '@/utils/api';
// import { getResizedImage } from '../../utils/imageTransform';
import SkeletonLoader from '@/components/SkeletonLoader';

const NewsDetail = () => {
  const { slug } = useParams();
  const [news, setNews] = useState(null);
   const [hasAddedView, setHasAddedView] = useState(false); // 🔥
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', comment: '' });
  const [submitting, setSubmitting] = useState(false);

  // Ambil detail berita
  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const response = await api.get(`/api/news/public/detail/${slug}`);
        setNews(response.data.data);
      } catch (error) {
        console.error('❌ Gagal mengambil detail berita:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNewsDetail();
  }, [slug]);

  // Tambahkan views setelah data berita berhasil diambil
  useEffect(() => {
    const addView = async () => {
      if (news?.id && !hasAddedView) {
        console.log('🟢 Menambahkan views ke newsId:', news.id);
        try {
          const res = await api.patch(`/api/news/${news.id}/views`);
          console.log('✅ PATCH response:', res.data);

          // Update views dari response backend (lebih akurat)
          const updatedViews = res.data?.data?.views;
          if (updatedViews !== undefined) {
            setNews((prev) => ({ 
              ...prev, 
              views: updatedViews 
            }));
          } else {
            // Fallback: tambah views secara lokal jika response tidak ada
            setNews((prev) => ({ 
              ...prev, 
              views: (prev.views || 0) + 1 
            }));
          }

          
          setHasAddedView(true);
        } catch (error) {
          console.error('❌ Gagal menambahkan views:', error);
        }
      }
    };

    addView();
  }, [news?.id, hasAddedView]);

  // Ambil komentar
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await api.get(`/api/comments/public/${slug}`);
        setComments(response.data || []);
      } catch (error) {
        console.error('❌ Gagal mengambil komentar:', error);
      }
    };
    fetchComments();
  }, [slug]);

  // Ganti title halaman
  useEffect(() => {
    const defaultTitle = 'Portal Berita';
    if (news) {
      document.title = `${news.title} | ${defaultTitle}`;
    }
    return () => {
      document.title = defaultTitle;
    };
  }, [news]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.comment) return;

    try {
      setSubmitting(true);
      await api.post(`/api/comments/${news.id}`, form);
      setForm({ name: '', email: '', comment: '' });

      const updated = await api.get(`/api/comments/public/${slug}`);
      setComments(updated.data || []);
    } catch (error) {
      console.error('❌ Gagal mengirim komentar:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SkeletonLoader />
      </div>
    );
  }
  
  if (!news) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-red-600 text-lg font-semibold">Berita tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Article Header */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
          {news.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 pb-4 border-b border-gray-200">
          <span className="font-semibold text-blue-600">{news.category}</span>
          <span>•</span>
          <time>
            {new Date(news.createdAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </time>
          {news.views && (
            <>
              <span>•</span>
              <span>{news.views} views</span>
            </>
          )}
        </div>
      </header>

      {/* Featured Image */}
      <div className="w-full aspect-[16/9] mb-8 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
        <img
          src={news.image_url || news.imageUrl || '/image/fallback.jpg'}
          alt={news.title}
          className="w-full h-full object-contain bg-gray-50"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/image/fallback.jpg';
          }}
        />
      </div>

      {/* Article Content */}
      <article className="prose prose-lg max-w-none text-justify text-gray-800">
        <div dangerouslySetInnerHTML={{ __html: news.content }} />
      </article>

      {/* Comments Section */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Komentar ({comments.length})
        </h2>

        {/* Form Komentar */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tinggalkan Komentar</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Nama Anda"
                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Anda"
                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <textarea
              name="comment"
              placeholder="Tulis komentar Anda..."
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              value={form.comment}
              onChange={handleChange}
              required
            ></textarea>
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Mengirim...' : 'Kirim Komentar'}
            </button>
          </form>
        </div>

        {/* Daftar Komentar */}
        {comments.length === 0 ? (
          <p className="text-gray-500 italic text-center py-8">Belum ada komentar.</p>
        ) : (
          <ul className="space-y-6">
            {comments.map((comment) => (
              <li
                key={comment.commentId}
                className="bg-white p-6 rounded-lg border border-gray-200 flex gap-4 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg uppercase flex-shrink-0">
                  {comment.name?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-900">{comment.name}</p>
                    <time className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </time>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{comment.comment}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NewsDetail;
