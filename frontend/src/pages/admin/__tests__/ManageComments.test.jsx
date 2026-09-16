import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock api utils - MUST be before component import
const mockApiGet = vi.fn();
const mockApiDelete = vi.fn();
const mockApiPatch = vi.fn();

// Mock axios first to prevent real HTTP requests
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: (...args) => mockApiGet(...args),
      delete: (...args) => mockApiDelete(...args),
      patch: (...args) => mockApiPatch(...args),
      interceptors: {
        request: {
          use: vi.fn(),
        },
        response: {
          use: vi.fn(),
        },
      },
    })),
  },
}));

vi.mock('../../utils/api', () => ({
  default: {
    get: (...args) => mockApiGet(...args),
    delete: (...args) => mockApiDelete(...args),
    patch: (...args) => mockApiPatch(...args),
    interceptors: {
      response: {
        use: vi.fn(),
      },
    },
  },
}));

vi.mock('react-hot-toast', () => ({
  default: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Import after mocks
import ManageComments from '../ManageComments';
import toast from 'react-hot-toast';
import {
  createMockComment,
} from '../../../test/factories';

// Mock CommentCard - use alias path to match component import
vi.mock('@/components/comments/CommentCard', async () => {
  const React = await import('react');
  return {
    default: React.memo(function CommentCardMock({ comment }) {
      return React.createElement('div', { 'data-testid': `comment-${comment.commentId}` }, comment.content);
    }),
  };
});
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
    mockApiGet.mockReset();
    mockApiDelete.mockReset();
    mockApiPatch.mockReset();
    localStorage.setItem('token', 'test-token');
  });

  afterEach(() => {
    cleanup();
  });

  describe('Loading States', () => {
    it('should display loading spinner when data is being fetched', () => {
      mockApiGet.mockImplementation(() => new Promise(() => {})); // Never resolves
      
      render(<ManageComments />);
      
      // LoadingSpinner mock has data-testid
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });
  });

  describe('Data Display', () => {
    it('should display comments after data is loaded', async () => {
      const mockComment = createMockComment({ 
        commentId: 1, 
        content: 'Test comment',
        name: 'John Doe',
        email: 'john@example.com',
        status: 'Approved',
        news: { title: 'Test Article' }
      });

      mockApiGet.mockResolvedValueOnce({
        data: {
          data: {
            comments: [mockComment],
          },
        },
      });

      render(<ManageComments />);

      // Wait for loading to finish
      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      }, { timeout: 3000 });
      
      // Wait for comments to appear (this waits for the useEffect to update filteredComments)
      // Use findBy* which automatically waits and retries
      const commentElement = await screen.findByTestId('comment-1', { timeout: 5000 });
      expect(commentElement).toBeInTheDocument();
      expect(await screen.findByText('Test comment', { timeout: 5000 })).toBeInTheDocument();
    });

    it('should display empty state when no comments exist', async () => {
      mockApiGet.mockResolvedValueOnce({
        data: {
          data: {
            comments: [],
          },
        },
      });

      render(<ManageComments />);

      await waitFor(() => {
        const loadingSpinner = screen.queryByTestId('loading-spinner');
        expect(loadingSpinner).not.toBeInTheDocument();
      }, { timeout: 3000 });

      await waitFor(() => {
        expect(screen.getByText('Tidak ada komentar yang cocok.')).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Error Handling', () => {
    it('should display error toast when fetch fails', async () => {
      mockApiGet.mockRejectedValue(new Error('Network error'));

      render(<ManageComments />);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Gagal memuat komentar.');
      }, { timeout: 3000 });
    });

    it('should handle network timeout gracefully', async () => {
      mockApiGet.mockImplementation(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 100)
        )
      );

      render(<ManageComments />);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      }, { timeout: 3000 });
    });
  });

  describe('Filtering', () => {
    it('should filter comments by status', async () => {
      const user = userEvent.setup();
      const mockComments = [
        createMockComment({ 
          commentId: 1, 
          status: 'Approved', 
          content: 'Approved comment',
          name: 'John',
          email: 'john@example.com',
          news: { title: 'Test' }
        }),
        createMockComment({ 
          commentId: 2, 
          status: 'Pending', 
          content: 'Pending comment',
          name: 'Jane',
          email: 'jane@example.com',
          news: { title: 'Test' }
        }),
      ];

      mockApiGet.mockResolvedValueOnce({
        data: {
          data: {
            comments: mockComments,
          },
        },
      });

      render(<ManageComments />);

      // Wait for loading to finish
      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      }, { timeout: 3000 });

      // Wait for both comments to appear using findBy* which automatically waits
      const comment1 = await screen.findByTestId('comment-1', { timeout: 5000 });
      const comment2 = await screen.findByTestId('comment-2', { timeout: 5000 });
      expect(comment1).toBeInTheDocument();
      expect(comment2).toBeInTheDocument();

      // Filter by Approved status
      const statusSelect = screen.getByRole('combobox');
      await user.selectOptions(statusSelect, 'Approved');

      // Wait for filtering to complete
      await waitFor(() => {
        expect(screen.getByTestId('comment-1')).toBeInTheDocument();
        expect(screen.queryByTestId('comment-2')).not.toBeInTheDocument();
      }, { timeout: 5000 });
    });

    it('should filter comments by search term', async () => {
      const user = userEvent.setup();
      const mockComments = [
        createMockComment({ 
          commentId: 1, 
          name: 'John Doe', 
          content: 'Test comment',
          email: 'john@example.com',
          status: 'Approved',
          news: { title: 'Test Article' }
        }),
        createMockComment({ 
          commentId: 2, 
          name: 'Jane Smith', 
          content: 'Another comment',
          email: 'jane@example.com',
          status: 'Approved',
          news: { title: 'Test Article' }
        }),
      ];

      mockApiGet.mockResolvedValueOnce({
        data: {
          data: {
            comments: mockComments,
          },
        },
      });

      render(<ManageComments />);

      // Wait for loading to finish
      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      }, { timeout: 3000 });

      // Wait for both comments to appear using findBy* which automatically waits
      const comment1 = await screen.findByTestId('comment-1', { timeout: 5000 });
      const comment2 = await screen.findByTestId('comment-2', { timeout: 5000 });
      expect(comment1).toBeInTheDocument();
      expect(comment2).toBeInTheDocument();

      // Search for "John"
      const searchInput = screen.getByPlaceholderText(/cari berdasarkan/i);
      await user.clear(searchInput);
      await user.type(searchInput, 'John');

      // Wait for filtering to complete
      await waitFor(() => {
        expect(screen.getByTestId('comment-1')).toBeInTheDocument();
        expect(screen.queryByTestId('comment-2')).not.toBeInTheDocument();
      }, { timeout: 5000 });
    });
  });
});

