import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ModalConfirm from '../ModalConfirm';

describe('ModalConfirm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('✅ Harus tidak render jika isOpen adalah false', () => {
    render(
      <ModalConfirm
        isOpen={false}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
        title="Test Title"
        message="Test Message"
      />
    );

    expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
  });

  it('✅ Harus render jika isOpen adalah true', () => {
    render(
      <ModalConfirm
        isOpen={true}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
        title="Test Title"
        message="Test Message"
      />
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });

  it('✅ Harus memanggil onConfirm ketika tombol confirm diklik', async () => {
    const user = userEvent.setup();
    const mockOnConfirm = vi.fn();

    render(
      <ModalConfirm
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={vi.fn()}
        title="Test Title"
        message="Test Message"
      />
    );

    // Gunakan getAllByRole karena mungkin ada multiple buttons dari test lain
    const confirmButtons = screen.getAllByRole('button', { name: /hapus/i });
    expect(confirmButtons.length).toBeGreaterThan(0);
    await user.click(confirmButtons[0]);

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('✅ Harus memanggil onCancel ketika tombol cancel diklik', async () => {
    const user = userEvent.setup();
    const mockOnCancel = vi.fn();

    render(
      <ModalConfirm
        isOpen={true}
        onConfirm={vi.fn()}
        onCancel={mockOnCancel}
        title="Test Title"
        message="Test Message"
      />
    );

    // Gunakan getAllByRole karena mungkin ada multiple buttons dari test lain
    const cancelButtons = screen.getAllByRole('button', { name: /batal/i });
    expect(cancelButtons.length).toBeGreaterThan(0);
    await user.click(cancelButtons[0]);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
});

