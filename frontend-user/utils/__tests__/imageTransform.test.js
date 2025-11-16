/**
 * ============================================
 * TEST FILE: imageTransform.test.js
 * ============================================
 * 
 * DESKRIPSI:
 * File ini menguji fungsi getResizedImage di utils/imageTransform.js
 * 
 * YANG DITEST:
 * - Transform URL Cloudinary dengan width dan height
 * - Handle empty/null URL
 * - Default width dan height
 */

import { describe, it, expect } from 'vitest';
import { getResizedImage } from '../imageTransform.js';

describe('getResizedImage', () => {
  /**
   * TEST 1: Transform URL dengan custom width dan height
   * 
   * SKENARIO:
   * - URL Cloudinary di-transform dengan width 300 dan height 200
   * 
   * YANG DITEST:
   * - Fungsi harus insert parameter Cloudinary (c_fill, h_200, w_300)
   * - URL harus tetap valid setelah transform
   * 
   * EXPECTED RESULT:
   * - URL mengandung /upload/c_fill,h_200,w_300/
   */
  it('✅ TEST 1: Harus transform URL dengan custom width dan height (300x200 → c_fill,h_200,w_300)', () => {
    const originalUrl = 'https://res.cloudinary.com/example/image/upload/v123/image.jpg';
    const result = getResizedImage(originalUrl, 300, 200);

    expect(result).toContain('c_fill');
    expect(result).toContain('h_200');
    expect(result).toContain('w_300');
    expect(result).toContain('/upload/c_fill,h_200,w_300/');
  });

  /**
   * TEST 2: Transform URL dengan default width dan height
   * 
   * SKENARIO:
   * - URL di-transform tanpa parameter width/height (menggunakan default)
   * 
   * YANG DITEST:
   * - Fungsi harus menggunakan default values (640x360)
   * - URL harus mengandung parameter default
   * 
   * EXPECTED RESULT:
   * - URL mengandung /upload/c_fill,h_360,w_640/ (default)
   */
  it('✅ TEST 2: Harus menggunakan default width 640 dan height 360 jika tidak dikirim (default: 640x360)', () => {
    const originalUrl = 'https://res.cloudinary.com/example/image/upload/v123/image.jpg';
    const result = getResizedImage(originalUrl);

    expect(result).toContain('h_360');
    expect(result).toContain('w_640');
  });

  /**
   * TEST 3: Handle empty URL
   * 
   * SKENARIO:
   * - URL kosong, null, atau undefined
   * 
   * YANG DITEST:
   * - Fungsi harus handle edge case dengan aman
   * - Harus mengembalikan string kosong, tidak error
   * 
   * EXPECTED RESULT:
   * - Return value: "" (empty string)
   */
  it('✅ TEST 3: Harus mengembalikan string kosong jika URL kosong (null/undefined/empty)', () => {
    const result1 = getResizedImage('');
    const result2 = getResizedImage(null);
    const result3 = getResizedImage(undefined);

    expect(result1).toBe('');
    expect(result2).toBe('');
    expect(result3).toBe('');
  });

  /**
   * TEST 4: Transform URL yang sudah ada parameter
   * 
   * SKENARIO:
   * - URL Cloudinary yang sudah ada parameter sebelumnya
   * 
   * YANG DITEST:
   * - Fungsi harus replace /upload/ dengan parameter baru
   * - Parameter lama harus diganti dengan yang baru
   * 
   * EXPECTED RESULT:
   * - URL: .../upload/c_fill,h_600,w_800/v123/image.jpg
   */
  it('✅ TEST 4: Harus replace /upload/ dengan parameter baru (800x600 → c_fill,h_600,w_800)', () => {
    const originalUrl = 'https://res.cloudinary.com/example/image/upload/v123/image.jpg';
    const result = getResizedImage(originalUrl, 800, 600);

    // Harus replace /upload/ dengan /upload/c_fill,h_600,w_800/
    expect(result).toBe('https://res.cloudinary.com/example/image/upload/c_fill,h_600,w_800/v123/image.jpg');
  });
});

