// Dashboard.jsx
import React from 'react';
import { Eye, MessageCircle, Users, FileText } from 'lucide-react';

const stats = [
  {
    label: 'Total Articles',
    value: '248',
    icon: <FileText className="text-blue-500 w-6 h-6" />,
    change: '+5% from last month',
    color: 'text-green-500'
  },
  {
    label: 'Total Views',
    value: '1.2M',
    icon: <Eye className="text-green-500 w-6 h-6" />,
    change: '+8% from last month',
    color: 'text-green-500'
  },
  {
    label: 'Comments',
    value: '3,427',
    icon: <MessageCircle className="text-yellow-500 w-6 h-6" />,
    change: '+5% from last month',
    color: 'text-green-500'
  },
  {
    label: 'Subscribers',
    value: '12,342',
    icon: <Users className="text-purple-500 w-6 h-6" />,
    change: '+18% from last month',
    color: 'text-green-500'
  }
];

const articles = [
  {
    title: 'Tech Giants Announce New AI Partnership',
    summary: 'Major tech companies join forces to develop ethical AI standards ...',
    tag: 'Technology',
    views: '1.2k',
    comments: 24,
    time: '2 hours ago',
    tagColor: 'bg-blue-100 text-blue-500'
  },
  {
    title: 'Global Climate Summit Reaches New Agreement',
    summary: 'World leaders agree on ambitious climate targets at annual summit ...',
    tag: 'Politic',
    views: '3.4k',
    comments: 56,
    time: '5 hours ago',
    tagColor: 'bg-blue-100 text-blue-600'
  },
  {
    title: 'New Study Reveals Health Benefits of Mediterranean Diet',
    summary: 'Research confirms long-term health advantages of Mediterranean eating patterns ...',
    tag: 'Health',
    views: '2.1k',
    comments: 32,
    time: '8 hours ago',
    tagColor: 'bg-red-100 text-red-500'
  }
];

const comments = [
  {
    name: 'Sarah Miller',
    text: 'This article really helped me understand the climate crisis better. Thank you !',
    article: 'Global Climate Summit Reaches New Agreement',
    time: '1 hour ago',
    initials: 'SM'
  },
  {
    name: 'James Thompson',
    text: 'I disagree with some points in this article. The technology has more risks than mentioned .',
    article: 'Tech Giants Announce New AI Partnership',
    time: '3 hours ago',
    initials: 'JT'
  },
  {
    name: 'Amy Lee',
    text: 'I’ve been following the Mediterranean diet for years and can confirm these benefits !',
    article: 'New Study Reveals Health Benefits of Mediterranean Diet',
    time: '6 hours ago',
    initials: 'AL'
  }
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
           <h2 className="text-lg font-semibold text-gray-700">Dashboard Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center gap-3">
              <div>{stat.icon}</div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
                <p className={`text-sm ${stat.color}`}>{stat.change}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold">Recent Articles</h3>
            <a href="#" className="text-sm text-blue-500">View All</a>
          </div>
          <div className="space-y-4">
            {articles.map((article, index) => (
              <div key={index}>
                <h4 className="font-semibold text-gray-800">{article.title}</h4>
                <p className="text-sm text-gray-600">{article.summary}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${article.tagColor}`}>{article.tag}</span>
                  <span>{article.views}</span>
                  <span>{article.comments}</span>
                  <span className="ml-auto text-xs text-gray-400">{article.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold">Recent Comments</h3>
            <a href="#" className="text-sm text-blue-500">View All</a>
          </div>
          <div className="space-y-4">
            {comments.map((comment, index) => (
              <div key={index}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700">
                    {comment.initials}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{comment.name}</p>
                    <p className="text-sm text-gray-600">{comment.text}</p>
                    <p className="text-sm text-blue-500 mt-1">On: {comment.article}</p>
                    <p className="text-xs text-gray-400">{comment.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
