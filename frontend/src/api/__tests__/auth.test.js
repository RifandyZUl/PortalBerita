import { describe, it, expect, beforeEach, vi } from 'vitest';
import axios from 'axios';
import { loginAdmin } from '../auth';

// Mock axios
vi.mock('axios');

describe('Auth API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loginAdmin', () => {
    it('✅ Harus memanggil API dengan email/username dan password', async () => {
      const mockResponse = {
        data: {
          data: {
            token: 'test-token-123',
          },
        },
      };

      axios.post.mockResolvedValue(mockResponse);

      const result = await loginAdmin('admin@test.com', 'password123');

      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:5000/api/auth/login',
        {
          emailOrUsername: 'admin@test.com',
          password: 'password123',
        }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('✅ Harus throw error jika response memiliki error message', async () => {
      const mockError = {
        response: {
          data: {
            message: 'Invalid credentials',
          },
        },
      };

      axios.post.mockRejectedValue(mockError);

      await expect(loginAdmin('admin@test.com', 'wrongpassword')).rejects.toThrow(
        'Invalid credentials'
      );
    });

    it('✅ Harus throw generic error jika tidak ada error message', async () => {
      const mockError = {
        response: {},
      };

      axios.post.mockRejectedValue(mockError);

      await expect(loginAdmin('admin@test.com', 'password123')).rejects.toThrow(
        'Login gagal. Silakan coba lagi.'
      );
    });

    it('✅ Harus throw error jika network error', async () => {
      const mockError = new Error('Network Error');

      axios.post.mockRejectedValue(mockError);

      await expect(loginAdmin('admin@test.com', 'password123')).rejects.toThrow(
        'Login gagal. Silakan coba lagi.'
      );
    });
  });
});

