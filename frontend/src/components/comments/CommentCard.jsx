import PropTypes from 'prop-types';
import CommentActions from './CommentActions';
import { format } from 'date-fns';

const CommentCard = ({ comment, onUpdateStatus, onDelete }) => {
  const handleReply = () => alert(`Reply to: ${comment.name}`);
  const handleEdit = () => alert(`Edit comment from: ${comment.name}`);
  const handleApprove = () => onUpdateStatus(comment.commentId, 'Approved');
  const handleMarkSpam = () => onUpdateStatus(comment.commentId, 'Spam');
  const handleDelete = () => {
    const confirm = window.confirm(`Yakin ingin menghapus komentar dari ${comment.name}?`);
    if (confirm) onDelete(comment.commentId);
  };

  const initials = comment.name
    ?.split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  return (
    <div className="border p-4 rounded-md mb-4 shadow-sm bg-white">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-gray-300 rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm">
          {initials || 'U'}
        </div>
        <div>
          <h4 className="font-semibold">{comment.name}</h4>
          <p className="text-sm text-blue-600">{comment.email}</p>
        </div>
      <div className="ml-auto flex items-center gap-3 text-sm text-gray-500">
        <span
          className={`text-xs px-2 py-1 rounded font-medium ${
            comment.status === 'Approved'
              ? 'bg-green-200 text-green-800'
              : comment.status === 'Spam'
              ? 'bg-red-200 text-red-800'
              : 'bg-yellow-200 text-yellow-800'
          }`}
        >
          {comment.status}
        </span>
        <span>{format(new Date(comment.createdAt), "dd MMM yyyy 'at' HH:mm")}</span>
      </div>


      </div>

      <p className="text-gray-700 mb-2">{comment.content}</p>

      <p className="text-sm text-blue-500">
        on:{' '}
        <span className="underline">
          {comment.news?.title || 'Judul tidak tersedia'}
        </span>
      </p>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <CommentActions
          status={comment.status}
          onReply={handleReply}
          onEdit={handleEdit}
          onApprove={handleApprove}
          onMarkSpam={handleMarkSpam}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

CommentCard.propTypes = {
  comment: PropTypes.object.isRequired,
  onUpdateStatus: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default CommentCard;
