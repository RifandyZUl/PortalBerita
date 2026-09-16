import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setToken, getToken, removeToken } from '../token';

describe('Token Utils', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('setToken', () => {
    it('should save token to localStorage', () => {
      const token = 'test-token-123';
      setToken(token);
      
      expect(localStorage.setItem).toHaveBeenCalledWith('token', token);
      expect(localStorage.getItem('token')).toBe(token);
    });

    it('should replace existing token', () => {
      setToken('old-token');
      setToken('new-token');
      
      expect(localStorage.getItem('token')).toBe('new-token');
    });
  });

  describe('getToken', () => {
    it('should return token from localStorage', () => {
      localStorage.setItem('token', 'test-token');
      
      const token = getToken();
      
      expect(localStorage.getItem).toHaveBeenCalledWith('token');
      expect(token).toBe('test-token');
    });

    it('should return null when token does not exist', () => {
      const token = getToken();
      
      expect(token).toBeNull();
    });
  });

  describe('removeToken', () => {
    it('should remove token from localStorage', () => {
      localStorage.setItem('token', 'test-token');
      
      removeToken();
      
      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
      expect(localStorage.getItem('token')).toBeNull();
    });

    it('should be safe to call even when token does not exist', () => {
      expect(() => removeToken()).not.toThrow();
      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    });
  });
});
