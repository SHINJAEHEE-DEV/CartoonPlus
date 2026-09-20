import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { BookSearchPage } from './BookSearchPage';

const books = [
  {
    id: 'chainsaw-man',
    title: '체인소 맨',
    author: '후지모토 타츠키',
    category: '액션/모험',
    volumeRange: '1~21권',
    shelfLocation: 'A-01 소년만화 서가',
  },
  {
    id: 'natsume',
    title: '나츠메 우인장',
    author: '미도리카와 유키',
    category: '로맨스/로판',
    volumeRange: '1~32권',
    shelfLocation: 'B-03 순정만화 서가',
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

  it('filters books by selected genre chips when no search query is present', () => {
    render(<BookSearchPage books={books} />);

    expect(screen.getByText('체인소 맨')).toBeTruthy();
    expect(screen.getByText('나츠메 우인장')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: '로맨스/로판' }));

    expect(screen.queryByText('체인소 맨')).toBeNull();
    expect(screen.getByText('나츠메 우인장')).toBeTruthy();
  });


  it('offers a book request modal with the entered title when there are no results', () => {
    render(<BookSearchPage books={books} />);

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '없는 책' } });

    const requestBtn = screen.getByRole('button', { name: '“없는 책” 입고 신청하기' });
    expect(requestBtn).toBeTruthy();

    fireEvent.click(requestBtn);

    // 모달이 열리고 제목 input에 '없는 책'이 채워져 있어야 함
    const titleInput = screen.getByLabelText(/도서명/) as HTMLInputElement;
    expect(titleInput).toBeTruthy();
    expect(titleInput.value).toBe('없는 책');
  });

  it('opens request modal when clicking the top CTA banner or floating action button', () => {
    render(<BookSearchPage books={books} />);

    const fabBtn = screen.getByRole('button', { name: '도서 입고 신청' });
    expect(fabBtn).toBeTruthy();
    fireEvent.click(fabBtn);

    expect(screen.getByRole('dialog', { name: '도서 입고 신청' })).toBeTruthy();
  });
});

