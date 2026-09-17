with open('src/components/MyCropsView.tsx', 'r') as f:
    text = f.read()

text = text.replace('      {myCrops.length > 0 && (  {/* Sidebar */}\n', '      {myCrops.length > 0 && (\n')

text = text.replace('        ) : (\n        )}\n        </div>', '        ) : (\n')
text = text.replace('              })}\n            </div>\n        )}\n        </div>', '              })}\n            </div>\n          )}\n        </div>\n')

with open('src/components/MyCropsView.tsx', 'w') as f:
    f.write(text)
