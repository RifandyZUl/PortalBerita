import { useEffect, useState } from 'react';
import axios from 'axios';
import PopularGrid from '@/components/PopularGrid';
import SectionTitle from '@/components/SectionTitle';
import SectionKategori from '@/components/SectionKategori';

function formatDate(date) {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

const HomePage = () => {
  const [popularNews, setPopularNews] = useState([]);
  const [nasional, setNasional] = useState([]);
  const [olahraga, setOlahraga] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'WinniCode';
    console.log('🏁 useEffect HomePage dijalankan');

    const fetchData = async () => {
      try {
        const [popularRes, nasionalRes, olahragaRes] = await Promise.all([
          axios.get('/api/news/popular'),
          axios.get('/api/news/public/list?category=Nasional&limit=3'),
          axios.get('/api/news/public/list?category=Olahraga&limit=4'),
        ]);

        setPopularNews(popularRes.data?.data || []);
        setNasional(nasionalRes.data?.data || []);
        setOlahraga(olahragaRes.data?.data || []);
      } catch (err) {
        console.error('❌ Gagal mengambil data berita:', err);
        setPopularNews([]);
        setNasional([]);
        setOlahraga([]);
      } finally {
        setLoading(false);
        console.log('🔚 Loading selesai');
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center py-20">Memuat halaman...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="bg-red-700 text-white px-4 py-1 w-max font-semibold text-sm uppercase">
          Berita Populer
        </div>
      </div>

      {/* Popular News */}
      <PopularGrid news={popularNews} />

      <div className="mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* Nasional */}
          <div>
            <SectionTitle text="Nasional" />
            {nasional.length === 0 ? (
              <p className="text-sm text-gray-500 italic">Belum ada berita nasional.</p>
            ) : (
              <div className="space-y-6">
                {nasional.map((news) => (
                  <div key={news.id}>
                    <a
                      href={`/news/${news.slug}`}
                      className="block group transition transform hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="w-full aspect-[16/9] overflow-hidden rounded-md bg-gray-100">
                      <img
                        loading="lazy"
                        src={news.image_url}
                        alt={news.title}
                        className="w-full h-full object-cover object-top transition group-hover:brightness-95"
                      />
                    </div>

                      <h2 className="mt-2 text-base font-semibold text-gray-900 group-hover:text-red-600 transition line-clamp-2">
                        {news.title}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {news.category} / {formatDate(news.createdAt)}
                      </p>
                      <p className="text-sm text-gray-700 mt-1 line-clamp-3">
                        {news.summary}
                      </p>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Olahraga */}
          <div>
            <SectionTitle text="Olahraga" />
            {olahraga.length === 0 ? (
              <p className="text-sm text-gray-500 italic">Belum ada berita olahraga.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {olahraga.map((news) => (
                  <a
                    key={news.id}
                    href={`/news/${news.slug}`}
                    className="block group"
                  >
                    <img
                      loading="lazy"
                      src={news.image_url}
                      alt={news.title}
                      className="w-full h-[200px] object-cover rounded-md transition hover:brightness-95"
                    />
                    <h3 className="mt-2 text-sm font-semibold text-gray-900 group-hover:text-red-600 transition line-clamp-2">
                      {news.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {news.category} / {formatDate(news.createdAt)}
                    </p>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Kategori Section */}
      <div className="mt-16 px-4">
        <SectionKategori />
      </div>
    </div>
  );
};

export default HomePage;
