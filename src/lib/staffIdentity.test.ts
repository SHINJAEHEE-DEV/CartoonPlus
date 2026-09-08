import { describe, expect, it } from 'vitest';
import { loginIdToInternalEmail, validateStaffSignup } from './staffIdentity';

describe('staff identity', () => {
  it('maps a login ID to an internal, non-contact email address', () => {
    expect(loginIdToInternalEmail('Jae.Hee_1')).toBe('jae.hee_1@staff.cartoonplus.internal');
  });

  it('rejects incomplete signup information', () => {
    expect(validateStaffSignup({ name: '', loginId: 'staff1', password: '12345678', phoneLast4: '1234' })).toBe(false);
    expect(validateStaffSignup({ name: '직원', loginId: 'staff1', password: '12345678', phoneLast4: '12' })).toBe(false);
  });
});
