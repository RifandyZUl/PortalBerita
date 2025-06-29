import { useState } from 'react';
import { Link } from 'react-router-dom';

const dummyNews = [
  {
    id: 1,
    title: 'Pengacara Ceritakan Momen Jokowi Jawab 22 Pertanyaan di Bareskrim',
    excerpt: 'Presiden ke-7 RI Joko Widodo (Jokowi) telah dimintai klarifikasi oleh penyidik Bareskrim Polri terkait kasus tudingan ijazah palsu...',
    category: 'Nasional',
    publishedAt: '2025-05-21',
    imageUrl: 'https://tse4.mm.bing.net/th?id=OIP.bgvMu8vQcELlufCQPSZivgHaEK&pid=Api&P=0&h=220',
    popularity: 90,
  },
  {
    id: 2,
    title: 'Bitcoin Jatuh: Apa Penyebab dan Dampaknya?',
    excerpt: 'Harga bitcoin kembali anjlok akibat kekhawatiran terhadap kebijakan moneter AS...',
    category: 'Ekonomi',
    publishedAt: '2025-06-24',
    imageUrl: 'https://tse4.mm.bing.net/th?id=OIP.bgvMu8vQcELlufCQPSZivgHaEK&pid=Api&P=0&h=220',
    popularity: 120,
  },
  // Tambahkan dummy lainnya...
];

const SearchPage = () => {
  const [sort, setSort] = useState('Relevansi');
  const [dateFilter, setDateFilter] = useState('');

  // Filter berdasarkan tanggal
  const filteredByDate = dateFilter
    ? dummyNews.filter((item) => item.publishedAt === dateFilter)
    : dummyNews;

  // Sortir berdasarkan pilihan
  const sortedNews = [...filteredByDate].sort((a, b) => {
    if (sort === 'Popular') return b.popularity - a.popularity;
    return a.id - b.id; // Default relevansi (dummy: urutan id)
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 text-gray-800">
      <h2 className="text-xl font-semibold mb-4">
        Hasil Pencarian <span className="italic text-black">“Jokowi”</span>
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
          <div key={news.id} className="flex flex-col md:flex-row gap-6 border-b pb-6">
            <img
              src={news.imageUrl}
              onError={(e) => (e.target.src = '/fallback.jpg')}
              alt={news.title}
              className="w-full md:w-56 h-40 object-cover rounded-md"
            />

            <div className="flex-1">
              <Link
                to={`/news/${news.id}`}
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
