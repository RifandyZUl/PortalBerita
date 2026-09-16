import { Link } from 'react-router-dom';
import { formatDate } from '@/utils/dateFormatter.js';
import NewsImage from '@/components/NewsImage.jsx';

/**
 * NewsCardMedium Component
 * 
 * Komponen untuk menampilkan card berita dengan ukuran medium.
 * Digunakan di NewsSectionVertical untuk menampilkan list berita vertikal.
 * 
 * @param {Object} news - Data berita
 * @param {string} news.slug - Slug berita untuk link
 * @param {string} news.title - Judul berita
 * @param {string} news.category - Kategori berita
 * @param {string} news.createdAt - Tanggal pembuatan
 * @param {string} news.image_url - URL gambar
 * @param {string} news.summary - Ringkasan berita (optional)
 */
const NewsCardMedium = ({ news }) => {
  return (
    <Link
      to={`/news/${news?.slug || '#'}`}
      className="group flex gap-4 pb-4 border-b border-gray-200 last:border-0 hover:bg-gray-50 p-2 -m-2 rounded transition"
    >
      <div className="w-32 h-24 rounded bg-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
        <NewsImage
          src={news?.image_url}
          alt={news?.title}
          className="w-full h-full object-contain bg-gray-50"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-2 leading-snug transition-colors mb-1">
          {news?.title}
        </h3>
        <p className="text-xs text-gray-500 mb-1">
          {news?.category} • {formatDate(news?.createdAt)}
        </p>
        {news?.summary && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {news.summary}
          </p>
        )}
      </div>
    </Link>
  );
};

export default NewsCardMedium;

