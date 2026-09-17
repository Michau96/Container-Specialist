with open('src/components/MyCropsView.tsx', 'r') as f:
    text = f.read()

text = text.replace('{myCrops.length > 0 && (  {/* Sidebar */}            <div', '{myCrops.length > 0 && (            <div')
text = text.replace('              })}\n            </div>\n          )}\n        </div>\n      {/* 4. Indywidualny Kalendarz Moich Upraw */}', '              })}\n            </div>\n        </div>\n      {/* 4. Indywidualny Kalendarz Moich Upraw */}')

with open('src/components/MyCropsView.tsx', 'w') as f:
    f.write(text)
