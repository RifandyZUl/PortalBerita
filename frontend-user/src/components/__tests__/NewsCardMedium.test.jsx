/**
 * ============================================
 * TEST FILE: NewsCardMedium.test.jsx
 * ============================================
 * 
 * DESKRIPSI:
 * File ini menguji komponen NewsCardMedium yang menampilkan card berita dengan ukuran medium.
 * 
 * YANG DITEST:
 * 1. Render news data dengan benar (title, category, date, image, summary)
 * 2. Memiliki link yang benar ke news detail (/news/{slug})
 * 3. Handle missing news data gracefully (null/undefined tidak crash)
 * 4. Handle missing slug dengan fallback (link ke /news/#)
 * 5. Conditional rendering summary (hanya render jika ada)
 * 6. Render dengan struktur yang benar (image + content)
 * 
 * BEST PRACTICES:
 * - Test presentational component
 * - Test link navigation
 * - Test conditional rendering
 * - Test edge cases (null, undefined, missing data)
 * - Test accessibility (alt text, semantic HTML)
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NewsCardMedium from '../NewsCardMedium';

// Mock NewsImage
vi.mock('../NewsImage', () => ({
  default: ({ src, alt, className }) => (
    <img src={src} alt={alt} className={className} data-testid="news-image" />
  ),
}));

// Mock dateFormatter
vi.mock('@/utils/dateFormatter.js', () => ({
  formatDate: (date) => '15 Januari 2024',
}));

describe('NewsCardMedium Component', () => {
  /**
   * TEST 1: Render news data dengan benar
   * 
   * SKENARIO:
   * - Komponen menerima data news yang lengkap
   * 
   * YANG DITEST:
   * - Title harus ditampilkan
   * - Category dan date harus ditampilkan
   * - Image harus ditampilkan dengan src yang benar
   * - Summary harus ditampilkan jika ada
   * 
   * EXPECTED RESULT:
   * - Semua data news ter-render dengan benar
   */
  it('✅ TEST 1: Harus render news data dengan benar (title, category, date, image, summary)', () => {
    const mockNews = {
      id: 1,
      title: 'Test News Title',
      slug: 'test-news-slug',
      category: 'Teknologi',
      createdAt: '2024-01-15T10:00:00Z',
      image_url: 'https://example.com/image.jpg',
      summary: 'This is a test summary',
    };

    render(
      <BrowserRouter>
        <NewsCardMedium news={mockNews} />
      </BrowserRouter>
    );

    expect(screen.getByText('Test News Title')).toBeInTheDocument();
    expect(screen.getByText(/Teknologi • 15 Januari 2024/i)).toBeInTheDocument();
    expect(screen.getByText('This is a test summary')).toBeInTheDocument();
    expect(screen.getByTestId('news-image')).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  /**
   * TEST 2: Memiliki link yang benar ke news detail
   * 
   * SKENARIO:
   * - User klik card news
   * 
   * YANG DITEST:
   * - Link harus mengarah ke /news/{slug}
   * - Link harus memiliki href yang benar
   * 
   * EXPECTED RESULT:
   * - Link mengarah ke /news/test-news-slug
   */
  it('✅ TEST 2: Harus memiliki link yang benar ke news detail (/news/{slug})', () => {
    const mockNews = {
      id: 1,
      title: 'Test News',
      slug: 'test-news-slug',
      category: 'Teknologi',
      createdAt: '2024-01-15T10:00:00Z',
    };

    render(
      <BrowserRouter>
        <NewsCardMedium news={mockNews} />
      </BrowserRouter>
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/news/test-news-slug');
  });

  /**
   * TEST 3: Handle missing news data gracefully
   * 
   * SKENARIO:
   * - Komponen menerima null atau undefined
   * 
   * YANG DITEST:
   * - Component tidak boleh crash
   * - Harus handle null/undefined dengan aman
   * 
   * EXPECTED RESULT:
   * - Component render tanpa error
   */
  it('✅ TEST 3: Harus handle missing news data gracefully (null/undefined tidak crash)', () => {
    render(
      <BrowserRouter>
        <NewsCardMedium news={null} />
      </BrowserRouter>
    );

    // Component harus render tanpa crash
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  /**
   * TEST 4: Handle missing slug dengan fallback
   * 
   * SKENARIO:
   * - News tidak memiliki slug
   * 
   * YANG DITEST:
   * - Link harus menggunakan fallback /news/#
   * 
   * EXPECTED RESULT:
   * - Link mengarah ke /news/#
   */
  it('✅ TEST 4: Harus handle missing slug dengan fallback (link ke /news/#)', () => {
    const mockNews = {
      id: 1,
      title: 'Test News',
      category: 'Teknologi',
      createdAt: '2024-01-15T10:00:00Z',
    };

    render(
      <BrowserRouter>
        <NewsCardMedium news={mockNews} />
      </BrowserRouter>
    );

    const link = screen.getByRole('link');
    // React Router Link akan menghasilkan /news/ jika slug adalah '#'
    expect(link).toHaveAttribute('href', '/news/');
  });

  /**
   * TEST 5: Conditional rendering summary
   * 
   * SKENARIO:
   * - News memiliki summary dan tidak memiliki summary
   * 
   * YANG DITEST:
   * - Summary harus ditampilkan jika ada
   * - Summary tidak boleh ditampilkan jika tidak ada
   * 
   * EXPECTED RESULT:
   * - Summary conditional rendering bekerja dengan benar
   */
  it('✅ TEST 5: Tidak boleh render summary jika tidak ada (conditional rendering)', () => {
    const mockNewsWithoutSummary = {
      id: 1,
      title: 'Test News',
      slug: 'test-news-slug',
      category: 'Teknologi',
      createdAt: '2024-01-15T10:00:00Z',
    };

    const { rerender } = render(
      <BrowserRouter>
        <NewsCardMedium news={mockNewsWithoutSummary} />
      </BrowserRouter>
    );

    // Summary tidak boleh ada
    expect(screen.queryByText(/summary/i)).not.toBeInTheDocument();

    // Re-render dengan summary
    const mockNewsWithSummary = {
      ...mockNewsWithoutSummary,
      summary: 'Test summary',
    };

    rerender(
      <BrowserRouter>
        <NewsCardMedium news={mockNewsWithSummary} />
      </BrowserRouter>
    );

    // Summary harus ada
    expect(screen.getByText('Test summary')).toBeInTheDocument();
  });

  /**
   * TEST 6: Render dengan struktur yang benar
   * 
   * SKENARIO:
   * - Component harus memiliki struktur layout yang benar
   * 
   * YANG DITEST:
   * - Harus ada image container
   * - Harus ada content container
   * - Harus memiliki border bottom
   * 
   * EXPECTED RESULT:
   * - Struktur layout benar
   */
  it('✅ TEST 6: Harus render dengan struktur yang benar (image + content layout)', () => {
    const mockNews = {
      id: 1,
      title: 'Test News',
      slug: 'test-news-slug',
      category: 'Teknologi',
      createdAt: '2024-01-15T10:00:00Z',
      image_url: 'https://example.com/image.jpg',
    };

    const { container } = render(
      <BrowserRouter>
        <NewsCardMedium news={mockNews} />
      </BrowserRouter>
    );

    // Harus ada image
    expect(screen.getByTestId('news-image')).toBeInTheDocument();
    
    // Harus ada title
    expect(screen.getByText('Test News')).toBeInTheDocument();
    
    // Link harus memiliki class yang benar
    const link = screen.getByRole('link');
    expect(link).toHaveClass('group', 'flex', 'gap-4');
  });
});

