import React from 'react';

/**
 * LatestNewsSection
 * Komponen ini menampilkan daftar 10 berita terbaru dalam format grid bernomor.
 * Dilengkapi heading semantik dan aksesibilitas untuk screen reader.
 *
 * @param {Object[]} latestNews - Array data berita terbaru.
 * @returns JSX Element
 */
const LatestNewsSection = ({ latestNews }) => {
  return (
    <section
      className="w-full flex justify-center py-10 px-4 md:px-6"
      aria-labelledby="latest-news-heading"
    >
      <div className="w-full max-w-7xl text-left relative">
        {/* Garis horizontal tipis di atas */}
        <div className="absolute left-0 -top-4 w-full" aria-hidden="true">
          <div className="border-b border-gray-300" />
        </div>

        {/* Judul section */}
        <h3
          id="latest-news-heading"
          className="inline-block border-b-2 border-red-600 text-lg font-semibold uppercase text-gray-800 mb-6"
        >
          Latest News
        </h3>

        {/* Grid daftar berita */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 text-gray-900">
          {latestNews.slice(0, 10).map((item, index) => (
            <div key={item.id}>
              <div className="flex items-start">
                {/* Nomor urutan */}
                <span
                  className={`text-2xl md:text-3xl font-bold mr-3 ${
                    [2, 6, 7, 8].includes(index) ? '-mt-2 md:-mt-4' : ''
                  }`}
                >
                  {index + 1}
                </span>

                {/* Judul berita dengan link */}
                <a
                  href={`/news/${item.slug}`}
                  className="text-sm md:text-base hover:underline cursor-pointer leading-snug"
                >
                  {item.title}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestNewsSection;
