/**
 * Test Setup File
 * 
 * File ini dijalankan sebelum setiap test.
 * Digunakan untuk setup global test configuration.
 */

import '@testing-library/jest-dom';
import { vi, beforeAll, afterAll } from 'vitest';

// Suppress console.error untuk expected errors di error handling tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    // Suppress error messages yang expected dari error handling tests
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Gagal mengambil') ||
       args[0].includes('Error saat mengambil') ||
       args[0].includes('Terjadi kesalahan'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Mock window.matchMedia (untuk components yang menggunakan media queries)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver (untuk components yang menggunakan intersection observer)
// eslint-disable-next-line no-undef
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};

