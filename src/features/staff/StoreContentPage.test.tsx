import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { StoreContentPage } from './StoreContentPage';

const selectedStoreId = vi.hoisted(() => ({ value: 'd6d4a587-f4c0-4ad1-94a6-4de4ccd1d32b' }));

const storeContentQuery = {
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  upsert: vi.fn().mockResolvedValue({ error: null }),
  then: vi.fn((resolve: (val: unknown) => void) =>
    resolve({
      data: [],
      error: null,
    })
  ),
};

vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => storeContentQuery),
  },
}));

vi.mock('./StaffStoreContext', () => ({
  useStaffStore: () => ({ selectedStoreSlug: 'snu', setSelectedStoreSlug: vi.fn() }),
  useSelectedStaffStoreId: () => selectedStoreId.value,
}));

describe('StoreContentPage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders correctly and allows editing a price package via modal', async () => {
    render(
      <MemoryRouter>
        <StoreContentPage />
      </MemoryRouter>
    );

    // 요금제 탭으로 이동
    const packageTabButton = screen.getByRole('button', { name: /요금제/ });
    fireEvent.click(packageTabButton);

    // 첫 번째 요금제 카드의 '수정' 버튼 클릭
    const editButtons = screen.getAllByRole('button', { name: '수정' });
    expect(editButtons.length).toBeGreaterThan(0);
    fireEvent.click(editButtons[0]);

    // 모달이 열렸는지 확인
    expect(screen.getByRole('dialog', { name: /요금제 수정/ })).toBeTruthy();
    const nameInput = screen.getByLabelText('요금제 명칭') as HTMLInputElement;
    expect(nameInput.value).toBe('기본 1시간');

    // 값 변경 후 저장
    fireEvent.change(nameInput, { target: { value: '기본 1시간 (특가)' } });
    const saveButton = screen.getByRole('button', { name: '수정 저장' });
    fireEvent.click(saveButton);

    // 모달이 닫히고 변경된 요금제명이 목록에 표시되는지 확인
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull();
      expect(screen.getByText('기본 1시간 (특가)')).toBeTruthy();
    });
  });

  it('allows editing a beverage item via modal', async () => {
    render(
      <MemoryRouter>
        <StoreContentPage />
      </MemoryRouter>
    );

    // 음료 탭으로 이동
    const beverageTabButton = screen.getByRole('button', { name: /음료/ });
    fireEvent.click(beverageTabButton);

    // 첫 번째 음료 카드의 '수정' 버튼 클릭
    const editButtons = screen.getAllByRole('button', { name: '수정' });
    expect(editButtons.length).toBeGreaterThan(0);
    fireEvent.click(editButtons[0]);

    // 음료 수정 모달이 열렸는지 확인
    expect(screen.getByRole('dialog', { name: /음료 메뉴 수정/ })).toBeTruthy();
    const nameInput = screen.getByLabelText('한글 음료명') as HTMLInputElement;

    // 이름 수정 및 저장
    fireEvent.change(nameInput, { target: { value: '시그니처 아메리카노' } });
    const saveButton = screen.getByRole('button', { name: '수정 저장' });
    fireEvent.click(saveButton);

    // 모달이 닫히고 목록에 반영되었는지 확인
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull();
      expect(screen.getByText('시그니처 아메리카노')).toBeTruthy();
    });
  });

  it('allows editing a food item via modal and closing without saving', async () => {
    render(
      <MemoryRouter>
        <StoreContentPage />
      </MemoryRouter>
    );

    // 식사·스낵 탭으로 이동
    const foodsTabButton = screen.getByRole('button', { name: /식사·스낵/ });
    fireEvent.click(foodsTabButton);

    // 첫 번째 음식 카드의 '수정' 버튼 클릭
    const editButtons = screen.getAllByRole('button', { name: '수정' });
    expect(editButtons.length).toBeGreaterThan(0);
    fireEvent.click(editButtons[0]);

    // 음식 수정 모달이 열렸는지 확인
    expect(screen.getByRole('dialog', { name: /식사·디저트·스낵 수정/ })).toBeTruthy();

    // 취소 버튼 클릭 시 모달 닫힘
    const cancelButton = screen.getByRole('button', { name: '취소' });
    fireEvent.click(cancelButton);

    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
