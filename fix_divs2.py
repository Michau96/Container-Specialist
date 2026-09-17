import re
with open('src/components/MyCropsView.tsx', 'r') as f:
    text = f.read()

text = re.sub(r'(\)[ \t]*}\n)[ \t]*{/\* 4\. Indywidualny', r'\1        </div>\n      {/* 4. Indywidualny', text)

with open('src/components/MyCropsView.tsx', 'w') as f:
    f.write(text)

