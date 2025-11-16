// src/pages/CategoryPage.jsx
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import api from '@/utils/api';
import { formatWaktuLalu } from '../../utils/time';

const CategoryPage = () => {
  const { slug } = useParams();
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔧 Fungsi normalisasi
  const normalize = (str) =>
    String(str || '')
      .toLowerCase()
      .replace(/^"|"$/g, '') // hapus tanda kutip jika ada
      .replace(/\s+/g, '-') // ubah spasi jadi dash untuk cocokkan slug
      .trim();

  // 🧠 Buat slug dari kategori yang sudah diformat
  const formattedCategory = useMemo(() => {
    const formatted = slug
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase())
      .trim();

    console.log('📌 Slug:', slug);
    console.log('📌 Formatted Category:', formatted);

    return formatted;
  }, [slug]);

  useEffect(() => {
    const fetchNewsByCategory = async () => {
      try {
        setLoading(true);

        const response = await api.get('/api/news/public/list');
        const rawData = response.data?.data || [];

        console.log('✅ Total berita di-fetch:', rawData.length);

        // Normalisasi data kategori
        const normalizedData = rawData.map((item) => {
          const rawCategory =
            item.category?.name || item.Category?.name || item.category || '-';
          const cleanedCategory = String(rawCategory).replace(/^"|"$/g, '').trim();

          return {
            ...item,
            normalizedCategorySlug: normalize(cleanedCategory),
            displayCategory: cleanedCategory,
          };
        });

        // Logging isi berita
        normalizedData.forEach((b, i) => {
          console.log(
            `📰 [${i}] Judul: ${b.title} | Category: "${b.displayCategory}" | Slug: ${b.normalizedCategorySlug}`
          );
        });

        // Cocokkan slug dari URL dengan slug hasil normalisasi kategori
        const filtered = normalizedData.filter(
          (item) => item.normalizedCategorySlug === slug.toLowerCase()
        );

        console.log('🔍 Total berita setelah filter kategori:', filtered.length);

        setNewsList(filtered);
      } catch (error) {
        console.error('❌ Error saat mengambil data kategori:', error);
        setNewsList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsByCategory();
  }, [slug]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 text-gray-800">
      <h2 className="text-xl font-bold mb-6 capitalize border-b-2 border-gray-400 pb-3">
        {formattedCategory}
      </h2>

      {loading ? (
        <p className="text-center">Memuat berita...</p>
      ) : newsList.length === 0 ? (
        <p className="text-center text-gray-500">
          Belum ada berita di kategori ini.
        </p>
      ) : (
        <div className="space-y-10">
          {newsList.map((news) => (
            <div
              key={news.id}
              className="flex flex-col md:flex-row gap-6 border-b pb-6"
            >
              <img
                src={news.image_url}
                alt={`Thumbnail: ${news.title}`}
                onError={(e) => (e.target.src = '/fallback.jpg')}
                className="w-full md:w-56 h-40 object-cover rounded-md"
              />
              <div className="flex-1">
                <Link
                  to={`/news/${news.slug}`}
                  className="text-lg font-semibold hover:text-blue-700 transition"
                >
                  {news.title}
                </Link>
                <p className="text-sm text-gray-500 mt-1">
                  {news.displayCategory} /{' '}
                  {new Date(news.createdAt).toLocaleDateString('id-ID')}
                </p>
                <p className="mt-2 text-sm text-gray-700">{news.summary}</p>
                <p className="mt-1 text-xs text-gray-400">
                  {formatWaktuLalu(news.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
