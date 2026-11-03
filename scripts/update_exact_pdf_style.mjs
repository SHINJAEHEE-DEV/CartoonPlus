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

// Colors matching original PDF
const COLOR_NAVY = { red: 0.06, green: 0.23, blue: 0.44 }; // #0F3A70
const COLOR_BLUE = { red: 0.035, green: 0.41, blue: 0.85 }; // #0969DA
const COLOR_SKY = { red: 0.01, green: 0.52, blue: 0.78 }; // #0284C7
const COLOR_TEXT = { red: 0.14, green: 0.16, blue: 0.18 }; // #24292F
const COLOR_MUTED = { red: 0.4, green: 0.45, blue: 0.5 };

async function main() {
  console.log("Rebuilding Google Doc Resume with Exact Original Design & Polite Tone...");
  const token = await getAccessToken();

  const doc = await getDoc(token);
  const endIdx = doc.body.content[doc.body.content.length - 1].endIndex;

  if (endIdx > 2) {
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

  // Define resume elements
  const elements = [
    { type: "TITLE_NAME", text: "신재희 Shin Jae-hee" },
    { type: "TITLE_ROLE", text: "BACKEND DEVELOPER" },
    { type: "CATCHPHRASE", text: "문제의 원인을 지표로 확인하고, 대안을 비교해서 고른 이유를 설명하는 백엔드 개발자입니다." },
    { type: "CONTACT", text: "M 010-4176-3805  |  E asjh011969@gmail.com  |  G github.com/SHINJAEHEE-DEV" },
    { type: "EMPTY", text: "" },

    { type: "SECTION_HEADER", text: "01 ABOUT ME" },
    {
      type: "INTRO_PARAGRAPH",
      text: "Spring 기반 백엔드 개발자입니다. 인증/인가와 API 설계에 관심이 많습니다. SalesWorksKorea와 U+ 금곡대로점에서 약 1년의 영업과 고객 응대를 하면서 고객 요구를 파악하고 문제를 해결하는 일을 했고, 상대 의견을 먼저 듣고 근거를 가지고 설득하는 습관이 여기서 생겼습니다. 개발로 넘어와서는 그 습관을 “왜 이 방식인가”를 수치로 설명하는 데 쓰고 있습니다. 최근에는 만화카페 카툰플러스의 매장 운영 비효율을 직접 발굴하여 인프라 비용 $0 아키텍처와 3개 지점 자동화 시스템을 기획부터 배포·운영까지 완수했습니다."
    },
    { type: "EMPTY", text: "" },

    { type: "SECTION_HEADER", text: "02 CAREER" },
    { type: "CAREER_TITLE", text: "[SalesWorksKorea] : [영업 / CS] [2024.07 ~ 2025.04]" },
    { type: "BULLET", text: "- 역할 : [전문모금 캠페이너 및 팀 리더]" },
    { type: "BULLET", text: "- 규모 : [부산 지부 20인, 직속팀 3명]" },
    { type: "BULLET", text: "- 하는일 : 고객과 시민들에게 후원의 가치를 알리고 후원참여까지 안내" },
    { type: "BULLET", text: "- 특이사항 : 2024 40~50대 후원자 유치 비율 전국 1등 (유엔난민기구에서 상 수여)" },
    { type: "EMPTY", text: "" },
    { type: "CAREER_TITLE", text: "[U+ 금곡대로점(으뜸컴퍼니)] : [영업 / CS] [2025.05 ~ 2025.09]" },
    { type: "BULLET", text: "- 역할 : [고객 대면 상담 및 통신요금 설계]" },
    { type: "BULLET", text: "- 규모 : [6인]" },
    { type: "BULLET", text: "- 하는일 : 고객과 대면업무 및 상품판매, 통신요금 설계" },
    { type: "BULLET", text: "- 특이사항 : 서부산 2분기 CS 고객평가 3위" },
    { type: "EMPTY", text: "" },
    { type: "CAREER_SUBTITLE", text: "[개발 전환 계기 및 직무 연관성]" },
    { type: "BULLET", text: "- 수많은 대면 영업 및 CS 업무를 수행하며, 고객의 숨은 니즈를 정확히 파악하고 근거를 바탕으로 상대를 설득하는 커뮤니케이션 역량을 체득함." },
    { type: "BULLET", text: "- 경제적 기반을 마련하기 위해 현장 업무에 매진하면서도 개발에 대한 목표를 잃지 않음. 오프라인 대면 응대를 넘어, 소프트웨어라는 도구를 통해 현장의 비효율을 자동화하고 사용자에게 직관적인 경험(UX)과 안정적인 성능을 제공하고자 백엔드 개발로 전향함." },
    { type: "EMPTY", text: "" },

    { type: "SECTION_HEADER", text: "03 EDUCATION & CERTIFICATION" },
    { type: "BULLET_DOT", text: "•  프로그래머스 AI 백엔드 개발 6기 (2026.03 ~ 2026.08) : Java/Spring Boot 백엔드 설계와 구현, 성능 최적화, AWS/Docker 인프라, 무중단 배포, 현업 멘토 코드 리뷰, AI 모델 API 연동, 최종 우수 프로젝트 선정" },
    { type: "BULLET_DOT", text: "•  부산디지털대학교 컴퓨터공학과 (2024.08 졸업) : 학점 4.03 / 4.5" },
    { type: "BULLET_DOT", text: "•  정보처리기사 (2023.09 취득)" },
    { type: "EMPTY", text: "" },

    { type: "SECTION_HEADER", text: "04 TECH STACK" },
    { type: "TECH_ITEM", text: "•  Language: Java, TypeScript, SQL" },
    { type: "TECH_ITEM", text: "•  Backend: Spring Boot, Spring Data JPA, QueryDSL, Spring Security" },
    { type: "TECH_ITEM", text: "•  Auth: JWT, OAuth2, HttpOnly Cookie, Double-Submit CSRF" },
    { type: "TECH_ITEM", text: "•  Database: PostgreSQL, MySQL, Redis, Supabase" },
    { type: "TECH_ITEM", text: "•  Infra: Cloudflare Pages, AWS(EC2, ECR, S3), Docker, GitHub Actions, Nginx" },
    { type: "TECH_ITEM", text: "•  Observability: Actuator, Prometheus, Grafana, k6, JUnit 5, Vitest" },
    { type: "TECH_ITEM", text: "•  Frontend: Next.js, React, TypeScript, Tailwind CSS, Web Audio API" },
    { type: "TECH_ITEM", text: "•  Collaboration: Git, GitHub, Notion, Slack, Postman" },
    { type: "EMPTY", text: "" },

    { type: "SECTION_HEADER", text: "05 PROJECTS" },
    { type: "PROJECT_NAME", text: "카툰플러스 (CartoonPlus), 만화카페 매장 운영 자동화 및 통합 웹 플랫폼 – 3개 지점 실운영" },
    { type: "META", text: "- 기간: 2026.08 ~ 2026.09 (개인 프로젝트 / 실제 3개 지점 운영 중)" },
    { type: "META", text: "- 규모: 1인 개발 (기획, UI/UX, 풀스택, 인프라, 현장 배포 기여도 100%)" },
    { type: "META", text: "- 역할: 기획, 풀스택 개발, 인프라 구축, 운영 이터레이션" },
    { type: "META", text: "- GitHub: https://github.com/SHINJAEHEE-DEV/CartoonPlus" },
    { type: "META", text: "- 배포 링크: https://cartoonplus.pages.dev" },
    { type: "META", text: "- 기술: TypeScript, React 19, Vite, Tailwind CSS, Supabase (PostgreSQL, RLS), Cloudflare Pages (SSG), Web Audio API" },
    { type: "CASE_NAME", text: "1. 1:N 데이터 모델 정규화 및 검색 엔진 최적화: 검색 실패율 0%" },
    { type: "BULLET", text: "- 문제: 기존 단일 평면 테이블로 동일 도서가 권수별로 중복 노출되어(약 5,000건) 검색 가독성이 저하되고, 띄어쓰기가 일치하지 않으면 도서 검색이 실패함." },
    { type: "BULLET", text: "- 접근: 데이터베이스를 도서 메타(books)와 지점별 권수/위치(book_inventory)로 1:N 분리 정규화하고, 공백 제거 정규화(replace) 및 한글 초성/부분 일치 검색 RPC 함수를 구현함." },
    { type: "BULLET", text: "- 성과: 중복 도서 데이터를 통합하고 도서 검색 실패율 0%를 달성함. 검색 화면 내 서가 번호 뱃지 및 구역 배치도 UI를 제공하여 카운터 도서 위치 문의를 70% 감소시킴." },
    { type: "EMPTY", text: "" },
    { type: "CASE_NAME", text: "2. 웹 성능 최적화 및 Post-Build SSG: LCP 17.4s -> 2.5s, SEO 100점" },
    { type: "BULLET", text: "- 문제: 고용량 외부 이미지와 렌더 블로킹 폰트로 인해 모바일 LCP가 17.4초에 달하고 Lighthouse 모바일 성능 점수가 37점에 머물러 매장 현장 사용성이 크게 저하됨." },
    { type: "BULLET", text: "- 접근: 이미지를 WebP로 변환해 정적 번들링하고 fetchpriority=\"high\"를 적용함. 고정 비율 AspectRatio 박스로 레이아웃 흔들림(CLS 0.009)을 방어하고, 빌드 시점 지점별 정적 HTML을 사전 생성하는 커스텀 SSG 스크립트를 구축함." },
    { type: "BULLET", text: "- 성과: 모바일 LCP 17.4s → 2.5s (85.6% 단축), Lighthouse 성능 점수 37점 → 76점 향상, 지점별 포털 검색엔진 노출을 위한 SEO 점수 100점 만점을 달성함." },
    { type: "EMPTY", text: "" },

    { type: "PROJECT_NAME", text: "CatchEat (캐치잇), 음식 기록과 챌린지 소셜 플랫폼 – 프로그래머스 우수 프로젝트 선정" },
    { type: "META", text: "- 기간: 2026.07 ~ 2026.08 (6주)" },
    { type: "META", text: "- 규모: 팀 5명, BE 5명" },
    { type: "META", text: "- 역할: 챌린지 도메인, 인증/인가, 어드민" },
    { type: "META", text: "- GitHub: https://github.com/prgrms-aibe-devcourse/AIBE6_FinalProject_Team02_BE" },
    { type: "META", text: "- 기술: Java, Spring Boot, JPA, QueryDSL, PostgreSQL, Redis, AWS(S3, EC2, ECR), Docker, GitHub Actions, Nginx, Prometheus, Grafana" },
    { type: "EMPTY", text: "" },
    { type: "CASE_NAME", text: "1. 리프레시 토큰 동시 재발급 경쟁 해결: 회전 승자 30/32 -> 1/32" },
    { type: "BULLET", text: "- 문제: 한 화면에서 여러 API가 동시에 401을 받을 시 병렬 재발급이 같은 저장값을 읽고 각자 새 토큰을 저장함. 마지막 하나만 남아 쿠키와 서버 상태가 어긋나며 예고 없는 로그아웃이 불규칙하게 재현됨." },
    { type: "BULLET", text: "- 접근: 백엔드는 Redis Lua 스크립트로 조회, 비교, 교체를 단일 원자 연산(CAS)으로 묶음. 프론트는 single-flight로 진행 중인 재발급을 공유해 호출을 1회로 합침. 정상 경쟁의 패자는 유예창 안에서 access만 받도록 처리하여 오탐 로그아웃을 방어함." },
    { type: "BULLET", text: "- 성과: 동시 32요청 재현 테스트에서 회전 승자를 30/32에서 1/32로 개선. 쿠키와 Redis 간의 불일치를 해소하고 다기기 동시 접속 세션을 독립적으로 유지함." },
    { type: "EMPTY", text: "" },
    { type: "CASE_NAME", text: "2. 목록 조회 N+1 제거: 150 VU에서 실패율 100% -> 0%, p95 30s -> 3.25s" },
    { type: "BULLET", text: "- 문제: 내 챌린지 목록이 카드마다 슬롯 수, 참여 여부, 해금 수를 따로 조회해 요청 하나에 쿼리가 약 1,500개 발생. 150 VU 부하에서 HikariCP 풀(10)이 고갈돼 실패율 100%, CPU는 13.9% 수준에 머무름." },
    { type: "BULLET", text: "- 접근: 풀 증설, fetch join, 캐시를 검토했으나 대기만 늦추거나 페이징이 깨지는 등 근본적 해결이 불가함. 부가정보를 IN(:ids) + GROUP BY로 한 번에 집계해 Map으로 받고, 루프 안 DB 호출을 0으로 개선하여 왕복을 상수 타임으로 최적화함." },
    { type: "BULLET", text: "- 성과: 동일 부하에서 실패율 100% -> 0%, p95 응답속도 30s -> 3.25s, 처리량 3.6 -> 33.7 RPS로 개선. Grafana를 통해 전후 지표를 정량적으로 확인함." },
    { type: "EMPTY", text: "" },

    { type: "PROJECT_NAME", text: "MODLE (모들), 프리랜서 모델과 디자이너 매칭 플랫폼" },
    { type: "META", text: "- 기간: 2026.06.11 ~ 2026.06.24 (2주)" },
    { type: "META", text: "- 규모: 팀 5명, BE 5명" },
    { type: "META", text: "- 역할: 프로필 도메인 전담" },
    { type: "META", text: "- GitHub: https://github.com/prgrms-aibe-devcourse/AIBE6_Project2_Team01" },
    { type: "META", text: "- 기술: Java 21, Spring Boot 3.5, Spring Data JPA, QueryDSL, MySQL 8, Redis 7, GCP Storage, Docker" },
    { type: "EMPTY", text: "" },
    { type: "CASE_NAME", text: "페치 전략 분리로 프로필 목록 조회 쿼리 61회 -> 6회" },
    { type: "BULLET", text: "- 문제: 프로필 목록을 20건씩 페이징할 때 상세, 사이즈, 경력, 포트폴리오를 지연 로딩하면서 한 페이지에 쿼리 61회가 발생함." },
    { type: "BULLET", text: "- 접근: 모든 연관관계를 fetch join 시 컬렉션 2개 이상에서 MultipleBagFetchException이 발생하고 페이징이 불가능해짐. 카디널리티별로 전략을 분리하여 1:1은 @EntityGraph로 조인 페치, 1:N 컬렉션은 @BatchSize를 적용해 IN 절 배치 로딩으로 처리함." },
    { type: "BULLET", text: "- 성과: 한 페이지 조회 쿼리를 61회에서 6회로 최적화. 컬렉션이 늘어도 컬렉션 수만큼만 쿼리가 늘어나고, 페이징이 DB에서 처리되어 데이터 건수가 늘어도 성능이 선형적으로 악화되지 않음." },
    { type: "EMPTY", text: "" },

    { type: "PROJECT_NAME", text: "뚜벅 (Ddubuk), 맞춤형 여행 플랫폼" },
    { type: "META", text: "- 기간: 2026.03.22 ~ 2026.03.31 (10일)" },
    { type: "META", text: "- 규모: 팀 5명, BE 5명" },
    { type: "META", text: "- 역할: 팀장, 프론트엔드 UI/UX, 인증과 DB 흐름" },
    { type: "META", text: "- GitHub: https://github.com/SHINJAEHEE-DEV" },
    { type: "META", text: "- 기술: Next.js 16, React 19, TypeScript, Supabase, Tailwind CSS" },
    { type: "EMPTY", text: "" },
    { type: "CASE_NAME", text: "회원가입 시 외래키 제약 오류 해결" },
    { type: "BULLET", text: "- 문제: 회원가입 때 비동기 메타데이터 매핑이 지연되어 profiles 생성이 누락되고 외래키 제약 위반 에러가 발생함." },
    { type: "BULLET", text: "- 접근: 프로필 생성 로직을 DB 레벨로 이관하여 auth.users INSERT 시 public.profiles를 자동 생성하는 트리거와 함수를 작성함." },
    { type: "BULLET", text: "- 성과: 네트워크나 애플리케이션 런타임 오류와 무관하게 프로필 생성이 원자성(Atomicity)을 가지고 보장됨." },
    { type: "EMPTY", text: "" },

    { type: "SECTION_HEADER", text: "06 COVER LETTER" },
    { type: "COVER_TITLE", text: "1. 현장 문제를 발견하고 기획부터 운영까지 완수합니다" },
    {
      type: "COVER_PARAGRAPH",
      text: "만화카페 카툰플러스 매장 현장에서 근무하며 띄어쓰기 오탈자로 인한 검색 실패, 파편화된 수기 안내방송 및 입고 신청 업무, 그리고 매달 지출되는 외주 DB SaaS(Caspio) 고정 비용 문제를 직접 목격했습니다.\n\n이를 해결하기 위해 일일 데이터 규모와 트래픽을 정량 분석하여 Serverless Free Tier 기반의 '인프라 비용 $0 아키텍처'를 설계하고, 사용자 웹·모바일 및 관리자 콘솔 화면 디자인 와이어프레임과 개선 기획서를 직접 작성해 대표님을 설득했습니다. 그 결과 대표님의 비용과 일정 우려를 해소하고 3개 지점 전면 전환 승인을 획득했습니다.\n\n배포 후에도 피크 시간대 방송 입력이 번거롭다는 현장 직원 피드백을 수렴해 6종 원클릭 즉시 방송 프리셋을 1일 만에 배포하고, 비회원 간편 신청 모달을 적용해 도서 신청 접수율을 크게 높였습니다. 비즈니스 문제를 주도적으로 발굴하고 엔드투엔드 개발과 현장 피드백 이터레이션을 통해 실질적인 사용자 가치를 만들어가는 개발자입니다."
    },
    { type: "EMPTY", text: "" },
    { type: "COVER_TITLE", text: "2. 대안을 다 써보고 나서 고르는 편입니다" },
    {
      type: "COVER_PARAGRAPH",
      text: "CatchEat 목록 API가 150 VU 부하에서 실패율 100%가 나왔을 때, 처음엔 커넥션 풀을 늘렸습니다. 대기만 늦춰졌습니다. fetch join으로 바꿨더니 행이 불어나고 페이징이 깨졌습니다. 캐시는 무효화 설계가 더 어려웠습니다.\n\nGrafana에서 CPU가 13.9%로 노는 걸 보고서야 병목이 연산이 아니라 커넥션 점유 시간이라는 걸 알았고, 그때부터 왕복 수를 줄이는 쪽으로 방향을 바꿨습니다. IN 절 일괄 집계로 왕복을 상수로 만들자 실패율이 0%가 됐습니다. 지금은 문제를 만나면 지표부터 보고, 대안은 해본 결과와 함께 표로 남깁니다."
    }
  ];

  // Assemble full text
  let fullText = "";
  const ranges = [];

  for (const item of elements) {
    const start = fullText.length + 1;
    fullText += item.text + "\n";
    const end = fullText.length + 1;
    ranges.push({
      ...item,
      startIndex: start,
      endIndex: end
    });
  }

  // 1. Insert text
  console.log("Inserting text into Google Doc...");
  await batchUpdateDoc(token, [
    {
      insertText: {
        location: { index: 1 },
        text: fullText
      }
    }
  ]);

  // 2. Base styling (Arial, 10pt, #24292F)
  const styleRequests = [
    {
      updateTextStyle: {
        range: { startIndex: 1, endIndex: fullText.length + 1 },
        textStyle: {
          weightedFontFamily: { fontFamily: "Arial" },
          fontSize: { magnitude: 10, unit: "PT" },
          foregroundColor: { color: { rgbColor: COLOR_TEXT } }
        },
        fields: "weightedFontFamily,fontSize,foregroundColor"
      }
    }
  ];

  // 3. Precise styling per element matching original PDF
  for (const r of ranges) {
    if (r.type === "TITLE_NAME") {
      styleRequests.push({
        updateTextStyle: {
          range: { startIndex: r.startIndex, endIndex: r.endIndex - 1 },
          textStyle: {
            fontSize: { magnitude: 22, unit: "PT" },
            bold: false,
            foregroundColor: { color: { rgbColor: COLOR_NAVY } }
          },
          fields: "fontSize,bold,foregroundColor"
        }
      });
      // Bold just the Korean name
      styleRequests.push({
        updateTextStyle: {
          range: { startIndex: r.startIndex, endIndex: r.startIndex + 3 },
          textStyle: { bold: true },
          fields: "bold"
        }
      });
    } else if (r.type === "TITLE_ROLE") {
      styleRequests.push({
        updateTextStyle: {
          range: { startIndex: r.startIndex, endIndex: r.endIndex - 1 },
          textStyle: {
            fontSize: { magnitude: 11, unit: "PT" },
            bold: true,
            foregroundColor: { color: { rgbColor: COLOR_BLUE } }
          },
          fields: "fontSize,bold,foregroundColor"
        }
      });
    } else if (r.type === "CATCHPHRASE") {
      styleRequests.push({
        updateTextStyle: {
          range: { startIndex: r.startIndex, endIndex: r.endIndex - 1 },
          textStyle: {
            fontSize: { magnitude: 10, unit: "PT" },
            foregroundColor: { color: { rgbColor: COLOR_TEXT } }
          },
          fields: "fontSize,foregroundColor"
        }
      });
    } else if (r.type === "CONTACT") {
      // Style M, E, G in bold blue
      const mIdx = r.text.indexOf("M ");
      const eIdx = r.text.indexOf("E ");
      const gIdx = r.text.indexOf("G ");
      if (mIdx !== -1) {
        styleRequests.push({
          updateTextStyle: {
            range: { startIndex: r.startIndex + mIdx, endIndex: r.startIndex + mIdx + 1 },
            textStyle: { bold: true, foregroundColor: { color: { rgbColor: COLOR_BLUE } } },
            fields: "bold,foregroundColor"
          }
        });
      }
      if (eIdx !== -1) {
        styleRequests.push({
          updateTextStyle: {
            range: { startIndex: r.startIndex + eIdx, endIndex: r.startIndex + eIdx + 1 },
            textStyle: { bold: true, foregroundColor: { color: { rgbColor: COLOR_BLUE } } },
            fields: "bold,foregroundColor"
          }
        });
      }
      if (gIdx !== -1) {
        styleRequests.push({
          updateTextStyle: {
            range: { startIndex: r.startIndex + gIdx, endIndex: r.startIndex + gIdx + 1 },
            textStyle: { bold: true, foregroundColor: { color: { rgbColor: COLOR_BLUE } } },
            fields: "bold,foregroundColor"
          }
        });
        const ghUrlIdx = r.text.indexOf("github.com");
        if (ghUrlIdx !== -1) {
          styleRequests.push({
            updateTextStyle: {
              range: { startIndex: r.startIndex + ghUrlIdx, endIndex: r.endIndex - 1 },
              textStyle: {
                underline: true,
                foregroundColor: { color: { rgbColor: COLOR_BLUE } },
                link: { url: "https://github.com/SHINJAEHEE-DEV" }
              },
              fields: "underline,foregroundColor,link"
            }
          });
        }
      }
    } else if (r.type === "SECTION_HEADER") {
      // Section header font: 12.5pt, bold, Navy
      styleRequests.push({
        updateTextStyle: {
          range: { startIndex: r.startIndex, endIndex: r.endIndex - 1 },
          textStyle: {
            fontSize: { magnitude: 12.5, unit: "PT" },
            bold: true,
            foregroundColor: { color: { rgbColor: COLOR_NAVY } }
          },
          fields: "fontSize,bold,foregroundColor"
        }
      });
      // Bottom border line for section header
      styleRequests.push({
        updateParagraphStyle: {
          range: { startIndex: r.startIndex, endIndex: r.endIndex - 1 },
          paragraphStyle: {
            borderBottom: {
              color: { color: { rgbColor: COLOR_NAVY } },
              width: { magnitude: 1.5, unit: "PT" },
              padding: { magnitude: 2, unit: "PT" },
              dashStyle: "SOLID"
            },
            spaceAbove: { magnitude: 8, unit: "PT" },
            spaceBelow: { magnitude: 4, unit: "PT" }
          },
          fields: "borderBottom,spaceAbove,spaceBelow"
        }
      });
    } else if (r.type === "CAREER_TITLE") {
      styleRequests.push({
        updateTextStyle: {
          range: { startIndex: r.startIndex, endIndex: r.endIndex - 1 },
          textStyle: {
            bold: true,
            foregroundColor: { color: { rgbColor: COLOR_NAVY } }
          },
          fields: "bold,foregroundColor"
        }
      });
    } else if (r.type === "CAREER_SUBTITLE") {
      styleRequests.push({
        updateTextStyle: {
          range: { startIndex: r.startIndex, endIndex: r.endIndex - 1 },
          textStyle: {
            bold: true,
            foregroundColor: { color: { rgbColor: COLOR_SKY } }
          },
          fields: "bold,foregroundColor"
        }
      });
    } else if (r.type === "PROJECT_NAME") {
      styleRequests.push({
        updateTextStyle: {
          range: { startIndex: r.startIndex, endIndex: r.endIndex - 1 },
          textStyle: {
            fontSize: { magnitude: 11, unit: "PT" },
            bold: true,
            foregroundColor: { color: { rgbColor: COLOR_NAVY } }
          },
          fields: "fontSize,bold,foregroundColor"
        }
      });
    } else if (r.type === "CASE_NAME" || r.type === "COVER_TITLE") {
      styleRequests.push({
        updateTextStyle: {
          range: { startIndex: r.startIndex, endIndex: r.endIndex - 1 },
          textStyle: {
            bold: true,
            foregroundColor: { color: { rgbColor: COLOR_TEXT } }
          },
          fields: "bold,foregroundColor"
        }
      });
    } else if (r.type === "META") {
      // Blue highlight for labels in META
      const colonIdx = r.text.indexOf(":");
      if (colonIdx !== -1) {
        styleRequests.push({
          updateTextStyle: {
            range: { startIndex: r.startIndex, endIndex: r.startIndex + colonIdx + 1 },
            textStyle: { foregroundColor: { color: { rgbColor: COLOR_SKY } } },
            fields: "foregroundColor"
          }
        });
      }
      if (r.text.includes("https://")) {
        const urlStart = r.text.indexOf("https://");
        const url = r.text.slice(urlStart).trim();
        styleRequests.push({
          updateTextStyle: {
            range: { startIndex: r.startIndex + urlStart, endIndex: r.endIndex - 1 },
            textStyle: {
              underline: true,
              foregroundColor: { color: { rgbColor: COLOR_BLUE } },
              link: { url }
            },
            fields: "underline,foregroundColor,link"
          }
        });
      }
    }

    // Bold labels like "AI 백엔드 개발 6기", "Language:", "Backend:", "문제:", "접근:", "성과:"
    if (r.text.startsWith("- 문제:")) {
      styleRequests.push({
        updateTextStyle: {
          range: { startIndex: r.startIndex, endIndex: r.startIndex + 5 },
          textStyle: { bold: true },
          fields: "bold"
        }
      });
    } else if (r.text.startsWith("- 접근:")) {
      styleRequests.push({
        updateTextStyle: {
          range: { startIndex: r.startIndex, endIndex: r.startIndex + 5 },
          textStyle: { bold: true },
          fields: "bold"
        }
      });
    } else if (r.text.startsWith("- 성과:")) {
      styleRequests.push({
        updateTextStyle: {
          range: { startIndex: r.startIndex, endIndex: r.startIndex + 5 },
          textStyle: { bold: true },
          fields: "bold"
        }
      });
    } else if (r.type === "TECH_ITEM") {
      const colonIdx = r.text.indexOf(":");
      if (colonIdx !== -1) {
        styleRequests.push({
          updateTextStyle: {
            range: { startIndex: r.startIndex, endIndex: r.startIndex + colonIdx + 1 },
            textStyle: { bold: true, foregroundColor: { color: { rgbColor: COLOR_NAVY } } },
            fields: "bold,foregroundColor"
          }
        });
      }
    }
  }

  // Execute in batches
  console.log(`Executing ${styleRequests.length} styling requests...`);
  const chunkSize = 40;
  for (let i = 0; i < styleRequests.length; i += chunkSize) {
    const chunk = styleRequests.slice(i, i + chunkSize);
    await batchUpdateDoc(token, chunk);
  }

  console.log("Successfully rebuilt Google Doc resume matching exact PDF style and polite tone!");
  console.log(`Document URL: https://docs.google.com/document/d/${DOC_ID}/edit`);
}

main().catch(err => {
  console.error("Error updating resume:", err);
  process.exit(1);
});
