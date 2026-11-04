import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BrandLandingPage } from './BrandLandingPage';

afterEach(cleanup);

describe('brand inquiries', () => {
  it('opens tailored input modals for franchise, partnership, and store inquiries', async () => {
    render(
      <MemoryRouter>
        <BrandLandingPage />
      </MemoryRouter>
    );

    // 1. 가맹 상담 신청 모달
    await userEvent.click(screen.getAllByRole('button', { name: /가맹 및 창업 상담 신청/ })[0]);
    const franchiseDialog = screen.getByRole('dialog', { name: '가맹 상담 신청' });
    expect(franchiseDialog.querySelector('form')).not.toBeNull();
    expect(franchiseDialog.textContent).toContain('희망 창업 지역');
    await userEvent.click(screen.getByRole('button', { name: '문의 창 닫기' }));

    // 2. 제휴 및 협업 문의 모달
    await userEvent.click(screen.getAllByRole('button', { name: /제휴 및 협업 문의/ })[0]);
    const partnerDialog = screen.getByRole('dialog', { name: '제휴 및 협업 문의' });
    expect(partnerDialog.querySelector('form')).not.toBeNull();
    expect(partnerDialog.textContent).toContain('제안 제목');
    await userEvent.click(screen.getByRole('button', { name: '문의 창 닫기' }));

    // 3. 매장 이용 및 안심 문의 모달
    await userEvent.click(screen.getByRole('button', { name: /여성 안심 매장 편의 시설 문의/ }));
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
      render(
        <MemoryRouter>
          <BrandLandingPage />
        </MemoryRouter>
      );
      await userEvent.click(
        screen
          .getByRole('navigation', { name: '페이지 섹션 이동' })
          .querySelector('button[aria-label="매장 현황"]')!
      );
      expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    } finally {
      Element.prototype.scrollIntoView = original;
      vi.unstubAllGlobals();
    }
  });
});

describe('brand landing sections', () => {
  it('renders Hero Section with headline, subtitle, and dual CTA', () => {
    render(
      <MemoryRouter>
        <BrandLandingPage />
      </MemoryRouter>
    );

    expect(screen.getByText('OFFICIAL BRAND SITE · COMIC CAFE & ARCHIVE')).toBeTruthy();
    expect(screen.getByRole('heading', { name: /만화를 읽고, 머물며,/ })).toBeTruthy();
    expect(
      screen.getByText(/카툰플러스 만화 멀티플렉스 라운지와 135,000권 중고만화 아카이브/)
    ).toBeTruthy();

    const shopLink = screen.getByRole('link', { name: '중고만화 쇼핑몰 구경하기 →' });
    expect(shopLink.getAttribute('href')).toBe('https://bookis.store/cartoon');
    expect(shopLink.getAttribute('target')).toBe('_blank');

    expect(screen.getByRole('button', { name: '가맹 및 제휴 문의하기 ↓' })).toBeTruthy();
  });

  it('renders Used Comic Bookstore Zone with honest inspection and metrics', () => {
    render(
      <MemoryRouter>
        <BrandLandingPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /중고만화 쇼핑몰/ })).toBeTruthy();
    expect(screen.getByText(/인생만화, 여기서 다시 찾다/)).toBeTruthy();
    expect(screen.getByText('전권 누락 없는 정직한 실물 검수')).toBeTruthy();
    expect(screen.getByText('실시간 온라인·매장 재고 연동')).toBeTruthy();

    expect(
      screen.getByRole('link', { name: /중고만화 쇼핑몰 바로가기 \(bookis\.store\)/ })
    ).toBeTruthy();
  });

  it('renders Cafe Experience and Women-Safe Zone', () => {
    render(
      <MemoryRouter>
        <BrandLandingPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /하루가 달라지는 곳/ })).toBeTruthy();

    // 5 Core Experiences
    expect(screen.getByText('READ')).toBeTruthy();
    expect(screen.getByText('WATCH')).toBeTruthy();
    expect(screen.getByText('PLAY')).toBeTruthy();
    expect(screen.getByText('EAT')).toBeTruthy();
    expect(screen.getByText('RELAX')).toBeTruthy();

    // Women's Safe Zone
    expect(screen.getByText(/WOMEN'S SAFETY ZONE/)).toBeTruthy();
    expect(screen.getByText(/24h 밝은/)).toBeTruthy();
    expect(screen.getByText(/안심 귀가/)).toBeTruthy();
    expect(screen.getByText(/사각지대 없는/)).toBeTruthy();
    expect(screen.getByText(/쾌적한 전용/)).toBeTruthy();
  });

  it('renders Compact Store Locator with 3 store cards and search links', () => {
    render(
      <MemoryRouter>
        <BrandLandingPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /취향을 만나세요/ })).toBeTruthy();
    expect(screen.getByText('홍대점')).toBeTruthy();
    expect(screen.getByText('서울대입구역점')).toBeTruthy();
    expect(screen.getByText('잠실점')).toBeTruthy();
    expect(screen.getAllByRole('button', { name: /지점 도서 검색 바로가기/ }).length).toBe(3);
  });

  it('renders 3J Automation System, toggles 3J accordion, and displays Franchise Roadmap', async () => {
    render(
      <MemoryRouter>
        <BrandLandingPage />
      </MemoryRouter>
    );

    expect(screen.getByText('CARTOONPLUS 3J AUTOMATION')).toBeTruthy();
    expect(screen.getByText(/SELF/)).toBeTruthy();
    expect(screen.getByText(/AUTO TTS/)).toBeTruthy();
    expect(screen.getAllByText(/INVENTORY/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/1-PERSON/)).toBeTruthy();

    // Toggle 3J Accordion
    const toggleBtn = screen.getByRole('button', { name: /3J 자동화 시스템이란 무엇인가요\?/ });
    expect(screen.queryByText('고객에게 자유를')).toBeNull();
    await userEvent.click(toggleBtn);
    expect(screen.getByText('고객에게 자유를')).toBeTruthy();
    expect(screen.getByText('직원에게 자율을')).toBeTruthy();
    expect(screen.getByText('시스템은 자동으로')).toBeTruthy();

    expect(screen.getByText('카툰플러스 5단계 창업 성공 로드맵')).toBeTruthy();
  });

  it('renders Global Vision banner and trust numbers', () => {
    render(
      <MemoryRouter>
        <BrandLandingPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', {
        name: /대한민국을 넘어 세계로/,
      })
    ).toBeTruthy();
    expect(screen.getByText('98.4%')).toBeTruthy();
  });

  it('handles Integrated Inline Inquiry Form tab switching and submission', async () => {
    render(
      <MemoryRouter>
        <BrandLandingPage />
      </MemoryRouter>
    );

    // Initial tab: 가맹 및 창업 상담
    expect(screen.getByRole('tab', { name: '가맹 및 창업 상담' })).toBeTruthy();
    expect(screen.getByPlaceholderText('예: 서울 마포구 / 경기 성남시')).toBeTruthy();

    // Switch to Business Partnership tab
    await userEvent.click(screen.getByRole('tab', { name: '비즈니스 및 IP 제휴' }));
    expect(screen.getByPlaceholderText('(주)콘텐츠파트너스')).toBeTruthy();
    expect(screen.getByPlaceholderText('김담당 팀장')).toBeTruthy();

    // Fill and submit form
    await userEvent.type(screen.getByPlaceholderText('김담당 팀장'), '이협업 팀장');
    await userEvent.type(screen.getByPlaceholderText('(주)콘텐츠파트너스'), '네오웹툰즈');
    await userEvent.type(screen.getByPlaceholderText('010-0000-0000'), '010-1234-5678');
    await userEvent.type(screen.getByPlaceholderText('partner@company.com'), 'partner@test.com');
    await userEvent.type(
      screen.getByPlaceholderText('예: 신작 웹툰 단행본 특별 서가 및 팝업 프로모션 제안'),
      '신작 웹툰 특별전 제휴'
    );
    await userEvent.type(
      screen.getByPlaceholderText('제안 배경, 협업 방식, 희망 일정 등을 구체적으로 작성해 주세요.'),
      '제안 세부 내용입니다.'
    );

    // Check mandatory consent
    await userEvent.click(screen.getByRole('checkbox'));

    // Submit
    await userEvent.click(screen.getByRole('button', { name: '상담 신청하기' }));

    // Confirm submission state
    expect(screen.getByText('상담 신청이 정상 접수되었습니다')).toBeTruthy();
  });

  it('displays FAB button when scrolled past 300px', () => {
    render(
      <MemoryRouter>
        <BrandLandingPage />
      </MemoryRouter>
    );

    // Initial: scrollY is 0, FAB not in document
    expect(screen.queryByLabelText('중고만화 쇼핑몰 바로가기')).toBeNull();

    // Simulate scroll past 300px
    window.scrollY = 450;
    fireEvent.scroll(window);

    const fab = screen.getByLabelText('중고만화 쇼핑몰 바로가기');
    expect(fab).toBeTruthy();
    expect(fab.getAttribute('href')).toBe('https://bookis.store/cartoon');
    expect(fab.getAttribute('target')).toBe('_blank');
  });
});
