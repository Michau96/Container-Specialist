with open('src/components/BalconySetupModal.tsx', 'r') as f:
    text = f.read()

# Make selected state very visible
text = text.replace("bg-stone-100 dark:bg-stone-700 text-stone-900 dark:text-stone-100 font-semibold ring-1.5 ring-stone-500/40 shadow-xs", "bg-stone-100 dark:bg-stone-200 text-stone-900 dark:text-stone-900 font-semibold ring-1.5 ring-stone-500/40 dark:ring-stone-400 shadow-xs")

# For unselected state
text = text.replace("dark:bg-stone-800/50 hover:bg-stone-100/70 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300", "dark:bg-stone-800/80 hover:bg-stone-100/70 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300")

# For pot/care buttons selected state
text = text.replace("bg-stone-100 dark:bg-stone-700 text-stone-900 dark:text-stone-100 font-medium", "bg-stone-100 dark:bg-stone-200 text-stone-900 dark:text-stone-900 font-medium")
text = text.replace("bg-stone-100 dark:bg-stone-700 text-stone-900 dark:text-stone-100 font-semibold", "bg-stone-100 dark:bg-stone-200 text-stone-900 dark:text-stone-900 font-semibold")

# For pot checkbox 
text = text.replace("bg-stone-900 dark:bg-stone-100 border-stone-900 dark:border-stone-100 text-white dark:text-stone-900", "bg-stone-900 dark:bg-stone-900 border-stone-900 dark:border-stone-900 text-white dark:text-white")

# Remove extra dark:bg-stone-900 on unselected orientation buttons
text = text.replace("bg-stone-50/40 dark:bg-stone-900 hover:bg-stone-100/70 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300", "bg-stone-50/40 dark:bg-stone-800/80 hover:bg-stone-100/70 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300")

# Fix missing Check dark text
text = text.replace("text-stone-900 dark:text-stone-100 shrink-0 mt-0.5", "text-stone-900 dark:text-stone-900 shrink-0 mt-0.5")

with open('src/components/BalconySetupModal.tsx', 'w') as f:
    f.write(text)

