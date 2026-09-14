import os
from PIL import Image
import numpy as np
from collections import deque

src = Image.open('docs/assets/5a042021b6252.png').convert('RGBA')
w, h = src.size
arr = np.array(src)
alpha = arr[:, :, 3]

centers = [
    {'name': 'mascot_sunglasses.png', 'cy': 300, 'cx': 350, 'min_x': 0, 'max_x': 650, 'min_y': 0, 'max_y': 650},
    {'name': 'mascot_thinking.png', 'cy': 300, 'cx': 980, 'min_x': 600, 'max_x': 1350, 'min_y': 0, 'max_y': 650},
    {'name': 'mascot_massage.png', 'cy': 300, 'cx': 1600, 'min_x': 1300, 'max_x': w, 'min_y': 0, 'max_y': 650},
    {'name': 'mascot_coffee.png', 'cy': 950, 'cx': 350, 'min_x': 0, 'max_x': 650, 'min_y': 600, 'max_y': 1350},
    {'name': 'mascot_relaxing.png', 'cy': 1050, 'cx': 980, 'min_x': 520, 'max_x': 1440, 'min_y': 650, 'max_y': 1400},
    {'name': 'mascot_gaming.png', 'cy': 950, 'cx': 1600, 'min_x': 1300, 'max_x': w, 'min_y': 600, 'max_y': 1350},
    {'name': 'mascot_ott.png', 'cy': 1600, 'cx': 350, 'min_x': 0, 'max_x': 650, 'min_y': 1300, 'max_y': h},
    {'name': 'mascot_front_peek.png', 'cy': 1600, 'cx': 980, 'min_x': 600, 'max_x': 1350, 'min_y': 1300, 'max_y': h},
    {'name': 'mascot_reading.png', 'cy': 1600, 'cx': 1600, 'min_x': 1300, 'max_x': w, 'min_y': 1300, 'max_y': h}
]

for item in centers:
    start_y, start_x = item['cy'], item['cx']
    q = deque([(start_y, start_x)])
    comp_mask = np.zeros((h, w), dtype=bool)
    comp_mask[start_y, start_x] = True
    
    while q:
        cy, cx = q.popleft()
        for dy, dx in [(-1,0), (1,0), (0,-1), (0,1), (-1,-1), (-1,1), (1,-1), (1,1)]:
            ny, nx = cy + dy, cx + dx
            if item['min_y'] <= ny < item['max_y'] and item['min_x'] <= nx < item['max_x']:
                if not comp_mask[ny, nx] and alpha[ny, nx] > 5:
                    comp_mask[ny, nx] = True
                    q.append((ny, nx))
                    
    coords = np.argwhere(comp_mask)
    if coords.size > 0:
        min_y, min_x = coords.min(axis=0)
        max_y, max_x = coords.max(axis=0)
        char_arr = np.zeros((max_y - min_y + 1, max_x - min_x + 1, 4), dtype=np.uint8)
        sub_orig = arr[min_y:max_y+1, min_x:max_x+1]
        sub_mask = comp_mask[min_y:max_y+1, min_x:max_x+1]
        char_arr[sub_mask] = sub_orig[sub_mask]
        char_img = Image.fromarray(char_arr, 'RGBA')
        
        dest_docs = os.path.join('docs/assets/mascot', item['name'])
        char_img.save(dest_docs, 'PNG')
        dest_src = os.path.join('src/assets', item['name'])
        if os.path.exists(dest_src) or item['name'] == 'mascot_relaxing.png':
            char_img.save(dest_src, 'PNG')
        print(item['name'], 'size:', char_img.size)

print('Done recropping all mascots cleanly!')
