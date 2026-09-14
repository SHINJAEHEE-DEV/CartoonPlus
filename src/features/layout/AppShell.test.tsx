import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { CustomerShell, StaffShell } from './AppShell';

afterEach(cleanup);

describe('CustomerShell', () => {
  it('provides a search-first customer navigation with Store Introduction', () => {
    render(<CustomerShell currentPath="/"><h1>카툰플러스</h1></CustomerShell>);

    expect(screen.getByRole('link', { name: '카툰플러스 홈' }).getAttribute('href')).toBe('/');
    expect(screen.getAllByRole('link', { name: '도서 검색' })[0].getAttribute('href')).toBe('/');
    expect(screen.getAllByRole('link', { name: '매장 소개' })[0].getAttribute('href')).toBe('/about');
    expect(screen.getAllByRole('link', { name: '즐길거리' })[0].getAttribute('href')).toBe('/games');
    expect(screen.getAllByRole('link', { name: '메뉴·요금' })[0].getAttribute('href')).toBe('/menu');
    expect(screen.getAllByRole('link', { name: '이벤트·공지' })[0].getAttribute('href')).toBe('/events');
    expect(screen.getAllByRole('link', { name: '매장 안내' })[0].getAttribute('href')).toBe('/store');
  });

  it('hides account management from Staff navigation', () => {
    render(<StaffShell currentPath="/staff/dashboard" isAdmin={false}><h1>운영</h1></StaffShell>);
    expect(screen.queryByRole('link', { name: '계정 관리' })).toBeNull();
  });
});
