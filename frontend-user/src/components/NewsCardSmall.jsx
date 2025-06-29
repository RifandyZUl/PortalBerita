import { Link } from 'react-router-dom';

const NewsCardSmall = ({ news }) => {
  return (
    <Link
      to={`/news/${news?.slug || '#'}`}
      className="block group transition-all duration-300 hover:scale-[1.02] hover:opacity-90"
    >
      <img
        src={news?.image_url}
        alt={news?.title}
        className="w-full h-32 sm:h-28 md:h-32 lg:h-30 object-cover rounded-xl"
      />
      <div className="mt-2">
        <h3 className="text-sm md:text-sm font-semibold text-gray-800 group-hover:text-primary transition line-clamp-2">
          {news?.title}
        </h3>
        <p className="text-xs md:text-xs text-gray-500 mt-1 line-clamp-1">
          {news?.category} / {new Date(news?.createdAt).toLocaleDateString('id-ID')}
        </p>
      </div>
    </Link>
  );
};

export default NewsCardSmall;
