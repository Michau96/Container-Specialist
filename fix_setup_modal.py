with open('src/components/BalconySetupModal.tsx', 'r') as f:
    text = f.read()

# Fix card backgrounds
text = text.replace('bg-white dark:bg-stone-800 p-4 rounded-2xl', 'bg-white dark:bg-stone-900/50 p-4 rounded-2xl')

# Fix selects
text = text.replace('bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100', 'bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100')

# Fix region macro tabs
text = text.replace("bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700", "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 border border-transparent dark:border-stone-700")

# Fix unselected grid buttons
text = text.replace("bg-stone-50/60 dark:bg-stone-800/50 hover:bg-stone-100/70 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300", "bg-stone-50/60 dark:bg-stone-800/50 hover:bg-stone-100/70 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300")

# Fix orientation buttons
text = text.replace("bg-stone-50/40 dark:bg-stone-800/50 hover:bg-stone-100/70 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300", "bg-stone-50/40 dark:bg-stone-900 hover:bg-stone-100/70 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300")

# Fix selected grid buttons
text = text.replace("bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100", "bg-stone-100 dark:bg-stone-700 text-stone-900 dark:text-stone-100")

# Fix pot buttons unselected
text = text.replace("bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300", "bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300")

# Fix pot buttons check box unselected
text = text.replace("bg-white dark:bg-stone-800", "bg-white dark:bg-stone-900")

with open('src/components/BalconySetupModal.tsx', 'w') as f:
    f.write(text)

