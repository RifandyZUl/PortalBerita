import PropTypes from 'prop-types';

const CommentActions = ({ onApprove, onMarkSpam, onDelete }) => {
  const buttonClass = 'text-xs px-3 py-1 rounded border transition-colors hover:bg-gray-100';

  return (
    <div className="flex items-center flex-wrap gap-2">
      <button className={buttonClass} onClick={onApprove}>
        Approve
      </button>
      <button className={buttonClass} onClick={onMarkSpam}>
        Mark as Spam
      </button>
      <button
        className="text-xs px-3 py-1 rounded border border-red-500 text-red-500 transition-colors hover:bg-red-100"
        onClick={onDelete}
      >
        Delete
      </button>
    </div>
  );
};

CommentActions.propTypes = {
  onApprove: PropTypes.func.isRequired,
  onMarkSpam: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default CommentActions;
