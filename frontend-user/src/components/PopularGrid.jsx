import NewsCardLarge from './NewsCardLarge';
import NewsCardSmall from './NewsCardSmall';

const PopularGrid = ({ news = [] }) => {
  // Hanya ambil 5 berita populer teratas
  const popularNews = news.slice(0, 5);

  if (popularNews.length < 5) {
    return (
      <p className="text-center text-gray-500 text-sm mt-6">
        Belum ada cukup berita populer untuk ditampilkan.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8">
      {/* Kiri: Kartu besar */}
      <NewsCardLarge news={popularNews[0]} />

      {/* Tengah: 3 kartu kecil */}
      <div className="flex flex-col gap-4">
        <NewsCardSmall news={popularNews[1]} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NewsCardSmall news={popularNews[2]} />
          <NewsCardSmall news={popularNews[3]} />
        </div>
      </div>

      {/* Kanan: Kartu besar */}
      <NewsCardLarge news={popularNews[4]} />
    </div>
  );
};

export default PopularGrid;
