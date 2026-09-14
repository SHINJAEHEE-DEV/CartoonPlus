import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import App from './App';

afterEach(cleanup);

describe('customer routes', () => {
  it('opens Book Search at the root route', () => {
    window.history.pushState({}, '', '/');

    render(<App />);

    expect(screen.getByRole('heading', { name: '도서 검색' })).toBeTruthy();
    expect(screen.getByRole('searchbox')).toBeTruthy();
  });

  it('keeps the former Home content at Store Introduction', () => {
    window.history.pushState({}, '', '/about');

    render(<App />);

    expect(screen.getByRole('heading', { name: '만화, 게임, 그리고 제대로 쉬는 시간' })).toBeTruthy();
  });

  it.each(['/books', '/search'])('keeps %s available for Book Search', async (path) => {
    window.history.pushState({}, '', path);

    render(<App />);

    await waitFor(() => expect(screen.getByRole('searchbox')).toBeTruthy());
  });

  it.each([
    ['/stores/snu', '서울대입구역점'],
    ['/stores/jamsil', '잠실점'],
    ['/stores/hongdae', '홍대점'],
  ])('opens %s in the selected Store context', async (path, storeName) => {
    window.history.pushState({}, '', path);

    render(<App />);

    await waitFor(() => expect(screen.getByRole('searchbox')).toBeTruthy());
    expect(screen.getAllByText(storeName).length).toBeGreaterThan(0);
  });

  it('does not substitute another Store for an unknown Store URL', () => {
    window.history.pushState({}, '', '/stores/unknown');

    render(<App />);

    expect(screen.getByText('페이지를 찾을 수 없습니다.')).toBeTruthy();
    expect(screen.queryByRole('searchbox')).toBeNull();
  });

  it('keeps unverified Store contact details out of a selected Store page', async () => {
    window.history.pushState({}, '', '/stores/jamsil');

    render(<App />);

    await waitFor(() => expect(screen.getByRole('searchbox')).toBeTruthy());
    expect(screen.getByRole('combobox', { name: '지점 변경' })).toBeTruthy();
    expect(screen.queryByText('02-888-0852')).toBeNull();
    expect(screen.getByText('매장 안내 점검 중')).toBeTruthy();
  });
});
