#!/usr/bin/env python3
# Lay screenshots out in a grid with captions, as one small JPEG (for PR descriptions).
# usage: grid.py out.jpg cellwidth cols "caption1|file1" "caption2|file2" ...
import sys
from PIL import Image, ImageDraw, ImageFont
out, cw, cols, *items = sys.argv[1:]
cw, cols = int(cw), int(cols)
cells = []
for it in items:
    cap, path = it.split('|', 1)
    im = Image.open(path).convert('RGB')
    im = im.resize((cw, round(im.height * cw / im.width)), Image.LANCZOS)
    cells.append((cap, im))
try:
    font = ImageFont.truetype('/System/Library/Fonts/Menlo.ttc', 13)
except Exception:
    font = ImageFont.load_default()
rows = [cells[i:i + cols] for i in range(0, len(cells), cols)]
gap, cap_h = 8, 22
rh = [max(im.height for _, im in r) + cap_h for r in rows]
sheet = Image.new('RGB', (cols * cw + gap * (cols - 1), sum(rh) + gap * (len(rows) - 1)), (255, 255, 255))
d = ImageDraw.Draw(sheet)
y = 0
for r, h in zip(rows, rh):
    for c, (cap, im) in enumerate(r):
        x = c * (cw + gap)
        d.text((x + 4, y + 3), cap, fill=(20, 20, 20), font=font)
        sheet.paste(im, (x, y + cap_h))
    y += h + gap
sheet.save(out, 'JPEG', quality=62, optimize=True)
print(out, sheet.size)
