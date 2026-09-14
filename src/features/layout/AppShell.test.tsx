import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CustomerShell, StaffShell } from './AppShell';

afterEach(cleanup);

describe('CustomerShell', () => {
  it('provides a search-first customer navigation with Store Introduction', () => {
    render(
      <CustomerShell currentPath="/">
        <h1>카툰플러스</h1>
      </CustomerShell>
    );

    expect(screen.getByRole('link', { name: '카툰플러스 홈' }).getAttribute('href')).toBe('/');
    expect(screen.getAllByRole('link', { name: '도서 검색' })[0].getAttribute('href')).toBe('/');
    expect(screen.getAllByRole('link', { name: '매장 소개' })[0].getAttribute('href')).toBe(
      '/about'
    );
    expect(screen.getAllByRole('link', { name: '즐길거리' })[0].getAttribute('href')).toBe(
      '/games'
    );
    expect(screen.getAllByRole('link', { name: '메뉴·요금' })[0].getAttribute('href')).toBe(
      '/menu'
    );
    expect(screen.getAllByRole('link', { name: '이벤트·공지' })[0].getAttribute('href')).toBe(
      '/events'
    );
    expect(screen.getAllByRole('link', { name: '매장 안내' })[0].getAttribute('href')).toBe(
      '/store'
    );
    expect(screen.queryByRole('link', { name: '직원 로그인' })).toBeNull();
  });

  it('hides account management from Staff navigation', () => {
    render(
      <StaffShell currentPath="/staff/dashboard" isAdmin={false}>
        <h1>운영</h1>
      </StaffShell>
    );
    expect(screen.queryByRole('link', { name: '계정 관리' })).toBeNull();
  });

  it('starts staff entry after a three-second pointer or keyboard hold', () => {
    vi.useFakeTimers();
    const onStaffEntry = vi.fn();
    render(
      <CustomerShell currentPath="/" onStaffEntry={onStaffEntry}>
        <h1>카툰플러스</h1>
      </CustomerShell>
    );
    const logo = screen.getByRole('link', { name: '카툰플러스 홈' });

    fireEvent.pointerDown(logo);
    vi.advanceTimersByTime(3000);
    expect(onStaffEntry).toHaveBeenCalledOnce();

    fireEvent.keyDown(logo, { key: 'Enter' });
    vi.advanceTimersByTime(3000);
    expect(onStaffEntry).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });
});
