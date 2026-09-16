/**
 * ============================================
 * TEST FILE: NewsImage.test.jsx
 * ============================================
 * 
 * DESKRIPSI:
 * File ini menguji komponen NewsImage yang menampilkan gambar dengan fallback handling.
 * 
 * YANG DITEST:
 * 1. Render image dengan src yang valid
 * 2. Fallback ke default image jika src kosong/null
 * 3. Fallback ke fallback image jika image gagal load (onError)
 * 4. Render dengan alt text yang benar (accessibility)
 * 5. Render dengan className yang benar
 * 
 * BEST PRACTICES:
 * - Test image loading behavior
 * - Test error handling (onError)
 * - Test accessibility (alt text)
 * - Test props handling
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import NewsImage from '../NewsImage';

describe('NewsImage Component', () => {
  /**
   * TEST 1: Render image dengan src yang valid
   * 
   * SKENARIO:
   * - Image src valid dan berhasil di-load
   * 
   * YANG DITEST:
   * - Image harus render dengan src yang benar
   * - Image harus memiliki alt text
   * 
   * EXPECTED RESULT:
   * - Image element ter-render dengan src yang sesuai
   */
  it('✅ TEST 1: Harus render image dengan src yang valid', () => {
    render(
      <NewsImage
        src="https://example.com/image.jpg"
        alt="Test image"
      />
    );

    const image = screen.getByAltText('Test image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  /**
   * TEST 2: Fallback ke default image jika src kosong/null
   * 
   * SKENARIO:
   * - Image src kosong atau null
   * 
   * YANG DITEST:
   * - Harus menggunakan fallback default (/image/fallback.jpg)
   * 
   * EXPECTED RESULT:
   * - Image src adalah fallback default
   */
  it('✅ TEST 2: Harus fallback ke default image jika src kosong/null', () => {
    render(
      <NewsImage
        src=""
        alt="Test image"
      />
    );

    const image = screen.getByAltText('Test image');
    expect(image).toHaveAttribute('src', '/image/fallback.jpg');
  });

  /**
   * TEST 3: Fallback ke custom fallback image jika image gagal load
   * 
   * SKENARIO:
   * - Image gagal di-load (onError triggered)
   * 
   * YANG DITEST:
   * - onError handler harus trigger
   * - Image src harus berubah ke fallback
   * 
   * EXPECTED RESULT:
   * - Image src berubah ke fallback setelah error
   */
  it('✅ TEST 3: Harus fallback ke fallback image jika image gagal load (onError)', () => {
    const customFallback = '/image/custom-fallback.jpg';
    render(
      <NewsImage
        src="https://example.com/invalid-image.jpg"
        alt="Test image"
        fallback={customFallback}
      />
    );

    const image = screen.getByAltText('Test image');
    
    // Simulate image error
    const errorEvent = new Event('error', { bubbles: true });
    Object.defineProperty(errorEvent, 'target', {
      value: image,
      writable: false,
    });
    
    image.dispatchEvent(errorEvent);
    
    // After error, src should be fallback
    expect(image).toHaveAttribute('src', customFallback);
  });

  /**
   * TEST 4: Render dengan alt text yang benar (accessibility)
   * 
   * SKENARIO:
   * - Image harus memiliki alt text untuk accessibility
   * 
   * YANG DITEST:
   * - Alt text harus sesuai dengan prop yang diberikan
   * - Default alt text jika tidak diberikan
   * 
   * EXPECTED RESULT:
   * - Image memiliki alt attribute yang benar
   */
  it('✅ TEST 4: Harus render dengan alt text yang benar (accessibility)', () => {
    render(
      <NewsImage
        src="https://example.com/image.jpg"
        alt="Descriptive alt text"
      />
    );

    const image = screen.getByAltText('Descriptive alt text');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('alt', 'Descriptive alt text');
  });

  /**
   * TEST 5: Render dengan className yang benar
   * 
   * SKENARIO:
   * - Image harus menerima dan menerapkan className
   * 
   * YANG DITEST:
   * - ClassName harus diterapkan ke image element
   * 
   * EXPECTED RESULT:
   * - Image memiliki className yang sesuai
   */
  it('✅ TEST 5: Harus render dengan className yang benar', () => {
    render(
      <NewsImage
        src="https://example.com/image.jpg"
        alt="Test image"
        className="custom-class rounded-lg"
      />
    );

    const image = screen.getByAltText('Test image');
    expect(image).toHaveClass('custom-class', 'rounded-lg');
  });

  /**
   * TEST 6: Harus memiliki loading="lazy" attribute
   * 
   * SKENARIO:
   * - Image harus lazy load untuk performance
   * 
   * YANG DITEST:
   * - Image harus memiliki loading="lazy" attribute
   * 
   * EXPECTED RESULT:
   * - Image memiliki loading="lazy"
   */
  it('✅ TEST 6: Harus memiliki loading="lazy" attribute (performance optimization)', () => {
    render(
      <NewsImage
        src="https://example.com/image.jpg"
        alt="Test image"
      />
    );

    const image = screen.getByAltText('Test image');
    expect(image).toHaveAttribute('loading', 'lazy');
  });
});

