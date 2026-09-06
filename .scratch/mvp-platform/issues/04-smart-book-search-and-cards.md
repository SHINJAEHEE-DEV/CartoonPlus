# 04: Smart Book Search Page & Text-Only Card View

**What to build:** Build the dedicated Book Search page (`/search`). Implement real-time search input utilizing the normalization and choseong search engine, genre filter chips ([전체], [웹툰], [코믹스/소년], [순정/로맨스], [액션/판타지], [소설/라노벨]), sort dropdown (신간순, 가나다순, 보유권수순), and high-contrast text-only book cards displaying book title, author, publisher, genre badge, volume range (e.g. `1~23권`), and signature yellow shelf location badge (`[📍 A-03 서가]`). Provide an empty search result state with mascot illustration and a button opening the Book Request modal.

**Blocked by:** 02: Hangul Choseong & Whitespace-Agnostic Search Utility, 03: Customer Header, Store Selector & Home Page

**Status:** ready-for-agent

- [ ] Real-time debounced search bar with instant filtering by title, author, or initial consonants
- [ ] Genre filter chips and sorting dropdown controls
- [ ] Text-only card layout highlighting volume range and yellow shelf location badge
- [ ] Empty search state with friendly guidance and book request action trigger
- [ ] Responsive grid layout looking sharp on mobile smartphones and desktop
