import os
from PIL import Image, ImageDraw, ImageFont

os.makedirs('public', exist_ok=True)
mascot_reading = Image.open('src/assets/mascot_reading.png').convert('RGBA')

def create_app_icon(size, bg_color=(254, 217, 67, 255)):
    canvas = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)
    padding = int(size * 0.04)
    draw.ellipse([padding, padding, size - padding, size - padding], fill=bg_color, outline=(30, 30, 30, 255), width=max(1, int(size * 0.04)))
    inner_size = int(size * 0.65)
    aspect = mascot_reading.width / mascot_reading.height
    if aspect > 1:
        target_w = inner_size
        target_h = int(inner_size / aspect)
    else:
        target_h = inner_size
        target_w = int(inner_size * aspect)
    scaled_mascot = mascot_reading.resize((target_w, target_h), Image.LANCZOS)
    x = (size - target_w) // 2
    y = (size - target_h) // 2
    canvas.paste(scaled_mascot, (x, y), scaled_mascot)
    return canvas

icon_512 = create_app_icon(512)
icon_512.save('public/icon-512.png', 'PNG')

icon_192 = create_app_icon(192)
icon_192.save('public/icon-192.png', 'PNG')

icon_180 = create_app_icon(180)
icon_180.save('public/apple-touch-icon.png', 'PNG')

icon_32 = create_app_icon(32)
icon_32.save('public/favicon-32x32.png', 'PNG')

icon_16 = create_app_icon(16)
icon_16.save('public/favicon-16x16.png', 'PNG')

icon_512.save('public/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])

svg_content = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="46" fill="#FED943" stroke="#1E1E1E" stroke-width="6"/>
  <polygon points="26,38 34,18 46,30" fill="#1E1E1E" />
  <polygon points="29,35 35,22 43,30" fill="#FED943" />
  <polygon points="74,38 66,18 54,30" fill="#1E1E1E" />
  <polygon points="71,35 65,22 57,30" fill="#FED943" />
  <circle cx="38" cy="50" r="4.5" fill="#1E1E1E"/>
  <circle cx="62" cy="50" r="4.5" fill="#1E1E1E"/>
  <ellipse cx="32" cy="57" rx="5" ry="3" fill="#FFAAA6" opacity="0.8"/>
  <ellipse cx="68" cy="57" rx="5" ry="3" fill="#FFAAA6" opacity="0.8"/>
  <polygon points="50,56 47,53 53,53" fill="#1E1E1E"/>
  <path d="M 45 60 Q 50 64 50 60 Q 50 64 55 60" fill="none" stroke="#1E1E1E" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M 30 76 Q 50 82 70 76" fill="none" stroke="#1E1E1E" stroke-width="3" stroke-linecap="round"/>
</svg>'''

with open('public/favicon.svg', 'w', encoding='utf-8') as f:
    f.write(svg_content)

og_w, og_h = 1200, 630
og = Image.new('RGBA', (og_w, og_h), (255, 249, 236, 255))
draw = ImageDraw.Draw(og)

card_margin = 32
draw.rounded_rectangle([card_margin, card_margin, og_w - card_margin, og_h - card_margin], radius=28, fill=(255, 255, 255, 255), outline=(30, 30, 30, 255), width=5)

circle_center = (920, 315)
circle_radius = 230
draw.ellipse([circle_center[0] - circle_radius, circle_center[1] - circle_radius, circle_center[0] + circle_radius, circle_center[1] + circle_radius], fill=(254, 217, 67, 255), outline=(30, 30, 30, 255), width=4)

mascot_h = 420
mascot_w = int(mascot_h * (mascot_reading.width / mascot_reading.height))
scaled_reading = mascot_reading.resize((mascot_w, mascot_h), Image.LANCZOS)
og.paste(scaled_reading, (920 - mascot_w // 2, 315 - mascot_h // 2 + 10), scaled_reading)

font_badge = ImageFont.truetype('C:/Windows/Fonts/malgunbd.ttf', 20)
font_title = ImageFont.truetype('C:/Windows/Fonts/malgunbd.ttf', 56)
font_sub = ImageFont.truetype('C:/Windows/Fonts/malgunbd.ttf', 28)
font_features = ImageFont.truetype('C:/Windows/Fonts/malgunbd.ttf', 24)

left_x = 90
badge_text = "SEOUL NAT'L UNIV. STN · 24 HOURS"
badge_bbox = draw.textbbox((0, 0), badge_text, font=font_badge)
bw = badge_bbox[2] - badge_bbox[0] + 28
bh = badge_bbox[3] - badge_bbox[1] + 16
draw.rounded_rectangle([left_x, 95, left_x + bw, 95 + bh], radius=8, fill=(30, 30, 30, 255))
draw.text((left_x + 14, 102), badge_text, font=font_badge, fill=(254, 217, 67, 255))

draw.text((left_x, 160), "카툰플러스", font=font_title, fill=(30, 30, 30, 255))
draw.text((left_x + 290, 178), "서울대입구역점", font=font_sub, fill=(138, 129, 117, 255))
draw.text((left_x, 240), "24시간 프리미엄 만화 & 힐링 카페", font=font_sub, fill=(30, 30, 30, 255))
draw.line([left_x, 295, left_x + 560, 295], fill=(230, 223, 207, 255), width=3)

features = [
    ("도서 검색", "도서명 · 작가명 · 초성으로 서가 위치 실시간 확인"),
    ("놀거리 완비", "보드게임 · 닌텐도 스위치 · OTT 룸 무료 이용"),
    ("스낵 & 음료", "카페 음료 · 라면 · 볶음밥 등 다양한 먹거리"),
]

start_y = 325
for title, desc in features:
    draw.rounded_rectangle([left_x, start_y, left_x + 12, start_y + 44], radius=6, fill=(254, 217, 67, 255), outline=(30, 30, 30, 255), width=2)
    draw.text((left_x + 24, start_y + 2), title, font=font_features, fill=(30, 30, 30, 255))
    draw.text((left_x + 24, start_y + 28), desc, font=ImageFont.truetype('C:/Windows/Fonts/malgun.ttf', 17), fill=(107, 99, 84, 255))
    start_y += 65

draw.text((left_x, 530), "https://shinjaehee-dev.github.io/CartoonPlus/", font=ImageFont.truetype('C:/Windows/Fonts/malgunbd.ttf', 16), fill=(138, 106, 0, 255))

og.convert('RGB').save('public/og-image.png', 'PNG', quality=95)
print("Assets created successfully.")
