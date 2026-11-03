import fs from "node:fs";

const CRED_PATH = process.env.HOME + "/.config/mcp-google-slides/credentials.json";
const CLIENT_PATH = process.env.HOME + "/.config/mcp-google-slides/client.json";
const DOC_ID = "1B7dKffJfG2f_4cyqIQfciSVSLTjdKSKv-zKNw5HKkNQ";

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
  console.log("Starting Google Doc Resume Update...");
  const token = await getAccessToken();

  // 1. Get current document
  const doc = await getDoc(token);
  const endIdx = doc.body.content[doc.body.content.length - 1].endIndex;
  console.log("Current document endIndex:", endIdx);

  // 2. Clear existing document content if > 2
  if (endIdx > 2) {
    console.log("Deleting old placeholder content...");
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

  // 3. Prepare complete resume text in strict nominal written style (~함, ~임, ~음) and no AI buzzwords
  const resumeText = [
    "신재희 | Shin Jae-hee",
    "Backend & Full-stack Developer",
    "이메일: asjh011969@gmail.com | 연락처: 010-4176-3805 | GitHub: github.com/SHINJAEHEE-DEV",
    "포트폴리오 웹사이트: shinjaehee-dev.github.io/portfolio-website",
    "",
    "────────────────────────────────────────────────────────────────────────────",
    "ABOUT ME",
    "────────────────────────────────────────────────────────────────────────────",
    "• 문제의 근본 원인을 수치와 지표로 확인하고, 여러 기술 대안의 비용과 한계를 비교 검증하여 최적의 아키텍처를 선택하는 개발자임.",
    "• 매장 현장의 비효율적 수기 업무와 UX 문제를 주도적으로 발굴하고, 인프라 비용 $0 설계를 기반으로 의사결정권자를 설득해 3개 지점 전면 전환을 이끌어낸 비즈니스 실행력을 보유함.",
    "• CS 및 팀 리딩 경험을 바탕으로 기술적 복잡성을 사용자와 동료의 관점에서 명확하게 소통하고, 실사용자 VOC를 신속하게 프로덕트에 반영하는 협업 태도를 지향함.",
    "",
    "────────────────────────────────────────────────────────────────────────────",
    "KEY PROJECTS",
    "────────────────────────────────────────────────────────────────────────────",
    "1. 카툰플러스 (CartoonPlus) — 매장 운영 자동화 및 통합 웹 플랫폼",
    "기간: 2026.08 ~ 2026.09 (개인 프로젝트 / 실제 3개 지점 운영 중)",
    "역할: 기획, UI/UX 설계, 풀스택 개발, 인프라 구축, 현장 운영 이터레이션 (기여도 100%)",
    "스택: TypeScript, React 19, Vite, Tailwind CSS, Supabase (PostgreSQL, RLS), Cloudflare Pages (SSG), Web Audio API",
    "",
    "주요 성과 및 구현 내용:",
    "• 비즈니스 기획 및 경영진 설득: 매장 현장의 수기 업무 병목과 검색 UX 문제를 발굴하고, PoC 디자인 및 비용 $0 인프라 설계를 기반으로 대표님을 설득해 3개 지점(홍대·잠실·서울대입구) 전면 전환 승인 획득.",
    "• TCO 100% 절감 (고정비 $0화): 기존 유료 DB SaaS(Caspio) 구독료를 제거하고 Supabase Free Tier와 Cloudflare Pages Edge 배포를 결합하여 연 36만 원 절감 및 지점 확장 한계비용 $0 달성.",
    "• 웹 성능 및 SEO 최적화: 이미지 WebP 변환 및 정적 번들링, fetchpriority 적용으로 모바일 LCP 17.4s → 2.5s 단축(85.6% 개선), Post-Build SSG 렌더링을 구축하여 지점별 SEO 점수 100점 만점 달성.",
    "• 1:N 데이터 모델 정규화 및 검색 엔진 구축: 단일 평면 테이블의 5,000건 중복 데이터를 도서 메타(1)와 지점별 재고/권수(N)로 분리 정규화하고, 공백 무시 및 한글 초성 검색 RPC를 구축하여 검색 실패율 0% 달성.",
    "• 매장 운영 자동화: Web Audio API 기반 무중단 정기 안내방송 스케줄러와 비회원 도서 입고 신청/처리 파이프라인을 구축하여 일일 수기 업무 공수 90% 감축 (일 30분 → 3분).",
    "• 현장 직원 VOC 기반 이터레이션: 현장 배포 후 피크 시간대 방송 입력 편의를 위해 6종 원클릭 즉시 방송 프리셋을 1일 만에 신속 추가하고, 비회원 간편 신청 모달을 적용하여 도서 신청 처리 건수 주 2건 → 18건 증가.",
    "",
    "────────────────────────────────────────────────────────────────────────────",
    "2. CatchEat (캐치잇) — 음식 기록 및 챌린지 소셜 플랫폼",
    "기간: 2026.07 ~ 2026.08 (5인 팀 프로젝트 / 프로그래머스 AI 백엔드 6기 우수 프로젝트 선정)",
    "역할: 챌린지 도메인 전반, 인증/인가 보안, 어드민, 부하 테스트 및 성능 최적화",
    "스택: Java 21, Spring Boot 3.3, Spring Data JPA, QueryDSL, PostgreSQL, Redis, Docker, k6, Prometheus, Grafana",
    "",
    "주요 성과 및 구현 내용:",
    "• Redis Lua CAS 기반 토큰 동시 재발급 원자화: 동시 401 수신 시 발생하는 토큰 탈취 오탐 레이스 컨디션을 프론트 Single-Flight와 백엔드 Redis Lua CAS 단일 연산으로 해결하여 동시 32개 요청 시 회전 승자 수를 30/32에서 1/32로 단일 원자화함.",
    "• N+1 쿼리 최적화 및 150 VU 부하 해결: 501개 챌린지 목록 조회 시 1,500회 발생하던 DB 쿼리를 IN절 GROUP BY 일괄 집계 및 Map O(1) 룩업으로 전환하여 쿼리 수를 3회로 단축함. 150 VU 부하 테스트 실패율 100% → 0% 달성, p95 응답 속도 30s → 3.25s (9.2배 단축).",
    "• 무상태 Double-Submit Cookie CSRF 보안 구축: HttpOnly 쿠키의 자동 전송 취약점을 __Host- 접두사와 Spring Security 커스텀 필터로 보완하여 서버 세션 메모리 오버헤드 0 Byte를 유지하며 서드파티 위조 요청을 100% 차단함.",
    "• 비관적 락(PESSIMISTIC_WRITE) 기반 완주 동시성 제어: 동시 다중 슬롯 해금 시 완주 판정과 리워드 중복 지급을 비관적 락으로 방지하고, S3 파일 삭제는 @TransactionalEventListener(AFTER_COMMIT)으로 비동기 분리하여 데이터 무결성을 보장함.",
    "",
    "────────────────────────────────────────────────────────────────────────────",
    "3. MODLE (모들) — 프리랜서 모델과 디자이너 매칭 플랫폼",
    "기간: 2026.06.11 ~ 2026.06.24 (5인 팀 프로젝트)",
    "역할: 프로필 도메인 CRUD, 카디널리티별 페치 전략 수립, GCP Storage 이미지 업로드",
    "스택: Java 21, Spring Boot 3.5, Spring Data JPA, QueryDSL, MySQL 8.0, Redis 7, GCP Storage, Docker",
    "",
    "주요 성과 및 구현 내용:",
    "• 카디널리티별 페치 전략 분리: 1:1 상세 엔티티는 @EntityGraph 조인 페치, 1:N 컬렉션(경력, 포트폴리오)은 @BatchSize(100) IN절 로딩으로 분리하여 MultipleBagFetchException을 방지하고 1페이지(20건) 조회 쿼리를 61회에서 6회로 90% 단축함.",
    "",
    "────────────────────────────────────────────────────────────────────────────",
    "4. 뚜벅 (Ddubuk) — 맞춤형 도보 여행 코스 플랫폼",
    "기간: 2026.03.22 ~ 2026.03.31 (5인 팀 프로젝트 / 팀장)",
    "역할: 팀장 리드, Next.js 16 UI/UX, Supabase PostgreSQL 데이터 흐름 설계",
    "스택: Next.js 16, React 19, TypeScript, Supabase (PostgreSQL), Tailwind CSS",
    "",
    "주요 성과 및 구현 내용:",
    "• PostgreSQL DB 트리거 기반 회원가입 원자성 보장: 클라이언트 비동기 호출 지연으로 발생하던 프로필 행 누락과 외래키 오류를 PostgreSQL 트리거 함수로 이전하여 DB 트랜잭션 레벨에서 100% 원자적 생성을 보장함.",
    "",
    "────────────────────────────────────────────────────────────────────────────",
    "SKILLS & CAPABILITIES",
    "────────────────────────────────────────────────────────────────────────────",
    "• Backend & Framework: Java 17/21, Spring Boot 3.x, Spring Data JPA, QueryDSL, Spring Security, TypeScript, React 19",
    "• Database & Cache: PostgreSQL, MySQL 8.0, Redis 7.x, Supabase (RLS, Edge RPC)",
    "• Infra & DevOps: Cloudflare Pages, Docker, AWS (EC2, S3, ECR), GitHub Actions, Nginx",
    "• Observability & Testing: Prometheus, Grafana, k6, JUnit 5, Vitest",
    "",
    "────────────────────────────────────────────────────────────────────────────",
    "CAREER & EXPERIENCE",
    "────────────────────────────────────────────────────────────────────────────",
    "• SalesWorksKorea (2024.07 ~ 2025.04) — 전문모금 캠페이너 및 팀 리더 (직속 팀 3인 / 부산 지부 20인)",
    "  - 국제기구/NGO 공익 캠페인 정기 후원 유치 및 팀 성과 관리",
    "  - 2024년 40~50대 후원자 유치 비율 전국 1등 달성 (유엔난민기구 표창)",
    "  - 정량 데이터와 고객 니즈 경청을 기반으로 한 의사결정 및 소통 역량 체득",
    "",
    "• U+ 금곡대로점 / 으뜸컴퍼니 (2025.05 ~ 2025.09) — 고객 대면 상담 및 통신요금 설계",
    "  - 고객 통신 사용 패턴 분석 및 맞춤형 요금제/결합 상품 설계, CS 전담",
    "  - 서부산 2분기 CS 고객평가 3위 달성",
    "  - 복잡한 기술/요금 구조를 사용자 관점에서 알기 쉽게 설명하는 커뮤니케이션 체화",
    "",
    "────────────────────────────────────────────────────────────────────────────",
    "EDUCATION & CERTIFICATIONS",
    "────────────────────────────────────────────────────────────────────────────",
    "• 프로그래머스 AI 백엔드 데브코스 6기 (2026.03 ~ 2026.08) — Java/Spring 백엔드 과정 수료 / 우수 프로젝트 선정",
    "• 부산디지털대학교 컴퓨터공학과 학사 (2024.08 졸업) — 학점 4.03 / 4.5",
    "• 정보처리기사 자격증 (2023.09 취득) — 한국산업인력공단"
  ].join("\n");

  console.log("Inserting new formatted resume content...");
  await batchUpdateDoc(token, [
    {
      insertText: {
        location: { index: 1 },
        text: resumeText
      }
    }
  ]);

  // Apply clean typography formatting (font: Arial, clean line spacing)
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
