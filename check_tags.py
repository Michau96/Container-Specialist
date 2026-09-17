import re

with open('src/components/MyCropsView.tsx', 'r') as f:
    lines = f.readlines()

div_count = 0
for i, line in enumerate(lines):
    # This is a very rough heuristic but usually works if formatted
    opens = len(re.findall(r'<div[\s>]', line))
    closes = len(re.findall(r'</div\s*>', line))
    div_count += opens - closes
    if i > 200 and (opens > 0 or closes > 0):
        # uncomment to trace
        pass

print("Final div count:", div_count)

# Let's just find where it becomes negative or ends up
