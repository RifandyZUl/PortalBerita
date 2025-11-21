import { useEffect, useState, useCallback } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import CommentCard from '@/components/comments/CommentCard';
import ModalConfirm from '@/components/ModalConfirm';
import LoadingSpinner from '@/components/LoadingSpinner';
import PageWrapper from '@/components/PageWrapper';

const ManageComments = () => {
  const [comments, setComments] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCommentToDelete, setSelectedCommentToDelete] = useState(null);

  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/comments');
      const data = res?.data?.data?.comments || [];
      setComments(data);
    } catch (err) {
      console.error('Gagal mengambil komentar:', err);
      toast.error('Gagal memuat komentar.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  useEffect(() => {
    const keyword = searchTerm.toLowerCase();
    const filtered = comments.filter((comment) => {
      const matchesStatus =
        !statusFilter || comment.status.toLowerCase() === statusFilter.toLowerCase();

      const matchesSearch =
        comment.name.toLowerCase().includes(keyword) ||
        comment.email.toLowerCase().includes(keyword) ||
        comment.content.toLowerCase().includes(keyword) ||
        comment.news?.title?.toLowerCase().includes(keyword);

      return matchesStatus && matchesSearch;
    });

    setFilteredComments(filtered);
  }, [comments, statusFilter, searchTerm]);

  const handleStatusUpdate = async (commentId, newStatus) => {
    try {
      await api.patch(`/api/comments/${commentId}/status`, {
        status: newStatus,
      });

      setComments((prev) =>
        prev.map((c) =>
          c.commentId === commentId ? { ...c, status: newStatus } : c
        )
      );

      toast.success('Status komentar diperbarui!');
    } catch (err) {
      console.error(err);
      toast.error('Gagal memperbarui status komentar');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCommentToDelete) return;

    try {
      await api.delete(`/api/comments/${selectedCommentToDelete.commentId}`);

      setComments((prev) =>
        prev.filter((c) => c.commentId !== selectedCommentToDelete.commentId)
      );

      toast.success('Komentar berhasil dihapus!');
    } catch (err) {
      console.error(err);
      toast.error('Gagal menghapus komentar');
    } finally {
      setSelectedCommentToDelete(null);
    }
  };

  return (
    <PageWrapper>
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">Manage Comments</h2>

        {/* Filter & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <input
            type="text"
            placeholder="Cari berdasarkan judul artikel..."
            className="w-full sm:w-1/2 px-3 py-2 border rounded text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border px-3 py-2 rounded text-sm"
          >
            <option value="">Semua Status</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Spam">Spam</option>
          </select>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-[40vh]">
            <LoadingSpinner />
          </div>
        ) : filteredComments.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-10">
            <p className="text-4xl mb-2">🧐</p>
            <p>Tidak ada komentar yang cocok.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredComments.map((comment) => (
              <CommentCard
                key={comment.commentId}
                comment={comment}
                onUpdateStatus={handleStatusUpdate}
                onDelete={setSelectedCommentToDelete}
              />
            ))}
          </div>
        )}

        {/* Modal Confirm */}
        <ModalConfirm
          isOpen={!!selectedCommentToDelete}
          title="Konfirmasi Hapus Komentar"
          message="Apakah kamu yakin ingin menghapus komentar ini? Tindakan ini tidak dapat dibatalkan."
          onCancel={() => setSelectedCommentToDelete(null)}
          onConfirm={handleDeleteConfirm}
          loading={false}
        />
      </div>
    </PageWrapper>
  );
};

export default ManageComments;
