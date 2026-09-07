import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { BookSearchPage } from './BookSearchPage';

const books = [
  {
    id: 'chainsaw-man',
    title: '체인소 맨',
    author: '후지모토 타츠키',
    category: '소년',
    volumeRange: '1~21권',
    shelfLocation: 'A-01 소년만화 서가',
  },
];

afterEach(cleanup);

describe('BookSearchPage', () => {
  it('shows inventory details for a matching customer search', () => {
    render(<BookSearchPage books={books} />);

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'ㅊㅇㅅㅁ' } });

    expect(screen.getByText('체인소 맨')).toBeTruthy();
    expect(screen.getByText('1~21권')).toBeTruthy();
    expect(screen.getByText('A-01 소년만화 서가')).toBeTruthy();
  });

  it('offers a book request with the entered title when there are no results', () => {
    render(<BookSearchPage books={books} />);

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '없는 책' } });

    expect(screen.getByRole('link', { name: '없는 책 입고 신청하기' }).getAttribute('href')).toBe(
      '/book-request?title=%EC%97%86%EB%8A%94%20%EC%B1%85',
    );
  });
});
