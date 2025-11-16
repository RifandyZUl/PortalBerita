import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import PageWrapper from '../PageWrapper';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className }) => <div className={className}>{children}</div>,
  },
}));

describe('PageWrapper', () => {
  it('✅ Harus render children dengan benar', () => {
    render(
      <PageWrapper>
        <div>Test Content</div>
      </PageWrapper>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('✅ Harus memiliki className yang benar', () => {
    const { container } = render(
      <PageWrapper>
        <div>Test</div>
      </PageWrapper>
    );

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('h-full');
  });
});

