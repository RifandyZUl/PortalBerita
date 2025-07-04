import NewsCardLarge from './NewsCardLarge';
import NewsCardSmall from './NewsCardSmall';

const PopularGrid = ({ news = [] }) => {
  if (news.length < 5) {
    return (
      <p className="text-center text-gray-500 text-sm mt-6">
        Berita populer belum cukup untuk ditampilkan.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 px-4 md:px-6 mb-12">
      {/* Kartu besar kiri */}
      <NewsCardLarge news={news[0]} />

      {/* Tengah: Kartu kecil */}
      <div className="flex flex-col gap-4">
        <NewsCardSmall news={news[1]} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NewsCardSmall news={news[2]} />
          <NewsCardSmall news={news[4]} />
        </div>
      </div>

      {/* Kartu besar kanan */}
      <NewsCardLarge news={news[3]} />
    </div>
  );
};

export default PopularGrid;
