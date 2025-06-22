import { Link } from 'react-router-dom';

const NewsCardLarge = ({ news }) => {
  return (
    <Link
      to={`/news/${news?.slug || '#'}`}
      className="block group hover:opacity-80 transition"
    >
      <img
        src={news?.image_url}
        alt={news?.title}
        className="w-full h-64 object-cover rounded-xl mb-3"
      />
      <h2 className="text-xl font-bold group-hover:text-primary transition line-clamp-2">
        {news?.title}
      </h2>
      <p className="text-gray-500 text-sm mt-1">{news?.category} / {new Date(news?.createdAt).toLocaleDateString()}</p>
      <p className="mt-2 text-sm text-gray-700 line-clamp-3">
        {news?.excerpt}
      </p>
    </Link>
  );
};

export default NewsCardLarge;
