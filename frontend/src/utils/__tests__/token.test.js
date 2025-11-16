import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setToken, getToken, removeToken } from '../token';

describe('Token Utils', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('setToken', () => {
    it('✅ Harus menyimpan token ke localStorage', () => {
      const token = 'test-token-123';
      setToken(token);
      
      expect(localStorage.setItem).toHaveBeenCalledWith('token', token);
      expect(localStorage.getItem('token')).toBe(token);
    });

    it('✅ Harus mengganti token yang sudah ada', () => {
      setToken('old-token');
      setToken('new-token');
      
      expect(localStorage.getItem('token')).toBe('new-token');
    });
  });

  describe('getToken', () => {
    it('✅ Harus mengembalikan token dari localStorage', () => {
      localStorage.setItem('token', 'test-token');
      
      const token = getToken();
      
      expect(localStorage.getItem).toHaveBeenCalledWith('token');
      expect(token).toBe('test-token');
    });

    it('✅ Harus mengembalikan null jika token tidak ada', () => {
      const token = getToken();
      
      expect(token).toBeNull();
    });
  });

  describe('removeToken', () => {
    it('✅ Harus menghapus token dari localStorage', () => {
      localStorage.setItem('token', 'test-token');
      
      removeToken();
      
      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
      expect(localStorage.getItem('token')).toBeNull();
    });

    it('✅ Harus aman dipanggil meskipun token tidak ada', () => {
      expect(() => removeToken()).not.toThrow();
      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    });
  });
});

