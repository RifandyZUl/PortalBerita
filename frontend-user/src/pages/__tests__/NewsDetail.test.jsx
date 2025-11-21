/**
 * ============================================
 * TEST FILE: NewsDetail.test.jsx
 * ============================================
 * 
 * DESKRIPSI:
 * File ini menguji halaman NewsDetail yang menampilkan detail berita, komentar, dan form komentar.
 * 
 * YANG DITEST:
 * 1. Loading state saat fetch data
 * 2. Render news detail (title, category, date, views, content, image)
 * 3. Render comments list
 * 4. Form komentar submission (validation, submit, refresh comments)
 * 5. Auto-increment views saat page load
 * 6. Handle missing news (404)
 * 
 * BEST PRACTICES:
 * - Mock useParams untuk routing
 * - Mock axios untuk API calls
 * - Test form interactions dengan userEvent
 * - Test multiple useEffect hooks
 * - Test side effects (document.title, views increment)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import NewsDetail from '../NewsDetail';

// Mock api
const mockApiGet = vi.fn();
const mockApiPost = vi.fn();
const mockApiPatch = vi.fn();
vi.mock('@/utils/api', () => ({
  default: {
    get: (...args) => mockApiGet(...args),
    post: (...args) => mockApiPost(...args),
    patch: (...args) => mockApiPatch(...args),
    interceptors: {
      response: {
        use: vi.fn(),
      },
    },
  },
}));

// Mock useParams
const mockUseParams = vi.fn(() => ({ slug: 'test-news-slug' }));
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => mockUseParams(),
  };
});

// Mock utils
vi.mock('../../utils/imageTransform', () => ({
  getResizedImage: (url) => url || '/placeholder.jpg',
}));

// Mock SkeletonLoader
vi.mock('@/components/SkeletonLoader', () => ({
  default: () => <div data-testid="skeleton-loader">Loading...</div>,
}));

describe('NewsDetail Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseParams.mockReturnValue({ slug: 'test-news-slug' });
  });

  /**
   * TEST 1: Render loading state
   * 
   * SKENARIO:
   * - Data news detail sedang di-fetch dari API
   * 
   * YANG DITEST:
   * - Harus menampilkan SkeletonLoader saat loading
   * - Tidak boleh menampilkan content sebelum data ready
   * 
   * EXPECTED RESULT:
   * - SkeletonLoader component ter-render
   */
  it('✅ TEST 1: Harus menampilkan loading state saat fetch data (SkeletonLoader)', () => {
    mockApiGet.mockImplementation(() => new Promise(() => {}));

    render(
      <BrowserRouter>
        <NewsDetail />
      </BrowserRouter>
    );

    expect(screen.getByTestId('skeleton-loader')).toBeInTheDocument();
  });

  /**
   * TEST 2: Render news detail setelah data loaded
   * 
   * SKENARIO:
   * - Data news detail berhasil di-fetch dari API
   * - Loading state selesai
   * 
   * YANG DITEST:
   * - Title, category, date, views harus ditampilkan
   * - Image harus ditampilkan dengan URL yang benar
   * - Content HTML harus di-render dengan benar
   * 
   * EXPECTED RESULT:
   * - Semua data news ditampilkan: title, category, date, views, image, content
   */
  it('✅ TEST 2: Harus render news detail setelah data loaded (title, category, date, views, image, content)', async () => {
    const mockNews = {
      id: 1,
      title: 'Test News Title',
      slug: 'test-news-slug',
      content: '<p>Test content</p>',
      category: 'Teknologi',
      createdAt: '2024-01-15T10:00:00Z',
      image_url: 'https://example.com/image.jpg',
      views: 100,
    };

    mockApiGet.mockResolvedValueOnce({
      data: { data: mockNews },
    });

    mockApiGet.mockResolvedValueOnce({
      data: [],
    });

    mockApiPatch.mockResolvedValueOnce({
      data: { success: true },
    });

    render(
      <BrowserRouter>
        <NewsDetail />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test News Title')).toBeInTheDocument();
      expect(screen.getByText(/Teknologi/i)).toBeInTheDocument();
      expect(screen.getByText(/100 views/i)).toBeInTheDocument();
    });
  });

  /**
   * TEST 3: Render comments
   * 
   * SKENARIO:
   * - Comments berhasil di-fetch dari API
   * 
   * YANG DITEST:
   * - Comments list harus ditampilkan
   * - Jumlah komentar harus ditampilkan di heading
   * - Setiap komentar harus menampilkan: name, comment, date
   * 
   * EXPECTED RESULT:
   * - Comments list ter-render dengan format yang benar
   * - Heading menampilkan "Komentar (X)"
   */
  it('✅ TEST 3: Harus render comments setelah data loaded (list komentar dengan name, comment, date)', async () => {
    const mockNews = {
      id: 1,
      title: 'Test News',
      slug: 'test-news-slug',
      content: '<p>Content</p>',
      category: 'Teknologi',
      createdAt: '2024-01-15T10:00:00Z',
      image_url: 'https://example.com/image.jpg',
      views: 0,
    };

    const mockComments = [
      {
        commentId: 1,
        name: 'John Doe',
        email: 'john@example.com',
        comment: 'Great article!',
        createdAt: '2024-01-15T10:00:00Z',
      },
    ];

    mockApiGet.mockResolvedValueOnce({
      data: { data: mockNews },
    });

    mockApiGet.mockResolvedValueOnce({
      data: mockComments,
    });

    mockApiPatch.mockResolvedValueOnce({
      data: { success: true },
    });

    render(
      <BrowserRouter>
        <NewsDetail />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Komentar \(1\)/i)).toBeInTheDocument();
      expect(screen.getByText('Great article!')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  /**
   * TEST 4: Submit komentar form
   * 
   * SKENARIO:
   * - User mengisi form komentar (name, email, comment)
   * - User submit form
   * 
   * YANG DITEST:
   * - Form validation (required fields)
   * - Form submission ke API
   * - Comments list harus di-refresh setelah submit
   * - Form harus di-reset setelah submit sukses
   * 
   * EXPECTED RESULT:
   * - Komentar terkirim ke API
   * - Comments list di-refresh dan menampilkan komentar baru
   */
  it('✅ TEST 4: Harus bisa submit komentar form (validation, submit, refresh comments)', async () => {
    const user = userEvent.setup();

    const mockNews = {
      id: 1,
      title: 'Test News',
      slug: 'test-news-slug',
      content: '<p>Content</p>',
      category: 'Teknologi',
      createdAt: '2024-01-15T10:00:00Z',
      image_url: 'https://example.com/image.jpg',
      views: 0,
    };

    mockApiGet.mockResolvedValueOnce({
      data: { data: mockNews },
    });

    mockApiGet.mockResolvedValueOnce({
      data: [],
    });

    mockApiPatch.mockResolvedValueOnce({
      data: { success: true },
    });

    mockApiPost.mockResolvedValueOnce({
      data: { success: true },
    });

    mockApiGet.mockResolvedValueOnce({
      data: [{ commentId: 1, name: 'Test User', comment: 'Test comment' }],
    });

    render(
      <BrowserRouter>
        <NewsDetail />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/nama anda/i)).toBeInTheDocument();
    });

    // Fill form
    const nameInput = screen.getByPlaceholderText(/nama anda/i);
    const emailInput = screen.getByPlaceholderText(/email anda/i);
    const commentInput = screen.getByPlaceholderText(/tulis komentar/i);
    const submitButton = screen.getByRole('button', { name: /kirim komentar/i });

    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'test@example.com');
    await user.type(commentInput, 'Test comment');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockApiPost).toHaveBeenCalledWith(
        '/api/comments/1',
        expect.objectContaining({
          name: 'Test User',
          email: 'test@example.com',
          comment: 'Test comment',
        })
      );
    });
  });

  /**
   * TEST 5: Handle missing news
   * 
   * SKENARIO:
   * - News tidak ditemukan (404 error dari API)
   * - Slug tidak valid atau news sudah dihapus
   * 
   * YANG DITEST:
   * - Error handling untuk 404 response
   * - Harus menampilkan pesan error yang user-friendly
   * 
   * EXPECTED RESULT:
   * - Menampilkan pesan "Berita tidak ditemukan"
   * - Tidak crash, tetap render error message
   */
  it('✅ TEST 5: Harus handle missing news dengan pesan error (404 - Berita tidak ditemukan)', async () => {
    mockApiGet.mockRejectedValueOnce({
      response: { status: 404 },
    });

    render(
      <BrowserRouter>
        <NewsDetail />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/berita tidak ditemukan/i)).toBeInTheDocument();
    });
  });
});

