import NewsCardLarge from './NewsCardLarge';
import NewsCardSmall from './NewsCardSmall';

const dummyNews = [
  {
    id: 1,
    slug: 'cryptocurrency-2025',
    title: 'Cryptocurrency',
    image_url: 'https://source.unsplash.com/600x400?bitcoin',
    category: 'Ekonomi',
    createdAt: '2025-05-18',
    excerpt: 'Berita tentang crypto terbaru.',
  },
  {
    id: 2,
    slug: 'internasional-ekonomi',
    title: 'Trump Umumkan Darurat Ekonomi',
    image_url: 'https://source.unsplash.com/600x400?trump',
    category: 'Internasional',
    createdAt: '2025-05-17',
  },
  {
    id: 3,
    slug: 'sepakbola-arab',
    title: 'Al AIRAW Sebelum Laga Kunci',
    image_url: 'https://source.unsplash.com/600x400?soccer',
    category: 'Olahraga',
    createdAt: '2025-05-17',
  },
  {
    id: 4,
    slug: 'otomotif-cepat',
    title: 'Review F1 Mobil Terbaru',
    image_url: 'https://source.unsplash.com/600x400?car',
    category: 'Otomotif',
    createdAt: '2025-05-17',
  },
];

const PopularGrid = () => {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-10">
      {/* Kiri (besar) */}
      <NewsCardLarge news={dummyNews[0]} />

      {/* Tengah (2 berita horizontal) */}
      <div className="flex flex-col gap-6">
        <NewsCardSmall news={dummyNews[1]} />
        <NewsCardSmall news={dummyNews[2]} />
      </div>

      {/* Kanan (1 vertical card) */}
      <NewsCardLarge news={dummyNews[3]} />
    </div>
  );
};

export default PopularGrid;
