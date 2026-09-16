import { Link } from 'react-router-dom';
import { formatDate } from '@/utils/dateFormatter.js';
import NewsImage from '@/components/NewsImage.jsx';

const NewsCardSmall = ({ news }) => {
  return (
    <Link
      to={`/news/${news?.slug || '#'}`}
      className="block group transition-all duration-300 hover:scale-[1.02] hover:opacity-90"
    >
      <div className="w-full h-32 sm:h-28 md:h-32 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
        <NewsImage
          src={news?.image_url}
          alt={news?.title}
          className="w-full h-full object-contain bg-gray-50"
        />
      </div>
      <div className="mt-2">
        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition line-clamp-2 leading-snug">
          {news?.title}
        </h3>
        <p className="text-xs text-gray-500 mt-1 line-clamp-1">
          {news?.category} • {formatDate(news?.createdAt)}
        </p>
      </div>
    </Link>
  );
};

export default NewsCardSmall;
