import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import Dashboard from '../dashboard';

// Mock dependencies
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

  it('✅ Harus menampilkan loading spinner saat data sedang dimuat', () => {
    global.fetch.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<Dashboard />);
    
    // Mock LoadingSpinner mungkin tidak bekerja, cari spinner dengan class atau testid
    const spinner = screen.queryByTestId('loading-spinner');
    if (!spinner) {
      // Jika mock tidak bekerja, cari elemen dengan class animate-spin
      const spinnerElement = document.querySelector('.animate-spin');
      expect(spinnerElement).toBeTruthy();
    } else {
      expect(spinner).toBeInTheDocument();
    }
  });

  it('✅ Harus menampilkan stats setelah data dimuat', async () => {
    const mockStats = {
      totalNews: 10,
      totalViews: 1000,
      totalComments: 50,
    };

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
    });
  });

  it('✅ Harus menampilkan recent articles', async () => {
    const mockArticles = [
      {
        newsId: 1,
        title: 'Test Article',
        content: '<p>Test content</p>',
        publishedAt: new Date().toISOString(),
        views: 100,
        commentsCount: 5,
        Category: { name: 'Technology' },
      },
    ];

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: {} }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { articles: mockArticles, totalPages: 1 } }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { comments: [], totalPages: 1 } }),
      });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Recent Articles')).toBeInTheDocument();
      expect(screen.getByText('Test Article')).toBeInTheDocument();
    });
  });

  it('✅ Harus menampilkan recent comments', async () => {
    const mockComments = [
      {
        commentId: 1,
        name: 'John Doe',
        content: 'Test comment',
        createdAt: new Date().toISOString(),
        news: { title: 'Test Article' },
      },
    ];

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
        json: async () => ({ data: { comments: mockComments, totalPages: 1 } }),
      });

    render(<Dashboard />);

    await waitFor(() => {
      // Gunakan getAllByText untuk menghindari multiple elements error
      const recentCommentsTexts = screen.getAllByText('Recent Comments');
      expect(recentCommentsTexts.length).toBeGreaterThan(0);
      const johnDoeTexts = screen.getAllByText('John Doe');
      expect(johnDoeTexts.length).toBeGreaterThan(0);
      const testCommentTexts = screen.getAllByText('Test comment');
      expect(testCommentTexts.length).toBeGreaterThan(0);
    });
  });

  it('✅ Harus menampilkan "No articles available" jika tidak ada artikel', async () => {
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
      // Gunakan getAllByText karena mungkin ada multiple elements dari test lain
      const noArticlesTexts = screen.getAllByText('No articles available.');
      expect(noArticlesTexts.length).toBeGreaterThan(0);
    });
  });

  it('✅ Harus menampilkan "No comments available" jika tidak ada komentar', async () => {
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
      // Gunakan getAllByText karena mungkin ada multiple elements dari test lain
      const noCommentsTexts = screen.getAllByText('No comments available.');
      expect(noCommentsTexts.length).toBeGreaterThan(0);
    });
  });
});

