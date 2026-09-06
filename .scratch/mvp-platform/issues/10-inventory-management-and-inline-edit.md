# 10: Staff Desk - Book Inventory Management & Inline Fast Editing

**What to build:** Build the Inventory Management table within the Staff Desk (`/admin`). Display books for the active store with searchable/filterable columns (도서명, 작가, 장르, 보유권수, 서가위치, 갱신일). Implement inline editing for shelf location (e.g. clicking `A-03 서가` to edit and press enter/save) and volume range (e.g. `1~24권`), and single book registration modal with strictly separated title and volume fields.

**Blocked by:** 08: Staff Auth Context & Login Flow

**Status:** ready-for-agent

- [ ] Filterable and paginated/scrollable inventory data table
- [ ] Inline editing for shelf location and volume ranges with instant state persistence
- [ ] Single book creation modal ensuring title and volume are distinct fields
- [ ] Soft deletion / removal action with confirmation dialog
