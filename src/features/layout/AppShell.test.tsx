import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { CustomerShell, StaffShell } from './AppShell';

afterEach(cleanup);

describe('CustomerShell', () => {
  it('provides the six customer destinations without adding a search field to Home', () => {
    render(<CustomerShell currentPath="/"><h1>카툰플러스</h1></CustomerShell>);

    expect(screen.getByRole('link', { name: '홈' }).getAttribute('href')).toBe('/');
    expect(screen.getByRole('link', { name: '도서 검색' }).getAttribute('href')).toBe('/books');
    expect(screen.getByRole('link', { name: '즐길거리' }).getAttribute('href')).toBe('/games');
    expect(screen.getByRole('link', { name: '메뉴·요금' }).getAttribute('href')).toBe('/menu');
    expect(screen.getByRole('link', { name: '이벤트·공지' }).getAttribute('href')).toBe('/events');
    expect(screen.getByRole('link', { name: '매장 안내' }).getAttribute('href')).toBe('/store');
    expect(screen.queryByRole('searchbox')).toBeNull();
  });

  it('hides account management from Staff navigation', () => {
    render(<StaffShell currentPath="/staff/dashboard" isAdmin={false}><h1>운영</h1></StaffShell>);
    expect(screen.queryByRole('link', { name: '계정 관리' })).toBeNull();
  });
});
