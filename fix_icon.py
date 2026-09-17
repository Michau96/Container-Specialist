with open('src/components/MyCropsView.tsx', 'r') as f:
    text = f.read()

text = text.replace('{plant.icon}', '<Sprout className="w-8 h-8 text-emerald-600" />')

with open('src/components/MyCropsView.tsx', 'w') as f:
    f.write(text)

