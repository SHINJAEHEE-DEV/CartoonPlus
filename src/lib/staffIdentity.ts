const LOGIN_ID = /^[a-z0-9._-]{3,30}$/i;

export function loginIdToInternalEmail(loginId: string): string {
  return `${loginId.trim().toLowerCase()}@staff.cartoonplus.internal`;
}

export function validateStaffSignup(input: { name: string; loginId: string; password: string; phoneLast4: string }): boolean {
  return input.name.trim().length > 0 && LOGIN_ID.test(input.loginId.trim())
    && input.password.length >= 8 && /^\d{4}$/.test(input.phoneLast4);
}
