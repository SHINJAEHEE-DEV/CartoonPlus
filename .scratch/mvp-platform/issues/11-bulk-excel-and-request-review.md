# 11: Staff Desk - Bulk Excel Import & Book Request Review/Conversion Flow

**What to build:** Build the Bulk Excel (CSV/XLSX) import tool and Book Request review section in the Staff Desk (`/admin`). The Excel uploader parses files containing hundreds of books, validates required columns (제목, 작가, 장르, 보유권수, 서가위치), runs normalization, and batch-inserts into inventory with a progress/success summary modal. The Book Request manager displays customer requests, allows status transitions (`PENDING` -> `ORDERED` -> `COMPLETED` / `REJECTED`) with admin notes, and on `COMPLETED`, opens the book registration modal prefilled with requested book details.

**Blocked by:** 10: Staff Desk - Book Inventory Management & Inline Fast Editing

**Status:** ready-for-agent

- [ ] CSV/Excel file dropzone parser validating columns and normalizing titles
- [ ] Bulk import summary dialog showing inserted count and error rows
- [ ] Customer book request list filtered by store and status
- [ ] Status update actions (`주문완료`, `입고완료`, `입고불가`) and admin note saving
- [ ] '입고완료' action triggers new book registration modal prefilled with request data
