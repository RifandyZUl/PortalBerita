import { Link } from 'react-router-dom';

const NewsCardSmall = ({ news }) => {
  return (
    <Link
      to={`/news/${news?.slug || '#'}`}
      className="block group transition-all duration-300 hover:scale-[1.02] hover:opacity-90"
    >
      <div className="w-full h-32 sm:h-28 md:h-32 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
        <img
          src={news?.image_url || '/image/fallback.jpg'}
          alt={news?.title}
          className="w-full h-full object-contain bg-gray-50"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/image/fallback.jpg';
          }}
        />
      </div>
      <div className="mt-2">
        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition line-clamp-2 leading-snug">
          {news?.title}
        </h3>
        <p className="text-xs text-gray-500 mt-1 line-clamp-1">
          {news?.category} • {new Date(news?.createdAt).toLocaleDateString('id-ID')}
        </p>
      </div>
    </Link>
  );
};

export default NewsCardSmall;
