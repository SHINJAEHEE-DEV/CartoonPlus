from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output/pdf/cartoonplus-staff-console-manual.pdf"
FONT = "/System/Library/Fonts/Supplemental/AppleGothic.ttf"

NAVY = colors.HexColor("#1E1E1E")
YELLOW = colors.HexColor("#FED943")
CREAM = colors.HexColor("#FFF9EC")
TAN = colors.HexColor("#F3EFE5")
MUTED = colors.HexColor("#6B6354")
GREEN = colors.HexColor("#E8F5E9")
RED = colors.HexColor("#FFEBEE")
BLUE = colors.HexColor("#E3F2FD")


def styles():
    pdfmetrics.registerFont(TTFont("Korean", FONT))
    base = getSampleStyleSheet()
    return {
        "cover_kicker": ParagraphStyle("cover_kicker", parent=base["Normal"], fontName="Korean", fontSize=11, leading=16, textColor=NAVY, alignment=TA_CENTER),
        "cover_title": ParagraphStyle("cover_title", parent=base["Title"], fontName="Korean", fontSize=30, leading=40, textColor=NAVY, alignment=TA_CENTER, spaceAfter=8),
        "cover_sub": ParagraphStyle("cover_sub", parent=base["Normal"], fontName="Korean", fontSize=13, leading=21, textColor=MUTED, alignment=TA_CENTER),
        "h1": ParagraphStyle("h1", parent=base["Heading1"], fontName="Korean", fontSize=21, leading=29, textColor=NAVY, spaceAfter=10),
        "h2": ParagraphStyle("h2", parent=base["Heading2"], fontName="Korean", fontSize=14, leading=21, textColor=NAVY, spaceBefore=8, spaceAfter=5),
        "body": ParagraphStyle("body", parent=base["BodyText"], fontName="Korean", fontSize=9.5, leading=15, textColor=NAVY, spaceAfter=5),
        "small": ParagraphStyle("small", parent=base["BodyText"], fontName="Korean", fontSize=8.1, leading=12, textColor=MUTED),
        "table": ParagraphStyle("table", parent=base["BodyText"], fontName="Korean", fontSize=8.4, leading=12, textColor=NAVY),
        "callout": ParagraphStyle("callout", parent=base["BodyText"], fontName="Korean", fontSize=9.2, leading=14, textColor=NAVY),
        "step": ParagraphStyle("step", parent=base["BodyText"], fontName="Korean", fontSize=9.5, leading=15, textColor=NAVY, leftIndent=4),
    }


S = styles()


def p(text, kind="body"):
    return Paragraph(text, S[kind])


def box(text, color=CREAM, border=NAVY):
    table = Table([[p(text, "callout")]], colWidths=[172 * mm])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), color),
        ("BOX", (0, 0), (-1, -1), 1.1, border),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))
    return table


def bullet(n, title, body):
    return [p(f"<b>{n}. {title}</b> - {body}", "step")]


def operation_table(rows, widths=(40, 52, 80)):
    data = [[p(a, "table"), p(b, "table"), p(c, "table")] for a, b, c in rows]
    table = Table(data, colWidths=[w * mm for w in widths], repeatRows=1)
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), NAVY),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("GRID", (0, 0), (-1, -1), 0.45, colors.HexColor("#CFC7B8")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("BACKGROUND", (0, 1), (-1, -1), colors.white),
    ]))
    return table


def screen_map():
    labels = ["대시보드", "도서·입고", "입고 신청", "매장 콘텐츠", "게임 관리", "이벤트 관리", "방송", "계정 관리 (관리자)"]
    cells = [[p(f"<b>{label}</b>", "table")] for label in labels]
    table = Table(cells, colWidths=[172 * mm])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), YELLOW),
        ("BOX", (0, 0), (-1, -1), 1.1, NAVY),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#CFC7B8")),
        ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]))
    return table


def footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Korean", 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawString(19 * mm, 12 * mm, "카툰플러스 직원 콘솔 운영 매뉴얼 | v1.0 | 2026-09-17")
    canvas.drawRightString(191 * mm, 12 * mm, f"{doc.page}")
    canvas.restoreState()


def build():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc = BaseDocTemplate(
        str(OUTPUT), pagesize=A4,
        leftMargin=19 * mm, rightMargin=19 * mm, topMargin=18 * mm, bottomMargin=20 * mm,
        pageTemplates=[PageTemplate(id="main", frames=[Frame(19 * mm, 20 * mm, 172 * mm, 259 * mm, id="body")], onPage=footer)],
        title="카툰플러스 직원 콘솔 운영 매뉴얼",
        author="CartoonPlus",
    )
    story = []

    # Cover
    story += [Spacer(1, 43 * mm), p("CARTOON PLUS", "cover_kicker"), Spacer(1, 7 * mm), p("직원 콘솔 운영 매뉴얼", "cover_title"), p("신입 직원 교육과 카운터 현장 운영을 위한 실무 안내서", "cover_sub"), Spacer(1, 18 * mm)]
    story.append(box("<b>이 매뉴얼의 범위</b><br/>승인된 직원의 로그인, 도서 재고와 입고 신청 처리, 매장 콘텐츠 관리, 방송 운영을 다룹니다. 관리자만 수행할 수 있는 계정 관리는 마지막 부록으로 분리했습니다.", YELLOW))
    story += [Spacer(1, 10 * mm), p("운영 기준: 서울대입구역점 · PC Chrome · A4 컬러 인쇄", "cover_sub"), Spacer(1, 3 * mm), p("문서 버전 1.0 | 기준일 2026-09-17", "cover_sub"), PageBreak()]

    # How to use and daily start
    story += [p("1. 시작 전: 카운터 PC 운영", "h1"), p("방송과 예약 방송을 안정적으로 운영하려면 카운터 PC에서 직원 콘솔을 열어 둡니다. 고객 공용 기기에서는 직원 계정으로 로그인하지 않습니다.")]
    story += bullet("1", "Chrome에서 직원 콘솔 열기", "직원용 직접 주소 또는 고객 화면의 카툰플러스 로고를 2초간 길게 눌러 직원 로그인 화면으로 이동합니다.")
    story += bullet("2", "앱처럼 열기", "Chrome 주소창 오른쪽의 설치 아이콘 또는 메뉴의 ‘설치’를 선택합니다. 설치 항목이 없다면 Chrome 바로가기로 열고 다음 단계로 진행합니다.")
    story += bullet("3", "전체 화면 켜기", "직원 콘솔을 연 뒤 <b>F11</b>을 눌러 주소창과 탭을 숨깁니다. 다시 F11을 누르면 일반 화면으로 돌아옵니다.")
    story += bullet("4", "로그인과 상태 확인", "승인된 직원 계정으로 로그인한 뒤 대시보드에서 처리 대기 신청, 오늘의 예약 방송, 최근 재고 작업을 확인합니다.")
    story += [Spacer(1, 4 * mm), box("<b>중요</b> - 앱 설치는 전체 화면과 별개입니다. 설치 메뉴가 보이지 않아도 Chrome 탭에서 F11을 누르면 전체 화면 운영이 가능합니다. 예약 방송은 카운터 PC의 방송 담당 탭이 열려 있어야 실행됩니다.", RED, colors.HexColor("#B52B2B")), Spacer(1, 5 * mm), p("직원 로그인 화면 확인", "h2")]
    story.append(operation_table([
        ("화면 요소", "의미", "현장 확인"),
        ("직원 로그인", "승인된 계정으로 콘솔 접속", "아이디와 비밀번호 입력 후 대시보드로 이동"),
        ("가입 신청", "새 직원의 승인 요청", "신청 후 관리자의 승인이 있어야 로그인 가능"),
        ("고객 홈", "고객 화면으로 복귀", "공용 화면으로 돌릴 때만 사용"),
    ]))
    story += [PageBreak()]

    # map
    story += [p("2. 업무 화면 빠른 찾기", "h1"), p("왼쪽 탐색 메뉴는 업무 단위로 구성됩니다. 먼저 아래에서 목적에 맞는 화면을 찾고, 해당 절의 순서를 따르세요."), screen_map(), Spacer(1, 7 * mm)]
    story.append(operation_table([
        ("업무", "이동 화면", "완료 기준"),
        ("오늘 처리할 일 확인", "대시보드", "대기 신청·예약·최근 재고를 확인"),
        ("도서 한 권 등록/수정", "도서·입고", "권수와 서가 위치가 저장됨"),
        ("고객 신청 상태 변경", "입고 신청", "접수 대기/주문 완료/입고 완료/입고 불가 중 하나로 갱신"),
        ("게임·이벤트·메뉴 정보", "매장 콘텐츠 / 게임 / 이벤트", "고객 공개 전 내용과 상태 확인"),
        ("즉시·예약 방송", "방송", "송출 상태 또는 예약 목록에서 확인"),
        ("직원 승인과 비활성화", "계정 관리", "관리자만 수행"),
    ]))
    story += [Spacer(1, 7 * mm), box("<b>지점 확인</b> - 다지점 운영 화면에서는 작업 전 선택된 지점이 맞는지 먼저 확인합니다. 일반 직원은 자신의 소속 지점 외 데이터에 쓰기 권한이 없습니다.", BLUE, colors.HexColor("#1976D2")), PageBreak()]

    # inventory
    story += [p("3. 도서 재고 관리", "h1"), p("도서 재고는 특정 지점에 실제로 비치된 권수와 서가 위치입니다. 도서 마스터나 다른 지점의 재고를 바꾸는 작업이 아닙니다."), p("한 권씩 등록 또는 수정", "h2")]
    story += bullet("1", "도서·입고 열기", "상단의 도서명, 작가, 장르, 보유 권수, 서가 위치 입력란을 확인합니다.")
    story += bullet("2", "실물 기준으로 입력", "도서명·작가·장르를 확인하고 마지막 권수와 서가 위치를 입력합니다. 서가 위치는 예: A-01-3 형식으로 기록합니다.")
    story += bullet("3", "저장 확인", "‘도서 재고를 저장했습니다’ 메시지와 목록의 최신 항목을 확인합니다.")
    story += [p("CSV 가져오기", "h2")]
    story += bullet("1", "업로드 전 파일 검토", "지점에 맞는 Caspio CSV인지, 도서명·권수·장르가 비어 있지 않은지 확인합니다.")
    story += bullet("2", "가져오기 실행", "업로드 결과의 반영 건수와 실패 건수를 확인합니다. 검토가 필요한 제목이 표시되면 원본 CSV와 실물 도서를 대조합니다.")
    story += [Spacer(1, 4 * mm), box("<b>삭제 주의</b> - 재고 삭제는 이 지점의 재고만 영구 삭제하며 서비스 내 복구 기능이 없습니다. 도서 마스터와 다른 지점 재고는 삭제되지 않지만, 삭제 전 도서명·지점을 반드시 재확인하세요.", RED, colors.HexColor("#B52B2B")), PageBreak()]

    # requests
    story += [p("4. 고객 도서 입고 신청 처리", "h1"), p("고객은 개인정보 없이 희망 도서를 신청합니다. 직원은 신청 내용을 검토하고 상태를 운영 현실에 맞게 갱신합니다."), p("표준 처리 흐름", "h2")]
    story.append(operation_table([
        ("순서", "상태", "직원이 할 일"),
        ("1", "접수 대기", "도서명, 작가/출판사, 희망 권수와 고객 코멘트를 확인"),
        ("2", "주문 완료", "구매 또는 주문이 확정되면 상태 변경"),
        ("3", "입고 완료", "실물 입고 후 재고 관리에서 도서·권수·서가 위치를 등록하고 상태 변경"),
        ("대안", "입고 불가", "품절·판권·운영 기준상 불가 사유가 확정된 경우에만 변경"),
    ]))
    story += [Spacer(1, 6 * mm), p("실무 순서", "h2")]
    story += bullet("1", "입고 신청 화면에서 필터", "‘접수 대기’를 먼저 확인해 미처리 건을 우선 처리합니다.")
    story += bullet("2", "중복과 보유 재고 확인", "이미 보유한 도서인지 먼저 재고 검색으로 확인합니다. 보유 중이면 주문 상태로 바꾸지 않습니다.")
    story += bullet("3", "입고 완료 시 재고 연결", "입고 신청 화면의 재고 등록 바로가기 또는 도서·입고 화면에서 재고를 저장한 후 상태를 ‘입고 완료’로 바꿉니다.")
    story += [Spacer(1, 4 * mm), box("<b>완료 기준</b> - ‘입고 완료’는 주문만 끝난 상태가 아니라, 고객이 찾을 수 있도록 해당 지점 재고와 서가 위치까지 등록된 상태입니다.", GREEN, colors.HexColor("#2E7D32")), PageBreak()]

    # content
    story += [p("5. 매장 콘텐츠 관리", "h1"), p("고객 화면에 공개되는 게임, 이벤트, 메뉴·요금 정보는 실제 매장 운영 상태와 일치해야 합니다. 확인되지 않은 정보를 공개하지 않습니다."), p("게임 관리", "h2")]
    story += bullet("1", "실물 보유 여부 확인", "타이틀, 기기 또는 보드게임 종류, 인원, 장르를 실물과 대조합니다.")
    story += bullet("2", "이용 가능 상태 반영", "점검·분실·고장인 게임은 이용 가능으로 표시하지 않습니다.")
    story += [p("이벤트 관리", "h2")]
    story += bullet("1", "제목·기간·이미지·안내문 입력", "기간과 고객에게 보이는 안내 문구를 재확인합니다.")
    story += bullet("2", "공개 전 검토", "오탈자, 종료일, 지점 정보와 이미지가 맞는지 확인합니다. 종료일 다음 날 고객 화면에서는 자동으로 숨겨집니다.")
    story += [p("메뉴·요금 관리", "h2")]
    story += bullet("1", "실물 메뉴판과 대조", "카테고리, 가격, 베스트 여부, 품절 상태를 실제 판매 기준에 맞춥니다.")
    story += bullet("2", "품절은 삭제와 구분", "일시 품절은 품절 상태를 사용합니다. 삭제는 복구할 수 없으므로 더 이상 운영하지 않는 항목에만 사용합니다.")
    story += [Spacer(1, 5 * mm), box("<b>공개 전 원칙</b> - 고객 화면에 보이는 모든 게임·이벤트·메뉴는 ‘확인된 운영 데이터’여야 합니다. 미확인 게임 목록은 공개하지 않습니다.", BLUE, colors.HexColor("#1976D2")), PageBreak()]

    # broadcast
    story += [p("6. 매장 안내 방송", "h1"), p("방송은 방송 담당 탭에서 한 번에 하나씩 순서대로 재생됩니다. 다른 기기는 프리셋·예약을 관리하고 담당 탭의 연결 상태를 확인하는 용도입니다."), p("즉시 방송", "h2")]
    story += bullet("1", "원클릭 프리셋 선택", "마감 안내, 음료 픽업 등 자주 쓰는 안내의 제목과 문구를 확인한 뒤 즉시 방송합니다.")
    story += bullet("2", "커스텀 문구 방송", "상황에 맞는 문장을 입력한 뒤 송출합니다. 고객에게 바로 들리는 문장이므로 호명·테이블 번호·표현을 다시 읽습니다.")
    story += bullet("3", "상태 확인", "송출 중, 대기, 완료 또는 실패 상태를 확인합니다. 잘못 시작한 방송은 긴급 중지로 멈출 수 있습니다.")
    story += [p("프리셋 관리", "h2")]
    story += bullet("1", "새 프리셋", "제목과 방송 문구를 입력해 저장합니다. 미리듣기로 발음과 길이를 확인합니다.")
    story += bullet("2", "수정 영향", "프리셋 문구를 수정하면 연결된 예약 방송에도 반영됩니다. 화면에 표시되는 영향 예약 건수를 확인합니다.")
    story += bullet("3", "삭제 영향", "프리셋 삭제 시 연결된 예약을 함께 삭제할 수 있습니다. 과거 방송 실행 기록은 유지됩니다.")
    story += [Spacer(1, 4 * mm), box("<b>방송 담당 탭</b> - 예약 방송을 쓰는 날에는 카운터 PC의 담당 탭을 열고 로그인·소리 출력·네트워크 상태를 영업 시작 전에 확인합니다.", YELLOW), PageBreak()]

    # schedules and troubleshoot
    story += [p("7. 예약 방송과 문제 대응", "h1"), p("예약 방송은 매일, 요일 반복, 일회성으로 등록할 수 있습니다. 자동 송출은 카운터 PC 브라우저가 열린 상태에서만 수행됩니다."), p("예약 등록", "h2")]
    story += bullet("1", "반복 방식 선택", "매일, 특정 요일 또는 특정 날짜 중 실제 운영 주기에 맞는 방식을 고릅니다.")
    story += bullet("2", "시간과 문구 점검", "오전/오후, 날짜, 요일, 프리셋 또는 직접 입력 문구를 읽고 저장합니다.")
    story += bullet("3", "활성 상태와 목록 확인", "등록된 방송 스케줄 목록에서 시간·반복·켜짐 상태를 확인합니다.")
    story += [p("문제 발생 시", "h2")]
    story.append(operation_table([
        ("증상", "먼저 확인", "조치"),
        ("예약이 재생되지 않음", "카운터 PC 담당 탭이 열려 있는지", "로그인·탭 연결·소리 출력 확인 후 실행 기록 확인"),
        ("소리가 안 남", "Windows 출력 장치와 Chrome 음소거", "스피커 연결·볼륨·Chrome 탭 음소거를 확인"),
        ("잘못된 방송 시작", "현재 송출/대기 상태", "긴급 중지 후 정확한 문구로 다시 송출"),
        ("실패 기록 발생", "실행 기록의 시각과 상태", "원인 확인 후 필요 시 수동 방송. 실패 건은 자동 재시도하지 않음"),
    ]))
    story += [Spacer(1, 5 * mm), box("<b>중요</b> - 예약을 삭제해도 이미 남은 방송 실행 기록은 삭제되지 않습니다. 기록은 당시의 문구·실행 시각·결과를 확인하는 운영 근거입니다.", CREAM), PageBreak()]

    # admin
    story += [p("부록 A. 관리자 전용: 직원 계정 관리", "h1"), p("이 절은 관리자(Admin)만 수행합니다. 일반 직원에게는 계정 관리 메뉴가 보이지 않습니다."), p("계정 상태", "h2")]
    story.append(operation_table([
        ("상태", "의미", "관리자 조치"),
        ("가입 대기", "가입 신청은 접수됐지만 운영 권한 없음", "이름·아이디·전화번호 끝 네 자리를 확인한 후 승인 여부 결정"),
        ("승인", "직원 콘솔 로그인 및 운영 업무 가능", "소속·권한을 확인하고 필요 시 비활성화"),
        ("비활성화", "운영 화면 접근 차단", "퇴사·권한 회수 시 사용. 다시 사용할 경우 운영 책임자 확인"),
    ]))
    story += [Spacer(1, 6 * mm), p("관리자 작업 순서", "h2")]
    story += bullet("1", "대기 계정 확인", "직원 계정 관리에서 신청자의 신원과 매장 근무 여부를 확인합니다.")
    story += bullet("2", "승인 또는 비활성화", "상태 변경 전 대상 계정과 영향(로그인 가능 여부)을 다시 확인합니다.")
    story += bullet("3", "비밀번호 재발급", "직원 확인 절차를 거친 뒤 임시 비밀번호를 발급하고, 안전한 내부 경로로만 전달합니다.")
    story += [Spacer(1, 5 * mm), box("<b>보안 원칙</b> - 비밀번호를 매뉴얼, 메신저 공지, 카운터 메모에 남기지 않습니다. 고객과 공유하는 기기는 직원 로그인 유지 대상이 아닙니다.", RED, colors.HexColor("#B52B2B")), PageBreak()]

    # daily checklist
    story += [p("부록 B. 현장 빠른 체크리스트", "h1"), p("아래 체크리스트는 출력해 카운터에서 사용합니다. 업무가 끝난 뒤 완료 확인란을 표시하세요."), p("영업 시작", "h2")]
    checklist = [
        "카운터 PC에서 직원 콘솔을 열고 로그인했다.",
        "Chrome 앱/바로가기 또는 F11 전체 화면을 적용했다.",
        "방송 담당 탭이 열려 있고 소리 출력과 네트워크를 확인했다.",
        "대시보드에서 처리 대기 입고 신청과 오늘의 예약 방송을 확인했다.",
        "선택된 지점이 현재 근무 지점과 일치한다.",
    ]
    rows = [[p("□", "table"), p(item, "table"), p("확인", "table")] for item in checklist]
    table = Table(rows, colWidths=[12 * mm, 132 * mm, 28 * mm])
    table.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#CFC7B8")),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("BACKGROUND", (0, 0), (-1, -1), colors.white),
        ("LEFTPADDING", (0, 0), (-1, -1), 7), ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 9), ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
    ]))
    story += [table, Spacer(1, 8 * mm), p("영업 마감", "h2")]
    close_list = [
        "처리한 입고 신청의 상태가 실제 진행 단계와 일치한다.",
        "오늘 등록·수정한 재고의 권수와 서가 위치를 확인했다.",
        "이벤트·메뉴·게임 변경 사항이 실제 매장 상태와 일치한다.",
        "다음 영업일 예약 방송과 방송 담당 탭 상태를 확인했다.",
        "직원 콘솔에서 로그아웃하고 고객 공용 화면을 복원했다.",
    ]
    rows = [[p("□", "table"), p(item, "table"), p("확인", "table")] for item in close_list]
    table = Table(rows, colWidths=[12 * mm, 132 * mm, 28 * mm])
    table.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#CFC7B8")), ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("BACKGROUND", (0, 0), (-1, -1), colors.white), ("LEFTPADDING", (0, 0), (-1, -1), 7), ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 9), ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
    ]))
    story += [table, Spacer(1, 10 * mm), box("문의나 화면 동작이 매뉴얼과 다르면, 작업을 반복하기 전에 화면의 메시지·대상 지점·발생 시각을 기록해 운영 책임자에게 전달합니다.", YELLOW)]
    doc.build(story)


if __name__ == "__main__":
    build()
    print(OUTPUT)
