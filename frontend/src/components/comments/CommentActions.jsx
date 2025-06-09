import PropTypes from "prop-types";

const CommentActions = ({ status, onReply, onEdit, onApprove, onMarkSpam, onDelete }) => {
  const statusColor = {
    Approved: "bg-green-200 text-green-800",
    Pending: "bg-yellow-200 text-yellow-800",
    Spam: "bg-red-200 text-red-800",
  };

  const badgeClass = statusColor[status] || "bg-gray-200 text-gray-800";

  return (
    <div className="flex items-center flex-wrap gap-2">
      <button className="text-xs px-3 py-1 rounded border" onClick={onReply}>Reply</button>
      <button className="text-xs px-3 py-1 rounded border" onClick={onEdit}>Edit</button>
      <button className="text-xs px-3 py-1 rounded border" onClick={onApprove}>Approve</button>
      <button className="text-xs px-3 py-1 rounded border" onClick={onMarkSpam}>Mark as Spam</button>
      <button
        className="text-xs px-3 py-1 rounded border border-red-500 text-red-500"
        onClick={onDelete}
      >
        Delete
      </button>
      <span className={`ml-auto text-xs px-2 py-1 rounded ${badgeClass}`}>{status}</span>
    </div>
  );
};

CommentActions.propTypes = {
  status: PropTypes.string.isRequired,
  onReply: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onApprove: PropTypes.func.isRequired,
  onMarkSpam: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default CommentActions;
