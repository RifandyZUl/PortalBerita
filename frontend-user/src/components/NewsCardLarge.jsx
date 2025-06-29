import { Link } from 'react-router-dom';

const NewsCardLarge = ({ news }) => {
  return (
    <Link
      to={`/news/${news?.slug || '#'}`}
      className="block group transition-all duration-300 hover:scale-[1.01] hover:opacity-90"
    >
      <img
        src={news?.image_url}
        alt={news?.title}
        className="w-full h-52 sm:h-56 md:h-64 object-cover rounded-xl"
      />

      <div className="mt-3">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 group-hover:text-primary transition line-clamp-2">
          {news?.title}
        </h2>

        <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-1">
          {news?.category} / {new Date(news?.createdAt).toLocaleDateString('id-ID')}
        </p>

        {news?.excerpt && (
          <p className="mt-2 text-sm text-gray-700 line-clamp-3">
            {news.excerpt}
          </p>
        )}
      </div>
    </Link>
  );
};

export default NewsCardLarge;
