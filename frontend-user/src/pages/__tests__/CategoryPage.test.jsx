/**
 * ============================================
 * TEST FILE: CategoryPage.test.jsx
 * ============================================
 * 
 * DESKRIPSI:
 * File ini menguji halaman CategoryPage yang menampilkan berita berdasarkan kategori.
 * 
 * YANG DITEST:
 * 1. Loading state saat fetch data
 * 2. Render news berdasarkan kategori (filter logic)
 * 3. Format category name dari slug (normalisasi)
 * 4. Handle empty category (tampilkan pesan)
 * 5. Handle API error gracefully
 * 
 * BEST PRACTICES:
 * - Mock useParams untuk routing
 * - Mock axios untuk API calls
 * - Test filtering logic (normalisasi kategori)
 * - Test slug to category name conversion
 * - Test edge cases (empty, error)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import CategoryPage from '../CategoryPage';

// Mock axios
vi.mock('axios');
const mockedAxios = axios;

// Mock useParams
const mockUseParams = vi.fn(() => ({ slug: 'teknologi' }));
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => mockUseParams(),
    Link: ({ children, to }) => <a href={to}>{children}</a>,
  };
});

// Mock utils
vi.mock('../../utils/time', () => ({
  formatWaktuLalu: (date) => '2 hari yang lalu',
}));

describe('CategoryPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseParams.mockReturnValue({ slug: 'teknologi' });
  });

  /**
   * TEST 1: Render loading state
   * 
   * SKENARIO:
   * - Data sedang di-fetch dari API
   * 
   * YANG DITEST:
   * - Harus menampilkan "Memuat berita..." saat loading
   * 
   * EXPECTED RESULT:
   * - Text "Memuat berita..." ter-render
   */
  it('✅ TEST 1: Harus menampilkan loading state (Memuat berita...)', () => {
    mockedAxios.get.mockImplementation(() => new Promise(() => {}));

    render(
      <BrowserRouter>
        <CategoryPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/memuat berita/i)).toBeInTheDocument();
  });

  /**
   * TEST 2: Render news berdasarkan kategori
   * 
   * SKENARIO:
   * - Data news berhasil di-fetch dan di-filter berdasarkan kategori dari URL slug
   * 
   * YANG DITEST:
   * - Filter logic: hanya news dengan kategori yang sesuai yang ditampilkan
   * - News dengan kategori berbeda tidak boleh ditampilkan
   * 
   * EXPECTED RESULT:
   * - Hanya news kategori "Teknologi" yang ditampilkan (jika slug=teknologi)
   */
  it('✅ TEST 2: Harus render news berdasarkan kategori (filter logic: hanya kategori yang sesuai)', async () => {
    const mockNews = [
      {
        id: 1,
        title: 'News Teknologi 1',
        slug: 'news-teknologi-1',
        category: 'Teknologi',
        image_url: 'https://example.com/image1.jpg',
        summary: 'Summary 1',
        createdAt: '2024-01-15T10:00:00Z',
      },
      {
        id: 2,
        title: 'News Teknologi 2',
        slug: 'news-teknologi-2',
        category: 'Teknologi',
        image_url: 'https://example.com/image2.jpg',
        summary: 'Summary 2',
        createdAt: '2024-01-14T10:00:00Z',
      },
      {
        id: 3,
        title: 'News Olahraga',
        slug: 'news-olahraga',
        category: 'Olahraga',
        image_url: 'https://example.com/image3.jpg',
        summary: 'Summary 3',
        createdAt: '2024-01-13T10:00:00Z',
      },
    ];

    mockedAxios.get.mockResolvedValueOnce({
      data: { data: mockNews },
    });

    render(
      <BrowserRouter>
        <CategoryPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      // Hanya news dengan kategori Teknologi yang ditampilkan
      expect(screen.getByText('News Teknologi 1')).toBeInTheDocument();
      expect(screen.getByText('News Teknologi 2')).toBeInTheDocument();
      // News Olahraga tidak boleh ditampilkan
      expect(screen.queryByText('News Olahraga')).not.toBeInTheDocument();
    });
  });

  /**
   * TEST 3: Format category name dari slug
   * 
   * SKENARIO:
   * - Slug "teknologi" harus di-format menjadi "Teknologi" (capitalize)
   * 
   * YANG DITEST:
   * - Slug to category name conversion
   * - Format: replace dash dengan space, capitalize first letter
   * 
   * EXPECTED RESULT:
   * - Slug "teknologi" → "Teknologi"
   * - Slug "olah-raga" → "Olah Raga"
   */
  it('✅ TEST 3: Harus format category name dari slug dengan benar (teknologi → Teknologi)', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { data: [] },
    });

    render(
      <BrowserRouter>
        <CategoryPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Teknologi')).toBeInTheDocument();
    });
  });

  /**
   * TEST 4: Handle empty category
   * 
   * SKENARIO:
   * - Tidak ada news di kategori tersebut (filter result empty)
   * 
   * YANG DITEST:
   * - Empty state handling
   * - Harus menampilkan pesan yang user-friendly
   * 
   * EXPECTED RESULT:
   * - Menampilkan pesan "Belum ada berita di kategori ini"
   */
  it('✅ TEST 4: Harus menampilkan pesan jika kategori kosong (empty state)', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { data: [] },
    });

    render(
      <BrowserRouter>
        <CategoryPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/belum ada berita di kategori ini/i)).toBeInTheDocument();
    });
  });

  /**
   * TEST 5: Handle API error
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
  it('✅ TEST 5: Harus handle API error gracefully (tidak crash saat API gagal)', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

    render(
      <BrowserRouter>
        <CategoryPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/belum ada berita di kategori ini/i)).toBeInTheDocument();
    });
  });
});

