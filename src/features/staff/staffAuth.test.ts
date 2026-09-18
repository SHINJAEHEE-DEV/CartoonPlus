import { beforeEach, describe, expect, it, vi } from 'vitest';

const fixture = vi.hoisted(() => ({
  status: 'approved',
  role: 'admin',
  getUser: vi.fn(),
  signOut: vi.fn(),
  signInWithPassword: vi.fn(),
}));

vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: fixture,
    from: () => ({
      select: () => {
        let ownAccount = false;
        const query = {
          eq: (column: string, value: string) => {
            ownAccount = column === 'id' && value === 'current-user';
            return query;
          },
          single: async () =>
            ownAccount || fixture.role === 'staff'
              ? { data: { role: fixture.role, status: fixture.status }, error: null }
              : { data: null, error: { code: 'PGRST116', message: 'Multiple rows returned' } },
        };
        return query;
      },
    }),
  },
}));

import { getApprovedStaffRole, signInStaff, signOutStaff } from './staffAuth';

describe('staff login account selection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fixture.role = 'admin';
    fixture.status = 'approved';
    fixture.getUser.mockResolvedValue({ data: { user: { id: 'current-user' } } });
    fixture.signInWithPassword.mockResolvedValue({
      data: { user: { id: 'current-user' } },
      error: null,
    });
  });

  it('allows an approved admin who can read multiple staff accounts', async () => {
    await expect(signInStaff('admin', 'test-password')).resolves.toBe('admin');
    expect(fixture.signOut).not.toHaveBeenCalled();
  });

  it('allows approved staff', async () => {
    fixture.role = 'staff';
    await expect(signInStaff('staff', 'test-password')).resolves.toBe('staff');
  });

  it.each(['pending', 'deactivated'])('blocks a %s account', async (status) => {
    fixture.role = 'staff';
    fixture.status = status;
    await expect(signInStaff('staff', 'test-password')).rejects.toThrow(
      '관리자 승인 후 이용할 수 있습니다.'
    );
    expect(fixture.signOut).toHaveBeenCalledOnce();
  });

  it('restores an approved staff role from the saved session', async () => {
    fixture.role = 'staff';

    await expect(getApprovedStaffRole()).resolves.toBe('staff');
    expect(fixture.signOut).not.toHaveBeenCalled();
  });

  it('clears an unapproved saved session', async () => {
    fixture.status = 'deactivated';

    await expect(getApprovedStaffRole()).resolves.toBeNull();
    expect(fixture.signOut).toHaveBeenCalledOnce();
  });

  it('ends the saved staff session on sign out', async () => {
    await signOutStaff();
    expect(fixture.signOut).toHaveBeenCalledOnce();
  });

  it('passes storeSlug when applying for staff', async () => {
    const rpcMock = vi.fn().mockResolvedValue({ error: null });
    const signUpMock = vi.fn().mockResolvedValue({ data: { user: { id: 'new-user' } }, error: null });

    const testSupabase = await import('../../lib/supabase');
    (testSupabase.supabase as any).auth.signUp = signUpMock;
    (testSupabase.supabase as any).rpc = rpcMock;

    const { applyForStaff } = await import('./staffAuth');
    await applyForStaff({
      name: '홍길동',
      loginId: 'hongdae_staff',
      password: 'password1234',
      phoneLast4: '1234',
      storeSlug: 'hongdae',
    });

    expect(signUpMock).toHaveBeenCalled();
    expect(rpcMock).toHaveBeenCalledWith('apply_for_staff_account', {
      p_name: '홍길동',
      p_login_id: 'hongdae_staff',
      p_phone_last4: '1234',
      p_store_slug: 'hongdae',
    });
  });
});
