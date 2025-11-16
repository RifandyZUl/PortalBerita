/**
 * ============================================
 * TEST FILE: SkeletonLoader.test.jsx
 * ============================================
 * 
 * DESKRIPSI:
 * File ini menguji komponen SkeletonLoader yang menampilkan loading placeholder.
 * 
 * YANG DITEST:
 * 1. Render skeleton loader tanpa crash
 * 2. Memiliki struktur skeleton yang benar (multiple placeholder elements)
 * 3. Memiliki class animate-pulse untuk animasi
 * 
 * BEST PRACTICES:
 * - Test presentational component (simple)
 * - Test CSS classes untuk styling
 * - Minimal test untuk loading components
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import SkeletonLoader from '../SkeletonLoader';

describe('SkeletonLoader Component', () => {
  /**
   * TEST 1: Render skeleton loader
   * 
   * SKENARIO:
   * - Komponen harus render tanpa crash
   * 
   * YANG DITEST:
   * - Komponen harus render dengan struktur yang benar
   * - Harus memiliki class animate-pulse untuk animasi
   * 
   * EXPECTED RESULT:
   * - Component ter-render dengan class animate-pulse
   */
  it('✅ TEST 1: Harus render skeleton loader tanpa crash (dengan animasi pulse)', () => {
    const { container } = render(<SkeletonLoader />);

    // Verifikasi komponen render
    expect(container.firstChild).toBeInTheDocument();
    
    // Verifikasi memiliki class animate-pulse
    expect(container.firstChild).toHaveClass('animate-pulse');
  });

  /**
   * TEST 2: Memiliki struktur skeleton yang benar
   * 
   * SKENARIO:
   * - Skeleton harus memiliki placeholder untuk trending, latest news, dan kategori
   * 
   * YANG DITEST:
   * - Harus ada multiple skeleton elements (gray-300, gray-200)
   * - Struktur harus sesuai dengan layout yang akan diisi
   * 
   * EXPECTED RESULT:
   * - Multiple skeleton placeholder elements ter-render
   */
  it('✅ TEST 2: Harus memiliki struktur skeleton yang benar (multiple placeholder elements)', () => {
    const { container } = render(<SkeletonLoader />);

    // Harus ada banyak skeleton elements (gray-300, gray-200)
    const skeletonElements = container.querySelectorAll('.bg-gray-300, .bg-gray-200');
    expect(skeletonElements.length).toBeGreaterThan(0);
  });
});

