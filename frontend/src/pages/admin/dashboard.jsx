import React, { useEffect, useState } from 'react';
import { Eye, MessageCircle, FileText } from 'lucide-react';
import PageWrapper from '../../components/PageWrapper';
import LoadingSpinner from '../../components/LoadingSpinner';

const stripHtml = (html) => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

const timeAgo = (dateString) => {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date() - date) / 1000);
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ];
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }
  return 'Just now';
};

const categoryColorMap = {
  olahraga: 'bg-blue-100 text-blue-600',
  politik: 'bg-yellow-100 text-yellow-600',
  kesehatan: 'bg-green-100 text-green-600',
  ekonomi: 'bg-purple-100 text-purple-600',
  teknologi: 'bg-gray-100 text-gray-600',
  nasional: 'bg-red-100 text-red-600',
  hiburan: 'bg-pink-500 text-pink-100',
  internasional: 'bg-orange-100 text-orange-600',
  otomotif: 'bg-teal-100 text-teal-600',
};




const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [articles, setArticles] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAllArticles, setShowAllArticles] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [articlePage, setArticlePage] = useState(1);
  const [commentPage, setCommentPage] = useState(1);
  const [articleTotalPages, setArticleTotalPages] = useState(1);
  const [commentTotalPages, setCommentTotalPages] = useState(1);

  const fetchStats = async (headers) => {
    const res = await fetch('http://localhost:5000/api/dashboard/stats', { headers });
    const data = await res.json();
    if (res.ok) setStats(data.data || {});
  };

  const fetchArticles = async (headers, page = 1, limit = 5) => {
    const res = await fetch(`http://localhost:5000/api/dashboard/articles?page=${page}&limit=${limit}`, { headers });
    const data = await res.json();
    if (res.ok) {
      setArticles(data.data?.articles || []);
      setArticleTotalPages(data.data?.totalPages || 1);
    }
  };

  const fetchComments = async (headers, page = 1, limit = 5) => {
    const res = await fetch(`http://localhost:5000/api/dashboard/comments?page=${page}&limit=${limit}`, { headers });
    const data = await res.json();
    if (res.ok) {
      setComments(data.data?.comments || []);
      setCommentTotalPages(data.data?.totalPages || 1);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchAll = async () => {
      try {
        await Promise.all([
          fetchStats(headers),
          fetchArticles(headers),
          fetchComments(headers),
        ]);
      } catch (err) {
        console.error('❌ Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  useEffect(() => {
    if (showAllArticles) {
      const token = localStorage.getItem('token');
      fetchArticles({ Authorization: `Bearer ${token}` }, articlePage, 10);
    }
  }, [showAllArticles, articlePage]);

  useEffect(() => {
    if (showAllComments) {
      const token = localStorage.getItem('token');
      fetchComments({ Authorization: `Bearer ${token}` }, commentPage, 10);
    }
  }, [showAllComments, commentPage]);

  const statsList = [
    {
      label: 'Total Articles',
      value: stats?.totalNews ?? 0,
      icon: <FileText className="text-blue-500 w-6 h-6" />,
    },
    {
      label: 'Total Views',
      value: stats?.totalViews ?? 0,
      icon: <Eye className="text-green-500 w-6 h-6" />,
    },
    {
      label: 'Comments',
      value: stats?.totalComments ?? 0,
      icon: <MessageCircle className="text-yellow-500 w-6 h-6" />,
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <PageWrapper>
      <div className="space-y-6 font-inter">
        <h2 className="text-xl font-semibold text-gray-700">Dashboard Overview</h2>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {statsList.map((stat, i) => (
            <div key={i} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-3">
                {stat.icon}
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Articles & Comments */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Articles */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-base">Recent Articles</h3>
              <button
                onClick={() => {
                  setShowAllArticles(!showAllArticles);
                  setArticlePage(1);
                }}
                className="text-sm text-blue-500 hover:underline"
              >
                {showAllArticles ? 'Back' : 'View All'}
              </button>
            </div>

            <div className="space-y-4">
              {articles.length > 0 ? (
                articles.map((art) => (
                  <div key={art.newsId} className="border-b pb-4">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-gray-800 text-sm line-clamp-1">{art.title}</h4>
                      <span className="text-xs text-gray-400 whitespace-nowrap">{timeAgo(art.publishedAt)}</span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-1">{stripHtml(art.content)}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColorMap[art.categoryName?.toLowerCase()] || 'bg-gray-100 text-gray-600'}`}>
                        {art.categoryName || 'Uncategorized'}
                      </span>
                      <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {art.views ?? 0}</span>
                      <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" /> {art.commentsCount ?? 0}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No articles available.</p>
              )}

              {showAllArticles && (
                <div className="flex justify-between pt-4 text-sm text-blue-600">
                  <button disabled={articlePage === 1} onClick={() => setArticlePage(articlePage - 1)}>Previous</button>
                  <span>Page {articlePage} of {articleTotalPages}</span>
                  <button disabled={articlePage === articleTotalPages} onClick={() => setArticlePage(articlePage + 1)}>Next</button>
                </div>
              )}
            </div>
          </div>

          {/* Comments */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-base">Recent Comments</h3>
              <button
                onClick={() => {
                  setShowAllComments(!showAllComments);
                  setCommentPage(1);
                }}
                className="text-sm text-blue-500 hover:underline"
              >
                {showAllComments ? 'Back' : 'View All'}
              </button>
            </div>

            <div className="space-y-4">
              {comments.length > 0 ? (
                comments.map((cm) => (
                  <div key={cm.commentId} className="border-b pb-4">
                    <div className="flex justify-between gap-3 items-start">
                      <div className="flex gap-3 flex-1 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700 shrink-0">
                          {cm.name?.split(' ').map(w => w[0]).join('').toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 line-clamp-1">{cm.name}</p>
                          <p className="text-xs text-gray-600 line-clamp-1">{cm.content}</p>
                          <p className="text-xs text-blue-500 truncate">On: {cm.news?.title}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap">{timeAgo(cm.createdAt)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No comments available.</p>
              )}

              {showAllComments && (
                <div className="flex justify-between pt-4 text-sm text-blue-600">
                  <button disabled={commentPage === 1} onClick={() => setCommentPage(commentPage - 1)}>Previous</button>
                  <span>Page {commentPage} of {commentTotalPages}</span>
                  <button disabled={commentPage === commentTotalPages} onClick={() => setCommentPage(commentPage + 1)}>Next</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Dashboard;
