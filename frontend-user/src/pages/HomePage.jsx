import { useEffect, useState } from 'react';
import axios from 'axios';
import PopularGrid from '@/components/PopularGrid';
import SectionTitle from '@/components/SectionTitle';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'WinniCode';

    const fetchData = async () => {
      try {
        const [popularRes, latestRes, nasionalRes, olahragaRes] = await Promise.all([
          axios.get('/api/news/popular'),
          axios.get('/api/news/public/list?limit=10'),
          axios.get('/api/news/public/list?category=Nasional&limit=10'),
          axios.get('/api/news/public/list?category=Olahraga&limit=10'),
        ]);

        setPopularNews(popularRes.data?.data || []);
        setLatestNews(latestRes.data?.data || []);
        setNasional(nasionalRes.data?.data || []);
        setOlahraga(olahragaRes.data?.data || []);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
  {/* Berita Populer */}
  <div className="mb-6">
    <div className="inline-block border-b-2 border-red-600 pb-1 text-lg font-semibold uppercase text-gray-800">
      Trending
    </div>
  </div>
  <PopularGrid news={popularNews} />

  {/* Latest News - Tanpa Gambar */}
  <section className="py-10" aria-labelledby="latest-news-heading">
    <div className="relative">
      <div className="absolute left-0 -top-4 w-full" aria-hidden="true">
        <div className="border-b border-black" />
      </div>

      <h3
        id="latest-news-heading"
        className="inline-block border-b-2 border-red-600 text-lg font-semibold uppercase text-gray-800 mb-6"
      >
        Latest News
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {latestNews.slice(0, 10).map((news, index) => (
          <div key={news.id} className="flex items-start">
            <span className={`text-xl font-bold mr-2 ${[2, 6, 7, 8].includes(index) ? '-mt-1' : ''}`}>
              {index + 1}
            </span>
            <a
              href={`/news/${news.slug}`}
              className="text-sm hover:underline cursor-pointer leading-snug"
            >
              {news.title}
            </a>
          </div>
        ))}
      </div>
    </div>
  </section>

  {/* Kategori */}
  <div className="mt-16">
    <SectionKategori />
  </div>

  {/* Nasional & Olahraga */}
  <div className="mt-16">
    <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Nasional */}
      <div>
        <div className="inline-block border-b-2 border-purple-600 pb-1 text-lg font-semibold text-gray-900 mb-3">
          Nasional
        </div>
        {nasional.length === 0 ? (
          <p className="text-xs text-gray-500 italic">Belum ada berita nasional.</p>
        ) : (
          <div className="space-y-5">
            {nasional.map((news) => (
              <a key={news.id} href={`/news/${news.slug}`} className="flex flex-col sm:flex-row gap-4 group">
                <div className="w-full sm:w-[230px] h-[170px] overflow-hidden rounded bg-gray-100 shrink-0">
                  <img
                    loading="lazy"
                    src={news.image_url}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/image/fallback.jpg';
                    }}
                    alt={news.title}
                    className="w-full h-full object-cover object-center group-hover:brightness-95 transition"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-base font-semibold text-gray-800 group-hover:text-red-600 line-clamp-2">
                    {news.title}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {news.category} / {formatDate(news.createdAt)}
                  </p>
                  <p className="text-sm text-gray-700 mt-1 line-clamp-2">{news.summary}</p>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Olahraga */}
      <div>
        <div className="inline-block border-b-2 border-purple-600 pb-1 text-lg font-semibold text-gray-900 mb-3">
          Olahraga
        </div>
        {olahraga.length === 0 ? (
          <p className="text-xs text-gray-500 italic">Belum ada berita olahraga.</p>
        ) : (
          <div className="space-y-5">
            {olahraga.map((news) => (
              <a key={news.id} href={`/news/${news.slug}`} className="flex flex-col sm:flex-row gap-4 group">
                <div className="w-full sm:w-[230px] h-[170px] overflow-hidden rounded bg-gray-100 shrink-0">
                  <img
                    loading="lazy"
                    src={news.image_url}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/image/fallback.jpg';
                    }}
                    alt={news.title}
                    className="w-full h-full object-cover object-center group-hover:brightness-95 transition"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-base font-semibold text-gray-800 group-hover:text-red-600 line-clamp-2">
                    {news.title}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {news.category} / {formatDate(news.createdAt)}
                  </p>
                  <p className="text-sm text-gray-700 mt-1 line-clamp-2">{news.summary}</p>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
</div>
  );
};

export default HomePage;
