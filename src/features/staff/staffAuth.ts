import { supabase } from '../../lib/supabase';
import { loginIdToInternalEmail, validateStaffSignup } from '../../lib/staffIdentity';

type ApprovedStaffRole = 'staff' | 'admin';

export type ApprovedStaffContext = {
  role: ApprovedStaffRole;
  storeName: string | null;
  storeSlug: 'snu' | 'jamsil' | 'hongdae';
};

async function loadApprovedStaffRole(userId: string): Promise<ApprovedStaffRole | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('staff_accounts')
    .select('role,status')
    .eq('id', userId)
    .single();
  if (error || data?.status !== 'approved') return null;
  return data.role as ApprovedStaffRole;
}

export async function getApprovedStaffContext(): Promise<ApprovedStaffContext | null> {
  if (!supabase) return null;
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return null;
  const { data, error } = await supabase
    .from('staff_accounts')
    .select('role,status,stores(name,slug)')
    .eq('id', authData.user.id)
    .single();
  if (error || data?.status !== 'approved') return null;
  const store = Array.isArray(data.stores) ? data.stores[0] : data.stores;
  return {
    role: data.role as ApprovedStaffRole,
    storeName: store?.name ?? null,
    storeSlug: (store?.slug ?? 'snu') as 'snu' | 'jamsil' | 'hongdae',
  };
}

export async function getApprovedStaffRole(): Promise<ApprovedStaffRole | null> {
  if (!supabase) return null;
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return null;

  const role = await loadApprovedStaffRole(authData.user.id);
  if (!role) await supabase.auth.signOut();
  return role;
}

export async function signOutStaff() {
  if (supabase) await supabase.auth.signOut();
}

export async function applyForStaff(input: {
  name: string;
  loginId: string;
  password: string;
  phoneLast4: string;
  storeSlug?: string;
}) {
  if (!supabase || !validateStaffSignup(input)) throw new Error('가입 정보를 확인해 주세요.');
  const email = loginIdToInternalEmail(input.loginId);
  const { data, error } = await supabase.auth.signUp({ email, password: input.password });
  if (error || !data.user) throw error ?? new Error('가입 처리에 실패했습니다.');
  const { error: profileError } = await supabase.rpc('apply_for_staff_account', {
    p_name: input.name,
    p_login_id: input.loginId,
    p_phone_last4: input.phoneLast4,
    p_store_slug: input.storeSlug || 'snu',
  });
  if (profileError) throw profileError;
}

export async function signInStaff(loginId: string, password: string) {
  if (!supabase) throw new Error('Supabase 연결이 필요합니다.');
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: loginIdToInternalEmail(loginId),
    password,
  });
  if (error) throw error;
  const role = await loadApprovedStaffRole(authData.user.id);
  if (!role) {
    await supabase.auth.signOut();
    throw new Error('관리자 승인 후 이용할 수 있습니다.');
  }
  return role;
}
