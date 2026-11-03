import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BrandLandingPage } from './BrandLandingPage';

afterEach(cleanup);

describe('brand inquiries', () => {
  it('opens tailored input modals for franchise, partnership, and store inquiries', async () => {
    render(<MemoryRouter><BrandLandingPage /></MemoryRouter>);

    // 1. 가맹 상담 신청 모달
    await userEvent.click(screen.getAllByRole('button', { name: /가맹 및 창업 상담 신청/ })[0]);
    const franchiseDialog = screen.getByRole('dialog', { name: '가맹 상담 신청' });
    expect(franchiseDialog.querySelector('form')).not.toBeNull();
    expect(franchiseDialog.textContent).toContain('희망 창업 지역');
    await userEvent.click(screen.getByRole('button', { name: '문의 창 닫기' }));

    // 2. 제휴 및 협업 문의 모달
    await userEvent.click(screen.getByRole('button', { name: /제휴 및 협업 문의/ }));
    const partnerDialog = screen.getByRole('dialog', { name: '제휴 및 협업 문의' });
    expect(partnerDialog.querySelector('form')).not.toBeNull();
    expect(partnerDialog.textContent).toContain('제안 제목');
    await userEvent.click(screen.getByRole('button', { name: '문의 창 닫기' }));

    // 3. 매장 이용 및 안심 문의 모달
    await userEvent.click(screen.getByRole('button', { name: /매장에 문의하기/ }));
    const storeDialog = screen.getByRole('dialog', { name: '매장 이용 및 안심 문의' });
    expect(storeDialog.querySelector('form')).not.toBeNull();
    expect(storeDialog.textContent).toContain('방문 지점 선택');
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
