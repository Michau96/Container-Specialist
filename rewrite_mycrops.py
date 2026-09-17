with open('src/components/MyCropsView.tsx', 'r') as f:
    text = f.read()

# find return (
start_idx = text.find('  return (\n    <div className="space-y-8">')
if start_idx == -1:
    print("Could not find start index")
    exit(1)

text_return = text[start_idx:]

header_start = text_return.find('{/* 1. Header Banner of My Crops */}')
header_end = text_return.find('{/* 2. Dzienna rekomendacja')
header_str = text_return[header_start:header_end]

daily_start = header_end
daily_end = text_return.find('{/* 3. Kafelki Moich Upraw')
daily_str = text_return[daily_start:daily_end]

empty_state_start = text_return.find('{myCrops.length === 0 ? (')
empty_state_end = text_return.find(') : (') + len(') : (\n')
empty_state_prefix = text_return[empty_state_start:empty_state_end]

sidebar_start = text_return.find('{/* Sidebar */}')
sidebar_end = text_return.find('{/* Details Panel */}')
sidebar_str = text_return[sidebar_start:sidebar_end]

details_start = sidebar_end
details_end = text_return.find('              })}\n            </div>\n          </div>') + len('              })}\n            </div>\n')
details_str = text_return[details_start:details_end]

calendar_start = text_return.find('{/* 4. Indywidualny Kalendarz Moich Upraw */}')
calendar_end = text_return.find('    </div>\n  );\n};')
calendar_str = text_return[calendar_start:calendar_end]

# Process
sidebar_str_mod = sidebar_str.replace('md:w-64 lg:w-72', 'xl:w-72 hidden md:block').replace('md:sticky md:top-24', 'xl:sticky xl:top-24').replace('<div className="w-full', '<div className="order-2 xl:order-1 w-full')
sidebar_final = "      {/* 1. Left Sidebar: Szybki wybór uprawy */}\n      {myCrops.length > 0 && (\n  " + sidebar_str_mod + "      )}\n"
daily_final = daily_str.replace('/>', 'layout="vertical"\n      />')

new_return = (
    '  return (\n'
    '    <div className="flex flex-col xl:flex-row gap-6 items-start w-full">\n'
    + sidebar_final +
    '      {/* 2. Main Content (Header + Details + Calendar) */}\n'
    '      <div className="order-1 xl:order-2 flex-1 min-w-0 w-full flex flex-col gap-8">\n'
    '        ' + header_str +
    '        {/* 3. Kafelki Moich Upraw (Details only) */}\n'
    '        <div className="space-y-4">\n'
    '          <div className="flex items-center justify-between gap-2">\n'
    '            <div>\n'
    '              <h3 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 tracking-tight flex items-center gap-2">\n'
    '                <span>Kafelki Moich upraw</span>\n'
    '                <span className="text-xs font-normal text-stone-500">\n'
    '                  (z nazwą odmiany i liczbą jednakowych donic)\n'
    '                </span>\n'
    '              </h3>\n'
    '              <p className="text-xs text-stone-500 dark:text-stone-400">\n'
    '                Każdy kafelek prezentuje precyzyjną odmianę, liczbę identycznych donic, schemat faz wzrostu oraz dedykowane zalecenia podlewania.\n'
    '              </p>\n'
    '            </div>\n'
    '            <button\n'
    '              onClick={onNavigateToSearch}\n'
    '              className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"\n'
    '            >\n'
    '              <span>+ Dodaj kolejną roślinę z bazy</span>\n'
    '            </button>\n'
    '          </div>\n'
    '        ' + empty_state_prefix + details_str + '        )}\n'
    '        </div>\n'
    '      ' + calendar_str +
    '      </div>\n\n'
    '      {/* 3. Right Sidebar: Daily Recommendations */}\n'
    '      <div className="order-3 w-full xl:w-80 shrink-0 xl:sticky xl:top-24 flex flex-col gap-6">\n'
    '      ' + daily_final +
    '      </div>\n'
    '    </div>\n'
    '  );\n'
    '};\n'
)

final_text = text[:start_idx] + new_return
with open('src/components/MyCropsView.tsx', 'w') as f:
    f.write(final_text)

print("Success")
