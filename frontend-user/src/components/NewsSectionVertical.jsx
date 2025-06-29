import SectionTitle from './SectionTitle';
import NewsCardMedium from './NewsCardMedium';

const NewsSectionVertical = ({ title, newsList = [] }) => {
  return (
    <section className="mb-10">
      <SectionTitle text={title} />
      <div className="space-y-6 pl-2 md:pl-8 max-w-5xl">
        {newsList.map((news, idx) => (
          <NewsCardMedium key={idx} news={news} />
        ))}
      </div>
    </section>
  );
};

export default NewsSectionVertical;
