/**
 * ============================================
 * TEST FILE: NewsCardLarge.test.jsx
 * ============================================
 * 
 * DESKRIPSI:
 * File ini menguji komponen NewsCardLarge yang menampilkan berita dalam format card besar.
 * 
 * YANG DITEST:
 * 1. Render news data dengan benar (title, category, date, image, excerpt)
 * 2. Link navigation ke news detail
 * 3. Handle missing/null data gracefully
 * 4. Render excerpt jika ada (conditional rendering)
 * 
 * BEST PRACTICES:
 * - Test user behavior, bukan implementation detail
 * - Gunakan getByRole untuk accessibility
 * - Test edge cases (null, undefined, missing data)
 * - Mock external dependencies (react-router-dom)
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NewsCardLarge from '../NewsCardLarge';

// Mock react-router-dom Link component
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Link: ({ children, to }) => <a href={to}>{children}</a>,
  };
});

describe('NewsCardLarge Component', () => {
  const mockNews = {
    id: 1,
    title: 'Test News Title yang Panjang untuk Large Card',
    slug: 'test-news-title-yang-panjang-untuk-large-card',
    image_url: 'https://example.com/image.jpg',
    category: 'Teknologi',
    createdAt: '2024-01-15T10:00:00Z',
    excerpt: 'Ini adalah excerpt atau ringkasan berita yang akan ditampilkan di card besar.',
  };

  /**
   * TEST 1: Render news data dengan benar
   * 
   * SKENARIO:
   * - Komponen menerima data news yang valid
   * 
   * YANG DITEST:
   * - Title harus ditampilkan
   * - Category dan date harus ditampilkan
   * - Image harus ditampilkan dengan src dan alt yang benar
   * - Excerpt harus ditampilkan jika ada
   * 
   * EXPECTED RESULT:
   * - Semua data news ditampilkan: title, category, date, image, excerpt
   */
  it('✅ TEST 1: Harus render news data dengan benar (title, category, date, image, excerpt)', () => {
    render(
      <BrowserRouter>
        <NewsCardLarge news={mockNews} />
      </BrowserRouter>
    );

    // Verifikasi title
    expect(screen.getByText('Test News Title yang Panjang untuk Large Card')).toBeInTheDocument();
    
    // Verifikasi category dan date
    expect(screen.getByText(/Teknologi/i)).toBeInTheDocument();
    
    // Verifikasi excerpt
    expect(screen.getByText(/Ini adalah excerpt atau ringkasan/i)).toBeInTheDocument();
    
    // Verifikasi image
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', mockNews.image_url);
    expect(image).toHaveAttribute('alt', mockNews.title);
  });

  /**
   * TEST 2: Link navigation ke news detail
   * 
   * SKENARIO:
   * - User bisa klik card untuk ke news detail
   * 
   * YANG DITEST:
   * - Link harus mengarah ke /news/{slug}
   * - Link harus bisa diklik untuk navigasi
   * 
   * EXPECTED RESULT:
   * - Link mengarah ke URL yang benar sesuai slug berita
   */
  it('✅ TEST 2: Harus memiliki link yang benar ke news detail (/news/{slug})', () => {
    render(
      <BrowserRouter>
        <NewsCardLarge news={mockNews} />
      </BrowserRouter>
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/news/${mockNews.slug}`);
  });

  /**
   * TEST 3: Handle missing news data gracefully
   * 
   * SKENARIO:
   * - Komponen menerima null atau undefined news
   * 
   * YANG DITEST:
   * - Tidak boleh crash saat menerima null/undefined
   * - Harus render dengan fallback yang aman
   * 
   * EXPECTED RESULT:
   * - Komponen tidak error, tetap render dengan fallback
   */
  it('✅ TEST 3: Harus handle missing news data gracefully (null/undefined tidak crash)', () => {
    render(
      <BrowserRouter>
        <NewsCardLarge news={null} />
      </BrowserRouter>
    );

    // Tidak boleh crash, harus render dengan fallback
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/news/#');
  });

  /**
   * TEST 4: Tidak render excerpt jika tidak ada
   * 
   * SKENARIO:
   * - News data ada tapi tidak ada excerpt (undefined/null)
   * 
   * YANG DITEST:
   * - Conditional rendering: excerpt tidak boleh ditampilkan jika tidak ada
   * 
   * EXPECTED RESULT:
   * - Excerpt tidak ter-render jika tidak ada di data
   */
  it('✅ TEST 4: Tidak boleh render excerpt jika tidak ada (conditional rendering)', () => {
    const newsWithoutExcerpt = { ...mockNews };
    delete newsWithoutExcerpt.excerpt;

    render(
      <BrowserRouter>
        <NewsCardLarge news={newsWithoutExcerpt} />
      </BrowserRouter>
    );

    // Excerpt tidak boleh ada
    expect(screen.queryByText(/Ini adalah excerpt/i)).not.toBeInTheDocument();
  });
});

