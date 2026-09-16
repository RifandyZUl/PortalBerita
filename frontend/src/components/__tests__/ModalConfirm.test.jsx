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

  describe('Visibility', () => {
    it('should not render when isOpen is false', () => {
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

    it('should render when isOpen is true', () => {
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
  });

  describe('User Interactions', () => {
    it('should call onConfirm when confirm button is clicked', async () => {
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

      const confirmButton = screen.getByRole('button', { name: /hapus/i });
      await user.click(confirmButton);

      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });

    it('should call onCancel when cancel button is clicked', async () => {
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

      const cancelButton = screen.getByRole('button', { name: /batal/i });
      await user.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });
  });
});
