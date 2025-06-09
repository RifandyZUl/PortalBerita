import PropTypes from "prop-types";
import CommentActions from "./CommentActions";

const CommentCard = ({ comment, onUpdateStatus }) => {
  const handleReply = () => alert(`Reply to: ${comment.name}`);
  const handleEdit = () => alert(`Edit comment from: ${comment.name}`);
  const handleApprove = () => onUpdateStatus(comment.id, "Approved");
  const handleMarkSpam = () => onUpdateStatus(comment.id, "Spam");
  const handleDelete = () => {
    const confirmDelete = window.confirm(`Delete comment from ${comment.name}?`);
    if (confirmDelete) {
      alert("Deleted (dummy only)");
    }
  };

  return (
    <div className="border p-4 rounded-md mb-4 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-gray-300 rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm">
          {comment.initials}
        </div>
        <div>
          <h4 className="font-semibold">{comment.name}</h4>
          <p className="text-sm text-blue-600">{comment.email}</p>
        </div>
        <div className="ml-auto text-sm text-gray-500">{comment.date}</div>
      </div>
      <p className="text-gray-700 mb-2">{comment.content}</p>
      <p className="text-sm text-blue-500">
        on: <span className="underline">{comment.article}</span>
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
};

export default CommentCard;
