import os
from PIL import Image
import numpy as np
from collections import deque

src_path = "docs/assets/5a042021b6252.png"
out_dir = "docs/assets/mascot"
os.makedirs(out_dir, exist_ok=True)

img = Image.open(src_path).convert("RGBA")
w, h = img.size
arr = np.array(img)
alpha = arr[:, :, 3]

# Centers of the 9 characters (approximate coordinates)
centers = [
    # row 0
    {"name": "mascot_sunglasses.png", "cy": 300, "cx": 350, "title": "선글라스 쓰고 걷기"},
    {"name": "mascot_thinking.png", "cy": 300, "cx": 980, "title": "도서 고민/검색"},
    {"name": "mascot_massage.png", "cy": 300, "cx": 1600, "title": "안마의자 힐링"},
    # row 1
    {"name": "mascot_coffee.png", "cy": 950, "cx": 350, "title": "커피/음료 티타임"},
    {"name": "mascot_relaxing.png", "cy": 1050, "cx": 980, "title": "매트에서 뒹굴뒹굴 휴식"},
    {"name": "mascot_gaming.png", "cy": 950, "cx": 1600, "title": "닌텐도 게임 집중"},
    # row 2
    {"name": "mascot_ott.png", "cy": 1600, "cx": 350, "title": "OTT/넷플릭스 시청"},
    {"name": "mascot_front_peek.png", "cy": 1600, "cx": 980, "title": "마스코트 기본 정면 (빼꼼)"},
    {"name": "mascot_reading.png", "cy": 1600, "cx": 1600, "title": "만화책 읽기"}
]

# Flood fill from center to find all connected non-transparent pixels belonging to the character
visited = np.zeros((h, w), dtype=bool)

for item in centers:
    start_y, start_x = item["cy"], item["cx"]
    
    # Find nearest solid pixel if start is transparent
    if alpha[start_y, start_x] < 10:
        found = False
        for rad in range(1, 100):
            for dy in range(-rad, rad+1):
                for dx in range(-rad, rad+1):
                    ny, nx = start_y + dy, start_x + dx
                    if 0 <= ny < h and 0 <= nx < w and alpha[ny, nx] > 10:
                        start_y, start_x = ny, nx
                        found = True
                        break
                if found: break
    
    # BFS
    q = deque([(start_y, start_x)])
    comp_mask = np.zeros((h, w), dtype=bool)
    comp_mask[start_y, start_x] = True
    
    # Local search radius to prevent jumping to neighboring characters
    min_search_y, max_search_y = max(0, item["cy"] - 350), min(h, item["cy"] + 350)
    min_search_x, max_search_x = max(0, item["cx"] - 350), min(w, item["cx"] + 350)
    
    while q:
        cy, cx = q.popleft()
        for dy, dx in [(-1,0), (1,0), (0,-1), (0,1), (-1,-1), (-1,1), (1,-1), (1,1)]:
            ny, nx = cy + dy, cx + dx
            if min_search_y <= ny < max_search_y and min_search_x <= nx < max_search_x:
                if not comp_mask[ny, nx] and alpha[ny, nx] > 5:
                    comp_mask[ny, nx] = True
                    q.append((ny, nx))
                    
    coords = np.argwhere(comp_mask)
    if coords.size > 0:
        min_y, min_x = coords.min(axis=0)
        max_y, max_x = coords.max(axis=0)
        
        # Create output image with only this component
        char_arr = np.zeros((max_y - min_y + 1, max_x - min_x + 1, 4), dtype=np.uint8)
        
        # Copy pixels
        sub_orig = arr[min_y:max_y+1, min_x:max_x+1]
        sub_mask = comp_mask[min_y:max_y+1, min_x:max_x+1]
        
        char_arr[sub_mask] = sub_orig[sub_mask]
        
        char_img = Image.fromarray(char_arr, "RGBA")
        dest = os.path.join(out_dir, item["name"])
        char_img.save(dest, "PNG")
        print(f"Perfect crop for {item['name']}: size {char_img.size}")

print("Done extracting isolated character masks!")
