with open('src/components/MyCropsView.tsx', 'r') as f:
    text = f.read()

text = text.replace('className="px-3 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-stone-800 dark:text-stone-200 hover:text-emerald-900 dark:hover:text-emerald-300 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"', 'className="px-4 py-2.5 bg-white dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 text-stone-700 dark:text-stone-200 hover:text-emerald-800 dark:hover:text-emerald-300 rounded-2xl border border-stone-200/80 dark:border-stone-700 text-sm font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"')

text = text.replace('className="mt-2 px-5 py-2.5 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-xl text-xs sm:text-sm font-semibold hover:bg-stone-800 dark:hover:bg-stone-200 transition cursor-pointer"', 'className="mt-6 px-6 py-3 bg-emerald-700 dark:bg-emerald-600 text-white dark:text-white rounded-2xl text-sm font-bold hover:bg-emerald-800 dark:hover:bg-emerald-700 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer flex items-center gap-2 mx-auto"')

text = text.replace('Przejdź do katalogu "Szukaj nowych upraw"', 'Przeglądaj pełny katalog roślin')

with open('src/components/MyCropsView.tsx', 'w') as f:
    f.write(text)

