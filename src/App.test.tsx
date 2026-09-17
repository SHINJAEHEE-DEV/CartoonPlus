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

    expect(
      screen.getByRole('heading', { name: '만화, 게임, 그리고 제대로 쉬는 시간' })
    ).toBeTruthy();
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

  it('shows verified Store contact details on a selected Store page', async () => {
    window.history.pushState({}, '', '/stores/jamsil');

    render(<App />);

    await waitFor(() => expect(screen.getByRole('searchbox')).toBeTruthy());
    expect(screen.getAllByText('잠실점').length).toBeGreaterThan(0);
    expect(screen.queryByText('02-888-0852')).toBeNull();
    expect(screen.getByText('02-423-9588')).toBeTruthy();
    expect(screen.getByText('서울특별시 송파구 백제고분로9길 23, 2층 (잠실동)')).toBeTruthy();
  });

  it.each([
    ['/stores/jamsil/about', '만화, 게임, 그리고'],
    ['/stores/hongdae/about', '만화, 게임, 그리고'],
    ['/stores/jamsil/store', '잠실점 안내'],
    ['/stores/hongdae/store', '홍대점 안내'],
  ])('activates scoped route %s with store content', async (path, expectedContent) => {
    window.history.pushState({}, '', path);

    render(<App />);

    await waitFor(() => expect(screen.getByText(new RegExp(expectedContent))).toBeTruthy());
  });

  it.each([
    ['/book-request', '도서 입고 신청'],
    ['/stores/jamsil/book-request', '도서 입고 신청'],
  ])('renders standalone book request form at %s', async (path, expectedHeading) => {
    window.history.pushState({}, '', path);

    render(<App />);

    await waitFor(() => expect(screen.getByText(expectedHeading)).toBeTruthy());
    expect(screen.getByLabelText(/도서명/)).toBeTruthy();
  });
});

