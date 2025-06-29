import { Link } from 'react-router-dom';
import SectionTitle from '@/components/SectionTitle';

const formatDate = (date) =>
  new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

const entertainmentNews = [
  {
    slug: 'jumbo-tumbangkan-lacai',
    image_url: 'https://tse1.mm.bing.net/th?id=OIP.LyFZuNIQ9HWkQJfskfBMEAHaEK&pid=Api&P=0&h=220',
    category: 'Hiburan',
    title: 'Jumbo Tumbangkan Agak Laen, Resmi Film Indonesia Terlaris Nomor 2',
    summary:
      'Resmi menumbangkan Agak Laen dalam posisi nomor dua daftar film Indonesia terlaris sepanjang sejarah. Posisi itu dicapai Jumbo hanya dalam 41 hari.',
    createdAt: '2025-05-11',
  },
  {
    slug: 'wali-tour-asia',
    image_url: 'https://tse1.mm.bing.net/th?id=OIP.Sy8Dg7g_ICN17pvtBSh5UwHaG0&pid=Api&P=0&h=220',
    category: 'Hiburan',
    title: 'Wali Akan Tur Asia, Rayakan 25 Tahun Berkarya',
    summary:
      'Grup band Wali akan menggelar tur Asia untuk merayakan 25 tahun berkarya di industri musik Tanah Air dengan konsep konser nostalgia dan kolaborasi.',
    createdAt: '2025-05-16',
  },
  {
    slug: 'utopian-dreams',
    image_url: 'https://tse4.mm.bing.net/th?id=OIP.TwnPeEJzKMz1mG58fw7ezwHaEH&pid=Api&P=0&h=220',
    category: 'Hiburan',
    title: 'FOTO: Refleksi Dunia yang Rusak dalam Utopian Dreams',
    summary:
      'Pameran seni fotografi Utopian Dreams menampilkan refleksi dunia modern yang penuh kerusakan, paradoks, dan kritik sosial melalui karya visual.',
    createdAt: '2025-05-13',
  },
];

const techNews = [
  {
    slug: 'tiktok-medis',
    image_url: 'https://tse1.mm.bing.net/th?id=OIP.0HYZIMF7zZEdP_ZEpzT-TwHaFj&pid=Api&P=0&h=220',
    category: 'Teknologi',
    title: 'TikTok Luncurkan Fitur Medisiasi, Ini Tujuan dan Cara Pakainya',
    createdAt: '2025-05-19',
  },
  {
    slug: 'robot-china',
    image_url: 'https://tse2.mm.bing.net/th?id=OIP.QGPb0gEk0Ii1nlC1hs1xwgHaE-&pid=Api&P=0&h=220',
    category: 'Teknologi',
    title: 'FOTO: Robot-robot Humanoid China Kuasai Dunia',
    createdAt: '2025-05-15',
  },
  {
    slug: 'indosat-listrik',
    image_url: 'https://tse4.mm.bing.net/th?id=OIP.rcyqC3q8n4ysP9laZdx7OQHaFk&pid=Api&P=0&h=220',
    category: 'Teknologi',
    title: 'Bali Mati Listrik, Jaringan Seluler Indosat Ikut Terganggu',
    createdAt: '2025-05-02',
  },
];

const SectionKategori = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* Kiri - Hiburan */}
      <div>
        <SectionTitle text="Hiburan" />
        <div className="flex flex-col gap-6 mt-6">
          {entertainmentNews.map((news) => (
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
                <p className="text-sm text-gray-700 mt-2 line-clamp-2">{news.summary}</p>
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
          {techNews.map((news) => (
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
