import { describe, expect, it, vi } from 'vitest';

const realtime = vi.hoisted(() => {
  const channel = {
    on: vi.fn(),
    subscribe: vi.fn(),
  };
  channel.on.mockReturnValue(channel);
  channel.subscribe.mockReturnValue(channel);
  return { channel, create: vi.fn(() => channel), remove: vi.fn(), from: vi.fn() };
});

vi.mock('../../lib/supabase', () => ({
  supabase: {
    channel: realtime.create,
    removeChannel: realtime.remove,
    from: realtime.from,
  },
}));

import { loadPublicCatalogue, subscribeToPublicCatalogueUpdates } from './catalogueRepository';

describe('subscribeToPublicCatalogueUpdates', () => {
  it('refreshes when inventory or book metadata changes', () => {
    const refresh = vi.fn();

    const stop = subscribeToPublicCatalogueUpdates(refresh);

    expect(realtime.create).toHaveBeenCalledWith('customer-book-catalogue');
    expect(realtime.channel.on).toHaveBeenCalledWith(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'book_inventories' },
      refresh
    );
    expect(realtime.channel.on).toHaveBeenCalledWith(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'books' },
      refresh
    );

    stop();
    expect(realtime.remove).toHaveBeenCalledWith(realtime.channel);
  });
});

describe('loadPublicCatalogue', () => {
  it('keeps an empty successful Supabase result instead of restoring stale CSV inventory', async () => {
    const query = {
      select: vi.fn(),
      eq: vi.fn(),
      order: vi.fn(),
      range: vi.fn(),
      then: (resolve: (value: unknown) => unknown) => resolve({ data: [], error: null }),
    };
    query.select.mockReturnValue(query);
    query.eq.mockReturnValue(query);
    query.order.mockReturnValue(query);
    query.range.mockReturnValue(query);
    realtime.from.mockReturnValue(query);
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(loadPublicCatalogue('snu')).resolves.toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();

    vi.unstubAllGlobals();
  });
});
