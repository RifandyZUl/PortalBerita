import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '@/utils/api';
import PopularGrid from '@/components/PopularGrid';
import SectionKategori from '@/components/SectionKategori';
import SkeletonLoader from '@/components/SkeletonLoader';

function formatDate(date) {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

const HomePage = () => {
  const [popularNews, setPopularNews] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [nasional, setNasional] = useState([]);
  const [olahraga, setOlahraga] = useState([]);
  const [international, setInternational] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'WinniCode - Portal Berita';

    const fetchData = async () => {
      try {
        const [popularRes, latestRes, nasionalRes, olahragaRes, internationalRes] = await Promise.all([
          api.get('/api/news/popular').catch(() => ({ data: { data: [] } })),
          api.get('/api/news/public/list?limit=10').catch(() => ({ data: { data: [] } })),
          api.get('/api/news/public/list?category=Nasional&limit=10').catch(() => ({ data: { data: [] } })),
          api.get('/api/news/public/list?category=Olahraga&limit=10').catch(() => ({ data: { data: [] } })),
          api.get('/api/news/public/list?category=International&limit=5').catch(() => ({ data: { data: [] } })),
        ]);

        setPopularNews(popularRes.data?.data || []);
        setLatestNews(latestRes.data?.data || []);
        setNasional(nasionalRes.data?.data || []);
        setOlahraga(olahragaRes.data?.data || []);
        setInternational(internationalRes.data?.data || []);
      } catch (err) {
        console.error('❌ Gagal mengambil data berita:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Featured Headlines Section */}
      {popularNews.length > 0 && (
        <section className="border-b border-gray-200 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide">
              Trending
            </h2>
            <PopularGrid news={popularNews} />
          </div>
        </section>
      )}

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-8">
            {/* Latest News Section */}
            <section className="mb-12">
              <div className="border-b-2 border-blue-600 pb-2 mb-6">
                <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
                  Latest Headlines
                </h2>
              </div>
              {latestNews.length === 0 ? (
                <p className="text-sm text-gray-500 italic py-8">Belum ada berita terbaru.</p>
              ) : (
                <div className="space-y-4">
                  {latestNews.slice(0, 8).map((news, index) => (
                    <Link
                      key={news.id || news.slug}
                      to={`/news/${news.slug}`}
                      className="flex gap-4 group border-b border-gray-100 pb-4 hover:bg-gray-50 p-2 -m-2 rounded transition"
                    >
                      <div className="flex-shrink-0 w-32 h-24 rounded bg-gray-100 overflow-hidden flex items-center justify-center">
                        <img
                          loading="lazy"
                          src={news.image_url || '/image/fallback.jpg'}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/image/fallback.jpg';
                          }}
                          alt={news.title}
                          className="w-full h-full object-contain bg-gray-50"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-2 leading-snug transition-colors">
                          {news.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {news.category || '-'} • {formatDate(news.createdAt || news.publishedAt)}
                        </p>
                        {news.summary && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {news.summary}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {/* Category Sections Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Nasional Section */}
              <section>
                <div className="border-b-2 border-blue-600 pb-2 mb-4">
                  <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                    Nasional
                  </h2>
                </div>
                {nasional.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">Belum ada berita nasional.</p>
                ) : (
                  <div className="space-y-5">
                    {nasional.map((news, index) => (
                      <Link
                        key={news.id}
                        to={`/news/${news.slug}`}
                        className={`flex gap-4 group ${index === 0 ? 'flex-col' : 'flex-row'}`}
                      >
                        <div className={`overflow-hidden rounded bg-gray-100 flex items-center justify-center ${
                          index === 0 
                            ? 'w-full h-48' 
                            : 'w-32 h-24 flex-shrink-0'
                        }`}>
                          <img
                            loading="lazy"
                            src={news.image_url || '/image/fallback.jpg'}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/image/fallback.jpg';
                            }}
                            alt={news.title}
                            className="w-full h-full object-contain bg-gray-50"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-2 transition-colors ${
                            index === 0 ? 'text-lg' : 'text-sm'
                          }`}>
                            {news.title}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {news.category} • {formatDate(news.createdAt)}
                          </p>
                          {index === 0 && news.summary && (
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                              {news.summary}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>

              {/* Olahraga Section */}
              <section>
                <div className="border-b-2 border-blue-600 pb-2 mb-4">
                  <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                    Olahraga
                  </h2>
                </div>
                {olahraga.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">Belum ada berita olahraga.</p>
                ) : (
                  <div className="space-y-5">
                    {olahraga.map((news, index) => (
                      <Link
                        key={news.id}
                        to={`/news/${news.slug}`}
                        className={`flex gap-4 group ${index === 0 ? 'flex-col' : 'flex-row'}`}
                      >
                        <div className={`overflow-hidden rounded bg-gray-100 flex items-center justify-center ${
                          index === 0 
                            ? 'w-full h-48' 
                            : 'w-32 h-24 flex-shrink-0'
                        }`}>
                          <img
                            loading="lazy"
                            src={news.image_url || '/image/fallback.jpg'}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/image/fallback.jpg';
                            }}
                            alt={news.title}
                            className="w-full h-full object-contain bg-gray-50"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-2 transition-colors ${
                            index === 0 ? 'text-lg' : 'text-sm'
                          }`}>
                            {news.title}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {news.category} • {formatDate(news.createdAt)}
                          </p>
                          {index === 0 && news.summary && (
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                              {news.summary}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* International Section */}
            {international.length > 0 && (
              <section className="mb-12">
                <div className="border-b-2 border-blue-600 pb-2 mb-4">
                  <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                    International
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {international.map((news) => (
                    <Link
                      key={news.id}
                      to={`/news/${news.slug}`}
                      className="group"
                    >
                      <div className="w-full h-40 rounded bg-gray-100 mb-2 overflow-hidden flex items-center justify-center">
                        <img
                          loading="lazy"
                          src={news.image_url || '/image/fallback.jpg'}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/image/fallback.jpg';
                          }}
                          alt={news.title}
                          className="w-full h-full object-contain bg-gray-50"
                        />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-2 transition-colors">
                        {news.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(news.createdAt)}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            {/* Categories Section */}
            <div className="sticky top-24">
              <SectionKategori />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
