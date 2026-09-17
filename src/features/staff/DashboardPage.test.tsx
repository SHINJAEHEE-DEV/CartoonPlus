import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const selectedStoreId = vi.hoisted(() => ({ value: 'd6d4a587-f4c0-4ad1-94a6-4de4ccd1d32b' }));

const bookRequestsQuery = {
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  then: vi.fn((resolve: (val: unknown) => void) =>
    resolve({ count: 3, data: null, error: null })
  ),
};

const broadcastsQuery = {
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  is: vi.fn().mockReturnThis(),
  then: vi.fn((resolve: (val: unknown) => void) =>
    resolve({
      data: [{ schedule_type: 'daily', target_date: null, target_days: null }],
      error: null,
    })
  ),
};

const inventoryQuery = {
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  then: vi.fn((resolve: (val: unknown) => void) =>
    resolve({
      data: [
        { updated_at: '2026-09-17T10:00:00Z', books: { title: '귀멸의 칼날' } },
        { updated_at: '2026-09-17T09:00:00Z', books: [{ title: '주술회전' }] },
      ],
      error: null,
    })
  ),
};

const fromMock = vi.fn((table: string) => {
  if (table === 'book_requests') return bookRequestsQuery;
  if (table === 'scheduled_broadcasts') return broadcastsQuery;
  if (table === 'book_inventories') return inventoryQuery;
  return inventoryQuery;
});

vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: (table: string) => fromMock(table),
  },
}));

vi.mock('./StaffStoreContext', () => ({
  useStaffStore: () => ({ selectedStoreSlug: 'snu', setSelectedStoreSlug: vi.fn() }),
  useSelectedStaffStoreId: () => selectedStoreId.value,
}));

import { DashboardPage } from './DashboardPage';

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(cleanup);

  it('queries book_inventories without the dropped archived_at column and displays KPI metrics', async () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(fromMock).toHaveBeenCalledWith('book_inventories');
    });

    // Verify inventory query did not call .is('archived_at', null)
    expect(inventoryQuery.select).toHaveBeenCalledWith('updated_at,books(title)');
    expect(inventoryQuery.eq).toHaveBeenCalledWith('store_id', selectedStoreId.value);
    expect(inventoryQuery.order).toHaveBeenCalledWith('updated_at', { ascending: false });
    expect(inventoryQuery.limit).toHaveBeenCalledWith(4);

    // Verify KPI rendered correctly
    expect(await screen.findByText('3건')).toBeTruthy();
    expect(await screen.findByText('1건')).toBeTruthy();
    expect(await screen.findByText('2종')).toBeTruthy();
    expect(screen.queryByText('운영 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.')).toBeNull();
  });
});
