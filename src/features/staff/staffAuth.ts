import { supabase } from '../../lib/supabase';
import { loginIdToInternalEmail, validateStaffSignup } from '../../lib/staffIdentity';

export async function applyForStaff(input: { name: string; loginId: string; password: string; phoneLast4: string }) {
  if (!supabase || !validateStaffSignup(input)) throw new Error('가입 정보를 확인해 주세요.');
  const email = loginIdToInternalEmail(input.loginId);
  const { data, error } = await supabase.auth.signUp({ email, password: input.password });
  if (error || !data.user) throw error ?? new Error('가입 처리에 실패했습니다.');
  const { error: profileError } = await supabase.rpc('apply_for_staff_account', { p_name: input.name, p_login_id: input.loginId, p_phone_last4: input.phoneLast4 });
  if (profileError) throw profileError;
}

export async function signInStaff(loginId: string, password: string) {
  if (!supabase) throw new Error('Supabase 연결이 필요합니다.');
  const { data: authData, error } = await supabase.auth.signInWithPassword({ email: loginIdToInternalEmail(loginId), password });
  if (error) throw error;
  const { data, error: accountError } = await supabase.from('staff_accounts').select('role,status').eq('id', authData.user.id).single();
  if (accountError || data.status !== 'approved') { await supabase.auth.signOut(); throw new Error('관리자 승인 후 이용할 수 있습니다.'); }
  return data.role as 'staff' | 'admin';
}
