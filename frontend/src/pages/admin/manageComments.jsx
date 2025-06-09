import { useState } from "react";
import CommentCard from "@/components/comments/CommentCard";
import { dummyComments } from "@/data/dummyComments";

const ManageComments = () => {
  const [comments, setComments] = useState(dummyComments);

  const updateStatus = (id, newStatus) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === id ? { ...comment, status: newStatus } : comment
      )
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-700">Manage Comments</h2>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h3 className="text-lg font-medium">All Comments</h3>
        <div className="flex gap-3 mt-2 sm:mt-0">
          <select className="border px-3 py-2 rounded text-sm">
            <option>All Status</option>
            <option>Approved</option>
            <option>Pending</option>
            <option>Spam</option>
          </select>
          <input
            type="text"
            placeholder="Search Comments..."
            className="border px-3 py-2 rounded text-sm w-full sm:w-64"
          />
        </div>
      </div>

      {comments.map((comment) => (
        <CommentCard
          key={comment.id}
          comment={comment}
          onUpdateStatus={updateStatus}
        />
      ))}
    </div>
  );
};

export default ManageComments;
