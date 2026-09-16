import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const selectedStoreId = vi.hoisted(() => ({ value: 'd6d4a587-f4c0-4ad1-94a6-4de4ccd1d32b' }));
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

import { InventoryPage } from './InventoryPage';

describe('InventoryPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    query.from.mockReturnValue(query);
    query.select.mockReturnValue(query);
    query.eq.mockReturnValue(query);
    query.order.mockResolvedValue({
      data: [
        {
          id: 'inventory-1',
          volume_range: '1~12권',
          shelf_location: '책장 5번',
          archived_at: null,
          books: { title: '원피스', author: '오다 에이이치로', category: '소년' },
        },
      ],
      error: null,
    });
  });

  afterEach(cleanup);

  it('renders a book returned as a single many-to-one relation object', async () => {
    render(
      <MemoryRouter>
        <InventoryPage />
      </MemoryRouter>
    );

    expect(await screen.findByText('원피스')).toBeTruthy();
    expect(screen.queryByText('제목 없음')).toBeNull();
  });
});
