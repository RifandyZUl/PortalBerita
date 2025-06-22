import PropTypes from 'prop-types';
import { format } from 'date-fns';
import CommentActions from './CommentActions';

const CommentCard = ({ comment, onUpdateStatus, onDelete }) => {
  const {
    commentId,
    name,
    email,
    content,
    status,
    createdAt,
    news,
  } = comment;

  const initials = name
    ?.split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  const statusBadge = {
    Approved: { color: 'bg-green-100 text-green-800', icon: '✅' },
    Spam: { color: 'bg-red-100 text-red-800', icon: '🚫' },
    Pending: { color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
  };

  const badge = statusBadge[status] || statusBadge['Pending'];

  return (
    <div className="border p-4 rounded-md mb-4 shadow-sm bg-white">
      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
        {/* Avatar & User Info */}
        <div className="flex gap-3 min-w-0">
          <div className="bg-gray-300 rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm text-white shrink-0">
            {initials || 'U'}
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-sm text-gray-800 truncate">{name}</h4>
            <p className="text-xs text-blue-600 truncate">{email}</p>
            <p className="text-sm text-gray-700 mt-1 line-clamp-2">{content}</p>
            <p className="text-xs text-blue-500 mt-1 truncate">
              on: <span className="underline">{news?.title || 'Judul tidak tersedia'}</span>
            </p>
          </div>
        </div>

        {/* Badge & Timestamp */}
        <div className="flex sm:flex-col items-start sm:items-end justify-between sm:ml-auto sm:gap-2 text-sm text-gray-500 whitespace-nowrap">
          <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded font-medium ${badge.color}`}>
            {badge.icon} {status}
          </span>
          <span className="text-xs">
            {format(new Date(createdAt), "dd MMM yyyy 'at' HH:mm")}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <CommentActions
          onApprove={() => onUpdateStatus(commentId, 'Approved')}
          onMarkSpam={() => onUpdateStatus(commentId, 'Spam')}
          onDelete={() => onDelete(comment)}
        />
      </div>
    </div>
  );
};

CommentCard.propTypes = {
  comment: PropTypes.shape({
    commentId: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    news: PropTypes.shape({
      title: PropTypes.string,
    }),
  }).isRequired,
  onUpdateStatus: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default CommentCard;
