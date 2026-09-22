import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const catalogue = vi.hoisted(() => ({
  loadPublicCatalogue: vi.fn(),
  subscribeToPublicCatalogueUpdates: vi.fn(),
}));

vi.mock('./features/book-search/catalogueRepository', () => catalogue);

import { BooksRoute } from './App';
import { StoreContext, defaultPublicStore } from './lib/storeContext';

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('BooksRoute', () => {
  it('reloads the current store catalogue when an inventory update arrives', async () => {
    const firstBook = {
      id: 'before',
      title: '기존 도서',
      author: '작가',
      category: '만화',
      volumeRange: '1권',
      shelfLocation: 'A-1',
    };
    const updatedBook = {
      ...firstBook,
      id: 'after',
      title: '새로 등록한 도서',
    };
    let onUpdate: (() => void) | undefined;
    catalogue.loadPublicCatalogue
      .mockResolvedValueOnce([firstBook])
      .mockResolvedValueOnce([updatedBook]);
    catalogue.subscribeToPublicCatalogueUpdates.mockImplementation((callback: () => void) => {
      onUpdate = callback;
      return vi.fn();
    });

    render(
      <StoreContext value={{ store: defaultPublicStore, scoped: false }}>
        <BooksRoute />
      </StoreContext>
    );

    await screen.findByText('기존 도서');
    onUpdate?.();

    await screen.findByText('새로 등록한 도서');
    expect(catalogue.loadPublicCatalogue).toHaveBeenLastCalledWith('snu');
  });
});
