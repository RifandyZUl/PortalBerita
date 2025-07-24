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
        const res = await fetch('/api/news/public/list');
        const data = await res.json();
        setNewsData(data.data || []);
      } catch (err) {
        console.error('❌ Gagal mengambil berita:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const entertainmentNews = newsData.filter((n) => n.category === 'Hiburan');
  const techNews = newsData.filter((n) => n.category === 'Teknologi');

  if (loading) {
    return <p className="text-center">Memuat berita...</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* Kiri - Hiburan */}
      <div>
        <SectionTitle text="Hiburan" />
        <div className="flex flex-col gap-6 mt-6">
          {entertainmentNews.slice(0, 10).map((news) => (
            <Link
              key={news.slug}
              to={`/news/${news.slug}`}
              className="group flex flex-col sm:flex-row gap-4 sm:gap-5"
            >
              <img
                src={news.image_url}
                alt={news.title}
                className="w-full sm:w-[240px] h-[180px] object-cover rounded-md flex-shrink-0"
              />
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
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
          ))}
        </div>
      </div>

      {/* Kanan - Teknologi */}
      <div>
        <SectionTitle text="Teknologi" />
        <div className="flex flex-col gap-6 mt-6">
          {techNews.slice(0, 10).map((news) => (
            <Link
              key={news.slug}
              to={`/news/${news.slug}`}
              className="group flex flex-col sm:flex-row gap-4 sm:gap-5"
            >
              <img
                src={news.image_url}
                alt={news.title}
                className="w-full sm:w-[200px] h-[160px] object-cover rounded-md flex-shrink-0"
              />
              <div className="flex-1">
                <h4 className="text-base font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                  {news.title}
                </h4>
                <p className="text-xs text-gray-500 mt-2">
                  {news.category} / {formatDate(news.createdAt)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SectionKategori;
