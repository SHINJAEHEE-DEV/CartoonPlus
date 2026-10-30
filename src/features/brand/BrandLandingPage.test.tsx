import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BrandLandingPage } from './BrandLandingPage';

afterEach(cleanup);

describe('brand inquiries', () => {
  it('explains that inquiries cannot be submitted through the site', async () => {
    render(<MemoryRouter><BrandLandingPage /></MemoryRouter>);
    await userEvent.click(screen.getByRole('button', { name: '가맹 및 창업 상담 신청' }));
    const dialog = screen.getByRole('dialog', { name: '가맹 상담 신청' });
    expect(dialog.textContent).toContain('홈페이지 문의 접수를 준비 중입니다');
    expect(dialog.querySelector('form')).toBeNull();
    expect(screen.getByRole('link', { name: /공식 인스타그램/ }).getAttribute('href')).toBe('https://www.instagram.com/cartoonplus_cafe/');
  });
});

describe('section navigation', () => {
  it('moves to the selected section', async () => {
    const scrollIntoView = vi.fn();
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    const original = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = scrollIntoView;
    try {
      render(<MemoryRouter><BrandLandingPage /></MemoryRouter>);
      await userEvent.click(screen.getByRole('navigation', { name: '페이지 섹션 이동' }).querySelector('button[aria-label="매장 현황"]')!);
      expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    } finally {
      Element.prototype.scrollIntoView = original;
      vi.unstubAllGlobals();
    }
  });
});
