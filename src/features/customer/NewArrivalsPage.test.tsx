import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const catalogue = vi.hoisted(() => ({
  loadNewArrivals: vi.fn(),
  subscribeToPublicCatalogueUpdates: vi.fn(),
}));

vi.mock('../book-search/catalogueRepository', () => catalogue);

import { NewArrivalsPage } from './NewArrivalsPage';
import { StoreContext, defaultPublicStore } from '../../lib/storeContext';

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('NewArrivalsPage', () => {
  it('reloads only the current store new-arrivals list when inventory changes', async () => {
    const firstBook = {
      id: 'before',
      title: '기존 신규 도서',
      author: '작가',
      category: '만화',
      volumeRange: '1권',
      shelfLocation: 'A-1',
    };
    const updatedBook = {
      ...firstBook,
      id: 'after',
      title: '새로 등록한 신규 도서',
    };
    let onUpdate: (() => void) | undefined;
    catalogue.loadNewArrivals
      .mockResolvedValueOnce([firstBook])
      .mockResolvedValueOnce([updatedBook]);
    catalogue.subscribeToPublicCatalogueUpdates.mockImplementation((callback: () => void) => {
      onUpdate = callback;
      return vi.fn();
    });

    render(
      <StoreContext value={{ store: defaultPublicStore, scoped: false }}>
        <NewArrivalsPage />
      </StoreContext>
    );

    await screen.findByText('기존 신규 도서');
    onUpdate?.();

    await screen.findByText('새로 등록한 신규 도서');
    expect(catalogue.loadNewArrivals).toHaveBeenLastCalledWith('snu');
  });
});
