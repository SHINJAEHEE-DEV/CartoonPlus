import { cleanup, render, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const selectedStoreId = vi.hoisted(() => ({ value: null as string | null }));
const query = vi.hoisted(() => ({
  from: vi.fn(),
  select: vi.fn(),
  eq: vi.fn(),
  order: vi.fn(),
}));

vi.mock('../../lib/supabase', () => ({ supabase: { from: query.from } }));
vi.mock('./StaffStoreContext', () => ({
  useSelectedStaffStoreId: () => selectedStoreId.value,
}));

import { BookRequestsPage } from './BookRequestsPage';

describe('BookRequestsPage', () => {
  beforeEach(() => {
    selectedStoreId.value = null;
    vi.clearAllMocks();
    query.from.mockReturnValue(query);
    query.select.mockReturnValue(query);
    query.eq.mockReturnValue(query);
    query.order.mockResolvedValue({ data: [], error: null });
  });

  afterEach(cleanup);

  it('waits for the store UUID instead of querying with an empty UUID', () => {
    render(<BookRequestsPage />);

    expect(query.from).not.toHaveBeenCalled();
  });

  it('uses the deployed customer_comment and staff_note columns after the store UUID is available', async () => {
    selectedStoreId.value = 'd6d4a587-f4c0-4ad1-94a6-4de4ccd1d32b';

    render(<BookRequestsPage />);

    await waitFor(() => expect(query.order).toHaveBeenCalled());
    expect(query.select).toHaveBeenCalledWith(
      'id,title,author,desired_volume,customer_comment,status,staff_note,created_at'
    );
    expect(query.eq).toHaveBeenCalledWith('store_id', selectedStoreId.value);
  });

  it('renders "입고 취소" label and displays staff cancel note', async () => {
    selectedStoreId.value = 'd6d4a587-f4c0-4ad1-94a6-4de4ccd1d32b';
    query.order.mockResolvedValue({
      data: [
        {
          id: 'req-1',
          title: '절판된 만화책',
          author: '테스트 작가',
          desired_volume: '전권',
          customer_comment: '꼭 구해주세요',
          status: 'unavailable',
          staff_note: '출판사 절판 도서',
          created_at: '2026-09-18T10:00:00Z',
        },
      ],
      error: null,
    });

    const { getByText, getAllByText } = render(<BookRequestsPage />);

    await waitFor(() => {
      expect(getByText('절판된 만화책')).toBeTruthy();
    });

    expect(getAllByText('입고 취소').length).toBeGreaterThan(0);
    expect(getByText('🚫 취소 사유: 출판사 절판 도서')).toBeTruthy();
  });
});
