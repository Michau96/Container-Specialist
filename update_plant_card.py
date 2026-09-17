with open('src/components/PlantCard.tsx', 'r') as f:
    text = f.read()

text = text.replace("bg-gradient-to-b from-stone-100/70 via-stone-50/30 to-white dark:from-stone-850/40 dark:via-stone-900/60 dark:to-stone-900", "bg-white/80 dark:bg-stone-900")
text = text.replace("border border-stone-200/70", "border border-stone-200")
text = text.replace("bg-white/70", "bg-white/90")
text = text.replace("rounded-[1.5rem] border ${theme.border} ${theme.cardBg} shadow-xs", "rounded-[1.5rem] border ${theme.border} ${theme.cardBg} shadow-sm backdrop-blur-sm")

with open('src/components/PlantCard.tsx', 'w') as f:
    f.write(text)

