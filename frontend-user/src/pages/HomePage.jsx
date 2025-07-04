import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PopularGrid from '@/components/PopularGrid';
import SectionTitle from '@/components/SectionTitle';
import SectionKategori from '@/components/SectionKategori';

function formatDate(date) {
  return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

const HomePage = () => {
  const [nasional, setNasional] = useState([]);
  const [olahraga, setOlahraga] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🏁 useEffect HomePage dijalankan');

    Promise.all([
      axios.get('/api/news', {
        params: {
          status: 'published',
          categoryId: 5, // Nasional
          limit: 3,
          sort: 'publishedAt',
          order: 'DESC',
        },
      }),
      axios.get('/api/news', {
        params: {
          status: 'published',
          categoryId: 7, // Olahraga
          limit: 4,
          sort: 'publishedAt',
          order: 'DESC',
        },
      }),
    ])
      .then(([resNasional, resOlahraga]) => {
        console.log('✅ Respon Nasional:', resNasional.data);
        console.log('✅ Respon Olahraga:', resOlahraga.data);

        setNasional(resNasional?.data?.articles || []);
        setOlahraga(resOlahraga?.data?.articles || []);
      })
      .catch((err) => {
        console.error('❌ Gagal mengambil data berita:', err);
        setNasional([]);
        setOlahraga([]);
      })
      .finally(() => {
        setLoading(false);
        console.log('🔚 Loading selesai');
      });
  }, []);

  if (loading) return <div className="text-center py-20">Loading homepage...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="bg-red-700 text-white px-4 py-1 w-max font-semibold text-sm uppercase">
          Latest Popular News
        </div>
      </div>

      <PopularGrid />

      <div className="mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">

          {/* SECTION NASIONAL */}
          <div>
            <SectionTitle text="Nasional" />
            {nasional.length === 0 ? (
              <p className="text-sm text-gray-500 italic">Belum ada berita nasional.</p>
            ) : (
              <div className="space-y-6">
                {nasional.map(news => (
                  <div key={news.newsId}>
                    <a href={`/news/${news.newsId}`} className="block group transition transform hover:-translate-y-1 hover:shadow-lg">
                      <img loading="lazy" src={news.imageUrl} alt={news.title}
                        className="w-full h-[200px] object-cover rounded-md group-hover:brightness-95 transition" />
                      <h2 className="mt-2 text-base font-semibold text-gray-900 group-hover:text-red-600 transition line-clamp-2">
                        {news.title}
                      </h2>
                      <p className="text-sm text-gray-500">{news.categoryName} / {formatDate(news.publishedAt)}</p>
                      <p className="text-sm text-gray-700 mt-1 line-clamp-3">{news.summary}</p>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION OLAHRAGA */}
          <div>
            <SectionTitle text="Olahraga" />
            {olahraga.length === 0 ? (
              <p className="text-sm text-gray-500 italic">Belum ada berita olahraga.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {olahraga.map(news => (
                  <a key={news.newsId} href={`/news/${news.newsId}`} className="block group">
                    <img loading="lazy" src={news.imageUrl} alt={news.title}
                      className="w-full h-[200px] object-cover rounded-md transition hover:brightness-95" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-900 group-hover:text-red-600 transition line-clamp-2">
                      {news.title}
                    </h3>
                    <p className="text-xs text-gray-500">{news.categoryName} / {formatDate(news.publishedAt)}</p>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Kategori lainnya */}
      <div className="mt-16 px-4">
        <SectionKategori />
      </div>
    </div>
  );
};

export default HomePage;
