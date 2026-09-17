import re

with open('src/components/MyCropsView.tsx', 'r') as f:
    lines = f.readlines()

div_count = 0
for i, line in enumerate(lines):
    if i < 208:
        continue
    opens = len(re.findall(r'<div[\s>]', line))
    closes = len(re.findall(r'</div\s*>', line))
    div_count += opens - closes
    if opens > 0 or closes > 0:
        print(f"{i+1:3d} | d:{div_count:2d} | +{opens} -{closes} | {line.strip()[:60]}")

