import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Pagination } from './Pagination';

describe('Pagination Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('does not render when totalItems is 0 or less', () => {
    const { container } = render(
      <Pagination currentPage={1} totalItems={0} pageSize={10} onPageChange={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders page numbers correctly and handles page clicks', () => {
    const onPageChange = vi.fn();
    render(
      <Pagination currentPage={1} totalItems={50} pageSize={10} onPageChange={onPageChange} />
    );

    // 50개 / 10개 = 5페이지
    expect(screen.getByRole('button', { name: '1' })).toBeDefined();
    expect(screen.getByRole('button', { name: '5' })).toBeDefined();

    // 다음 페이지 클릭
    const nextBtn = screen.getByRole('button', { name: '다음 페이지' });
    fireEvent.click(nextBtn);
    expect(onPageChange).toHaveBeenCalledWith(2);

    // 3페이지 클릭
    const page3Btn = screen.getByRole('button', { name: '3' });
    fireEvent.click(page3Btn);
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('disables previous button on first page and next button on last page', () => {
    const { rerender } = render(
      <Pagination currentPage={1} totalItems={30} pageSize={10} onPageChange={() => {}} />
    );

    const prevBtn = screen.getByRole('button', { name: '이전 페이지' });
    expect(prevBtn).toHaveProperty('disabled', true);

    rerender(
      <Pagination currentPage={3} totalItems={30} pageSize={10} onPageChange={() => {}} />
    );

    const nextBtn = screen.getByRole('button', { name: '다음 페이지' });
    expect(nextBtn).toHaveProperty('disabled', true);
  });
});
