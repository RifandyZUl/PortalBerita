// src/pages/CategoryPage.jsx
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import api from '@/utils/api';
import SkeletonLoader from '@/components/SkeletonLoader';

function formatDate(date) {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

const CategoryPage = () => {
  const { slug } = useParams();
  const [newsList, setNewsList] = useState([]);
  const [popularNews, setPopularNews] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔧 Fungsi normalisasi
  const normalize = (str) =>
    String(str || '')
      .toLowerCase()
      .replace(/^"|"$/g, '') 
      .replace(/\s+/g, '-') 
      .trim();

  // 🧠 Buat slug dari kategori yang sudah diformat
  const formattedCategory = useMemo(() => {
    const formatted = slug
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase())
      .trim();

    return formatted;
  }, [slug]);

  useEffect(() => {
    const fetchNewsByCategory = async () => {
      try {
        setLoading(true);

        const response = await api.get('/api/news/public/list');
        const rawData = response.data?.data || [];

        // Normalisasi data kategori
        const normalizedData = rawData.map((item) => {
          const rawCategory = item.category || '-';
          const cleanedCategory = String(rawCategory).replace(/^"|"$/g, '').trim();

          return {
            ...item,
            normalizedCategorySlug: normalize(cleanedCategory),
            displayCategory: cleanedCategory,
          };
        });

        // Cocokkan slug dari URL dengan slug hasil normalisasi kategori
        const filtered = normalizedData.filter(
          (item) => item.normalizedCategorySlug === slug.toLowerCase()
        );

        // Sort by publishedAt untuk terbaru
        const sortedByDate = [...filtered].sort((a, b) => {
          const dateA = new Date(a.createdAt || a.publishedAt);
          const dateB = new Date(b.createdAt || b.publishedAt);
          return dateB - dateA;
        });

        // Sort by views untuk populer
        const sortedByViews = [...filtered].sort((a, b) => {
          return (b.views || 0) - (a.views || 0);
        });

        setNewsList(sortedByDate);
        setPopularNews(sortedByViews.slice(0, 6)); // Top 6 populer
      } catch (error) {
        console.error('❌ Error saat mengambil data kategori:', error);
        setNewsList([]);
        setPopularNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsByCategory();
  }, [slug]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Kategori */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 uppercase tracking-wide">
          {formattedCategory}
        </h1>
        {!loading && newsList.length > 0 && (
          <p className="text-sm text-gray-600">
            {newsList.length} artikel ditemukan
          </p>
        )}
      </header>

      {loading ? (
        <SkeletonLoader count={6} />
      ) : newsList.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Belum ada berita di kategori <span className="font-semibold">{formattedCategory}</span>.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Featured Article - Artikel Utama Besar */}
            {newsList.length > 0 && (
              <section className="mb-8">
                <Link
                  to={`/news/${newsList[0].slug}`}
                  className="group block mb-6"
                >
                  <div className="w-full h-80 md:h-96 rounded-lg bg-gray-100 overflow-hidden mb-4 flex items-center justify-center">
                    <img
                      src={newsList[0].image_url || '/image/fallback.jpg'}
                      alt={newsList[0].title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/image/fallback.jpg';
                      }}
                      className="w-full h-full object-contain bg-gray-50 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 leading-tight">
                      {newsList[0].title}
                    </h2>
                    <p className="text-sm text-gray-500 mb-2">
                      {newsList[0].displayCategory} • {formatDate(newsList[0].createdAt)}
                    </p>
                    {newsList[0].summary && (
                      <p className="text-base text-gray-700 line-clamp-3">
                        {newsList[0].summary}
                      </p>
                    )}
                  </div>
                </Link>

                {/* Dua Artikel Kecil di Bawah Featured */}
                {newsList.length > 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {newsList.slice(1, 3).map((news) => (
                      <Link
                        key={news.id}
                        to={`/news/${news.slug}`}
                        className="group"
                      >
                        <div className="w-full h-48 rounded-lg bg-gray-100 overflow-hidden mb-3 flex items-center justify-center">
                          <img
                            src={news.image_url || '/image/fallback.jpg'}
                            alt={news.title}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/image/fallback.jpg';
                            }}
                            className="w-full h-full object-contain bg-gray-50 group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-2 leading-snug transition-colors mb-1">
                          {news.title}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {news.displayCategory} • {formatDate(news.createdAt)}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Section TERBARU */}
            {newsList.length > 3 && (
              <section>
                <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-blue-600">
                  <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                    Terbaru
                  </h2>
                  <Link
                    to="#"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    LIHAT SEMUA
                  </Link>
                </div>

                <div className="space-y-4">
                  {newsList.slice(3).map((news) => (
                    <Link
                      key={news.id}
                      to={`/news/${news.slug}`}
                      className="group flex gap-4 pb-4 border-b border-gray-200 last:border-0 hover:bg-gray-50 p-2 -m-2 rounded transition"
                    >
                      <div className="w-32 h-24 rounded bg-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                        <img
                          src={news.image_url || '/image/fallback.jpg'}
                          alt={news.title}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/image/fallback.jpg';
                          }}
                          className="w-full h-full object-contain bg-gray-50"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-2 leading-snug transition-colors mb-1">
                          {news.title}
                        </h3>
                        <p className="text-xs text-gray-500 mb-1">
                          {news.displayCategory} • {formatDate(news.createdAt)}
                        </p>
                        {news.summary && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {news.summary}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar - TERPOPULER */}
          <aside className="lg:col-span-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4 sticky top-24">
              <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-blue-600">
                <h2 className="text-base font-bold text-gray-900 uppercase tracking-wide">
                  Terpopuler
                </h2>
                <Link
                  to="#"
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  LIHAT SEMUA
                </Link>
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {popularNews.length > 0 ? (
                  popularNews.map((news, idx) => (
                    <Link
                      key={news.id}
                      to={`/news/${news.slug}`}
                      className="group flex gap-3 pb-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 p-2 -m-2 rounded transition"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                        {String(idx + 1).padStart(2, '0')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-2 leading-snug transition-colors">
                          {news.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {news.displayCategory}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 italic py-4">Belum ada berita populer.</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
