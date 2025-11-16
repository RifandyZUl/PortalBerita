import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SectionTitle from '@/components/SectionTitle';

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
        const baseURL = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${baseURL}/api/news/public/list`);
        const data = await res.json();
        setNewsData(data?.data || []);
      } catch (err) {
        console.error('❌ Gagal mengambil berita:', err);
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
    <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-6">
      {/* HIBURAN */}
      <section>
        <SectionTitle text="Hiburan" />
        <div className="flex flex-col gap-6 mt-6">
          {entertainmentNews.length > 0 ? (
            entertainmentNews.slice(0, 10).map((news) => (
              <Link
                key={news.slug}
                to={`/news/${news.slug}`}
                className="group flex flex-col sm:flex-row gap-4 sm:gap-5"
              >
                <div className="w-full sm:w-[220px] h-[160px] bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={news.image_url}
                    alt={news.title}
                    className="w-full h-full object-cover object-center group-hover:brightness-95 transition"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-800 group-hover:text-red-600 transition">
                    {news.title}
                  </h3>
                  <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                    {news.summary}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {news.category} / {formatDate(news.createdAt)}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-sm text-gray-600">Tidak ada berita hiburan tersedia.</p>
          )}
        </div>
      </section>

      {/* TEKNOLOGI */}
      <section>
        <SectionTitle text="Teknologi" />
        <div className="flex flex-col gap-6 mt-6">
          {techNews.length > 0 ? (
            techNews.slice(0, 10).map((news) => (
              <Link
                key={news.slug}
                to={`/news/${news.slug}`}
                className="group flex flex-col sm:flex-row gap-4 sm:gap-5"
              >
                <div className="w-full sm:w-[220px] h-[160px] bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={news.image_url}
                    alt={news.title}
                    className="w-full h-full object-cover object-center group-hover:brightness-95 transition"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-800 group-hover:text-red-600 transition">
                    {news.title}
                  </h3>
                  <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                    {news.summary}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {news.category} / {formatDate(news.createdAt)}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-sm text-gray-600">Tidak ada berita teknologi tersedia.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default SectionKategori;
