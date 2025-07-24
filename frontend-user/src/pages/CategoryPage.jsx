import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CategoryPage = () => {
  const { slug } = useParams(); // e.g. "gaya-hidup"
  const [categoryNews, setCategoryNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const formattedCategory = slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  useEffect(() => {
    setLoading(true);

    axios
      .get('/api/news/public/list')
      .then((res) => {
        const rawData = res.data?.data || [];

        // Normalisasi category
        const data = rawData.map((n) => ({
          ...n,
          category: n.category || n.Category?.name || '-',
        }));

        const filtered = data.filter(
          (n) => n.category.toLowerCase() === formattedCategory.toLowerCase()
        );

        setCategoryNews(filtered);
      })
      .catch((err) => {
        console.error('❌ Gagal mengambil data kategori:', err);
        setCategoryNews([]);
      })
      .finally(() => setLoading(false));
  }, [slug, formattedCategory]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 text-gray-800">
      <h2 className="text-xl font-bold mb-6 capitalize border-b-2 border-gray-400 pb-3">
        {formattedCategory}
      </h2>

      {loading ? (
        <p className="text-center">Memuat berita...</p>
      ) : categoryNews.length === 0 ? (
        <p className="text-center text-gray-500">Belum ada berita di kategori ini.</p>
      ) : (
        <div className="space-y-10">
          {categoryNews.map((news) => (
            <div key={news.id} className="flex flex-col md:flex-row gap-6 border-b pb-6">
              {/* Gambar */}
              <img
                src={news.image_url}
                onError={(e) => (e.target.src = '/fallback.jpg')}
                alt={`Thumbnail berita: ${news.title}`}
                className="w-full md:w-56 h-40 object-cover rounded-md"
              />

              {/* Info */}
              <div className="flex-1">
                <Link
                  to={`/news/${news.slug}`}
                  className="text-lg font-semibold hover:text-blue-700 transition"
                >
                  {news.title}
                </Link>
                <p className="text-sm text-gray-500 mt-1">
                  {news.category} /{' '}
                  {new Date(news.createdAt).toLocaleDateString('id-ID')}
                </p>
                <p className="mt-2 text-sm text-gray-700">{news.summary}</p>
                <p className="mt-1 text-xs text-gray-400">7 jam yang lalu</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
