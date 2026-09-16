import { Link } from 'react-router-dom';
import { formatDate } from '@/utils/dateFormatter.js';
import NewsImage from '@/components/NewsImage.jsx';

const NewsCardLarge = ({ news }) => {
  return (
    <Link
      to={`/news/${news?.slug || '#'}`}
      className="block group transition-all duration-300 hover:scale-[1.01] hover:opacity-90"
    >
      <div className="w-full h-52 sm:h-56 md:h-64 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
        <NewsImage
          src={news?.image_url}
          alt={news?.title}
          className="w-full h-full object-contain bg-gray-50"
        />
      </div>

      <div className="mt-3">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition line-clamp-2 leading-tight">
          {news?.title}
        </h2>

        <p className="text-xs sm:text-sm text-gray-500 mt-2 line-clamp-1">
          {news?.category} • {formatDate(news?.createdAt)}
        </p>

        {news?.excerpt && (
          <p className="mt-2 text-sm text-gray-700 line-clamp-3 leading-relaxed">
            {news.excerpt}
          </p>
        )}
      </div>
    </Link>
  );
};

export default NewsCardLarge;
