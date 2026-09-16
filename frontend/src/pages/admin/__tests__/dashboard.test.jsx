import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import Dashboard from '../dashboard';
import { createMockComment, createMockArticle } from '../../../test/factories';

// Mock dependencies
// eslint-disable-next-line no-undef
global.fetch = vi.fn();
vi.mock('../../components/PageWrapper', () => ({
  default: ({ children }) => <div data-testid="page-wrapper">{children}</div>,
}));
vi.mock('../../components/LoadingSpinner', () => ({
  default: () => <div data-testid="loading-spinner">Loading...</div>,
}));

describe('Dashboard Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('token', 'test-token');
  });

  afterEach(() => {
    cleanup();
  });

  describe('Loading States', () => {
    it('should display loading spinner when data is being fetched', () => {
      // eslint-disable-next-line no-undef
      global.fetch.mockImplementation(() => new Promise(() => {})); // Never resolves
      
      const { container } = render(<Dashboard />);
      
      // LoadingSpinner mock should have data-testid, but if not, check by spinner class
      const spinner = screen.queryByTestId('loading-spinner') || container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('Stats Display', () => {
    it('should display stats after data is loaded', async () => {
      const mockStats = {
        totalNews: 10,
        totalViews: 1000,
        totalComments: 50,
      };

      // eslint-disable-next-line no-undef
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: mockStats }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: { articles: [], totalPages: 1 } }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: { comments: [], totalPages: 1 } }),
        });

      render(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText('Total Articles')).toBeInTheDocument();
        expect(screen.getByText('10')).toBeInTheDocument();
        expect(screen.getByText('Total Views')).toBeInTheDocument();
        expect(screen.getByText('1000')).toBeInTheDocument();
        expect(screen.getByText('Comments')).toBeInTheDocument();
        expect(screen.getByText('50')).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Recent Articles', () => {
    it('should display recent articles', async () => {
      const mockArticle = createMockArticle({
        newsId: 1,
        title: 'Test Article',
        content: '<p>Test content</p>',
        views: 100,
        commentsCount: 5,
        Category: { name: 'Technology' },
      });

      // eslint-disable-next-line no-undef
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: {} }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: { articles: [mockArticle], totalPages: 1 } }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: { comments: [], totalPages: 1 } }),
        });

      render(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText('Recent Articles')).toBeInTheDocument();
        expect(screen.getByText('Test Article')).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should display "No articles available" when no articles exist', async () => {
      // eslint-disable-next-line no-undef
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: {} }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: { articles: [], totalPages: 1 } }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: { comments: [], totalPages: 1 } }),
        });

      render(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText('No articles available.')).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Recent Comments', () => {
    it('should display recent comments', async () => {
      const mockComment = createMockComment({
        commentId: 1,
        name: 'John Doe',
        content: 'Test comment',
        news: { title: 'Test Article' },
      });

      // eslint-disable-next-line no-undef
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: {} }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: { articles: [], totalPages: 1 } }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: { comments: [mockComment], totalPages: 1 } }),
        });

      render(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText('Recent Comments')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Test comment')).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should display "No comments available" when no comments exist', async () => {
      // eslint-disable-next-line no-undef
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: {} }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: { articles: [], totalPages: 1 } }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: { comments: [], totalPages: 1 } }),
        });

      render(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText('No comments available.')).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });
});
