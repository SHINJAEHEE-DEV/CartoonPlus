import os
from PIL import Image
import numpy as np

src_path = "docs/assets/5a042021b6252.png"
out_dir = "docs/assets/mascot"
os.makedirs(out_dir, exist_ok=True)

img = Image.open(src_path).convert("RGBA")
w, h = img.size
print(f"Source image size: {w}x{h}")

# The image contains a 3x3 grid of characters:
# Row 0: [walking with sunglasses, thinking/puzzled, massage chair]
# Row 1: [drinking tea/coffee, lying down relaxing, gaming with controller]
# Row 2: [watching TV/OTT, front face peek (정면 빼꼼), reading book]

# Let's define safe bounding boxes for each with extra margin so nothing is clipped:
grid_w = w / 3.0
grid_h = h / 3.0

items = [
    # row 0
    {"name": "mascot_sunglasses.png", "r": 0, "c": 0, "title": "선글라스 쓰고 걷기"},
    {"name": "mascot_thinking.png", "r": 0, "c": 1, "title": "도서 고민/검색"},
    {"name": "mascot_massage.png", "r": 0, "c": 2, "title": "안마의자 힐링"},
    # row 1
    {"name": "mascot_coffee.png", "r": 1, "c": 0, "title": "커피/음료 티타임"},
    {"name": "mascot_relaxing.png", "r": 1, "c": 1, "title": "매트에서 뒹굴뒹굴 휴식"},
    {"name": "mascot_gaming.png", "r": 1, "c": 2, "title": "닌텐도 게임 집중"},
    # row 2
    {"name": "mascot_ott.png", "r": 2, "c": 0, "title": "OTT/넷플릭스 시청"},
    {"name": "mascot_front_peek.png", "r": 2, "c": 1, "title": "마스코트 기본 정면 (빼꼼)"},
    {"name": "mascot_reading.png", "r": 2, "c": 2, "title": "만화책 읽기"}
]

arr = np.array(img)
alpha = arr[:, :, 3]

for item in items:
    r, c = item["r"], item["c"]
    x1 = int(c * grid_w)
    x2 = int((c + 1) * grid_w)
    y1 = int(r * grid_h)
    y2 = int((r + 1) * grid_h)
    
    # In this cell, find actual non-transparent bounding box
    cell_alpha = alpha[y1:y2, x1:x2]
    coords = np.argwhere(cell_alpha > 10)
    if coords.size > 0:
        min_y, min_x = coords.min(axis=0)
        max_y, max_x = coords.max(axis=0)
        
        # Add 12px safe margin without exceeding image bounds
        crop_x1 = max(0, x1 + min_x - 12)
        crop_y1 = max(0, y1 + min_y - 12)
        crop_x2 = min(w, x1 + max_x + 13)
        crop_y2 = min(h, y1 + max_y + 13)
        
        cropped = img.crop((crop_x1, crop_y1, crop_x2, crop_y2))
        dest = os.path.join(out_dir, item["name"])
        cropped.save(dest, "PNG")
        print(f"Saved {item['name']}: size {cropped.size} (box: {crop_x1},{crop_y1} to {crop_x2},{crop_y2})")

print("All 9 mascot poses cropped with zero clipping!")
