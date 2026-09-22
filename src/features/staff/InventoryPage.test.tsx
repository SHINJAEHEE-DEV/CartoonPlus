import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const selectedStoreId = vi.hoisted(() => ({ value: 'd6d4a587-f4c0-4ad1-94a6-4de4ccd1d32b' }));
const query = vi.hoisted(() => ({
  from: vi.fn(),
  select: vi.fn(),
  eq: vi.fn(),
  order: vi.fn(),
  range: vi.fn(),
  rpc: vi.fn(),
}));

vi.mock('../../lib/supabase', () => ({ supabase: { from: query.from, rpc: query.rpc } }));
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
    query.order.mockReturnValue(query);
    query.range.mockResolvedValue({
      data: [
        {
          id: 'inventory-1',
          last_volume: 12,
          volume_range: '1~12권',
          shelf_location: '책장 5번',
          archived_at: null,
          books: { title: '원피스', author: '오다 에이이치로', category: '소년' },
        },
      ],
      error: null,
    });
    query.rpc.mockResolvedValue({ error: null });
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

  it('populates the form when clicking the edit button', async () => {
    render(
      <MemoryRouter>
        <InventoryPage />
      </MemoryRouter>
    );

    const editButton = await screen.findByRole('button', { name: '수정' });
    editButton.click();

    expect(await screen.findByText(/도서 정보를 수정 중입니다/)).toBeTruthy();
    const titleInput = screen.getByPlaceholderText('도서명 *') as HTMLInputElement;
    const authorInput = screen.getByPlaceholderText('작가명') as HTMLInputElement;
    const volumeInput = screen.getByPlaceholderText('마지막 권수 (예: 22)') as HTMLInputElement;
    const shelfInput = screen.getByPlaceholderText(
      '서가 (예: A-03 또는 책장 1번) *'
    ) as HTMLInputElement;

    expect(titleInput.value).toBe('원피스');
    expect(authorInput.value).toBe('오다 에이이치로');
    expect(volumeInput.value).toBe('12');
    expect(shelfInput.value).toBe('책장 5번');
  });

  it('keeps the selected inventory when correcting its title', async () => {
    render(
      <MemoryRouter>
        <InventoryPage />
      </MemoryRouter>
    );

    fireEvent.click(await screen.findByRole('button', { name: '수정' }));
    fireEvent.change(screen.getByPlaceholderText('도서명 *'), {
      target: { value: '원피스 완전판' },
    });
    fireEvent.click(screen.getByRole('button', { name: '수정 완료 (저장)' }));

    await waitFor(() =>
      expect(query.rpc).toHaveBeenCalledWith('update_inventory_for_store', {
        p_inventory_id: 'inventory-1',
        p_title: '원피스 완전판',
        p_author: '오다 에이이치로',
        p_category: '소년',
        p_last_volume: 12,
        p_shelf_location: '책장 5번',
        p_merge_duplicate: false,
      })
    );
    expect(query.rpc).not.toHaveBeenCalledWith('upsert_inventory_for_store', expect.anything());
  });

  it('updates the selected inventory by ID even when the corrected title already exists', async () => {
    render(
      <MemoryRouter>
        <InventoryPage />
      </MemoryRouter>
    );

    fireEvent.click(await screen.findByRole('button', { name: '수정' }));
    fireEvent.change(screen.getByPlaceholderText('도서명 *'), {
      target: { value: '이미 등록된 도서' },
    });
    fireEvent.click(screen.getByRole('button', { name: '수정 완료 (저장)' }));

    await waitFor(() =>
      expect(query.rpc).toHaveBeenCalledWith('update_inventory_for_store', {
        p_inventory_id: 'inventory-1',
        p_title: '이미 등록된 도서',
        p_author: '오다 에이이치로',
        p_category: '소년',
        p_last_volume: 12,
        p_shelf_location: '책장 5번',
        p_merge_duplicate: false,
      })
    );
  });

  it('keeps new book registration on the inventory upsert path', async () => {
    render(
      <MemoryRouter>
        <InventoryPage />
      </MemoryRouter>
    );

    await screen.findByText('원피스');
    fireEvent.change(screen.getByPlaceholderText('도서명 *'), { target: { value: '신규 도서' } });
    fireEvent.change(screen.getByPlaceholderText('작가명'), { target: { value: '신규 작가' } });
    fireEvent.change(screen.getByPlaceholderText('마지막 권수 (예: 22)'), {
      target: { value: '3' },
    });
    fireEvent.change(screen.getByPlaceholderText('서가 (예: A-03 또는 책장 1번) *'), {
      target: { value: 'B-2' },
    });
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    await waitFor(() =>
      expect(query.rpc).toHaveBeenCalledWith('upsert_inventory_for_store', {
        p_store_id: selectedStoreId.value,
        p_title: '신규 도서',
        p_author: '신규 작가',
        p_category: '',
        p_last_volume: 3,
        p_shelf_location: 'B-2',
      })
    );
  });
});
