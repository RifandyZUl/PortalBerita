import { Link } from 'react-router-dom';

const NewsCardLarge = ({ news }) => {
  return (
    <Link
      to={`/news/${news?.slug || '#'}`}
      className="block group transition-all duration-300 hover:scale-[1.01] hover:opacity-90"
    >
      <div className="w-full h-52 sm:h-56 md:h-64 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
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

      <div className="mt-3">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition line-clamp-2 leading-tight">
          {news?.title}
        </h2>

        <p className="text-xs sm:text-sm text-gray-500 mt-2 line-clamp-1">
          {news?.category} • {new Date(news?.createdAt).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
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
