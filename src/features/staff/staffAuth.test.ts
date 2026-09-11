import { beforeEach, describe, expect, it, vi } from 'vitest';

const fixture = vi.hoisted(() => ({
  status: 'approved',
  role: 'admin',
  signOut: vi.fn(),
  signInWithPassword: vi.fn(),
}));

vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: fixture,
    from: () => ({ select: () => {
      let ownAccount = false;
      const query = {
        eq: (column: string, value: string) => {
          ownAccount = column === 'id' && value === 'current-user';
          return query;
        },
        single: async () => ownAccount || fixture.role === 'staff'
          ? { data: { role: fixture.role, status: fixture.status }, error: null }
          : { data: null, error: { code: 'PGRST116', message: 'Multiple rows returned' } },
      };
      return query;
    } }),
  },
}));

import { signInStaff } from './staffAuth';

describe('staff login account selection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fixture.role = 'admin';
    fixture.status = 'approved';
    fixture.signInWithPassword.mockResolvedValue({ data: { user: { id: 'current-user' } }, error: null });
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
    await expect(signInStaff('staff', 'test-password')).rejects.toThrow('관리자 승인 후 이용할 수 있습니다.');
    expect(fixture.signOut).toHaveBeenCalledOnce();
  });
});
