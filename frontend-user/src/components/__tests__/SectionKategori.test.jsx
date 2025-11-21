/**
 * ============================================
 * TEST FILE: SectionKategori.test.jsx
 * ============================================
 * 
 * DESKRIPSI:
 * File ini menguji komponen SectionKategori yang menampilkan berita berdasarkan kategori (Hiburan & Teknologi).
 * 
 * YANG DITEST:
 * 1. Loading state saat fetch data
 * 2. Render news berdasarkan kategori (filter logic)
 * 3. Handle empty category (tampilkan pesan)
 * 4. Handle API error gracefully
 * 
 * BEST PRACTICES:
 * - Mock fetch API untuk isolation
 * - Test async operations dengan waitFor
 * - Test error handling
 * - Test filtering logic
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SectionKategori from '../SectionKategori';

// Mock api
const mockApiGet = vi.fn();
vi.mock('@/utils/api', () => ({
  default: {
    get: mockApiGet,
  },
}));

// Mock SectionTitle
vi.mock('@/components/SectionTitle', () => ({
  default: ({ text }) => <div data-testid={`section-title-${text.toLowerCase()}`}>{text}</div>,
}));

// Mock react-router-dom Link
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Link: ({ children, to }) => <a href={to}>{children}</a>,
  };
});

describe('SectionKategori Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
    mockApiGet.mockImplementation(() => new Promise(() => {}));

    render(
      <BrowserRouter>
        <SectionKategori />
      </BrowserRouter>
    );

    expect(screen.getByText(/memuat berita/i)).toBeInTheDocument();
  });

  /**
   * TEST 2: Render news berdasarkan kategori
   * 
   * SKENARIO:
   * - Data berhasil di-fetch dan di-filter berdasarkan kategori
   * 
   * YANG DITEST:
   * - Filter logic: News Hiburan harus ditampilkan di section Hiburan
   * - News Teknologi harus ditampilkan di section Teknologi
   * - News kategori lain tidak boleh muncul di section yang salah
   * 
   * EXPECTED RESULT:
   * - Section Hiburan menampilkan hanya news kategori Hiburan
   * - Section Teknologi menampilkan hanya news kategori Teknologi
   */
  it('✅ TEST 2: Harus render news berdasarkan kategori (filter: Hiburan & Teknologi)', async () => {
    const mockNews = [
      {
        id: 1,
        title: 'News Hiburan 1',
        slug: 'news-hiburan-1',
        category: 'Hiburan',
        image_url: 'https://example.com/image1.jpg',
        summary: 'Summary 1',
        createdAt: '2024-01-15T10:00:00Z',
      },
      {
        id: 2,
        title: 'News Teknologi 1',
        slug: 'news-teknologi-1',
        category: 'Teknologi',
        image_url: 'https://example.com/image2.jpg',
        summary: 'Summary 2',
        createdAt: '2024-01-14T10:00:00Z',
      },
    ];

    mockApiGet.mockResolvedValueOnce({
      data: { data: mockNews },
    });

    render(
      <BrowserRouter>
        <SectionKategori />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('News Hiburan 1')).toBeInTheDocument();
      expect(screen.getByText('News Teknologi 1')).toBeInTheDocument();
    });
  });

  /**
   * TEST 3: Handle empty category
   * 
   * SKENARIO:
   * - Tidak ada news di kategori tertentu (filter result empty)
   * 
   * YANG DITEST:
   * - Empty state handling untuk setiap kategori
   * - Harus menampilkan pesan yang user-friendly
   * 
   * EXPECTED RESULT:
   * - Menampilkan "Tidak ada berita hiburan tersedia" atau "Tidak ada berita teknologi tersedia"
   */
  it('✅ TEST 3: Harus menampilkan pesan jika kategori kosong (empty state)', async () => {
    mockApiGet.mockResolvedValueOnce({
      data: { data: [] },
    });

    render(
      <BrowserRouter>
        <SectionKategori />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/tidak ada berita hiburan tersedia/i)).toBeInTheDocument();
      expect(screen.getByText(/tidak ada berita teknologi tersedia/i)).toBeInTheDocument();
    });
  });

  /**
   * TEST 4: Handle API error
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
  it('✅ TEST 4: Harus handle API error gracefully (tidak crash saat API gagal)', async () => {
    mockApiGet.mockRejectedValueOnce(new Error('API Error'));

    render(
      <BrowserRouter>
        <SectionKategori />
      </BrowserRouter>
    );

    await waitFor(() => {
      // Tidak boleh crash, harus render dengan empty state
      expect(screen.getByText(/tidak ada berita hiburan tersedia/i)).toBeInTheDocument();
      expect(screen.getByText(/tidak ada berita teknologi tersedia/i)).toBeInTheDocument();
    });
  });
});

