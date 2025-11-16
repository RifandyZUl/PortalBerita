import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('✅ Harus render spinner dengan benar', () => {
    const { container } = render(<LoadingSpinner />);
    
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('border-blue-500');
  });

  it('✅ Harus memiliki struktur HTML yang benar', () => {
    const { container } = render(<LoadingSpinner />);
    
    const wrapper = container.querySelector('.flex.justify-center.items-center');
    expect(wrapper).toBeInTheDocument();
    
    const spinner = container.querySelector('.rounded-full');
    expect(spinner).toBeInTheDocument();
  });
});

