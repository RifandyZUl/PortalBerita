/**
 * ============================================
 * TEST FILE: PopularGrid.test.jsx
 * ============================================
 * 
 * DESKRIPSI:
 * File ini menguji komponen PopularGrid yang menampilkan 5 berita populer dengan layout grid.
 * 
 * YANG DITEST:
 * 1. Render popular news dengan layout yang benar (2 NewsCardLarge, 3 NewsCardSmall)
 * 2. Handle kurang dari 5 berita (tampilkan pesan)
 * 3. Handle empty array
 * 4. Handle undefined news prop (default empty array)
 * 
 * BEST PRACTICES:
 * - Mock child components untuk isolation
 * - Test edge cases (empty, undefined, kurang dari minimum)
 * - Test layout logic (posisi card berdasarkan index)
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PopularGrid from '../PopularGrid';

// Mock child components
vi.mock('../NewsCardLarge', () => ({
  default: ({ news }) => <div data-testid="news-card-large">{news?.title}</div>,
}));

vi.mock('../NewsCardSmall', () => ({
  default: ({ news }) => <div data-testid="news-card-small">{news?.title}</div>,
}));

describe('PopularGrid Component', () => {
  const mockNews = Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    title: `Popular News ${i + 1}`,
    slug: `popular-news-${i + 1}`,
    image_url: `https://example.com/image${i + 1}.jpg`,
    category: 'Teknologi',
    createdAt: '2024-01-15T10:00:00Z',
  }));

  /**
   * TEST 1: Render popular news dengan layout yang benar
   * 
   * SKENARIO:
   * - Komponen menerima 5 atau lebih berita populer
   * 
   * YANG DITEST:
   * - Layout logic: harus render 2 NewsCardLarge (posisi 0 dan 4)
   * - Harus render 3 NewsCardSmall (posisi 1, 2, 3)
   * 
   * EXPECTED RESULT:
   * - Layout: [Large] [Small] [Small] [Small] [Large]
   */
  it('✅ TEST 1: Harus render popular news dengan layout yang benar (2 Large + 3 Small)', () => {
    render(
      <BrowserRouter>
        <PopularGrid news={mockNews} />
      </BrowserRouter>
    );

    // Harus ada 2 NewsCardLarge (posisi 0 dan 4)
    const largeCards = screen.getAllByTestId('news-card-large');
    expect(largeCards).toHaveLength(2);
    expect(largeCards[0]).toHaveTextContent('Popular News 1');
    expect(largeCards[1]).toHaveTextContent('Popular News 5');

    // Harus ada 3 NewsCardSmall (posisi 1, 2, 3)
    const smallCards = screen.getAllByTestId('news-card-small');
    expect(smallCards).toHaveLength(3);
    expect(smallCards[0]).toHaveTextContent('Popular News 2');
    expect(smallCards[1]).toHaveTextContent('Popular News 3');
    expect(smallCards[2]).toHaveTextContent('Popular News 4');
  });

  /**
   * TEST 2: Handle kurang dari 5 berita
   * 
   * SKENARIO:
   * - Komponen menerima kurang dari 5 berita (minimum requirement)
   * 
   * YANG DITEST:
   * - Validation: harus menampilkan pesan jika kurang dari 5
   * - Tidak boleh render layout jika data tidak cukup
   * 
   * EXPECTED RESULT:
   * - Menampilkan pesan "Belum ada cukup berita populer untuk ditampilkan"
   */
  it('✅ TEST 2: Harus menampilkan pesan jika kurang dari 5 berita (minimum requirement)', () => {
    const fewNews = mockNews.slice(0, 3);

    render(
      <BrowserRouter>
        <PopularGrid news={fewNews} />
      </BrowserRouter>
    );

    expect(screen.getByText(/Belum ada cukup berita populer/i)).toBeInTheDocument();
  });

  /**
   * TEST 3: Handle empty array
   * 
   * SKENARIO:
   * - Komponen menerima array kosong (tidak ada data)
   * 
   * YANG DITEST:
   * - Edge case: harus handle empty array dengan aman
   * - Harus menampilkan pesan yang sesuai
   * 
   * EXPECTED RESULT:
   * - Menampilkan pesan "Belum ada cukup berita populer"
   */
  it('✅ TEST 3: Harus handle empty array dengan benar (edge case: no data)', () => {
    render(
      <BrowserRouter>
        <PopularGrid news={[]} />
      </BrowserRouter>
    );

    expect(screen.getByText(/Belum ada cukup berita populer/i)).toBeInTheDocument();
  });

  /**
   * TEST 4: Handle undefined news prop
   * 
   * SKENARIO:
   * - Komponen menerima undefined news prop (tidak dikirim)
   * 
   * YANG DITEST:
   * - Default parameter: harus menggunakan default empty array
   * - Tidak boleh error saat prop undefined
   * 
   * EXPECTED RESULT:
   * - Menggunakan default empty array, menampilkan pesan
   */
  it('✅ TEST 4: Harus handle undefined news prop dengan default empty array (default parameter)', () => {
    render(
      <BrowserRouter>
        <PopularGrid />
      </BrowserRouter>
    );

    expect(screen.getByText(/Belum ada cukup berita populer/i)).toBeInTheDocument();
  });
});

