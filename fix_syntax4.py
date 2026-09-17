with open('src/components/MyCropsView.tsx', 'r') as f:
    text = f.read()

# Fix 1: ) : ( \n {/* Details Panel */}
text = text.replace('        ) : (\n\n            {/* Details Panel */}\n            <div', '        ) : (\n            <div')
text = text.replace('        ) : (\n            {/* Details Panel */}\n            <div', '        ) : (\n            <div')

# Let's fix the brackets
with open('src/components/MyCropsView.tsx', 'w') as f:
    f.write(text)

