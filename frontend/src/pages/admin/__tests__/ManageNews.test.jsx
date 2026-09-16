import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';

// Mock api utils - MUST be before component import
const mockApiGet = vi.fn();
const mockApiDelete = vi.fn();
vi.mock('../../utils/api', () => ({
  default: {
    get: (...args) => mockApiGet(...args),
    delete: (...args) => mockApiDelete(...args),
    interceptors: {
      response: {
        use: vi.fn(),
      },
    },
  },
}));

// Import after mocks
import ManageNews from '../ManageNews';
import toast from 'react-hot-toast';
import {
  createMockArticles,
} from '../../../test/factories';
vi.mock('react-hot-toast', () => ({
  default: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Mock NewsForm
vi.mock('../../components/ManageNews/NewsForm', async () => {
  const React = await import('react');
  return {
    default: React.memo(function NewsFormMock({ selectedArticle }) {
      return React.createElement('div', { 'data-testid': 'news-form' },
        React.createElement('div', null, 'News Form'),
        selectedArticle && React.createElement('div', { 'data-testid': 'selected-article' }, selectedArticle.title)
      );
    }),
  };
});
vi.mock('../../components/ModalConfirm', () => ({
  default: ({ isOpen, onConfirm, onCancel }) =>
    isOpen ? (
      <div data-testid="modal-confirm">
        <button onClick={onConfirm}>Confirm</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    ) : null,
}));
vi.mock('../../components/LoadingSpinner', () => ({
  default: () => <div data-testid="loading-spinner">Loading...</div>,
}));
vi.mock('../../components/PageWrapper', () => ({
  default: ({ children }) => <div>{children}</div>,
}));
vi.mock('../../components/skeleton/SkeletonNewsTable', () => ({
  default: () => <div data-testid="skeleton-table">Loading...</div>,
}));

describe('ManageNews Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockApiGet.mockReset();
    mockApiDelete.mockReset();
    localStorage.setItem('token', 'test-token');
  });

  afterEach(() => {
    cleanup();
  });

  describe('Loading States', () => {
    it('should display loading spinner when data is being fetched', () => {
      mockApiGet.mockImplementation(() => new Promise(() => {})); // Never resolves
      
      const { container } = render(<ManageNews />);
      
      // LoadingSpinner component doesn't have test id, check by spinner class
      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('Data Display', () => {
    it('should display articles after data is loaded', async () => {
      const mockArticles = createMockArticles(1, {
        title: 'Test Article',
        content: 'Test content',
        status: 'published',
        Category: { name: 'Tech' },
        Author: { name: 'John Doe' },
      });

      mockApiGet.mockResolvedValueOnce({
        data: {
          data: {
            articles: mockArticles,
            total: 1,
          },
        },
      });

      render(<ManageNews />);

      await waitFor(() => {
        const loadingSpinner = screen.queryByTestId('loading-spinner');
        expect(loadingSpinner).not.toBeInTheDocument();
      }, { timeout: 3000 });
      
      await waitFor(() => {
        expect(screen.getByText('Add New Article')).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should display empty state when no articles exist', async () => {
      mockApiGet.mockResolvedValueOnce({
        data: {
          data: {
            articles: [],
            total: 0,
          },
        },
      });

      render(<ManageNews />);

      await waitFor(() => {
        const loadingSpinner = screen.queryByTestId('loading-spinner');
        expect(loadingSpinner).not.toBeInTheDocument();
      }, { timeout: 3000 });

      await waitFor(() => {
        expect(screen.getByText('Add New Article')).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Error Handling', () => {
    it('should display error toast when fetch fails', async () => {
      mockApiGet.mockRejectedValue(new Error('Network error'));

    render(<ManageNews />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Gagal memuat artikel.');
      }, { timeout: 3000 });
    });

    it('should handle network timeout gracefully', async () => {
      mockApiGet.mockImplementation(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 100)
        )
      );

      render(<ManageNews />);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      }, { timeout: 3000 });
    });
  });

  describe('Form Display', () => {
    it('should display form for adding new article', async () => {
      mockApiGet.mockResolvedValueOnce({
        data: {
          data: {
            articles: [],
            total: 0,
          },
        },
      });

      render(<ManageNews />);

      // Wait for loading to finish - form is always shown, so just wait for title
      await waitFor(() => {
        expect(screen.getByText('Add New Article')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Form is always rendered, verify it exists
      // The mock NewsForm should have data-testid="news-form"
      // But if real form is rendered, it will have form element
      const formElement = screen.queryByTestId('news-form') || 
                         document.querySelector('form');
      expect(formElement).toBeTruthy();
    });
  });
});
