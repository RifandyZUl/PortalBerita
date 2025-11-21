import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SectionTitle from '@/components/SectionTitle';
import api from '@/utils/api';

const formatDate = (date) =>
  new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

const SectionKategori = () => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get('/api/news/public/list');
        setNewsData(response.data?.data || []);
      } catch (err) {
        console.error('❌ Gagal mengambil berita:', err);
        setNewsData([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const entertainmentNews = newsData.filter(
    (n) => n?.category?.toLowerCase() === 'hiburan'
  );
  const techNews = newsData.filter(
    (n) => n?.category?.toLowerCase() === 'teknologi'
  );

  if (loading) return <p className="text-center">Memuat berita...</p>;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-base font-bold text-gray-900 uppercase tracking-wide">
          Kategori Populer
        </h2>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 gap-6">
          {/* HIBURAN */}
          <section>
            <SectionTitle text="Hiburan" />
            <div className="flex flex-col gap-3 mt-3">
              {entertainmentNews.length > 0 ? (
                entertainmentNews.slice(0, 4).map((news) => (
                  <Link
                    key={news.slug || news.id}
                    to={`/news/${news.slug}`}
                    className="group flex gap-3 hover:bg-gray-50 p-2 -m-2 rounded transition"
                  >
                    <div className="w-20 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
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
                      <h3 className="text-xs font-semibold text-gray-900 group-hover:text-blue-600 transition line-clamp-2 leading-snug">
                        {news.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(news.createdAt)}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-xs text-gray-500 italic py-2">Tidak ada berita hiburan tersedia.</p>
              )}
            </div>
          </section>

          {/* TEKNOLOGI */}
          <section>
            <SectionTitle text="Teknologi" />
            <div className="flex flex-col gap-3 mt-3">
              {techNews.length > 0 ? (
                techNews.slice(0, 4).map((news) => (
                  <Link
                    key={news.slug || news.id}
                    to={`/news/${news.slug}`}
                    className="group flex gap-3 hover:bg-gray-50 p-2 -m-2 rounded transition"
                  >
                    <div className="w-20 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
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
                      <h3 className="text-xs font-semibold text-gray-900 group-hover:text-blue-600 transition line-clamp-2 leading-snug">
                        {news.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(news.createdAt)}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-xs text-gray-500 italic py-2">Tidak ada berita teknologi tersedia.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SectionKategori;
