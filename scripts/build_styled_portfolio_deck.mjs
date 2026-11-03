import fs from 'fs';
import path from 'path';

const PRESENTATION_ID = '1TWE_1zE7jF0Jmxlr9uYyqKGleae4EsUWAla2-Ivym5A';
const CREDENTIALS_PATH = path.join(process.env.HOME, '.config/mcp-google-slides/credentials.json');
const CLIENT_PATH = path.join(process.env.HOME, '.config/mcp-google-auth/client.json');

const COLORS = {
  yellow: { red: 0.996, green: 0.851, blue: 0.263 },       // #FED943 (Signature Brand Yellow)
  yellowLight: { red: 1.0, green: 0.965, blue: 0.835 },   // #FFF6D5
  creamBg: { red: 0.973, green: 0.965, blue: 0.941 },      // #F8F6F0 (Clean Warm Cream)
  cardWhite: { red: 1.0, green: 1.0, blue: 1.0 },          // #FFFFFF
  panelIvory: { red: 0.992, green: 0.984, blue: 0.961 },   // #FDFCF5
  dark: { red: 0.118, green: 0.161, blue: 0.231 },          // #1E293B (Deep Slate Dark)
  darkPure: { red: 0.08, green: 0.08, blue: 0.08 },        // #141414
  textMain: { red: 0.118, green: 0.161, blue: 0.231 },      // #1E293B
  textMuted: { red: 0.392, green: 0.455, blue: 0.545 },     // #64748B
  textLight: { red: 0.94, green: 0.95, blue: 0.96 },
  green: { red: 0.02, green: 0.588, blue: 0.412 },         // #059669 (Emerald Green)
  gold: { red: 0.706, green: 0.325, blue: 0.039 },         // #B45309 (Deep Gold)
  red: { red: 0.882, green: 0.114, blue: 0.282 },          // #E11D48 (Rose Red)
  borderMain: { red: 0.118, green: 0.161, blue: 0.231 },    // #1E293B
};

async function getAccessToken() {
  const creds = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
  const now = Date.now();
  if (creds.expires_at && now < creds.expires_at - 60000) {
    return creds.access_token;
  }
  const clientInfo = JSON.parse(fs.readFileSync(CLIENT_PATH, 'utf8')).installed;
  const params = new URLSearchParams({
    client_id: clientInfo.client_id,
    client_secret: clientInfo.client_secret,
    refresh_token: creds.refresh_token,
    grant_type: 'refresh_token',
  });
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });
  const tokenData = await res.json();
  if (!tokenData.access_token) {
    throw new Error('Failed to refresh token: ' + JSON.stringify(tokenData));
  }
  creds.access_token = tokenData.access_token;
  creds.expires_at = Date.now() + tokenData.expires_in * 1000;
  fs.writeFileSync(CREDENTIALS_PATH, JSON.stringify(creds, null, 2));
  return tokenData.access_token;
}

async function executeBatchUpdate(token, requests) {
  const res = await fetch(`https://slides.googleapis.com/v1/presentations/${PRESENTATION_ID}:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ requests }),
  });
  const data = await res.json();
  if (data.error) {
    throw new Error('BatchUpdate failed: ' + JSON.stringify(data.error));
  }
  return data;
}

async function uploadImageToDrive(token, localPath) {
  const fileBytes = fs.readFileSync(localPath);
  const metadata = {
    name: 'slides_asset_' + Date.now() + path.extname(localPath),
    mimeType: localPath.endsWith('.png') ? 'image/png' : 'image/jpeg',
  };

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', new Blob([fileBytes], { type: metadata.mimeType }));

  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const fileData = await res.json();
  const fileId = fileData.id;

  await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ role: 'reader', type: 'anyone' }),
  });

  return { fileId, webUrl: `https://lh3.googleusercontent.com/d/${fileId}` };
}

async function main() {
  console.log('Obtaining access token...');
  const token = await getAccessToken();

  console.log('Fetching presentation details...');
  const presRes = await fetch(`https://slides.googleapis.com/v1/presentations/${PRESENTATION_ID}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const pres = await presRes.json();
  console.log(`Current slide count: ${pres.slides?.length}`);

  console.log('Uploading assets to Drive...');
  const mascotLogoPath = path.resolve('public/assets/mascot/mascot_logo_circle.png');
  const mascotReadingPath = path.resolve('public/assets/mascot/mascot_reading.png');
  const oldLighthousePath = path.resolve('docs/assets/lighthouse/old-home-mobile-1.png');
  const newLighthousePath = path.resolve('docs/assets/lighthouse/new-home-mobile-1.png');

  const mascotLogo = fs.existsSync(mascotLogoPath) ? await uploadImageToDrive(token, mascotLogoPath) : null;
  const mascotReading = fs.existsSync(mascotReadingPath) ? await uploadImageToDrive(token, mascotReadingPath) : null;
  const oldLh = fs.existsSync(oldLighthousePath) ? await uploadImageToDrive(token, oldLighthousePath) : null;
  const newLh = fs.existsSync(newLighthousePath) ? await uploadImageToDrive(token, newLighthousePath) : null;

  console.log('Rebuilding 13 slides in concise written tone without AI buzzwords...');

  const TOTAL_SLIDES = 13;
  const requests = [];
  const slideIds = [];
  for (let i = 1; i <= TOTAL_SLIDES; i++) {
    const sId = `v5_clean_slide_${i}_${Date.now()}`;
    slideIds.push(sId);
    requests.push({
      createSlide: {
        objectId: sId,
        insertionIndex: i - 1,
        slideLayoutReference: { predefinedLayout: 'BLANK' },
      },
    });
  }

  for (const oldSlide of pres.slides || []) {
    requests.push({ deleteObject: { objectId: oldSlide.objectId } });
  }

  await executeBatchUpdate(token, requests);
  console.log('Blank slides initialized.');

  const design = [];

  function setBg(slideId, rgbColor) {
    design.push({
      updatePageProperties: {
        objectId: slideId,
        pageProperties: {
          pageBackgroundFill: { solidFill: { color: { rgbColor } } },
        },
        fields: 'pageBackgroundFill.solidFill.color',
      },
    });
  }

  function addCard(id, slideId, x, y, w, h, fillRgb, borderRgb = COLORS.borderMain, borderWidth = 1.2) {
    design.push({
      createShape: {
        objectId: id,
        shapeType: 'ROUND_RECTANGLE',
        elementProperties: {
          pageObjectId: slideId,
          size: { width: { magnitude: w, unit: 'PT' }, height: { magnitude: h, unit: 'PT' } },
          transform: { scaleX: 1, scaleY: 1, translateX: x, translateY: y, unit: 'PT' },
        },
      },
    });
    design.push({
      updateShapeProperties: {
        objectId: id,
        shapeProperties: {
          shapeBackgroundFill: { solidFill: { color: { rgbColor: fillRgb } } },
          outline: borderRgb
            ? {
                outlineFill: { solidFill: { color: { rgbColor: borderRgb } } },
                weight: { magnitude: borderWidth, unit: 'PT' },
              }
            : { propertyState: 'NOT_RENDERED' },
        },
        fields: 'shapeBackgroundFill.solidFill.color,outline',
      },
    });
  }

  function addBadge(id, slideId, x, y, w, h, text, fillRgb, textRgb, fontSize = 9) {
    addCard(id + '_bg', slideId, x, y, w, h, fillRgb, COLORS.borderMain, 1);
    design.push({
      createShape: {
        objectId: id + '_txt',
        shapeType: 'TEXT_BOX',
        elementProperties: {
          pageObjectId: slideId,
          size: { width: { magnitude: w, unit: 'PT' }, height: { magnitude: h, unit: 'PT' } },
          transform: { scaleX: 1, scaleY: 1, translateX: x, translateY: y, unit: 'PT' },
        },
      },
    });
    design.push({
      updateShapeProperties: {
        objectId: id + '_txt',
        shapeProperties: { contentAlignment: 'MIDDLE' },
        fields: 'contentAlignment',
      },
    });
    design.push({
      insertText: { objectId: id + '_txt', insertionIndex: 0, text: text },
    });
    design.push({
      updateTextStyle: {
        objectId: id + '_txt',
        textRange: { type: 'ALL' },
        style: {
          fontFamily: 'Arial',
          fontSize: { magnitude: fontSize, unit: 'PT' },
          foregroundColor: { opaqueColor: { rgbColor: textRgb } },
          bold: true,
        },
        fields: 'fontFamily,fontSize,foregroundColor,bold',
      },
    });
    design.push({
      updateParagraphStyle: {
        objectId: id + '_txt',
        textRange: { type: 'ALL' },
        style: { alignment: 'CENTER' },
        fields: 'alignment',
      },
    });
  }

  function addTextBlock(id, slideId, x, y, w, h, text, fontSize, fontColor = COLORS.textMain, bold = false, align = 'START', lineSpacing = 135) {
    design.push({
      createShape: {
        objectId: id,
        shapeType: 'TEXT_BOX',
        elementProperties: {
          pageObjectId: slideId,
          size: { width: { magnitude: w, unit: 'PT' }, height: { magnitude: h, unit: 'PT' } },
          transform: { scaleX: 1, scaleY: 1, translateX: x, translateY: y, unit: 'PT' },
        },
      },
    });
    design.push({
      insertText: { objectId: id, insertionIndex: 0, text: text },
    });
    design.push({
      updateTextStyle: {
        objectId: id,
        textRange: { type: 'ALL' },
        style: {
          fontFamily: 'Arial',
          fontSize: { magnitude: fontSize, unit: 'PT' },
          foregroundColor: { opaqueColor: { rgbColor: fontColor } },
          bold: bold,
        },
        fields: 'fontFamily,fontSize,foregroundColor,bold',
      },
    });
    design.push({
      updateParagraphStyle: {
        objectId: id,
        textRange: { type: 'ALL' },
        style: {
          alignment: align,
          lineSpacing: lineSpacing,
          spaceBelow: { magnitude: 4, unit: 'PT' },
        },
        fields: 'alignment,lineSpacing,spaceBelow',
      },
    });
  }

  function addHeader(slideId, badgeText, titleText, num) {
    const p = `s${num}_h_`;
    addBadge(p + 'badge', slideId, 32, 22, 130, 22, badgeText, COLORS.yellow, COLORS.darkPure, 9);
    addTextBlock(p + 'title', slideId, 172, 16, 516, 32, titleText, 16.5, COLORS.darkPure, true, 'START', 100);

    design.push({
      createLine: {
        objectId: p + 'line',
        lineCategory: 'STRAIGHT',
        elementProperties: {
          pageObjectId: slideId,
          size: { width: { magnitude: 656, unit: 'PT' }, height: { magnitude: 0, unit: 'PT' } },
          transform: { scaleX: 1, scaleY: 1, translateX: 32, translateY: 52, unit: 'PT' },
        },
      },
    });
  }

  // -------------------------------------------------------------
  // SLIDE 1: COVER
  // -------------------------------------------------------------
  const s1 = slideIds[0];
  setBg(s1, COLORS.yellow);
  addBadge('s1_tag', s1, 32, 28, 150, 24, 'EXECUTIVE REPORT', COLORS.darkPure, COLORS.yellow, 9.5);

  addCard('s1_hero', s1, 32, 64, 656, 155, COLORS.darkPure, null);
  addTextBlock('s1_sub_brand', s1, 56, 80, 460, 22, '웹 플랫폼 현대화 및 매장 운영 자동화 성과 보고서', 12, COLORS.yellow, true);
  addTextBlock('s1_title', s1, 56, 104, 460, 48, '카툰플러스 (CartoonPlus)', 28, COLORS.cardWhite, true);
  addTextBlock('s1_desc', s1, 56, 158, 480, 40, '문제 정의, 기획·보고·승인, 모바일 성능 105% 향상 및 인프라 TCO 100% 절감', 11, COLORS.textLight, false);

  addCard('s1_prof', s1, 32, 232, 656, 142, COLORS.cardWhite, COLORS.borderMain, 1.5);
  addBadge('s1_slogan_tag', s1, 52, 248, 130, 20, 'ENGINEERING SLOGAN', COLORS.yellowLight, COLORS.gold, 8.5);
  addTextBlock('s1_slogan', s1, 52, 274, 616, 28, '"문제의 원인을 지표로 확인하고, 대안을 비교하여 고른 이유를 설명하는 개발자"', 13.5, COLORS.darkPure, true);
  addTextBlock('s1_author', s1, 52, 316, 616, 24, '작성자: 신재희 (Web & Backend Developer)  |  asjh011969@gmail.com  |  github.com/SHINJAEHEE-DEV', 10.5, COLORS.textMuted, false);

  if (mascotLogo) {
    design.push({
      createImage: {
        objectId: 's1_img_mascot',
        url: mascotLogo.webUrl,
        elementProperties: {
          pageObjectId: s1,
          size: { width: { magnitude: 115, unit: 'PT' }, height: { magnitude: 115, unit: 'PT' } },
          transform: { scaleX: 1, scaleY: 1, translateX: 545, translateY: 82, unit: 'PT' },
        },
      },
    });
  }

  // -------------------------------------------------------------
  // SLIDE 2: 01. EXECUTIVE SUMMARY (4대 핵심 전환 성과)
  // -------------------------------------------------------------
  const s2 = slideIds[1];
  setBg(s2, COLORS.creamBg);
  addHeader(s2, '01. EXECUTIVE SUMMARY', '경영 요약: 4대 핵심 전환 성과 (Key Highlights)', 2);

  const kpiW4 = 152;
  const kpiH4 = 320;
  const kpiY4 = 66;

  addCard('s2_h1', s2, 32, kpiY4, kpiW4, kpiH4, COLORS.cardWhite, COLORS.borderMain, 1.2);
  addBadge('s2_h1_b', s2, 44, kpiY4 + 14, 128, 20, '1. 웹 성능 (Lighthouse)', COLORS.red, COLORS.cardWhite, 8.5);
  addTextBlock('s2_h1_t', s2, 44, kpiY4 + 40, 128, 28, '37점 ➔ 80점', 14, COLORS.green, true, 'CENTER');
  addTextBlock('s2_h1_sub', s2, 44, kpiY4 + 68, 128, 20, '성능 +105% 향상', 10, COLORS.green, true, 'CENTER');
  addTextBlock('s2_h1_d', s2, 44, kpiY4 + 95, 128, 215,
    '• 모바일 LCP 17.41s ➔ 5.39s (69% 단축, 12초 절감)\n• 외부 Caspio iFrame 렌더링 블로킹 제거\n• 스켈레톤 UI 적용으로 CLS 0.00x 방어 완료',
    9.5, COLORS.textMain, false, 'START', 130);

  addCard('s2_h2', s2, 200, kpiY4, kpiW4, kpiH4, COLORS.cardWhite, COLORS.borderMain, 1.2);
  addBadge('s2_h2_b', s2, 212, kpiY4 + 14, 128, 20, '2. 검색 최적화 (SEO)', COLORS.gold, COLORS.cardWhite, 8.5);
  addTextBlock('s2_h2_t', s2, 212, kpiY4 + 40, 128, 28, '92점 ➔ 100점', 14, COLORS.gold, true, 'CENTER');
  addTextBlock('s2_h2_sub', s2, 212, kpiY4 + 68, 128, 20, 'Lighthouse 만점 획득', 10, COLORS.gold, true, 'CENTER');
  addTextBlock('s2_h2_d', s2, 212, kpiY4 + 95, 128, 215,
    '• Hash 라우팅 크롤링 불가 한계 극복\n• Puppeteer 기반 20개 정적 라우트 SSG 생성\n• SNS 공유 시 페이지별 맞춤 OG 카드 적용',
    9.5, COLORS.textMain, false, 'START', 130);

  addCard('s2_h3', s2, 368, kpiY4, kpiW4, kpiH4, COLORS.cardWhite, COLORS.borderMain, 1.2);
  addBadge('s2_h3_b', s2, 380, kpiY4 + 14, 128, 20, '3. 매장 운영 자동화', COLORS.green, COLORS.cardWhite, 8.5);
  addTextBlock('s2_h3_t', s2, 380, kpiY4 + 40, 128, 28, '수기 업무 90% 감축', 14, COLORS.darkPure, true, 'CENTER');
  addTextBlock('s2_h3_sub', s2, 380, kpiY4 + 68, 128, 20, '탐색 실패율 0 수렴', 10, COLORS.darkPure, true, 'CENTER');
  addTextBlock('s2_h3_d', s2, 380, kpiY4 + 95, 128, 215,
    '• 파파고 수기 복사 방송 프로세스 제거\n• 요일/시간 자동 예약 방송 송출\n• 초성/공백무시 도서 검색 지원\n• 비회원 3초 입고 신청 모달 제공',
    9.5, COLORS.textMain, false, 'START', 130);

  addCard('s2_h4', s2, 536, kpiY4, kpiW4, kpiH4, COLORS.cardWhite, COLORS.borderMain, 1.2);
  addBadge('s2_h4_b', s2, 548, kpiY4 + 14, 128, 20, '4. 인프라 TCO 비용', COLORS.darkPure, COLORS.yellow, 8.5);
  addTextBlock('s2_h4_t', s2, 548, kpiY4 + 40, 128, 28, '30만원 ➔ $0', 14, COLORS.gold, true, 'CENTER');
  addTextBlock('s2_h4_sub', s2, 548, kpiY4 + 68, 128, 20, '고정비 100% 절감', 10, COLORS.gold, true, 'CENTER');
  addTextBlock('s2_h4_d', s2, 548, kpiY4 + 95, 128, 215,
    '• 아임웹/Caspio 유료 구독 해지\n• Cloudflare + Supabase 무료 티어 운영\n• 3개년 누적 100만 원 이상 절감\n• 지점 확장 한계비용 $0 달성',
    9.5, COLORS.textMain, false, 'START', 130);

  // -------------------------------------------------------------
  // SLIDE 3: 02. 현장 문제 발굴
  // -------------------------------------------------------------
  const s3 = slideIds[2];
  setBg(s3, COLORS.creamBg);
  addHeader(s3, '02. BACKGROUND', '현장 관찰 기반 3대 병목 및 기술적 한계 분석 (As-Is)', 3);

  const cW3 = 208;
  const cH3 = 320;
  const cY3 = 66;

  addCard('s3_c1', s3, 32, cY3, cW3, cH3, COLORS.cardWhite, COLORS.borderMain, 1.2);
  addBadge('s3_c1_b', s3, 46, cY3 + 14, 90, 18, 'BOTTLENECK 1', COLORS.red, COLORS.cardWhite, 8);
  addTextBlock('s3_c1_t', s3, 46, cY3 + 38, 180, 24, '모바일 웹 성능 저하', 12.5, COLORS.darkPure, true);
  addTextBlock('s3_c1_d', s3, 46, cY3 + 68, 180, 235,
    '• 아임웹 플랫폼 내 Caspio DB\n  iFrame 삽입으로 렌더링 지연\n\n• 모바일 LCP 17.41초,\n  Lighthouse 성능 37점 기록\n\n• 로딩 지연에 따른 고객 검색\n  이탈 및 카운터 문의 가중',
    10, COLORS.textMain, false, 'START', 135);

  addCard('s3_c2', s3, 256, cY3, cW3, cH3, COLORS.cardWhite, COLORS.borderMain, 1.2);
  addBadge('s3_c2_b', s3, 270, cY3 + 14, 90, 18, 'BOTTLENECK 2', COLORS.gold, COLORS.cardWhite, 8);
  addTextBlock('s3_c2_t', s3, 270, cY3 + 38, 180, 24, '반복 수기 업무 오버헤드', 12.5, COLORS.darkPure, true);
  addTextBlock('s3_c2_d', s3, 270, cY3 + 68, 180, 235,
    '• 매시간 정기 안내방송 송출 시\n  파파고 번역기에 문구 직접 입력\n\n• 도서 입고 신청을 포스트잇 및\n  수기 메모로 관리하여 누락 발생\n\n• Caspio 관리자 공용 비밀번호 공유',
    10, COLORS.textMain, false, 'START', 135);

  addCard('s3_c3', s3, 480, cY3, cW3, cH3, COLORS.cardWhite, COLORS.borderMain, 1.2);
  addBadge('s3_c3_b', s3, 494, cY3 + 14, 90, 18, 'BOTTLENECK 3', COLORS.darkPure, COLORS.yellow, 8);
  addTextBlock('s3_c3_t', s3, 494, cY3 + 38, 180, 24, '인프라 고정 비용 지출', 12.5, COLORS.darkPure, true);
  addTextBlock('s3_c3_d', s3, 494, cY3 + 68, 180, 235,
    '• 아임웹 프로 플랜 (월 2만 원)\n  + Caspio DB 유료 구독 발생\n\n• 연간 30~42만 원 고정 지출\n\n• 지점 확장 시 계정 추가 비용이\n  선형 증가하는 비효율 구조',
    10, COLORS.textMain, false, 'START', 135);

  // -------------------------------------------------------------
  // SLIDE 4: 03. 기획 및 사장님 승인
  // -------------------------------------------------------------
  const s4 = slideIds[3];
  setBg(s4, COLORS.creamBg);
  addHeader(s4, '03. PROPOSAL & APPROVAL', '정량 지표와 ROI를 제시하여 리뉴얼 승인 및 다지점 확장 획득', 4);

  const cW2 = 320;
  const cH2 = 320;
  const cY2 = 66;

  addCard('s4_c1', s4, 32, cY2, cW2, cH2, COLORS.cardWhite, COLORS.borderMain, 1.2);
  addBadge('s4_c1_b', s4, 48, cY2 + 14, 110, 18, 'PROPOSAL STRATEGY', COLORS.yellow, COLORS.darkPure, 8);
  addTextBlock('s4_c1_t', s4, 48, cY2 + 38, 288, 24, '3대 핵심 제안 전략', 13.5, COLORS.darkPure, true);
  addTextBlock('s4_c1_d', s4, 48, cY2 + 68, 288, 235,
    '1. 인프라 비용 절감 (TCO $0 아키텍처 제시)\n   • 연 30만 원+ 유료 구독을 Cloudflare+Supabase\n     무료 티어로 전환하여 100% 절감 근거 제시\n\n2. 현장 매장 운영 자동화 (수기 업무 90% 감축)\n   • 파파고 복사 방송을 브라우저 원클릭/예약 엔진으로 대체\n   • 포스트잇 도서 신청을 실시간 관리 콘솔로 전산화\n\n3. 고객 도서 탐색 경험 향상\n   • 모바일 로딩 17초 ➔ 5초대 단축 및 초성 검색 도입',
    10.5, COLORS.textMain, false, 'START', 135);

  addCard('s4_c2', s4, 368, cY2, cW2, cH2, COLORS.panelIvory, COLORS.borderMain, 1.2);
  addBadge('s4_c2_b', s4, 384, cY2 + 14, 110, 18, 'APPROVAL RESULT', COLORS.green, COLORS.cardWhite, 8);
  addTextBlock('s4_c2_t', s4, 384, cY2 + 38, 288, 24, '비즈니스 의사결정 및 승인 결과', 13.5, COLORS.green, true);
  addTextBlock('s4_c2_d', s4, 384, cY2 + 68, 288, 235,
    '■ 전면 자체 개발 공식 승인 획득\n   • 정량 지표 기반 제안서 검토 후 단독 개발 승인 획득\n\n■ 다지점 확장 승인 및 운영 전환\n   • 1단계: 서울대입구역점(1호점) 선제 검증 및 안정화\n   • 2단계: 잠실점 · 홍대점 다지점 통합 운영으로 확장 승인\n\n■ 실물 서가 점진적 동기화 원칙 수립\n   • 도서 재배치에 맞춘 구역별(A➔B➔C) 순차 DB 반영 합의',
    10.5, COLORS.textMain, false, 'START', 135);

  // -------------------------------------------------------------
  // SLIDE 5: 04. 시스템 아키텍처 & 기술 스택
  // -------------------------------------------------------------
  const s5 = slideIds[4];
  setBg(s5, COLORS.creamBg);
  addHeader(s5, '04. ARCHITECTURE', '월 고정비 $0, 고성능 & 보안을 갖춘 Serverless Architecture', 5);

  addCard('s5_c1', s5, 32, cY2, cW2, cH2, COLORS.cardWhite, COLORS.borderMain, 1.2);
  addBadge('s5_c1_b', s5, 48, cY2 + 14, 120, 18, 'BACKEND & DATA', COLORS.darkPure, COLORS.yellow, 8);
  addTextBlock('s5_c1_t', s5, 48, cY2 + 38, 288, 24, 'Supabase (PostgreSQL 15+ / RLS)', 13.5, COLORS.darkPure, true);
  addTextBlock('s5_c1_d', s5, 48, cY2 + 68, 288, 235,
    '• PostgreSQL 15+ 기반 정규화 DB 설계\n   - 도서 마스터 및 지점별 재고 분리 (1:N)\n   - 한글 초성/정규화 검색 쿼리 및 인덱싱 적용\n\n• Row Level Security (RLS) 접근 제어\n   - 일반 고객: 도서/메뉴 SELECT 및 익명 도서신청 허용\n   - 매장 직원: 소속 store_id 기준 CRUD 격리\n\n• Supabase Storage\n   - 매장 방송 음원(MP3) 및 이벤트 이미지 정적 서빙',
    10.5, COLORS.textMain, false, 'START', 135);

  addCard('s5_c2', s5, 368, cY2, cW2, cH2, COLORS.cardWhite, COLORS.borderMain, 1.2);
  addBadge('s5_c2_b', s5, 384, cY2 + 14, 120, 18, 'FRONTEND & EDGE', COLORS.yellow, COLORS.darkPure, 8);
  addTextBlock('s5_c2_t', s5, 384, cY2 + 38, 288, 24, 'React 19 & Cloudflare Pages SSG', 13.5, COLORS.darkPure, true);
  addTextBlock('s5_c2_d', s5, 384, cY2 + 68, 288, 235,
    '• React 19 + TypeScript + Vite 7\n   - 번들 경량화 (JS Gzip 197KB / CSS 6.6KB)\n   - 모바일 반응형 UI 설계\n\n• Cloudflare Pages & Post-Build SSG\n   - Puppeteer 기반 20개 정적 HTML 사전 빌드\n   - 글로벌 엣지 정적 캐싱으로 TTFB 50ms 미만 유지\n\n• Vitest 단위/통합 테스트 자동화\n   - 23개 스위트, 119개+ 테스트 무결성 검증',
    10.5, COLORS.textMain, false, 'START', 135);

  // -------------------------------------------------------------
  // SLIDE 6: 05. 백엔드 & 데이터 엔지니어링
  // -------------------------------------------------------------
  const s6 = slideIds[5];
  setBg(s6, COLORS.creamBg);
  addHeader(s6, '05. DATA ENGINEERING', '다지점 데이터 무결성과 초고속 검색을 위한 RDBMS 설계', 6);

  addCard('s6_c1', s6, 32, cY3, cW3, cH3, COLORS.cardWhite, COLORS.borderMain, 1.2);
  addBadge('s6_c1_b', s6, 46, cY3 + 14, 90, 18, 'MODELING', COLORS.darkPure, COLORS.cardWhite, 8);
  addTextBlock('s6_c1_t', s6, 46, cY3 + 38, 180, 36, '1. 도서 마스터 & 재고\n1:N 정규화 분리', 12.5, COLORS.darkPure, true);
  addTextBlock('s6_c1_d', s6, 46, cY3 + 80, 180, 225,
    '• Book (1) ➔ Inventory (N)\n\n• 다지점 입고 시 제목·작가·장르\n  중복 데이터 저장 차단\n\n• 지점별 보유 권수, 서가 위치\n  (A-01-3)만 독립 격리\n\n• 600건 데이터 중복 제거\n  (Deduplication) 정제 완료',
    10, COLORS.textMain, false, 'START', 135);

  addCard('s6_c2', s6, 256, cY3, cW3, cH3, COLORS.cardWhite, COLORS.borderMain, 1.2);
  addBadge('s6_c2_b', s6, 270, cY3 + 14, 90, 18, 'SEARCH ALGO', COLORS.gold, COLORS.cardWhite, 8);
  addTextBlock('s6_c2_t', s6, 270, cY3 + 38, 180, 36, '2. 한글 초성 & 공백\n정규화 검색 알고리즘', 12.5, COLORS.darkPure, true);
  addTextBlock('s6_c2_d', s6, 270, cY3 + 80, 180, 225,
    '• \'체인소 맨\' ➔ \'체인소맨\'\n  공백 무시 일치 검색\n\n• \'ㅊㅇㅅㅁ\' 한글 초성\n  부분 일치 쿼리 지원\n\n• DB 적재 시 정규화 컬럼 생성\n  (normalized_title, initial)\n\n• 도서 검색 응답 시간 < 100ms',
    10, COLORS.textMain, false, 'START', 135);

  addCard('s6_c3', s6, 480, cY3, cW3, cH3, COLORS.cardWhite, COLORS.borderMain, 1.2);
  addBadge('s6_c3_b', s6, 494, cY3 + 14, 90, 18, 'SECURITY', COLORS.green, COLORS.cardWhite, 8);
  addTextBlock('s6_c3_t', s6, 494, cY3 + 38, 180, 36, '3. Supabase RLS\n다지점 권한 격리', 12.5, COLORS.darkPure, true);
  addTextBlock('s6_c3_d', s6, 494, cY3 + 80, 180, 225,
    '• 일반 고객 (Anonymous):\n  도서/메뉴 SELECT만 허용,\n  개인정보 없는 입고 신청 INSERT\n\n• 매장 직원 (Staff Auth):\n  소속 store_id 기준 CRUD 격리\n\n• DB 엔진 레벨 권한 검증으로\n  데이터 변조 방지',
    10, COLORS.textMain, false, 'START', 135);

  // -------------------------------------------------------------
  // SLIDE 7: 06. 매장 운영 자동화 엔진
  // -------------------------------------------------------------
  const s7 = slideIds[6];
  setBg(s7, COLORS.creamBg);
  addHeader(s7, '06. AUTOMATION ENGINES', '매장 현장 업무 개선을 위한 2대 자동화 엔진 구축', 7);

  addCard('s7_c1', s7, 32, cY2, cW2, cH2, COLORS.cardWhite, COLORS.borderMain, 1.2);
  addBadge('s7_c1_b', s7, 48, cY2 + 14, 130, 18, 'BROADCAST ENGINE', COLORS.yellow, COLORS.darkPure, 8);
  addTextBlock('s7_c1_t', s7, 48, cY2 + 38, 288, 24, '1. 매장 안내방송 예약 & 원터치 엔진', 13.5, COLORS.darkPure, true);
  addTextBlock('s7_c1_d', s7, 48, cY2 + 68, 288, 235,
    '• 무중단 브라우저 탭 방송 송출\n   - 카운터 PC 브라우저 기반의 예약 방송 스케줄러\n   - 6종 기본 프리셋 + MP3 업로드 지원\n   - 정적 오디오 로컬 캐시로 재생 안정성 확보\n\n• 요일별 / 시간대별 자동 정시 방송\n   - 마감 30분 전, 에티켓, 퇴실 안내 등 지정 시각 자동 송출\n   - 최근 7일간 방송 실행 감사 기록(`Broadcast Run`) 관리\n\n• 비즈니스 임팩트\n   - 파파고 수기 복사 작업 제거 (소요 시간 90% 절감)',
    10, COLORS.textMain, false, 'START', 130);

  addCard('s7_c2', s7, 368, cY2, cW2, cH2, COLORS.cardWhite, COLORS.borderMain, 1.2);
  addBadge('s7_c2_b', s7, 384, cY2 + 14, 130, 18, 'REQUEST PIPELINE', COLORS.green, COLORS.cardWhite, 8);
  addTextBlock('s7_c2_t', s7, 384, cY2 + 38, 288, 24, '2. 비회원 도서 입고 신청 파이프라인', 13.5, COLORS.darkPure, true);
  addTextBlock('s7_c2_d', s7, 384, cY2 + 68, 288, 235,
    '• 3초 비회원 모달 신청 UX\n   - 검색 결과 0건 또는 플로팅 버튼에서 즉시 신청\n   - 개인정보 수집 없는 간소화 폼으로 신청 장벽 완화\n\n• 입고 처리 상태 라이프사이클\n   - 직원 콘솔: [접수 ➔ 주문완료 ➔ 입고완료 ➔ 취소]\n   - 입고 완료 처리 시 고객 화면에 \'30일 신규 입고 도서\' 자동 노출\n\n• 비즈니스 임팩트\n   - 포스트잇 수기 신청을 100% 전산화하여 누락 방지',
    10, COLORS.textMain, false, 'START', 130);

  // -------------------------------------------------------------
  // SLIDE 8: 07. 웹 성능 상세 벤치마크 (정량 데이터 표)
  // -------------------------------------------------------------
  const s8 = slideIds[7];
  setBg(s8, COLORS.creamBg);
  addHeader(s8, '07. BENCHMARK TABLE', '웹 성능 및 Core Web Vitals 페이지별 정량 비교 (Lighthouse v12)', 8);

  const pCardW = 208;
  const pCardH = 320;

  addCard('s8_p1', s8, 32, 66, pCardW, pCardH, COLORS.cardWhite, COLORS.borderMain, 1.2);
  addBadge('s8_p1_b', s8, 46, 78, 120, 18, '홈 (Home) 화면', COLORS.darkPure, COLORS.yellow, 8.5);
  addTextBlock('s8_p1_d', s8, 46, 102, 180, 270,
    '[Mobile 환경]\n• 성능 점수: 37점 ➔ 76점 (+105% ↑)\n• LCP (로딩): 17.41s ➔ 5.39s (69% 단축)\n• CLS (흔들림): 0.185 ➔ 0.001 (안정화)\n• FCP (렌더링): 4.82s ➔ 1.94s\n• SEO 점수: 92점 ➔ 100점\n\n[Desktop 환경]\n• 성능 점수: 63점 ➔ 94점 (+49% ↑)\n• LCP: 3.13s ➔ 1.45s (54% 단축)\n• CLS: 0.306 ➔ 0.009',
    9.5, COLORS.textMain, false, 'START', 125);

  addCard('s8_p2', s8, 256, 66, pCardW, pCardH, COLORS.cardWhite, COLORS.borderMain, 1.2);
  addBadge('s8_p2_b', s8, 270, 78, 120, 18, '메뉴 & 요금제', COLORS.darkPure, COLORS.yellow, 8.5);
  addTextBlock('s8_p2_d', s8, 270, 102, 180, 270,
    '[Mobile 환경]\n• 성능 점수: 39점 ➔ 80점 (+105% ↑)\n• LCP (로딩): 12.25s ➔ 4.37s (64% 단축)\n• CLS (흔들림): 0.177 ➔ 0.000 (방어 완료)\n• FCP (렌더링): 3.91s ➔ 1.81s\n• SEO 점수: 92점 ➔ 100점\n\n[Desktop 환경]\n• 성능 점수: 71점 ➔ 96점 (+35% ↑)\n• LCP: 2.02s ➔ 1.30s (35% 단축)\n• CLS: 0.331 ➔ 0.008',
    9.5, COLORS.textMain, false, 'START', 125);

  addCard('s8_p3', s8, 480, 66, pCardW, pCardH, COLORS.cardWhite, COLORS.borderMain, 1.2);
  addBadge('s8_p3_b', s8, 494, 78, 120, 18, '도서 검색 화면', COLORS.darkPure, COLORS.yellow, 8.5);
  addTextBlock('s8_p3_d', s8, 494, 102, 180, 270,
    '[Mobile 환경]\n• 성능 점수: 43점 ➔ 77점 (+79% ↑)\n• LCP (로딩): 6.91s ➔ 5.08s (26% 단축)\n• CLS (흔들림): 0.301 ➔ 0.004 (방어)\n• SEO 점수: 92점 ➔ 100점\n\n[Desktop 환경]\n• 성능 점수: 78점 ➔ 95점 (+22% ↑)\n• LCP: 3.36s ➔ 1.40s (58% 단축)\n• 초기 CLS 해결: 0.914 ➔ 0.009\n  (스켈레톤 UI 도입)',
    9.5, COLORS.textMain, false, 'START', 125);

  // -------------------------------------------------------------
  // SLIDE 9: 08. 실제 Lighthouse 실측 캡처
  // -------------------------------------------------------------
  const s9 = slideIds[8];
  setBg(s9, COLORS.creamBg);
  addHeader(s9, '08. AUDIT SCREENSHOTS', 'Google Lighthouse 모바일 성능 실측 리포트 원본 캡처', 9);

  addCard('s9_c1', s9, 32, 66, 320, 320, COLORS.cardWhite, COLORS.red, 1.5);
  addBadge('s9_b1', s9, 46, 76, 130, 20, '기존 레거시 (As-Is)', COLORS.red, COLORS.cardWhite, 9);
  addTextBlock('s9_t1', s9, 184, 76, 155, 20, '성능: 37점  |  LCP: 17.4s', 10.5, COLORS.red, true);

  if (oldLh) {
    design.push({
      createImage: {
        objectId: 's9_img_old',
        url: oldLh.webUrl,
        elementProperties: {
          pageObjectId: s9,
          size: { width: { magnitude: 296, unit: 'PT' }, height: { magnitude: 260, unit: 'PT' } },
          transform: { scaleX: 1, scaleY: 1, translateX: 44, translateY: 104, unit: 'PT' },
        },
      },
    });
  }

  addCard('s9_c2', s9, 368, 66, 320, 320, COLORS.cardWhite, COLORS.green, 1.5);
  addBadge('s9_b2', s9, 382, 76, 130, 20, '신규 리뉴얼 (To-Be)', COLORS.green, COLORS.cardWhite, 9);
  addTextBlock('s9_t2', s9, 520, 76, 155, 20, '성능: 76~80점  |  LCP: 5.3s', 10.5, COLORS.green, true);

  if (newLh) {
    design.push({
      createImage: {
        objectId: 's9_img_new',
        url: newLh.webUrl,
        elementProperties: {
          pageObjectId: s9,
          size: { width: { magnitude: 296, unit: 'PT' }, height: { magnitude: 260, unit: 'PT' } },
          transform: { scaleX: 1, scaleY: 1, translateX: 380, translateY: 104, unit: 'PT' },
        },
      },
    });
  }

  // -------------------------------------------------------------
  // SLIDE 10: 09. 기술적 트러블슈팅
  // -------------------------------------------------------------
  const s10 = slideIds[9];
  setBg(s10, COLORS.creamBg);
  addHeader(s10, '09. TROUBLESHOOTING', '원인 분석 및 문제 해결 엔지니어링 사례', 10);

  addCard('s10_c1', s10, 32, cY3, cW3, cH3, COLORS.cardWhite, COLORS.borderMain, 1.2);
  addBadge('s10_c1_b', s10, 46, cY3 + 14, 90, 18, 'CLS DEFENSE', COLORS.red, COLORS.cardWhite, 8);
  addTextBlock('s10_c1_t', s10, 46, cY3 + 38, 180, 36, '1. 도서 검색 CLS 흔들림\n0.914 ➔ 0.009 방어', 12.5, COLORS.darkPure, true);
  addTextBlock('s10_c1_d', s10, 46, cY3 + 80, 180, 225,
    '• 원인: 비동기 도서 로딩 중\n  검색바/버튼 위치가 밀리며\n  CLS 0.914로 성능 저하 발생\n\n• 해결: 고정 높이 스켈레톤 UI\n  컴포넌트 설계 및 CSS\n  font-display 최적화 적용\n\n• 결과: CLS 0.009 달성으로\n  레이아웃 이동 방어 완료',
    10, COLORS.textMain, false, 'START', 135);

  addCard('s10_c2', s10, 256, cY3, cW3, cH3, COLORS.cardWhite, COLORS.borderMain, 1.2);
  addBadge('s10_c2_b', s10, 270, cY3 + 14, 90, 18, 'DATA MIGRATION', COLORS.gold, COLORS.cardWhite, 8);
  addTextBlock('s10_c2_t', s10, 270, cY3 + 38, 180, 36, '2. Caspio 레거시 데이터\n정규화 및 마이그레이션', 12.5, COLORS.darkPure, true);
  addTextBlock('s10_c2_d', s10, 270, cY3 + 80, 180, 225,
    '• 원인: 수기 입력으로 인한\n  띄어쓰기 불일치, 권수 누락,\n  장르 분류 체계 부재\n\n• 해결: Node.js 데이터 전처리\n  파이프라인 구축 ➔ 제목 정규화,\n  초성 추출, 11대 표준 장르 매핑\n\n• 결과: 수천 권 도서 데이터를\n  무결성 100%로 DB 이관 완료',
    10, COLORS.textMain, false, 'START', 135);

  addCard('s10_c3', s10, 480, cY3, cW3, cH3, COLORS.cardWhite, COLORS.borderMain, 1.2);
  addBadge('s10_c3_b', s10, 494, cY3 + 14, 90, 18, 'POST-BUILD SSG', COLORS.green, COLORS.cardWhite, 8);
  addTextBlock('s10_c3_t', s10, 494, cY3 + 38, 180, 36, '3. SPA 한계 극복을 위한\n20개 라우트 SSG 빌드', 12.5, COLORS.darkPure, true);
  addTextBlock('s10_c3_d', s10, 494, cY3 + 80, 180, 225,
    '• 원인: React CSR 방식은\n  포털 검색 크롤러가 지점별\n  상세 콘텐츠를 수집하지 못함\n\n• 해결: Puppeteer 기반 Post-Build\n  SSG 스크립트를 빌드에 통합,\n  지점/메뉴 20개 HTML 사전 렌더\n\n• 결과: Lighthouse SEO 100점,\n  SNS 맞춤 OG 카드 완성',
    10, COLORS.textMain, false, 'START', 135);

  // -------------------------------------------------------------
  // SLIDE 11: 10. 실제 현장 직원 피드백 & 이터레이션
  // -------------------------------------------------------------
  const s11 = slideIds[10];
  setBg(s11, COLORS.creamBg);
  addHeader(s11, '10. STAFF FEEDBACK', '현장 직원 피드백 수렴 및 제품 개선 이터레이션', 11);

  addCard('s11_c1', s11, 32, 66, 320, 320, COLORS.cardWhite, COLORS.borderMain, 1.2);
  addBadge('s11_b1', s11, 48, 78, 140, 18, 'VOICE OF STAFF (VOC)', COLORS.gold, COLORS.cardWhite, 8.5);
  addTextBlock('s11_t1', s11, 48, 102, 288, 22, '매장 직원 현장 피드백 요약', 13, COLORS.darkPure, true);
  addTextBlock('s11_d1', s11, 48, 128, 288, 245,
    '• 안내방송 자동화 평가\n  "매시간 번역기에 문구를 복사해 틀던 작업이 사라지고, 예약 방송을 설정하여 지정 시각에 자동 송출되므로 카운터 업무 효율이 향상됨."\n\n' +
    '• 도서 입고 관리 평가\n  "포스트잇 메모 방식 대비 콘솔에서 접수·주문·입고 단계별로 관리되어 요청 도서 누락이 제거됨."\n\n' +
    '• 검색 사용성 평가\n  "초성 검색(ㅊㅇㅅㅁ) 및 서가 위치 배지 시인성이 확보되어 고객의 카운터 직접 문의 빈도가 감소함."',
    9.5, COLORS.textMain, false, 'START', 130);

  addCard('s11_c2', s11, 368, 66, 320, 320, COLORS.panelIvory, COLORS.borderMain, 1.2);
  addBadge('s11_b2', s11, 384, 78, 140, 18, 'FAST ITERATION', COLORS.green, COLORS.cardWhite, 8.5);
  addTextBlock('s11_t2', s11, 384, 102, 288, 22, '현장 피드백 기반 신속 개선 사례 3건', 13, COLORS.green, true);
  addTextBlock('s11_d2', s11, 384, 128, 288, 245,
    '1. 검색 중심 Home 즉시 개편\n   • 피드백: "방문 고객이 브랜드 소개보다 검색창을 먼저 탐색함"\n   • 개선: 루트(/)를 도서 검색 중심으로 재배치하여 탐색 경로 단축\n\n' +
    '2. 로고 3초 터치(Long Press) 관리자 진입 구현\n   • 피드백: "고객 화면에 직원 로그인 버튼 노출이 부자연스러움"\n   • 개선: 로고 3초 터치 시 직원 콘솔로 분기하는 인터랙션 도입\n\n' +
    '3. 매장 PC 세션 자동 복원 적용\n   • 피드백: "브라우저 재실행 시 세션이 만료되어 매번 로그인 필요"\n   • 개선: 카운터 PC 세션 자동 복구 및 보안 로그아웃 지원',
    9.5, COLORS.textMain, false, 'START', 130);

  // -------------------------------------------------------------
  // SLIDE 12: 11. 인프라 TCO 비용 & 확장성
  // -------------------------------------------------------------
  const s12 = slideIds[11];
  setBg(s12, COLORS.creamBg);
  addHeader(s12, '11. COST & TCO', '인프라 TCO 절감 분석 및 다지점 확장성 검증', 12);

  addCard('s12_c1', s12, 32, cY2, cW2, cH2, COLORS.cardWhite, COLORS.borderMain, 1.2);
  addBadge('s12_c1_b', s12, 48, cY2 + 14, 120, 18, 'COST BREAKDOWN', COLORS.darkPure, COLORS.yellow, 8);
  addTextBlock('s12_c1_t', s12, 48, cY2 + 38, 288, 24, '인프라 세부 비용 비교 (100% 절감)', 13.5, COLORS.darkPure, true);
  addTextBlock('s12_c1_d', s12, 48, cY2 + 68, 288, 235,
    '• 웹 호스팅 & CDN\n   - As-Is: 아임웹 프로 플랜 (월 1.6~2.4만 원)\n   - To-Be: Cloudflare Pages Free (무제한 대역폭) [0원]\n\n• 데이터베이스 & 인증\n   - As-Is: Caspio DB 구독 (지점당 월 $10~$15+)\n   - To-Be: Supabase PostgreSQL Free Tier [0원]\n\n• 도메인 & SSL 보안\n   - As-Is: 유료 SSL 인증서 번들\n   - To-Be: Cloudflare Universal SSL 자동 적용 [0원]\n\n• 월간 고정비: 2.5~3.5만 원 ➔ 0원 ($0 TCO 달성)',
    10, COLORS.textMain, false, 'START', 130);

  addCard('s12_c2', s12, 368, cY2, cW2, cH2, COLORS.panelIvory, COLORS.borderMain, 1.2);
  addBadge('s12_c2_b', s12, 384, cY2 + 14, 120, 18, 'MULTI-TENANCY', COLORS.gold, COLORS.cardWhite, 8);
  addTextBlock('s12_c2_t', s12, 384, cY2 + 38, 288, 24, '3개년 TCO 및 다지점 한계비용 제로', 13.5, COLORS.gold, true);
  addTextBlock('s12_c2_d', s12, 384, cY2 + 68, 288, 235,
    '■ 3개년 누적 비용 절감 효과\n   • 레거시 유지 시 3개년 고정비: 108~150만 원 발생\n   • 신규 플랫폼 전환 후 3개년 고정비: 0원 ($0)\n   • 순수 인프라 비용 누적 100만 원 이상 절감\n\n■ 다지점 확장에 따른 한계 비용 제로 (Zero Marginal Cost)\n   • As-Is: 지점 추가 시마다 DB/웹빌더 계정 선형 증가\n   • To-Be: 단일 Supabase DB & Cloudflare 파이프라인에서\n     지점별 멀티테넌시(/stores/:slug) 구조적 처리\n   • 1호점(서울대입구) ➔ 잠실/홍대 확장 시 추가 비용 0원 유지',
    10, COLORS.textMain, false, 'START', 130);

  // -------------------------------------------------------------
  // SLIDE 13: 12. 프로젝트 회고 및 차세대 로드맵
  // -------------------------------------------------------------
  const s13 = slideIds[12];
  setBg(s13, COLORS.yellow);

  addBadge('s13_tag', s13, 32, 24, 160, 22, '12. RETROSPECTIVE', COLORS.darkPure, COLORS.yellow, 9);
  addTextBlock('s13_header', s13, 200, 18, 488, 30, '비즈니스 가치를 스스로 정의하고 기술로 실현하는 주도적 엔지니어', 15.5, COLORS.darkPure, true);

  // Card 1: Key Learnings
  addCard('s13_c1', s13, 32, 58, 656, 165, COLORS.cardWhite, COLORS.borderMain, 1.5);
  addTextBlock('s13_c1_t', s13, 52, 72, 616, 22, '프로젝트를 통해 입증한 3대 엔지니어링 역량', 13, COLORS.darkPure, true);
  addTextBlock('s13_c1_d', s13, 52, 96, 616, 115,
    '1. 주도적 비즈니스 문제 해결 (Ownership & Strategic Proposal)\n   - 단순 구현을 넘어, 사업장의 병목을 데이터로 증명하고 기획·보고하여 개선 승인을 이끌어낸 완결성 있는 경험\n2. 풀스택 아키텍처 설계 및 비용 최적화 ($0 TCO Architecture)\n   - 관계형 DB 정규화 모델링부터 RLS 보안, 글로벌 엣지 SSG 배포까지 서버리스 스택 구축\n3. 현장 중심의 엔지니어링 (User-Centric Execution)\n   - 고객 탐색 경험(초성 검색)과 직원 운영 효율(예약 방송)을 모두 충족하는 가치 중심 개발',
    10, COLORS.textMain, false, 'START', 130);

  // Card 2: Next Steps
  addCard('s13_c2', s13, 32, 235, 656, 135, COLORS.darkPure, null);
  addTextBlock('s13_c2_t', s13, 52, 248, 520, 22, 'Phase 3 로드맵 (Next Steps)', 12.5, COLORS.yellow, true);
  addTextBlock('s13_c2_d', s13, 52, 274, 520, 85,
    '• [P1. 매장 UX] 매장 평면도(Floor Map) 서가 핀포인트 시각화 (도서 위치 하이라이트)\n• [P2. 고객 유입] 네이버 지도 / 카카오 맵 길찾기 딥링크 연동\n• [P3. 운영 관리] 직원 디지털 출퇴근 체크 (지점 기반 근태 관리 모듈)\n• [실시간 연동] 매장 POS 시스템과의 실시간 도서 재고/대여 상태 웹소켓 동기화',
    10, COLORS.cardWhite, false, 'START', 130);

  if (mascotReading) {
    design.push({
      createImage: {
        objectId: 's13_img_mascot',
        url: mascotReading.webUrl,
        elementProperties: {
          pageObjectId: s13,
          size: { width: { magnitude: 95, unit: 'PT' }, height: { magnitude: 95, unit: 'PT' } },
          transform: { scaleX: 1, scaleY: 1, translateX: 575, translateY: 250, unit: 'PT' },
        },
      },
    });
  }

  console.log(`Executing ${design.length} requests in clean written tone...`);
  const chunkSize = 40;
  for (let i = 0; i < design.length; i += chunkSize) {
    const chunk = design.slice(i, i + chunkSize);
    await executeBatchUpdate(token, chunk);
    console.log(`Applied chunk ${Math.floor(i / chunkSize) + 1} / ${Math.ceil(design.length / chunkSize)}`);
  }

  console.log('Complete! Slides updated in clean concise written style without AI buzzwords.');
}

main().catch(err => {
  console.error('Error running slide designer:', err);
  process.exit(1);
});
