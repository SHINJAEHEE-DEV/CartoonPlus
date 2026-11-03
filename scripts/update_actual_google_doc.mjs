import fs from "node:fs";

const CRED_PATH = process.env.HOME + "/.config/mcp-google-slides/credentials.json";
const CLIENT_PATH = process.env.HOME + "/.config/mcp-google-slides/client.json";
const DOC_ID = "1NKf2HQPbUDJ_ZyF-cLLyKmtrhPdI08PNLoTwQAhY1N4";

async function getAccessToken() {
  const creds = JSON.parse(fs.readFileSync(CRED_PATH, "utf8"));
  if (Date.now() < creds.expires_at - 60000) {
    return creds.access_token;
  }
  const clientConfig = JSON.parse(fs.readFileSync(CLIENT_PATH, "utf8"));
  const clientId = clientConfig.web?.client_id || clientConfig.installed?.client_id;
  const clientSecret = clientConfig.web?.client_secret || clientConfig.installed?.client_secret;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: creds.refresh_token,
      grant_type: "refresh_token"
    })
  });
  const data = await res.json();
  creds.access_token = data.access_token;
  creds.expires_at = Date.now() + data.expires_in * 1000;
  fs.writeFileSync(CRED_PATH, JSON.stringify(creds, null, 2));
  return creds.access_token;
}

async function getDoc(token) {
  const res = await fetch(`https://docs.googleapis.com/v1/documents/${DOC_ID}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return await res.json();
}

async function batchUpdateDoc(token, requests) {
  const res = await fetch(`https://docs.googleapis.com/v1/documents/${DOC_ID}:batchUpdate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ requests })
  });
  const result = await res.json();
  if (res.status !== 200) {
    throw new Error(`Batch update failed (${res.status}): ${JSON.stringify(result)}`);
  }
  return result;
}

async function main() {
  console.log("Starting Live Google Doc Resume Update for ID:", DOC_ID);
  const token = await getAccessToken();

  // 1. Get current document
  const doc = await getDoc(token);
  const endIdx = doc.body.content[doc.body.content.length - 1].endIndex;
  console.log("Current document endIndex:", endIdx);

  // 2. Clear existing document content
  if (endIdx > 2) {
    console.log("Clearing existing content...");
    await batchUpdateDoc(token, [
      {
        deleteContentRange: {
          range: {
            startIndex: 1,
            endIndex: endIdx - 1
          }
        }
      }
    ]);
  }

  // 3. Prepare formatted resume content in concise nominal written style
  const resumeLines = [
    "신재희 Shin Jae-hee",
    "BACKEND / FULL-STACK DEVELOPER",
    "문제의 원인을 지표로 확인하고, 대안을 비교해서 고른 이유를 설명하는 개발자",
    "M 010-4176-3805  |  E asjh011969@gmail.com  |  G github.com/SHINJAEHEE-DEV  |  P shinjaehee-dev.github.io/portfolio-website",
    "",
    "01 ABOUT ME",
    "Spring Boot 및 React/Next.js 기반 백엔드/풀스택 개발자임. 대면 영업과 CS 현장에서 고객 요구를 파악하고 문제를 해결하며, 상대의 의견을 먼저 듣고 객관적 근거와 수치로 설득하는 역량을 체득함. 개발 영역에서는 현장의 비효율적 수기 업무를 자동화하고 성능 병목의 원인을 정량 지표로 분석하여 최적의 기술 대안을 도출하는 데 집중함.",
    "",
    "02 CAREER",
    "[SalesWorksKorea] : [영업 / CS] [2024.07 ~ 2025.04]",
    "- 역할 : [전문모금 캠페이너 및 팀 리더]",
    "- 규모 : [부산 지부 20인, 직속팀 3명]",
    "- 업무 : 고객 및 시민 대상 공익 후원 가치 전달 및 정기 후원 유치, 팀 성과 관리",
    "- 성과 : 2024년 40~50대 후원자 유치 비율 전국 1등 달성 (유엔난민기구 표창 수상)",
    "",
    "[U+ 금곡대로점(으뜸컴퍼니)] : [영업 / CS] [2025.05 ~ 2025.09]",
    "- 역할 : [고객 대면 상담 및 통신요금 설계]",
    "- 규모 : [매장 6인]",
    "- 업무 : 고객 대면 CS, 통신 사용 패턴 분석 기반 맞춤형 요금제 및 결합 상품 설계",
    "- 성과 : 서부산 2분기 CS 고객평가 3위 달성",
    "",
    "[개발 전환 계기 및 직무 연관성]",
    "- 현장 대면 업무를 수행하며 고객의 숨은 니즈를 파악하고 데이터와 근거를 바탕으로 상대를 설득하는 커뮤니케이션 역량을 체득함.",
    "- 오프라인 대면 응대를 넘어, 소프트웨어 엔지니어링을 통해 현장의 비효율을 자동화하고 사용자에게 직관적인 경험(UX)과 안정적인 성능을 제공하고자 백엔드/풀스택 개발자로 전향함.",
    "",
    "03 EDUCATION & CERTIFICATION",
    "* 프로그래머스 AI 백엔드 데브코스 6기 (2026.03 ~ 2026.08) : Java/Spring Boot 백엔드 설계, k6 대규모 부하 테스트, 성능 최적화, AWS/Docker 인프라, 우수 프로젝트 선정",
    "* 부산디지털대학교 컴퓨터공학과 학사 (2024.08 졸업) : 학점 4.03 / 4.5",
    "* 정보처리기사 (2023.09 취득, 한국산업인력공단)",
    "",
    "04 TECH STACK",
    "* Language: Java 17/21, TypeScript, SQL",
    "* Backend: Spring Boot 3.x, Spring Data JPA, QueryDSL, Spring Security",
    "* Auth: JWT, OAuth2, HttpOnly Cookie, Double-Submit CSRF",
    "* Database: PostgreSQL, MySQL 8.0, Redis 7.x, Supabase (RLS, Edge RPC)",
    "* Infra: Cloudflare Pages, AWS(EC2, ECR, S3), Docker, GitHub Actions, Nginx",
    "* Observability: Actuator, Prometheus, Grafana, k6, JUnit 5, Vitest",
    "* Frontend: React 19, Next.js 16, TypeScript, Tailwind CSS, Web Audio API",
    "* Collaboration: Git, GitHub, Notion, Slack, Postman",
    "",
    "05 PROJECTS",
    "1. 카툰플러스 (CartoonPlus), 만화카페 매장 운영 자동화 및 통합 웹 플랫폼 전면 리뉴얼",
    "- 기간: 2026.08 ~ 2026.09 (개인 프로젝트 / 3개 지점 실운영)",
    "- 규모: 1인 개발 (기획, UI/UX, 풀스택, 인프라, 운영 배포 기여도 100%)",
    "- 기술: TypeScript, React 19, Vite, Tailwind CSS, Supabase (PostgreSQL, RLS), Cloudflare Pages (SSG), Web Audio API",
    "",
    "① 비즈니스 기획 및 대표 설득 (TCO 100% 절감, 고정비 $0화)",
    "- 문제: 유료 DB SaaS(Caspio) 구독료(연 약 36만 원)가 지속 발생하고 있었으며, 파파고 번역기 수기 방송 조작과 수기 도서 신청 등 매장 운영 업무가 파편화되어 피크 시간대 업무 지연이 발생함.",
    "- 접근: 일일 트래픽 및 데이터 갱신량을 분석해 Serverless Free Tier 기반 '비용 $0 아키텍처'를 설계하고, 모바일 UI 시안 및 PoC 검색 엔진을 직접 제작하여 대표님께 시연함.",
    "- 성과: 대표님의 비용 및 일정 우려를 해소하고 3개 지점(홍대·잠실·서울대입구) 전면 개편 승인을 획득함. 유료 SaaS 비용을 전액 절감하고 지점 확장에 따른 인프라 한계비용 $0을 달성함.",
    "",
    "② 1:N 데이터 모델 정규화 및 검색 엔진 최적화",
    "- 문제: 기존 단일 평면 테이블로 동일 도서가 권수별로 중복 노출되어(약 5,000건) 검색 가독성이 저하되고, 띄어쓰기가 일치하지 않으면 도서 검색이 실패함.",
    "- 접근: 데이터베이스를 도서 메타(books)와 지점별 권수/위치(book_inventory)로 1:N 분리 정규화하고, 공백 제거 정규화(replace) 및 한글 초성/부분 일치 검색 RPC 함수를 구현함.",
    "- 성과: 중복 도서 데이터를 통합하고 도서 검색 실패율 0%를 달성함. 검색 화면 내 서가 번호 뱃지 및 구역 배치도 UI를 제공하여 카운터 도서 위치 문의를 70% 감소시킴.",
    "",
    "③ 웹 성능 최적화 및 Post-Build SSG SEO",
    "- 문제: 고용량 외부 이미지와 렌더 블로킹 폰트로 인해 모바일 LCP가 17.4초에 달하고 Lighthouse 모바일 성능 점수가 37점에 머물러 매장 현장 사용성이 크게 저하됨.",
    "- 접근: 이미지를 WebP로 변환해 정적 번들링하고 fetchpriority=\"high\"를 적용함. 고정 비율 AspectRatio 박스로 레이아웃 흔들림(CLS 0.009)을 방어하고, 빌드 시점 지점별 정적 HTML을 사전 생성하는 커스텀 SSG 스크립트를 구축함.",
    "- 성과: 모바일 LCP 17.4s → 2.5s (85.6% 단축), Lighthouse 성능 점수 37점 → 76점 향상, 지점별 포털 검색엔진 노출을 위한 SEO 점수 100점 만점을 달성함.",
    "",
    "④ 매장 운영 파이프라인 자동화 및 현장 실사용자(직원/고객) VOC 이터레이션",
    "- 문제: 수기 방송 입력의 번거로움과 비회원 고객의 도서 신청 진입 장벽 존재.",
    "- 접근: Web Audio API 기반 무중단 정기 방송 스케줄러를 구축하고, 피크 시간대 직원 피로도 감소를 위해 6종 원클릭 즉시 방송 프리셋을 1일 만에 신속 추가함. 도서 신청은 비회원 간편 모달로 전환함.",
    "- 성과: 일일 수기 업무 소요 공수를 90% 감축함 (일 30분 → 3분). 도서 신청 처리 건수 주 2건 → 18건 증가로 현장 서비스 만족도를 크게 향상시킴.",
    "",
    "────────────────────────────────────────────────────────────────────────────",
    "2. CatchEat (캐치잇), 음식 기록과 챌린지 소셜 플랫폼 – 프로그래머스 우수 프로젝트 선정",
    "- 기간: 2026.07 ~ 2026.08 (6주)",
    "- 규모: 팀 5명, BE 5명",
    "- 역할: 챌린지 도메인 전반, 인증/인가 보안, 어드민, 부하 테스트 및 성능 최적화",
    "- GitHub: https://github.com/prgrms-aibe-devcourse/AIBE6_FinalProject_Team02_BE",
    "- 기술: Java 21, Spring Boot 3.3, JPA, QueryDSL, PostgreSQL, Redis, AWS(S3, EC2, ECR), Docker, GitHub Actions, Nginx, Prometheus, Grafana, k6",
    "",
    "① 리프레시 토큰 동시 재발급 경쟁 해결: 회전 승자 30/32 -> 1/32",
    "- 문제: 한 화면에서 여러 API가 동시에 401을 받을 시 병렬 재발급이 같은 저장값을 읽고 각자 새 토큰을 저장함. 마지막 하나만 남아 쿠키와 서버 상태가 어긋나며 예고 없는 로그아웃이 불규칙하게 발생함.",
    "- 접근: 백엔드는 Redis Lua 스크립트로 조회, 비교, 교체를 단일 원자 연산(CAS)으로 묶음. 프론트는 single-flight로 진행 중인 재발급 Promise를 공유해 호출을 1회로 합침. 정상 경쟁의 패자는 유예창 안에서 access만 받도록 처리하여 오탐 로그아웃을 방어함.",
    "- 성과: 동시 32요청 재현 테스트에서 회전 승자를 30/32에서 1/32로 개선. 쿠키와 Redis 간의 불일치를 해소하고 다기기 동시 접속 세션을 안정적으로 유지함.",
    "",
    "② HttpOnly 쿠키 인증의 무상태 Double-Submit CSRF 방어",
    "- 문제: XSS를 방어하고자 Access와 Refresh를 모두 HttpOnly 쿠키에 담았으나, 쿠키 자동 전송 메커니즘으로 인해 피싱 사이트의 POST 요청으로 사용자 상태 변경이 위조될 위험이 존재함.",
    "- 접근: 상태 저장이 필수인 Synchronizer Token 대신, JWT의 무상태성(Stateless)을 유지하는 Double-Submit Cookie 패턴을 채택함. Spring Security 필터로 구현하고 __Host- 접두사로 서브도메인 주입 공격을 방어함.",
    "- 성과: X-XSRF-TOKEN 헤더 없이 전송되는 위조 POST 요청을 403 Forbidden으로 100% 차단하고 서버 세션 메모리 오버헤드 0 Byte를 유지함.",
    "",
    "③ 목록 조회 N+1 제거: 150 VU에서 실패율 100% -> 0%, p95 30s -> 3.25s",
    "- 문제: 내 챌린지 목록 조회 시 카드마다 슬롯 수, 참여 여부, 해금 수를 개별 조회해 요청 1건당 쿼리가 약 1,500개 발생함. 150 VU 부하에서 HikariCP 풀(10)이 고갈되어 실패율 100% 발생, CPU는 13.9% 수준에 머무름.",
    "- 접근: 병목 원인이 연산 부족이 아닌 과도한 DB 왕복 및 커넥션 점유임을 확인한 후, 부가정보를 IN(:ids) + GROUP BY로 한 번에 집계해 Map으로 받고 루프 내 DB I/O를 0으로 제거하여 왕복 횟수를 상수 타임으로 최적화함.",
    "- 성과: 동일 부하에서 실패율 100% -> 0%, p95 응답속도 30s -> 3.25s (9.2배 단축), 처리량 3.6 -> 33.7 RPS (9.3배 증대) 달성.",
    "",
    "④ 챌린지 위치 인증과 완주 동시성 제어",
    "- 문제: 위치 기반 슬롯 해금 시 클라이언트 좌표 조작 위험이 있고, 마지막 슬롯이 동시 해금될 경우 완주 판정과 보상 뱃지가 중복 지급될 수 있는 동시성 문제가 존재함.",
    "- 접근: 참여자, 슬롯, 기간, 중복 인증을 서버에서 다단계로 검증하고 완주 판정 로직은 PESSIMISTIC_WRITE(비관적 락) 행 잠금으로 보호함. S3 객체 삭제는 트랜잭션 커밋 후 @TransactionalEventListener(AFTER_COMMIT)으로 비동기 격리함.",
    "- 성과: 동시 해금 시 완주 판정 및 리워드 중복 지급을 차단하여 데이터 정합성 100%를 보장하고 DB 롤백 시 파일 유실을 방지함.",
    "",
    "────────────────────────────────────────────────────────────────────────────",
    "3. MODLE (모들), 프리랜서 모델과 디자이너 매칭 플랫폼",
    "- 기간: 2026.06.11 ~ 2026.06.24 (2주)",
    "- 규모: 팀 5명, BE 5명",
    "- 역할: 프로필 도메인 전담, 페치 전략 최적화",
    "- GitHub: https://github.com/prgrms-aibe-devcourse/AIBE6_Project2_Team01",
    "- 기술: Java 21, Spring Boot 3.5, Spring Data JPA, QueryDSL, MySQL 8, Redis 7, GCP Storage, Docker",
    "",
    "페치 전략 분리로 프로필 목록 조회 쿼리 61회 -> 6회",
    "- 문제: 프로필 목록 20건 페이징 시 상세, 사이즈, 경력, 포트폴리오를 지연 로딩하면서 한 페이지당 쿼리 61회가 발생함.",
    "- 접근: 모든 연관관계를 fetch join 시 발생하는 MultipleBagFetchException과 페이징 붕괴를 방지하기 위해, 1:1 관계는 @EntityGraph로 조인 페치하고 1:N 컬렉션은 @BatchSize(100)을 적용해 IN 절 배치 로딩으로 분리함.",
    "- 성과: 1페이지 조회 쿼리를 61회에서 6회로 90% 단축하고, 페이징이 DB LIMIT/OFFSET에서 안전하게 처리되도록 구조를 개선함.",
    "",
    "────────────────────────────────────────────────────────────────────────────",
    "4. 뚜벅 (Ddubuk), 맞춤형 여행 플랫폼",
    "- 기간: 2026.03.22 ~ 2026.03.31 (10일)",
    "- 규모: 팀 5명, BE 5명",
    "- 역할: 팀장, 프론트엔드 UI/UX, 인증과 DB 흐름 설계",
    "- GitHub: https://github.com/SHINJAEHEE-DEV",
    "- 기술: Next.js 16, React 19, TypeScript, Supabase (PostgreSQL), Tailwind CSS",
    "",
    "PostgreSQL DB 트리거 기반 회원가입 프로필 생성 원자성 보장",
    "- 문제: 회원가입 시 클라이언트 비동기 매핑 지연으로 profiles 행 생성이 누락되어 외래키 제약 위반 500 에러가 간헐적으로 발생함.",
    "- 접근: 프로필 생성 책임을 DB 계층으로 이전하여 auth.users INSERT 시 public.profiles를 자동 생성하는 PostgreSQL 트리거 함수를 작성함.",
    "- 성과: 네트워크 단절이나 클라이언트 오류와 무관하게 DB 트랜잭션 레벨에서 프로필 생성이 100% 원자적으로 보장되도록 무결성을 확립함.",
    "",
    "06 COVER LETTER",
    "1. 대안을 다 써보고 나서 고르는 편입니다",
    "CatchEat 목록 API가 150 VU 부하에서 실패율 100%가 나왔을 때, 처음엔 커넥션 풀을 늘렸으나 대기 시간만 뒤로 지연되었습니다. fetch join으로 변경했을 때는 데이터 행이 급증해 페이징이 깨졌고, 캐싱은 빈번한 슬롯 상태 변경으로 인한 무효화 설계 복잡도가 높았습니다.",
    "Grafana에서 CPU 사용률이 13.9%로 여유로운 것을 확인한 후, 병목의 원인이 연산 부족이 아니라 과도한 DB 왕복(1,500회)과 커넥션 점유라는 점을 발견했습니다. 부가정보를 IN 절 일괄 집계로 변경해 DB 왕복을 상수화하자 실패율이 0%로 개선되고 응답 속도가 9.2배 단축되었습니다. 문제를 마주하면 감이 아닌 지표부터 확인하고, 각 대안의 한계와 비용을 비교표로 정리해 최적의 답을 찾습니다.",
    "",
    "2. 먼저 듣고, 근거로 설득합니다",
    "뚜벅 프로젝트에서 리뷰 기능을 두고 팀 내 의견이 나뉘었습니다. 담당 팀원은 코스 구간마다 경사, 계단, 그늘을 상세히 기록하길 원했고, 다른 팀원들은 작성 피로도와 일정을 이유로 전체 요약만 남기자고 했습니다. 저는 담당자의 의도와 가치를 먼저 경청한 뒤, 실제 모바일 작성 피로도 데이터와 남은 개발 일정, 화면 노출 범위를 근거로 제시해 핵심 항목을 간소화한 리뷰 폼으로 원만한 합의를 이끌어냈습니다.",
    "CatchEat 기획 초기에도 피드, 스토리, 채팅 등 SNS 기능 추가 제안에 대해 '음식 기록'이라는 핵심 정체성이 흐려질 수 있음을 논리적으로 설득하여 불필요한 스코프를 덜어내고 서비스 본질에 집중했습니다. 분위기에 휩쓸리지 않고 객관적 근거를 바탕으로 소통합니다.",
    "",
    "3. 현장 문제를 발견하고 기획부터 운영까지 완수합니다",
    "만화카페 카툰플러스 매장 현장에서 띄어쓰기 오탈자로 인한 검색 실패, 파편화된 수기 안내방송 및 입고 신청 업무, 매달 지출되는 외주 DB SaaS(Caspio) 고정 비용 문제를 직접 목격했습니다.",
    "이를 해결하기 위해 일일 데이터 규모와 트래픽을 정량 분석하여 Serverless Free Tier 기반의 '인프라 비용 $0 아키텍처'를 설계하고, 모바일 UI 시안과 PoC 검색 엔진을 직접 제작해 대표님을 설득했습니다. 그 결과 대표님의 비용 우려를 해소하고 3개 지점 전면 전환 승인을 획득했습니다.",
    "배포 후에도 피크 시간대 방송 입력이 번거롭다는 직원 피드백을 수렴해 6종 원클릭 즉시 방송 프리셋을 1일 만에 배포하고, 비회원 간편 신청 모달을 적용해 도서 신청 접수율을 크게 높였습니다. 비즈니스 문제를 주도적으로 발굴하고 엔드투엔드 개발과 현장 피드백 이터레이션을 통해 실질적인 가치를 창출하는 개발자입니다."
  ].join("\n");

  console.log("Inserting structured resume content...");
  await batchUpdateDoc(token, [
    {
      insertText: {
        location: { index: 1 },
        text: resumeLines
      }
    }
  ]);

  // Apply typography styling
  console.log("Applying typography styling...");
  const updatedDoc = await getDoc(token);
  const totalEnd = updatedDoc.body.content[updatedDoc.body.content.length - 1].endIndex;

  await batchUpdateDoc(token, [
    {
      updateTextStyle: {
        range: {
          startIndex: 1,
          endIndex: totalEnd - 1
        },
        textStyle: {
          weightedFontFamily: {
            fontFamily: "Arial"
          },
          fontSize: {
            magnitude: 10,
            unit: "PT"
          },
          foregroundColor: {
            color: {
              rgbColor: { red: 0.15, green: 0.15, blue: 0.15 }
            }
          }
        },
        fields: "weightedFontFamily,fontSize,foregroundColor"
      }
    }
  ]);

  console.log("Google Doc Resume successfully updated!");
  console.log(`Document URL: https://docs.google.com/document/d/${DOC_ID}/edit`);
}

main().catch(err => {
  console.error("Error updating Google Doc:", err);
  process.exit(1);
});
