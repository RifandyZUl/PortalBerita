// components/SkeletonLoader.jsx
const SkeletonLoader = () => {
  return (
    <div className="animate-pulse space-y-6">
      {/* Trending Placeholder */}
      <div>
        <div className="h-6 w-32 bg-gray-300 rounded" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded" />
          ))}
        </div>
      </div>

      {/* Latest News Placeholder */}
      <div>
        <div className="h-6 w-32 bg-gray-300 rounded" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-start space-x-2">
              <div className="h-6 w-6 bg-gray-300 rounded" />
              <div className="h-4 w-full bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Nasional & Olahraga Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((section) => (
          <div key={section} className="space-y-5">
            <div className="h-6 w-32 bg-gray-300 rounded" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-[230px] h-[170px] bg-gray-200 rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-full bg-gray-300 rounded" />
                  <div className="h-3 w-1/2 bg-gray-200 rounded" />
                  <div className="h-4 w-full bg-gray-300 rounded" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonLoader;
