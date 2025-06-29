import { Link } from 'react-router-dom';
import PopularGrid from '@/components/PopularGrid';
import SectionTitle from '@/components/SectionTitle';
import SectionKategori from '@/components/SectionKategori';

const formatDate = (date) =>
  new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

const HomePage = () => {
  const newsNasional = [
    {
      slug: 'dpr-komisi',
      image_url: 'https://tse4.mm.bing.net/th?id=OIP.8_NLXgvxdp7wtyzm8wWv1AHaE7&pid=Api&P=0&h=220',
      category: 'Nasional',
      title: 'Daftar Lengkap 13 Komisi DPR RI dan Mitra Kerjanya',
      createdAt: '2025-07-24',
      summary:
        'Komisi-komisi DPR memiliki fungsi dan mitra kerja yang berbeda. Berikut ini daftar lengkap beserta pembagian tugas dan ruang lingkup kerja masing-masing komisi di DPR RI.',
    },
    {
      slug: 'ai-sd-ugm',
      image_url: 'https://tse3.mm.bing.net/th?id=OIP.GSccCnlp79XxTat5Za_SMAHaEH&pid=Api&P=0&h=220',
      category: 'Nasional',
      title: 'AI dan Koding Masuk SD? Pakar UGM Ingatkan Risiko Serius',
      createdAt: '2025-05-18',
      summary:
        'Penerapan AI dan koding sejak usia dini menimbulkan pro dan kontra. Pakar dari UGM menyarankan pendekatan yang hati-hati demi menjaga keseimbangan perkembangan anak.',
    },
    {
      slug: 'belanja-negara',
      image_url: 'https://tse4.mm.bing.net/th?id=OIP.0BGFi3cSFqg3bnOHD5tWOAHaE8&pid=Api&P=0&h=220',
      category: 'Nasional',
      title: 'Belanja Negara 2025 Fokus pada Infrastruktur & Pendidikan',
      createdAt: '2025-04-29',
      summary:
        'APBN 2025 diprioritaskan untuk pembangunan infrastruktur dan sektor pendidikan. Pemerintah menargetkan pertumbuhan ekonomi lewat pembangunan yang berkelanjutan.',
    },
  ];

  const newsOlahraga = [
    {
      slug: 'marquez-ducati',
      image_url: 'https://tse1.mm.bing.net/th?id=OIP.qnpt1f2KChNiwxKmnaiwWAHaE7&pid=Api&P=0&h=220',
      category: 'Olahraga',
      title: 'Gagal Pepet Marquez, Bagnaia Gondok Berat Sama Ducati',
      createdAt: '2025-05-13',
    },
    {
      slug: 'verstappen-arab',
      image_url: 'https://tse4.mm.bing.net/th?id=OIP.ZWs1ne3Vz5aODs2kJDeSTQHaFU&pid=Api&P=0&h=220',
      category: 'Olahraga',
      title: 'Hasil F1 GP Arab Saudi 2025: Oscar Piastri Kalahkan Verstappen',
      createdAt: '2025-04-21',
    },
    {
      slug: 'thailand-open',
      image_url: 'https://tse3.mm.bing.net/th?id=OIP.PiB9SGCXenzcHsahfgjbmQHaE6&pid=Api&P=0&h=220',
      category: 'Olahraga',
      title: 'Thailand Open 2025: Fajar/Rian Lolos Semi Final',
      createdAt: '2025-04-15',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Label Populer */}
      <div className="mb-6">
        <div className="bg-red-700 text-white px-4 py-1 w-max font-semibold text-sm uppercase">
          Latest Popular News
        </div>
      </div>

      {/* Grid Populer */}
      <PopularGrid />

      {/* Nasional dan Olahraga */}
      <div className="mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* Nasional */}
          <div>
            <SectionTitle text="Nasional" />
            <div className="space-y-6">
              {newsNasional.map((news, index) => (
                <Link
                  to={`/news/${news.slug}`}
                  key={index}
                  className="block group transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
                >
                  <img
                    src={news.image_url}
                    alt={news.title}
                    loading="lazy"
                    className="w-full h-[200px] object-cover rounded-md group-hover:brightness-95 transition-all duration-300"
                  />
                  <h2 className="mt-2 text-base font-semibold text-gray-900 group-hover:text-red-600 transition-colors duration-300 line-clamp-2">
                    {news.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {news.category} / {formatDate(news.createdAt)}
                  </p>
                  <p className="text-sm text-gray-700 mt-1 line-clamp-3">
                    {news.summary}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Olahraga */}
          <div>
            <SectionTitle text="Olahraga" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {newsOlahraga.map((news, index) => (
                <Link to={`/news/${news.slug}`} key={index} className="block group">
                  <img
                    src={news.image_url}
                    alt={news.title}
                    className="w-full h-[200px] object-cover rounded-md transition hover:brightness-95"
                  />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900 group-hover:text-red-600 transition line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {news.category} / {formatDate(news.createdAt)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hiburan & Teknologi */}
      <div className="mt-16">
        <div className="max-w-5xl mx-auto px-4">
          <SectionKategori />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
