import os
from PIL import Image, ImageDraw, ImageFont

mascot_reading = Image.open('src/assets/mascot_reading.png').convert('RGBA')

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
badge_text = "SEOUL NAT'L UNIV. STN · MANGA & CAFE"
badge_bbox = draw.textbbox((0, 0), badge_text, font=font_badge)
bw = badge_bbox[2] - badge_bbox[0] + 28
bh = badge_bbox[3] - badge_bbox[1] + 16
draw.rounded_rectangle([left_x, 95, left_x + bw, 95 + bh], radius=8, fill=(30, 30, 30, 255))
draw.text((left_x + 14, 102), badge_text, font=font_badge, fill=(254, 217, 67, 255))

draw.text((left_x, 160), "카툰플러스", font=font_title, fill=(30, 30, 30, 255))
draw.text((left_x + 290, 178), "서울대입구역점", font=font_sub, fill=(138, 129, 117, 255))
draw.text((left_x, 240), "프리미엄 만화 & 복합 힐링 카페", font=font_sub, fill=(30, 30, 30, 255))
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
print("OG Image updated.")
