import NewsCardLarge from './NewsCardLarge';
import NewsCardSmall from './NewsCardSmall';

const dummyNews = [
  {
    id: 1,
    slug: 'cryptocurrency-2025',
    title: 'Cryptocurrency',
    image_url: 'https://tse4.mm.bing.net/th?id=OIP.bgvMu8vQcELlufCQPSZivgHaEK&pid=Api&P=0&h=220',
    category: 'Ekonomi',
    createdAt: '2025-05-18',
    excerpt: 'Berita tentang crypto terbaru.',
  },
  {
    id: 2,
    slug: 'internasional-ekonomi',
    title: 'Trump Umumkan Darurat Ekonomi',
    image_url: 'https://tse4.mm.bing.net/th?id=OIP.27wIi-bWAris_LyhBnHZjAHaEK&pid=Api&P=0&h=220',
    category: 'Internasional',
    createdAt: '2025-05-17',
  },
  {
    id: 3,
    slug: 'sepakbola-arab',
    title: 'Al AIRAW Sebelum Laga Kunci',
    image_url: 'https://tse1.mm.bing.net/th?id=OIF.YaGuDRju%2fis5DTeSM9r6RQ&pid=Api&P=0&h=220',
    category: 'Olahraga',
    createdAt: '2025-05-17',
  },
  {
    id: 4,
    slug: 'gaya-hidup-sehat',
    title: 'Manfaat Lari untuk Kesehatan Tubuh Anak',
    image_url: 'https://tse4.mm.bing.net/th?id=OIP.6wrD7z1Gk2iCxkek1MQzbgHaEK&pid=Api&P=0&h=220',
    category: 'Gaya Hidup',
    createdAt: '2025-05-17',
    excerpt: 'Gaya hidup sehat membuat anak tumbuh optimal.',
  },
  {
    id: 5,
    slug: 'timnas-indonesia-menang',
    title: 'Timnas Indonesia Menang Telak!',
    image_url: 'https://tse3.mm.bing.net/th?id=OIP.DohtmOjlpnHJKjsac8P89gHaE7&pid=Api&P=0&h=220',
    category: 'Olahraga',
    createdAt: '2025-05-18',
  },
];

const PopularGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 px-4 md:px-6 mb-12">
      {/* Kartu besar kiri */}
      <NewsCardLarge news={dummyNews[0]} />

      {/* Tengah: Kartu kecil */}
      <div className="flex flex-col gap-4">
        <NewsCardSmall news={dummyNews[1]} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NewsCardSmall news={dummyNews[2]} />
          <NewsCardSmall news={dummyNews[4]} />
        </div>
      </div>

      {/* Kartu besar kanan */}
      <NewsCardLarge news={dummyNews[3]} />
    </div>
  );
};

export default PopularGrid;
