#!/usr/bin/env python3
from PIL import Image
from pathlib import Path
import sys

root = Path(__file__).resolve().parent
png = root / 'assets' / 'icon.png'
ico = root / 'assets' / 'icon.ico'

if not png.exists():
    print(f"Source PNG not found: {png}")
    sys.exit(2)

sizes = [(256,256),(128,128),(64,64),(48,48),(32,32),(24,24),(16,16)]

try:
    img = Image.open(png)
    # Ensure RGBA for transparency
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    img.save(ico, format='ICO', sizes=sizes)
    print(f"Generated ICO: {ico}")
    sys.exit(0)
except Exception as e:
    print(f"Failed to generate ICO: {e}")
    sys.exit(1)
