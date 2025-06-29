import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const dummyNews = [
  {
    id: 1,
    title: 'Pengacara Ceritakan Momen Jokowi Jawab 22 Pertanyaan di Bareskrim',
    excerpt: 'Presiden ke-7 RI Joko Widodo (Jokowi) telah dimintai klarifikasi oleh penyidik Bareskrim Polri terkait kasus tudingan ijazah palsu...',
    category: 'Nasional',
    publishedAt: '2025-05-21',
    imageUrl: 'https://tse4.mm.bing.net/th?id=OIP.bgvMu8vQcELlufCQPSZivgHaEK&pid=Api&P=0&h=220',
  },
  // Tambahkan berita lainnya sesuai kebutuhan
];

const CategoryPage = () => {
  const { slug } = useParams();
  const [categoryNews, setCategoryNews] = useState([]);

  useEffect(() => {
    const categoryName = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const filtered = dummyNews.filter(
      news => news.category.toLowerCase() === categoryName.toLowerCase()
    );
    setCategoryNews(filtered);
  }, [slug]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 text-gray-800">
     <h2 className="text-xl font-bold mb-6 capitalize border-b-2 border-gray-400 pb-3">
  {slug.replace(/-/g, ' ')}
    </h2>


      <div className="space-y-10">
        {categoryNews.map(news => (
          <div key={news.id} className="flex flex-col md:flex-row gap-6 border-b pb-6">
            {/* Gambar */}
            <img
              src={news.imageUrl}
              onError={(e) => (e.target.src = '/fallback.jpg')}
              alt={`Thumbnail berita: ${news.title}`}
              className="w-full md:w-56 h-40 object-cover rounded-md"
            />

            {/* Info */}
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

        {categoryNews.length === 0 && (
          <p className="text-center text-gray-500">Belum ada berita di kategori ini.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
