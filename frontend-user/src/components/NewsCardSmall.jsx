import { Link } from 'react-router-dom';

const NewsCardSmall = ({ news }) => {
  return (
    <Link
      to={`/news/${news?.slug || '#'}`}
      className="block group hover:opacity-80 transition"
    >
      <img
        src={news?.image_url}
        alt={news?.title}
        className="h-48 w-full object-cover rounded-xl mb-2"
      />
      <h3 className="text-base font-semibold group-hover:text-primary transition line-clamp-2">
        {news?.title}
      </h3>
      <p className="text-sm text-gray-500 mt-1">{news?.category} / {new Date(news?.createdAt).toLocaleDateString()}</p>
    </Link>
  );
};

export default NewsCardSmall;
