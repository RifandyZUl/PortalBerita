/**
 * ============================================
 * TEST FILE: NewsSectionVertical.test.jsx
 * ============================================
 * 
 * DESKRIPSI:
 * File ini menguji komponen NewsSectionVertical yang menampilkan list berita vertikal.
 * 
 * YANG DITEST:
 * 1. Render section dengan title
 * 2. Render list news dengan NewsCardMedium
 * 3. Handle empty newsList (edge case)
 * 4. Handle undefined newsList (default parameter)
 * 
 * BEST PRACTICES:
 * - Mock child components untuk isolation
 * - Test list rendering
 * - Test edge cases (empty, undefined)
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import NewsSectionVertical from '../NewsSectionVertical';

// Mock SectionTitle
vi.mock('../SectionTitle', () => ({
  default: ({ text }) => <div data-testid="section-title">{text}</div>,
}));

// Mock NewsCardMedium
vi.mock('../NewsCardMedium', () => ({
  default: ({ news }) => (
    <div data-testid={`news-card-${news?.id || 'unknown'}`}>
      {news?.title || 'Unknown'}
    </div>
  ),
}));

describe('NewsSectionVertical Component', () => {
  /**
   * TEST 1: Render section dengan title
   * 
   * SKENARIO:
   * - Component harus render dengan title yang diberikan
   * 
   * YANG DITEST:
   * - SectionTitle harus render dengan text yang benar
   * 
   * EXPECTED RESULT:
   * - SectionTitle ter-render dengan title yang sesuai
   */
  it('✅ TEST 1: Harus render section dengan title', () => {
    render(
      <NewsSectionVertical
        title="Terbaru"
        newsList={[]}
      />
    );

    expect(screen.getByTestId('section-title')).toBeInTheDocument();
    expect(screen.getByTestId('section-title')).toHaveTextContent('Terbaru');
  });

  /**
   * TEST 2: Render list news dengan NewsCardMedium
   * 
   * SKENARIO:
   * - Component harus render list news menggunakan NewsCardMedium
   * 
   * YANG DITEST:
   * - Setiap news harus di-render sebagai NewsCardMedium
   * - News harus di-render dengan data yang benar
   * 
   * EXPECTED RESULT:
   * - Semua news ter-render sebagai NewsCardMedium
   */
  it('✅ TEST 2: Harus render list news dengan NewsCardMedium', () => {
    const mockNewsList = [
      { id: 1, title: 'News 1' },
      { id: 2, title: 'News 2' },
      { id: 3, title: 'News 3' },
    ];

    render(
      <NewsSectionVertical
        title="Terbaru"
        newsList={mockNewsList}
      />
    );

    expect(screen.getByTestId('news-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('news-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('news-card-3')).toBeInTheDocument();
  });

  /**
   * TEST 3: Handle empty newsList (edge case)
   * 
   * SKENARIO:
   * - newsList adalah array kosong
   * 
   * YANG DITEST:
   * - Component tidak boleh crash
   * - Section title tetap ter-render
   * - Tidak ada news card yang di-render
   * 
   * EXPECTED RESULT:
   * - Component render tanpa error
   * - Tidak ada news card
   */
  it('✅ TEST 3: Harus handle empty newsList dengan benar (edge case: no data)', () => {
    render(
      <NewsSectionVertical
        title="Terbaru"
        newsList={[]}
      />
    );

    expect(screen.getByTestId('section-title')).toBeInTheDocument();
    expect(screen.queryByTestId(/news-card-/)).not.toBeInTheDocument();
  });

  /**
   * TEST 4: Handle undefined newsList (default parameter)
   * 
   * SKENARIO:
   * - newsList tidak diberikan (undefined)
   * 
   * YANG DITEST:
   * - Component harus menggunakan default parameter (empty array)
   * - Component tidak boleh crash
   * 
   * EXPECTED RESULT:
   * - Component render tanpa error
   * - Tidak ada news card
   */
  it('✅ TEST 4: Harus handle undefined newsList dengan default empty array (default parameter)', () => {
    render(
      <NewsSectionVertical
        title="Terbaru"
      />
    );

    expect(screen.getByTestId('section-title')).toBeInTheDocument();
    expect(screen.queryByTestId(/news-card-/)).not.toBeInTheDocument();
  });
});

