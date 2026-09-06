# 05: Non-member Book Request Modal & Customer Submission Flow

**What to build:** Build the non-member customer Book Purchase Request modal. Allow customers without logging in to submit a request for missing books by choosing the target store, entering the book title (required), author/publisher, volume range (e.g. `1~5권`, `전권`), and comments. Validate inputs, persist the request into the mock repository (`book_requests` state with `PENDING` status), and provide immediate visual success feedback (toast/modal).

**Blocked by:** 04: Smart Book Search Page & Text-Only Card View

**Status:** ready-for-agent

- [ ] Accessible modal dialog with clean form validation for mandatory and optional fields
- [ ] Submitting appends new request to mock state and localStorage
- [ ] Success state/toast with friendly confirmation message
- [ ] Accessible from search empty state and quick action button in header/search page
