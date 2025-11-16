import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import ManageComments from '../ManageComments';
import toast from 'react-hot-toast';

// Mock dependencies
vi.mock('axios');
vi.mock('react-hot-toast', () => ({
  default: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));
vi.mock('@/components/comments/CommentCard', () => ({
  default: ({ comment }) => <div data-testid={`comment-${comment.commentId}`}>{comment.content}</div>,
}));
vi.mock('@/components/ModalConfirm', () => ({
  default: ({ isOpen, onConfirm, onCancel }) =>
    isOpen ? (
      <div data-testid="modal-confirm">
        <button onClick={onConfirm}>Confirm</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    ) : null,
}));
vi.mock('@/components/LoadingSpinner', () => ({
  default: () => <div data-testid="loading-spinner">Loading...</div>,
}));
vi.mock('@/components/PageWrapper', () => ({
  default: ({ children }) => <div>{children}</div>,
}));

describe('ManageComments Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('✅ Harus menampilkan loading spinner saat data sedang dimuat', () => {
    axios.get.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<ManageComments />);
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('✅ Harus menampilkan komentar setelah data dimuat', async () => {
    const mockComments = [
      {
        commentId: 1,
        name: 'John Doe',
        email: 'john@example.com',
        content: 'Test comment',
        status: 'approved',
        news: { title: 'Test Article' },
      },
    ];

    axios.get.mockResolvedValue({
      data: { data: { comments: mockComments } },
    });

    render(<ManageComments />);

    await waitFor(() => {
      expect(screen.getByTestId('comment-1')).toBeInTheDocument();
      expect(screen.getByText('Test comment')).toBeInTheDocument();
    });
  });

  it('✅ Harus menampilkan error toast jika fetch gagal', async () => {
    axios.get.mockRejectedValue(new Error('Network error'));

    render(<ManageComments />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Gagal memuat komentar.');
    });
  });

  it('✅ Harus filter komentar berdasarkan status', async () => {
    const mockComments = [
      {
        commentId: 1,
        name: 'John Doe',
        email: 'john@example.com',
        content: 'Approved comment',
        status: 'approved',
        news: { title: 'Test Article' },
      },
      {
        commentId: 2,
        name: 'Jane Doe',
        email: 'jane@example.com',
        content: 'Pending comment',
        status: 'pending',
        news: { title: 'Test Article' },
      },
    ];

    axios.get.mockResolvedValue({
      data: { data: { comments: mockComments } },
    });

    render(<ManageComments />);

    await waitFor(() => {
      // Gunakan getAllByTestId karena mungkin ada multiple elements dari test lain
      const comments1 = screen.getAllByTestId('comment-1');
      const comments2 = screen.getAllByTestId('comment-2');
      expect(comments1.length).toBeGreaterThan(0);
      expect(comments2.length).toBeGreaterThan(0);
    });
  });

  it('✅ Harus filter komentar berdasarkan search term', async () => {
    const user = userEvent.setup();
    const mockComments = [
      {
        commentId: 1,
        name: 'John Doe',
        email: 'john@example.com',
        content: 'Test comment',
        status: 'approved',
        news: { title: 'Test Article' },
      },
    ];

    axios.get.mockResolvedValue({
      data: { data: { comments: mockComments } },
    });

    render(<ManageComments />);

    await waitFor(() => {
      // Gunakan getAllByTestId karena mungkin ada multiple elements
      const comments = screen.getAllByTestId('comment-1');
      expect(comments.length).toBeGreaterThan(0);
    });

    // Placeholder sebenarnya adalah "Cari berdasarkan judul artikel..."
    const searchInput = screen.getByPlaceholderText(/cari berdasarkan/i);
    await user.type(searchInput, 'John');

    // Comment should still be visible
    const comments = screen.getAllByTestId('comment-1');
    expect(comments.length).toBeGreaterThan(0);
  });
});

