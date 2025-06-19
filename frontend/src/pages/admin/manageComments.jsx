import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import CommentCard from '@/components/comments/CommentCard';

const ManageComments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/comments");
      const data = res?.data?.data?.comments || [];
      setComments(data);
    } catch (err) {
      console.error("Gagal mengambil komentar:", err);
      toast.error("Gagal memuat komentar.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/comments/${id}/status`, { status: newStatus });
      setComments(prev =>
        prev.map(comment =>
          comment.commentId === id ? { ...comment, status: newStatus } : comment
        )
      );
      toast.success('Status komentar diperbarui!');
    } catch (err) {
      console.error(err);
      toast.error('Gagal memperbarui status komentar');
    }
  };

  const deleteComment = async (id) => {
    const confirmDelete = window.confirm('Yakin ingin menghapus komentar ini?');
    if (!confirmDelete) return;
    try {
      await axios.delete(`http://localhost:5000/api/comments/${id}`);
      setComments(prev => prev.filter(comment => comment.commentId !== id));
      toast.success('Komentar berhasil dihapus!');
    } catch (err) {
      console.error(err);
      toast.error('Gagal menghapus komentar');
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-700">Manage Comments</h2>

      {loading ? (
        <p className="text-sm text-gray-500">Memuat komentar...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-gray-500">Belum ada komentar.</p>
      ) : (
        comments.map(comment => (
          <CommentCard
            key={comment.commentId}
            comment={comment}
            onUpdateStatus={updateStatus}
            onDelete={deleteComment}
          />
        ))
      )}
    </div>
  );
};

export default ManageComments;
