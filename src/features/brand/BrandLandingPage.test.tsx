import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { BrandLandingPage } from './BrandLandingPage';

describe('brand inquiries', () => {
  it('explains that inquiries cannot be submitted through the site', async () => {
    render(<MemoryRouter><BrandLandingPage /></MemoryRouter>);
    await userEvent.click(screen.getByRole('button', { name: '가맹 및 창업 상담 신청' }));
    const dialog = screen.getByRole('dialog', { name: '가맹 상담 안내' });
    expect(dialog.textContent).toContain('홈페이지에서는 문의를 접수할 수 없습니다');
    expect(dialog.querySelector('form')).toBeNull();
    expect(screen.getByRole('link', { name: /공식 인스타그램 방문/ }).getAttribute('href')).toBe('https://www.instagram.com/cartoonplus_cafe/');
  });
});
