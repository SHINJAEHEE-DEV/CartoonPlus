# 도메인 모델 (Domain Model) : 카툰플러스 (CartoonPlus)

카툰플러스는 만화카페 고객을 위한 도서/엔터테인먼트 검색 및 매장 안내 서비스와, 매장 직원을 위한 도서 재고 관리 및 매장 안내 방송 자동화 솔루션입니다.

---

## 1. 핵심 용어 사전 (Glossary)

| 용어 (한글) | 용어 (영문) | 설명 |
| :--- | :--- | :--- |
| **지점 / 매장** | `Store` | 카툰플러스의 개별 오프라인 매장 (예: 서울대입구역점, 잠실점 등). |
| **도서 마스터** | `Book` | 단행본/시리즈의 공통 도서 메타데이터 (제목, 정규화 제목, 초성, 작가, 출판사, 장르). |
| **도서 재고 / 권수** | `BookInventory` | 특정 지점에 입고된 실제 권수 범위(예: 1~15권), 서가 위치, 최신 갱신일. |
| **도서 입고 신청** | `BookRequest` | 손님이 매장에 없는 도서의 입고를 신청하고 관리자가 접수/처리하는 내역. |
| **서가 위치** | `ShelfLocation` | 매장 내 도서가 비치된 위치 코드 및 텍스트 설명 (예: `A-03 (순정만화 구역)`). |
| **즐길거리 (게임/보드게임)** | `EntertainmentItem` | 매장 내 구비된 닌텐도 스위치 / Xbox 게임 팩 및 보드게임 (타이틀명, 플레이 인원, 장르 등). |
| **식음료 메뉴** | `MenuItem` | 매장에서 판매하는 음식 및 음료 (카테고리: 라면, 스낵, 커피/음료, 요금제 등, 가격, 베스트 여부). |
| **방송 프리셋** | `BroadcastPreset` | 매장 스피커로 송출할 사전 정의된 안내 음성 멘트 (제목, 재생 텍스트/TTS). |
| **공백 무시 정규화** | `WhitespaceNormalization` | 도서명 검색 시 공백/특수문자를 제거하여 '체인소 맨'과 '체인소맨'을 동일하게 매칭하는 검색 처리 방식. |
| **관리자** | `Admin / Staff` | 매장 직원 및 점주로, 이름과 비밀번호로 로그인하여 재고/입고신청/방송을 제어하는 사용자. |

---

## 2. 핵심 엔티티 관계 (Entity Relationship)

```mermaid
erDiagram
    STORE ||--o{ BOOK_INVENTORY : "지점별 재고"
    STORE ||--o{ BOOK_REQUEST : "도서 입고 신청"
    STORE ||--o{ ENTERTAINMENT_ITEM : "구비 게임"
    STORE ||--o{ MENU_ITEM : "판매 메뉴"
    STORE ||--o{ BROADCAST_PRESET : "보유 프리셋"
    STORE ||--o{ ADMIN_USER : "소속 직원"
    
    BOOK ||--o{ BOOK_INVENTORY : "도서 마스터 매핑"
    
    BOOK {
        string id PK
        string title "도서명"
        string normalized_title "정규화 제목"
        string initial_consonants "한글 초성"
        string author "작가"
        string publisher "출판사"
        string category "장르"
    }

    BOOK_INVENTORY {
        string id PK
        string store_id FK
        string book_id FK
        string volume_range "보유 권수 (예: 1~35권)"
        string shelf_location "서가 위치 (예: A-04)"
        string note "특이사항"
        datetime updated_at "최종 갱신일"
    }

    BOOK_REQUEST {
        string id PK
        string store_id FK
        string title "신청 도서명"
        string author "작가/출판사"
        string volume_range "희망 권수"
        string user_comment "손님 코멘트"
        string status "상태 (PENDING | ORDERED | COMPLETED | REJECTED)"
        string admin_reply "관리자 메모/답변"
        datetime created_at "신청일시"
    }

    ENTERTAINMENT_ITEM {
        string id PK
        string store_id FK
        string type "종류 (NINTENDO | XBOX | BOARD_GAME)"
        string title "타이틀명"
        string players "지원 인원 (예: 1~4인)"
        string genre "장르/난이도"
        boolean is_available "이용 가능 여부"
    }

    MENU_ITEM {
        string id PK
        string store_id FK
        string category "카테고리 (MEAL | SNACK | BEV | PACKAGE)"
        string name "메뉴명"
        int price "가격"
        boolean is_best "인기 메뉴 여부"
        boolean is_soldout "품절 여부"
    }

    BROADCAST_PRESET {
        string id PK
        string store_id FK "지점 공통 또는 전용"
        string preset_key "식별 키"
        string title "버튼명 (예: 마감 10분 전)"
        string message_text "TTS 음성 텍스트"
        int sort_order "정렬 순서"
    }

    ADMIN_USER {
        string id PK
        string store_id FK
        string username "아이디/이름"
        string password_hash "암호화 비밀번호"
        string role "권한 (ADMIN | STAFF)"
    }
```
