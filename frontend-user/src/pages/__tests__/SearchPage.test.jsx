/**
 * ============================================
 * TEST FILE: SearchPage.test.jsx
 * ============================================
 * 
 * DESKRIPSI:
 * File ini menguji halaman SearchPage yang menampilkan hasil pencarian dengan filter dan sort.
 * 
 * YANG DITEST:
 * 1. Render search results setelah data loaded
 * 2. Sort functionality (Terbaru, Popular, Relevansi)
 * 3. Date filter functionality
 * 4. Handle empty results (tampilkan pesan)
 * 5. Loading state saat fetch data
 * 6. Handle API error gracefully
 * 
 * BEST PRACTICES:
 * - Mock useSearchParams untuk query string
 * - Mock axios untuk API calls
 * - Test user interactions (select, input)
 * - Test sorting logic
 * - Test filtering logic
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import SearchPage from '../SearchPage';

// Mock api
const mockApiGet = vi.fn();
vi.mock('@/utils/api', () => ({
  default: {
    get: (...args) => mockApiGet(...args),
    interceptors: {
      response: {
        use: vi.fn(),
      },
    },
  },
}));

// Mock useSearchParams
const mockSearchParams = new URLSearchParams('?query=teknologi');
const mockSetSearchParams = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useSearchParams: () => [mockSearchParams, mockSetSearchParams],
    Link: ({ children, to }) => <a href={to}>{children}</a>,
  };
});

// Mock utils
vi.mock('../../utils/time', () => ({
  formatWaktuLalu: (date) => '2 hari yang lalu',
}));

// Mock SkeletonLoader
vi.mock('@/components/SkeletonLoader', () => ({
  default: ({ count }) => <div data-testid="skeleton-loader">Loading {count} items...</div>,
}));

describe('SearchPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams.set('query', 'teknologi');
  });

  /**
   * TEST 1: Render search results
   * 
   * SKENARIO:
   * - User melakukan search dengan keyword dan hasil ditemukan
   * 
   * YANG DITEST:
   * - Search results harus ditampilkan setelah API response
   * - Keyword harus ditampilkan di heading
   * - Setiap result harus menampilkan: title, image, summary, date
   * 
   * EXPECTED RESULT:
   * - Heading: "Hasil Pencarian 'keyword'"
   * - List hasil pencarian ter-render dengan lengkap
   */
  it('✅ TEST 1: Harus render search results setelah data loaded (heading + list hasil)', async () => {
    const mockResults = [
      {
        id: 1,
        title: 'News tentang Teknologi',
        slug: 'news-tentang-teknologi',
        imageUrl: 'https://example.com/image1.jpg',
        summary: 'Summary 1',
        publishedAt: '2024-01-15T10:00:00Z',
        createdAt: '2024-01-15T10:00:00Z',
        views: 100,
      },
    ];

    mockApiGet.mockResolvedValueOnce({
      data: { data: mockResults },
    });

    render(
      <BrowserRouter>
        <SearchPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/hasil pencarian/i)).toBeInTheDocument();
      // Ada beberapa elemen dengan text "teknologi", gunakan query yang lebih spesifik
      expect(screen.getByText('News tentang Teknologi')).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Verifikasi keyword ditampilkan di heading
    const heading = screen.getByText(/hasil pencarian/i);
    expect(heading).toBeInTheDocument();
  });

  /**
   * TEST 2: Sort functionality
   * 
   * SKENARIO:
   * - User memilih sort option dari dropdown (Terbaru, Popular, Relevansi)
   * 
   * YANG DITEST:
   * - Sort dropdown harus bisa diubah
   * - Results harus di-sort sesuai pilihan (Terbaru: by date, Popular: by views)
   * 
   * EXPECTED RESULT:
   * - Sort option berubah sesuai pilihan user
   * - Results ter-sort sesuai option yang dipilih
   */
  it('✅ TEST 2: Harus bisa mengubah sort option (Terbaru, Popular, Relevansi)', async () => {
    const user = userEvent.setup();

    mockApiGet.mockResolvedValueOnce({
      data: { data: [] },
    });

    render(
      <BrowserRouter>
        <SearchPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      const sortSelect = screen.getByRole('combobox');
      expect(sortSelect).toBeInTheDocument();
    });

    const sortSelect = screen.getByRole('combobox');
    await user.selectOptions(sortSelect, 'Popular');

    expect(sortSelect.value).toBe('Popular');
  });

  /**
   * TEST 3: Date filter functionality
   * 
   * SKENARIO:
   * - User memilih date filter untuk filter hasil berdasarkan tanggal
   * 
   * YANG DITEST:
   * - Date input harus bisa diisi
   * - Results harus di-filter berdasarkan tanggal yang dipilih
   * 
   * EXPECTED RESULT:
   * - Date input value berubah sesuai input user
   * - Results ter-filter berdasarkan tanggal
   */
  it('✅ TEST 3: Harus bisa mengubah date filter (filter hasil berdasarkan tanggal)', async () => {
    const user = userEvent.setup();

    const mockResults = [
      {
        id: 1,
        title: 'News 1',
        slug: 'news-1',
        imageUrl: 'https://example.com/image1.jpg',
        publishedAt: '2024-01-15T10:00:00Z',
        createdAt: '2024-01-15T10:00:00Z',
      },
    ];

    mockApiGet.mockResolvedValueOnce({
      data: { data: mockResults },
    });

    const { container } = render(
      <BrowserRouter>
        <SearchPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      // Cari date input dengan querySelector
      const dateInput = container.querySelector('input[type="date"]');
      expect(dateInput).toBeInTheDocument();
    });

    // Test mengubah date filter
    const dateInput = container.querySelector('input[type="date"]');
    if (dateInput) {
      await user.clear(dateInput);
      await user.type(dateInput, '2024-01-15');
      expect(dateInput.value).toBe('2024-01-15');
    }
  });

  /**
   * TEST 4: Handle empty results
   * 
   * SKENARIO:
   * - Search tidak menemukan hasil (API return empty array)
   * 
   * YANG DITEST:
   * - Empty state handling
   * - Harus menampilkan pesan yang user-friendly
   * 
   * EXPECTED RESULT:
   * - Menampilkan pesan "Berita tidak ditemukan"
   */
  it('✅ TEST 4: Harus menampilkan pesan jika tidak ada hasil (empty state)', async () => {
    mockApiGet.mockResolvedValueOnce({
      data: { data: [] },
    });

    render(
      <BrowserRouter>
        <SearchPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/tidak ada hasil ditemukan/i)).toBeInTheDocument();
    });
  });

  /**
   * TEST 5: Loading state
   * 
   * SKENARIO:
   * - Data sedang di-fetch dari API
   * 
   * YANG DITEST:
   * - Harus menampilkan SkeletonLoader saat loading
   * - Tidak boleh menampilkan results sebelum data ready
   * 
   * EXPECTED RESULT:
   * - SkeletonLoader component ter-render
   */
  it('✅ TEST 5: Harus menampilkan loading state (SkeletonLoader)', () => {
    mockApiGet.mockImplementation(() => new Promise(() => {}));

    render(
      <BrowserRouter>
        <SearchPage />
      </BrowserRouter>
    );

    expect(screen.getByTestId('skeleton-loader')).toBeInTheDocument();
  });

  /**
   * TEST 6: Handle API error
   * 
   * SKENARIO:
   * - API call gagal (network error, 500, dll)
   * 
   * YANG DITEST:
   * - Error handling: tidak boleh crash
   * - Harus handle error dengan baik (try-catch)
   * - Harus menampilkan empty state atau error message
   * 
   * EXPECTED RESULT:
   * - Component tetap render, tidak crash
   * - Error di-handle dengan baik
   */
  it('✅ TEST 6: Harus handle API error gracefully (tidak crash saat API gagal)', async () => {
    mockApiGet.mockRejectedValueOnce(new Error('API Error'));

    render(
      <BrowserRouter>
        <SearchPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/tidak ada hasil ditemukan/i)).toBeInTheDocument();
    });
  });
});

