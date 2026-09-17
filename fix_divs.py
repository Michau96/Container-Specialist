with open('src/components/MyCropsView.tsx', 'r') as f:
    text = f.read()

text = text.replace('            </div>\n          )}\n      {/* 4. Indywidualny Kalendarz Moich Upraw */}', '            </div>\n          )}\n        </div>\n      {/* 4. Indywidualny Kalendarz Moich Upraw */}')

with open('src/components/MyCropsView.tsx', 'w') as f:
    f.write(text)

