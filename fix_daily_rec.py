with open('src/components/DailyRecommendationCard.tsx', 'r') as f:
    text = f.read()

text = text.replace('from-stone-900 via-stone-800 to-stone-900 text-stone-100 rounded-3xl p-5 sm:p-7 shadow-md border border-stone-800', 'from-emerald-950 via-teal-900 to-emerald-950 text-emerald-50 rounded-[2rem] p-5 sm:p-7 shadow-lg border border-emerald-800/80 shadow-emerald-900/20')

text = text.replace('border-b border-stone-800', 'border-b border-emerald-800/50')
text = text.replace('bg-stone-800/80 px-3 py-1.5 rounded-xl border border-stone-700/60 text-xs text-stone-300', 'bg-emerald-900/60 px-3 py-1.5 rounded-xl border border-emerald-700/60 text-xs text-emerald-200')
text = text.replace('text-stone-300 mt-1', 'text-emerald-200 mt-1')

text = text.replace('bg-stone-800/60 hover:bg-stone-800/90 rounded-2xl p-4 sm:p-5 border border-stone-700/60 transition-all flex flex-col justify-between', 'bg-emerald-900/40 hover:bg-emerald-900/70 rounded-[1.5rem] p-4 sm:p-5 border border-emerald-800/50 transition-all flex flex-col justify-between')

text = text.replace('text-stone-100', 'text-white')
text = text.replace('text-stone-400', 'text-emerald-300')
text = text.replace('text-stone-300', 'text-emerald-200')
text = text.replace('bg-white/10 text-stone-100', 'bg-emerald-800/50 text-white')

with open('src/components/DailyRecommendationCard.tsx', 'w') as f:
    f.write(text)

