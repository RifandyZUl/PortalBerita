// src/pages/SearchPage.jsx
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { formatWaktuLalu } from '../../utils/time';
import api from '@/utils/api';
import SkeletonLoader from '@/components/SkeletonLoader';

function formatDate(date) {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

const SearchPage = () => {
  const [sort, setSort] = useState('Terbaru');
  const [dateFilter, setDateFilter] = useState('');
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('query') || '';

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/news/search?keyword=${keyword}`);
        setNewsList(res.data.data || []);
      } catch (err) {
        console.error('Gagal mengambil berita:', err);
        setNewsList([]);
      } finally {
        setLoading(false);
      }
    };

    if (keyword) {
      fetchNews();
    }
  }, [keyword]);

  // Filter berdasarkan tanggal
  const filteredByDate = dateFilter
    ? newsList.filter((item) =>
        (item.publishedAt || item.createdAt)?.startsWith(dateFilter)
      )
    : newsList;

  // Sort berdasarkan pilihan
  const sortedNews = [...filteredByDate].sort((a, b) => {
    if (sort === 'Popular') return (b.views || 0) - (a.views || 0);
    if (sort === 'Terbaru') {
      const dateA = new Date(a.publishedAt || a.createdAt);
      const dateB = new Date(b.publishedAt || b.createdAt);
      return dateB - dateA;
    }
    return 0; 
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Hasil Pencarian
        </h1>
        {keyword && (
          <p className="text-gray-600">
            Menampilkan hasil untuk: <span className="font-semibold text-gray-900">"{keyword}"</span>
          </p>
        )}
      </div>

      {/* Filter Sort dan Date */}
      <div className="flex flex-wrap gap-3 mb-6 pb-4 border-b border-gray-200">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="Terbaru">Terbaru</option>
          <option value="Relevansi">Relevansi</option>
          <option value="Popular">Popular</option>
        </select>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {dateFilter && (
          <button
            onClick={() => setDateFilter('')}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 underline"
          >
            Hapus filter tanggal
          </button>
        )}
      </div>

      {/* Loading */}
      {loading ? (
        <SkeletonLoader count={6} />
      ) : (
        <>
          {sortedNews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {keyword ? `Tidak ada hasil ditemukan untuk "${keyword}"` : 'Masukkan kata kunci untuk mencari'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedNews.map((news) => (
                <Link
                  key={news.id || news.newsId}
                  to={`/news/${news.slug}`}
                  className="flex flex-col md:flex-row gap-4 group border-b border-gray-200 pb-6 hover:bg-gray-50 p-4 -m-4 rounded transition"
                >
                  <div className="w-full md:w-56 h-40 rounded bg-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                    <img
                      src={news.imageUrl || news.image_url || '/image/fallback.jpg'}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/image/fallback.jpg';
                      }}
                      alt={news.title}
                      className="w-full h-full object-contain bg-gray-50"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-2 transition-colors mb-2">
                      {news.title}
                    </h2>
                    <p className="text-xs text-gray-500 mb-2">
                      {news.category || '-'} • {formatDate(news.publishedAt || news.createdAt)}
                    </p>
                    {(news.summary || news.excerpt) && (
                      <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                        {news.summary || news.excerpt}
                      </p>
                    )}
                    <p className="text-xs text-gray-400">
                      {formatWaktuLalu(news.createdAt || news.publishedAt)}
                      {news.views && ` • ${news.views} views`}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchPage;
