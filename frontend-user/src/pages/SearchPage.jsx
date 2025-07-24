import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const SearchPage = () => {
  const [sort, setSort] = useState('Relevansi');
  const [dateFilter, setDateFilter] = useState('');
  const [newsList, setNewsList] = useState([]);
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('query') || '';

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(`/api/news/search?keyword=${keyword}`);
        setNewsList(res.data.data);
      } catch (err) {
        console.error('Gagal mengambil berita:', err);
      }
    };

    if (keyword) {
      fetchNews();
    }
  }, [keyword]);

  // Filter berdasarkan tanggal
  const filteredByDate = dateFilter
    ? newsList.filter((item) => item.publishedAt.startsWith(dateFilter))
    : newsList;

  // Sortir berdasarkan pilihan
  const sortedNews = [...filteredByDate].sort((a, b) => {
    if (sort === 'Popular') return b.popularity - a.popularity;
    if (sort === 'Terbaru') return new Date(b.publishedAt) - new Date(a.publishedAt);
    return a.id - b.id; // Relevansi dummy (bisa diganti logika relevansi backend)
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 text-gray-800">
      <h2 className="text-xl font-semibold mb-4">
        Hasil Pencarian <span className="italic text-black">“{keyword}”</span>
      </h2>

      {/* FILTER */}
      <div className="flex flex-wrap gap-2 mb-6 text-sm">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded px-3 py-1"
        >
          <option value="Terbaru">Terbaru</option>  
          <option value="Relevansi">Relevansi</option>
          <option value="Popular">Popular</option>
        </select>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border rounded px-3 py-1"
        />
      </div>

      {/* HASIL PENCARIAN */}
      <div className="space-y-10">
        {sortedNews.map((news) => (
          <div key={news.newsId} className="flex flex-col md:flex-row gap-6 border-b pb-6">
            <img
              src={news.imageUrl}
              onError={(e) => (e.target.src = '/fallback.jpg')}
              alt={news.title}
              className="w-full md:w-56 h-40 object-cover rounded-md"
            />

            <div className="flex-1">
              <Link
                to={`/news/${news.slug}`}
                className="text-lg font-semibold hover:text-blue-700 transition"
              >
                {news.title}
              </Link>
              <p className="text-sm text-gray-500 mt-1">
                {news.category} / {new Date(news.publishedAt).toLocaleDateString('id-ID')}
              </p>
              <p className="mt-2 text-sm text-gray-700">{news.excerpt}</p>
              <p className="mt-1 text-xs text-gray-400">7 jam yang lalu</p>
            </div>
          </div>
        ))}

        {sortedNews.length === 0 && (
          <p className="text-center text-gray-500">Berita tidak ditemukan.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
