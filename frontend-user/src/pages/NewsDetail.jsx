import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '@/utils/api';
import { getResizedImage } from '../../utils/imageTransform';
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

          // Tambah views secara lokal
          setNews((prev) => ({ ...prev, views: prev.views + 1 }));

          // 🔐 tandai bahwa views sudah ditambahkan
          setHasAddedView(true);
        } catch (error) {
          console.error('❌ Gagal menambahkan views:', error);
        }
      }
    };

    addView();
  }, [news?.id, hasAddedView]); // ⛔ supaya nggak infinite loop

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <SkeletonLoader />
      </div>
    );
  }
  if (!news) return <div className="p-4 text-red-500">Berita tidak ditemukan.</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{news.title}</h1>
      <p className="text-sm text-gray-500 mb-4">
        {news.category} |{' '}
        {new Date(news.createdAt).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}{' '}
        | {news.views} views
      </p>

      <div className="w-full max-w-2xl mx-auto aspect-[16/9] mb-4 rounded overflow-hidden bg-gray-100">
        <img
          src={getResizedImage(news.image_url) || '/placeholder.jpg'}
          alt={news.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div
        className="prose prose-lg max-w-none text-justify text-gray-800 mt-6"
        dangerouslySetInnerHTML={{ __html: news.content }}
      />

      {/* Form Komentar */}
      <div className="mt-10 border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Tinggalkan Komentar</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Nama Anda"
            className="w-full border px-3 py-2 rounded"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Anda"
            className="w-full border px-3 py-2 rounded"
            value={form.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="comment"
            placeholder="Tulis komentar Anda..."
            className="w-full border px-3 py-2 rounded"
            rows="4"
            value={form.comment}
            onChange={handleChange}
            required
          ></textarea>
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {submitting ? 'Mengirim...' : 'Kirim Komentar'}
          </button>
        </form>
      </div>

      {/* Daftar Komentar */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-5 text-gray-800">
          Komentar ({comments.length})
        </h3>
        {comments.length === 0 ? (
          <p className="text-gray-500 italic">Belum ada komentar.</p>
        ) : (
          <ul className="space-y-6">
            {comments.map((comment) => (
              <li
                key={comment.commentId}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm uppercase">
                  {comment.name?.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-800">{comment.name}</p>
                    <span className="text-xs text-gray-400">
                      {new Date(comment.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.comment}</p>
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
