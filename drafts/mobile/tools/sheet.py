#!/usr/bin/env python3
# Tile several screenshots side by side as one small JPEG for viewing.
# usage: sheet.py out.jpg cellwidth in1.jpg in2.jpg ...
import sys
from PIL import Image
out, cw, *ins = sys.argv[1:]
cw = int(cw)
ims = []
for p in ins:
    im = Image.open(p).convert('RGB')
    h = round(im.height * cw / im.width)
    ims.append(im.resize((cw, h), Image.LANCZOS))
H = max(i.height for i in ims)
sheet = Image.new('RGB', (cw * len(ims) + 8 * (len(ims) - 1), H), (128, 128, 128))
for n, im in enumerate(ims):
    sheet.paste(im, (n * (cw + 8), 0))
sheet.save(out, 'JPEG', quality=60)
print(out, sheet.size)
