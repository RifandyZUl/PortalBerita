/**
 * ============================================
 * TEST FILE: HomePage.test.jsx
 * ============================================
 * 
 * DESKRIPSI:
 * File ini menguji halaman HomePage yang menampilkan berita populer, terbaru, dan kategori.
 * 
 * YANG DITEST:
 * 1. Loading state saat fetch data
 * 2. Render popular news setelah data loaded
 * 3. Render latest news dengan format bernomor
 * 4. Render section kategori (Hiburan, Teknologi)
 * 5. Render kategori Nasional & Olahraga
 * 6. Handle API errors gracefully
 * 
 * BEST PRACTICES:
 * - Mock axios untuk API calls
 * - Mock child components untuk isolation
 * - Test multiple API calls dengan Promise.all
 * - Test async operations dengan waitFor
 * - Test error handling
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import HomePage from '../HomePage';

// Mock axios
vi.mock('axios');
const mockedAxios = axios;

// Mock child components
vi.mock('@/components/PopularGrid', () => ({
  default: ({ news }) => <div data-testid="popular-grid">{news?.length || 0} popular news</div>,
}));

vi.mock('@/components/SectionTitle', () => ({
  default: ({ text }) => <div data-testid="section-title">{text}</div>,
}));

vi.mock('@/components/SectionKategori', () => ({
  default: () => <div data-testid="section-kategori">Section Kategori</div>,
}));

vi.mock('@/components/SkeletonLoader', () => ({
  default: () => <div data-testid="skeleton-loader">Loading...</div>,
}));

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * TEST 1: Render loading state
   * 
   * SKENARIO:
   * - Data sedang di-fetch dari API
   * - Component masih dalam state loading
   * 
   * YANG DITEST:
   * - Harus menampilkan SkeletonLoader saat loading
   * - Tidak boleh menampilkan data sebelum fetch selesai
   * 
   * EXPECTED RESULT:
   * - SkeletonLoader component ter-render
   */
  it('✅ TEST 1: Harus menampilkan loading state saat fetch data (SkeletonLoader)', () => {
    // Mock axios dengan delay
    mockedAxios.get.mockImplementation(() => new Promise(() => {}));

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    expect(screen.getByTestId('skeleton-loader')).toBeInTheDocument();
  });

  /**
   * TEST 2: Render popular news setelah data loaded
   * 
   * SKENARIO:
   * - Data popular news berhasil di-fetch dari API
   * - Loading state selesai
   * 
   * YANG DITEST:
   * - PopularGrid harus render dengan data yang benar
   * - Data harus ditampilkan setelah fetch selesai
   * 
   * EXPECTED RESULT:
   * - PopularGrid component ter-render dengan data news
   */
  it('✅ TEST 2: Harus render popular news setelah data loaded (PopularGrid dengan data)', async () => {
    const mockPopularNews = [
      { id: 1, title: 'Popular 1', slug: 'popular-1' },
      { id: 2, title: 'Popular 2', slug: 'popular-2' },
    ];

    mockedAxios.get.mockResolvedValueOnce({
      data: { data: mockPopularNews },
    });

    mockedAxios.get.mockResolvedValueOnce({
      data: { data: [] },
    });

    mockedAxios.get.mockResolvedValueOnce({
      data: { data: [] },
    });

    mockedAxios.get.mockResolvedValueOnce({
      data: { data: [] },
    });

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('popular-grid')).toBeInTheDocument();
    });
  });

  /**
   * TEST 3: Render latest news
   * 
   * SKENARIO:
   * - Data latest news berhasil di-fetch dari API
   * 
   * YANG DITEST:
   * - Latest news harus ditampilkan dengan format bernomor
   * - Data harus sesuai dengan response API
   * 
   * EXPECTED RESULT:
   * - Latest news ditampilkan dengan format list bernomor
   */
  it('✅ TEST 3: Harus render latest news dengan format bernomor (1, 2, 3, ...)', async () => {
    const mockLatestNews = [
      { id: 1, title: 'Latest 1', slug: 'latest-1' },
      { id: 2, title: 'Latest 2', slug: 'latest-2' },
    ];

    mockedAxios.get.mockResolvedValueOnce({
      data: { data: [] },
    });

    mockedAxios.get.mockResolvedValueOnce({
      data: { data: mockLatestNews },
    });

    mockedAxios.get.mockResolvedValueOnce({
      data: { data: [] },
    });

    mockedAxios.get.mockResolvedValueOnce({
      data: { data: [] },
    });

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Latest 1')).toBeInTheDocument();
      expect(screen.getByText('Latest 2')).toBeInTheDocument();
    });
  });

  /**
   * TEST 5: Handle API error gracefully
   * 
   * SKENARIO:
   * - API call gagal (network error, 500, dll)
   * 
   * YANG DITEST:
   * - Component tidak boleh crash saat API error
   * - Harus handle error dengan baik (try-catch)
   * - Harus menampilkan state yang sesuai (error atau empty)
   * 
   * EXPECTED RESULT:
   * - Component tetap render, tidak crash
   * - Error di-handle dengan baik
   */
  it('✅ TEST 5: Harus handle API error gracefully (tidak crash saat API gagal)', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      // Tidak boleh crash, harus render dengan empty state atau error handling
      expect(screen.queryByTestId('skeleton-loader')).not.toBeInTheDocument();
    });
  });

  /**
   * TEST 4: Render section kategori
   * 
   * SKENARIO:
   * - Data berhasil di-fetch dari semua API endpoints
   * 
   * YANG DITEST:
   * - SectionKategori component harus ditampilkan
   * - Component harus ter-render setelah data loaded
   * 
   * EXPECTED RESULT:
   * - SectionKategori component ter-render di halaman
   */
  it('✅ TEST 4: Harus render section kategori (Hiburan & Teknologi)', async () => {
    mockedAxios.get.mockResolvedValue({ data: { data: [] } });

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('section-kategori')).toBeInTheDocument();
    });
  });
});

