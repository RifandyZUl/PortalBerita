import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';

// Mock api utils - MUST be before component import
const mockApiGet = vi.fn();
const mockApiPut = vi.fn();

// Mock axios first to prevent real HTTP requests
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: (...args) => mockApiGet(...args),
      put: (...args) => mockApiPut(...args),
      interceptors: {
        request: {
          use: vi.fn(),
        },
        response: {
          use: vi.fn(),
        },
      },
    })),
  },
}));

vi.mock('../../utils/api', () => ({
  default: {
    get: (...args) => mockApiGet(...args),
    put: (...args) => mockApiPut(...args),
    interceptors: {
      request: {
        use: vi.fn(),
      },
      response: {
        use: vi.fn(),
      },
    },
  },
}));

// Import after mocks
import Settings from '../settings';
import { createMockAdmin, createMockAdminResponse } from '../../../test/factories';

vi.mock('@/components/settings/ProfileCard', () => ({
  default: ({ admin, onPhotoSelect }) => (
    <div data-testid="profile-card">
      <p>{admin?.firstName}</p>
      <button onClick={() => onPhotoSelect('test-photo.jpg')}>Select Photo</button>
    </div>
  ),
}));

vi.mock('@/components/settings/ProfileForm', () => ({
  default: ({ admin, onProfileUpdated }) => (
    <div data-testid="profile-form">
      <p>{admin?.email}</p>
      <button onClick={onProfileUpdated}>Update</button>
    </div>
  ),
}));

describe('Settings Page', () => {
  beforeEach(() => {
    mockApiGet.mockReset();
    mockApiPut.mockReset();
    localStorage.setItem('token', 'test-token');
  });

  afterEach(() => {
    cleanup();
  });

  describe('Loading States', () => {
    it('should display loading when data is being fetched', () => {
      mockApiGet.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<Settings />);
    
      expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
  });

  describe('Error Handling', () => {
    it('should display error message when fetch fails', async () => {
      mockApiGet.mockRejectedValue(new Error('Network error'));

    render(<Settings />);

    await waitFor(() => {
      expect(screen.getByText('Gagal memuat profil.')).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should handle network timeout gracefully', async () => {
      mockApiGet.mockImplementation(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 100)
        )
      );

      render(<Settings />);

      await waitFor(() => {
        expect(screen.getByText('Gagal memuat profil.')).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Data Display', () => {
    it('should display profile card and form after data is loaded', async () => {
      const mockAdmin = createMockAdmin({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        photo: 'https://example.com/photo.jpg',
      });

      // Override default mock for this test
      mockApiGet.mockResolvedValueOnce(createMockAdminResponse(mockAdmin));

      render(<Settings />);

      // Wait for profile card and form to be displayed
      await waitFor(() => {
        expect(screen.getByTestId('profile-card')).toBeInTheDocument();
        expect(screen.getByTestId('profile-form')).toBeInTheDocument();
        expect(screen.getByText('John')).toBeInTheDocument();
        expect(screen.getByText('john@example.com')).toBeInTheDocument();
      }, { timeout: 5000 });
    });

    it('should display title "Account Settings"', async () => {
      const mockAdmin = createMockAdmin({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
      });

      // Override default mock for this test
      mockApiGet.mockResolvedValueOnce(createMockAdminResponse(mockAdmin));

      render(<Settings />);

      // Wait for title to be displayed
      await waitFor(() => {
        expect(screen.getByText('Account Settings')).toBeInTheDocument();
        const errorMessage = screen.queryByText('Gagal memuat profil.');
        expect(errorMessage).not.toBeInTheDocument();
      }, { timeout: 5000 });
    });
  });
});
