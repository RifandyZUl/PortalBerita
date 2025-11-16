import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import Settings from '../settings';

// Mock dependencies
global.fetch = vi.fn();
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
    vi.clearAllMocks();
    localStorage.setItem('token', 'test-token');
  });

  afterEach(() => {
    cleanup();
  });

  it('✅ Harus menampilkan loading saat data sedang dimuat', () => {
    global.fetch.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<Settings />);
    
    // Gunakan getAllByText karena mungkin ada beberapa "Loading..." dari test lain
    const loadingElements = screen.getAllByText('Loading...');
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it('✅ Harus menampilkan error jika fetch gagal', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Unauthorized' }),
    });

    render(<Settings />);

    await waitFor(() => {
      expect(screen.getByText('Gagal memuat profil.')).toBeInTheDocument();
    });
  });

  it('✅ Harus menampilkan profile card dan form setelah data dimuat', async () => {
    const mockAdmin = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      photo: 'https://example.com/photo.jpg',
    };

    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ admin: mockAdmin }),
    });

    render(<Settings />);

    await waitFor(() => {
      expect(screen.getByTestId('profile-card')).toBeInTheDocument();
      expect(screen.getByTestId('profile-form')).toBeInTheDocument();
      expect(screen.getByText('John')).toBeInTheDocument();
      // Gunakan getAllByText karena mungkin ada beberapa email dari test lain
      const emails = screen.getAllByText('john@example.com');
      expect(emails.length).toBeGreaterThan(0);
    });
  });

  it('✅ Harus menampilkan title "Account Settings"', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ admin: {} }),
    });

    render(<Settings />);

    await waitFor(() => {
      expect(screen.getByText('Account Settings')).toBeInTheDocument();
    });
  });
});

