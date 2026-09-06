# 08: Staff Auth Context & Login Flow

**What to build:** Build the Staff Authentication system. Create `AuthContext` with mock credentials validation (`snu_staff` / `1234`, `jamsil_staff` / `1234`), session persistence in localStorage, and Staff Login modal accessible from the header. Protect the `/admin` route so unauthorized guests are redirected or shown the login modal, and provide an easy one-click logout action in the admin header.

**Blocked by:** 03: Customer Header, Store Selector & Home Page

**Status:** ready-for-agent

- [ ] `AuthContext` with `login()`, `logout()`, `user`, and `isAuthenticated` state
- [ ] Staff login modal with error handling for invalid credentials
- [ ] Route guard protecting `/admin` and redirecting unauthenticated users
- [ ] Admin header showing current logged-in staff name and logout button
