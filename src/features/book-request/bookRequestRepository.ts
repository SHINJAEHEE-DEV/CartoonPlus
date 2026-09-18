import { supabase } from '../../lib/supabase';
import type { StoreSlug } from '../../lib/storeContext';

export interface BookRequestInput {
  title: string;
  author?: string;
  desiredVolume?: string;
  customerComment?: string;
}

export async function submitBookRequest(
  storeSlug: StoreSlug,
  input: BookRequestInput
): Promise<{ success: boolean; error?: string }> {
  if (!input.title.trim()) {
    return { success: false, error: '도서명을 입력해 주세요.' };
  }

  if (!supabase) {
    // Mock / Offline mode fallback
    return { success: true };
  }

  try {
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select('id')
      .eq('slug', storeSlug)
      .single();

    if (storeError && storeError.code !== 'PGRST116') {
      throw storeError;
    }

    if (!store?.id) {
      return { success: false, error: '유효한 지점 정보를 찾을 수 없습니다.' };
    }

    const { error } = await supabase.from('book_requests').insert({
      store_id: store.id,
      title: input.title.trim(),
      author: input.author?.trim() || null,
      desired_volume: input.desiredVolume?.trim() || null,
      customer_comment: input.customerComment?.trim() || null,
    });

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '도서 입고 신청 처리 중 오류가 발생했습니다.';
    return { success: false, error: message };
  }
}
