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
});
