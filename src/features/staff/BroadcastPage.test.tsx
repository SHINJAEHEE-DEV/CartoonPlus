import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as voiceAssetsModule from '../../lib/voiceAssets';

const selectedStoreId = vi.hoisted(() => ({ value: 'store-uuid-1' }));
const mockStorageUpload = vi.hoisted(() => vi.fn().mockResolvedValue({ data: { path: 'store-uuid-1/test.mp3' }, error: null }));
const mockStorageRemove = vi.hoisted(() => vi.fn().mockResolvedValue({ data: [], error: null }));
const mockStorageGetPublicUrl = vi.hoisted(() => vi.fn().mockReturnValue({
  data: { publicUrl: 'https://storage.test/broadcast-audio/store-uuid-1/test.mp3' },
}));

const mockPresetsData = [
  {
    id: 'uploaded-1',
    store_id: 'store-uuid-1',
    title: '매장 특별 이벤트 안내',
    audio_url: 'https://storage.test/broadcast-audio/store-uuid-1/event.mp3',
    source_type: 'upload',
    hidden_at: null,
  },
];

const presetsQuery = {
  select: vi.fn().mockReturnThis(),
  or: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  insert: vi.fn().mockResolvedValue({ data: [{ id: 'new-1' }], error: null }),
  update: vi.fn().mockReturnValue({
    eq: vi.fn().mockResolvedValue({ data: [], error: null }),
  }),
  delete: vi.fn().mockReturnValue({
    eq: vi.fn().mockResolvedValue({ data: [], error: null }),
  }),
  then: vi.fn((resolve: (val: unknown) => void) =>
    resolve({ data: mockPresetsData, error: null })
  ),
};

const scheduledBroadcastsQuery = {
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnValue({
    eq: vi.fn().mockResolvedValue({ data: [], error: null }),
  }),
  then: vi.fn((resolve: (val: unknown) => void) =>
    resolve({ data: [], error: null })
  ),
};

const broadcastRunsQuery = {
  insert: vi.fn().mockReturnValue({
    select: vi.fn().mockReturnValue({
      single: vi.fn().mockResolvedValue({ data: { id: 'run-1' }, error: null }),
    }),
  }),
  update: vi.fn().mockReturnValue({
    eq: vi.fn().mockResolvedValue({ data: [], error: null }),
  }),
  select: vi.fn().mockReturnValue({
    eq: vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        order: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue({ data: [], error: null }),
        }),
      }),
    }),
  }),
  then: vi.fn((resolve: (val: unknown) => void) =>
    resolve({ data: [], error: null })
  ),
};

const fromMock = vi.fn((table: string) => {
  if (table === 'broadcast_presets') return presetsQuery;
  if (table === 'scheduled_broadcasts') return scheduledBroadcastsQuery;
  if (table === 'broadcast_runs') return broadcastRunsQuery;
  return presetsQuery;
});

vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: (table: string) => fromMock(table),
    storage: {
      from: vi.fn().mockReturnValue({
        upload: mockStorageUpload,
        remove: mockStorageRemove,
        getPublicUrl: mockStorageGetPublicUrl,
      }),
    },
  },
}));

vi.mock('./StaffStoreContext', () => ({
  useStaffStore: () => ({ selectedStoreSlug: 'snu', setSelectedStoreSlug: vi.fn() }),
  useSelectedStaffStoreId: () => selectedStoreId.value,
}));

import { BroadcastPage } from './BroadcastPage';

describe('BroadcastPage MP3 preset management', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(cleanup);

  it('renders default static presets and uploaded presets', async () => {
    render(
      <MemoryRouter>
        <BroadcastPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('기본 안내')).toBeTruthy();
      expect(screen.getByText('11시 마감 안내')).toBeTruthy();
      expect(screen.getByText('만석 안내')).toBeTruthy();
      expect(screen.getByText('소음 안내')).toBeTruthy();
      expect(screen.getByText('신분증 검사 안내')).toBeTruthy();
      expect(screen.getByText('음료 픽업 요청 안내')).toBeTruthy();
    });

    expect(await screen.findByText('매장 특별 이벤트 안내')).toBeTruthy();
  });

  it('plays preset audio with HTML Audio when clicking broadcast button', async () => {
    const playSpy = vi.spyOn(voiceAssetsModule, 'playVoiceAsset').mockResolvedValue(undefined);

    render(
      <MemoryRouter>
        <BroadcastPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('기본 안내')).toBeTruthy();
    });

    const playButtons = screen.getAllByRole('button', { name: /즉시 방송/i });
    fireEvent.click(playButtons[0]);

    await waitFor(() => {
      expect(playSpy).toHaveBeenCalledWith('/audio/broadcast/기본 안내.wav');
    });
  });

  it('allows opening upload modal and uploading an MP3 preset', async () => {
    const uploadSpy = vi.spyOn(voiceAssetsModule, 'uploadVoiceAsset').mockResolvedValue({
      url: 'https://storage.test/broadcast-audio/store-uuid-1/arrival.mp3',
      path: 'store-uuid-1/arrival.mp3',
    });

    render(
      <MemoryRouter>
        <BroadcastPage />
      </MemoryRouter>
    );

    const addUploadBtn = await screen.findByRole('button', { name: /\+ 새 MP3 프리셋 업로드/i });
    fireEvent.click(addUploadBtn);

    expect(screen.getByText('새 MP3 방송 프리셋 등록')).toBeTruthy();

    const titleInput = screen.getByLabelText('프리셋 제목', { selector: '#upload-preset-title' });
    const fileInput = screen.getByLabelText('MP3 음성 파일 (최대 3MB)', { selector: '#upload-preset-file' });

    fireEvent.change(titleInput, { target: { value: '신규 도서 입고 안내' } });
    const dummyFile = new File(['dummy audio content'], 'arrival.mp3', { type: 'audio/mpeg' });
    fireEvent.change(fileInput, { target: { files: [dummyFile] } });

    const form = screen.getByRole('dialog');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(uploadSpy).toHaveBeenCalledWith('store-uuid-1', dummyFile);
    });
  });

  it('allows opening edit title modal and updating preset title', async () => {
    render(
      <MemoryRouter>
        <BroadcastPage />
      </MemoryRouter>
    );

    expect(await screen.findByText('매장 특별 이벤트 안내')).toBeTruthy();

    const editBtn = screen.getByRole('button', { name: /매장 특별 이벤트 안내 제목 수정/i });
    fireEvent.click(editBtn);

    expect(screen.getByText('프리셋 제목 수정')).toBeTruthy();
    const editInput = screen.getByLabelText('프리셋 제목', { selector: '#edit-preset-title' });
    fireEvent.change(editInput, { target: { value: '수정된 이벤트 안내' } });

    const form = screen.getByRole('dialog');
    fireEvent.submit(form);
  });

  it('allows deleting uploaded preset with storage and schedule cascade', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const deleteStorageSpy = vi.spyOn(voiceAssetsModule, 'deleteVoiceAssetFromStorage');

    render(
      <MemoryRouter>
        <BroadcastPage />
      </MemoryRouter>
    );

    expect(await screen.findByText('매장 특별 이벤트 안내')).toBeTruthy();

    const deleteBtn = screen.getByRole('button', { name: /매장 특별 이벤트 안내 삭제/i });
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(deleteStorageSpy).toHaveBeenCalledWith('https://storage.test/broadcast-audio/store-uuid-1/event.mp3');
    });
  });
});
