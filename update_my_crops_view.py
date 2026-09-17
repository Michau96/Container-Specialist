with open('src/components/MyCropsView.tsx', 'r') as f:
    text = f.read()

import re

# Update empty state
old_empty = '''        {myCrops.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 space-y-4">
            <Sprout className="w-12 h-12 text-stone-400 mx-auto" />
            <div>
              <h4 className="text-lg font-bold text-stone-800 dark:text-stone-200">
                Nie masz jeszcze żadnych dodanych upraw
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-md mx-auto">
                Dodaj swoją pierwszą uprawę wybierając jedną z popularnych roślin poniżej, lub przejdź do pełnego katalogu rekomendacji.
              </p>
            </div>'''
new_empty = '''        {myCrops.length === 0 ? (
          <div className="text-center py-20 bg-gradient-to-b from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-stone-900 rounded-[2rem] border border-emerald-100/50 dark:border-stone-800 p-8 space-y-6 shadow-sm">
            <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Sprout className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h4 className="text-2xl font-black text-stone-800 dark:text-stone-100 tracking-tight">
                Zacznij swój balkonowy ogród! 🌱
              </h4>
              <p className="text-sm text-stone-500 dark:text-stone-400 mt-2 max-w-md mx-auto leading-relaxed">
                Twój balkon ma duży potencjał. Dodaj swoją pierwszą uprawę wybierając jedną z najłatwiejszych i najchętniej wybieranych roślin poniżej. Pomożemy Ci zadbać o nią krok po kroku.
              </p>
            </div>'''
            
text = text.replace(old_empty, new_empty)

with open('src/components/MyCropsView.tsx', 'w') as f:
    f.write(text)

