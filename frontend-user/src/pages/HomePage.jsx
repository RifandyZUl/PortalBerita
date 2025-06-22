// src/pages/HomePage.jsx
import PopularGrid from '../components/PopularGrid';
import SectionTitle from '../components/SectionTitle';
import NewsCardLarge from '../components/NewsCardLarge';
import NewsCardSmall from '../components/NewsCardSmall';

const HomePage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Banner Populer */}
      <div className="mb-6">
        <div className="bg-red-600 text-white px-4 py-1 w-max font-semibold text-sm uppercase">
          Latest Popular News
        </div>
      </div>

      {/* Grid Populer (besar dan kecil) */}
      <PopularGrid />

      {/* Kategori Nasional */}
      <SectionTitle text="Nasional" />
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <NewsCardLarge />
        <NewsCardSmall />
      </div>

      {/* Kategori Olahraga */}
      <SectionTitle text="Olahraga" />
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <NewsCardSmall />
        <NewsCardSmall />
        <NewsCardSmall />
      </div>

      {/* Tambahan kategori lain menyusul */}
    </div>
  );
};

export default HomePage;
