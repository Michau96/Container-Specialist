with open('src/components/MyCropsView.tsx', 'r') as f:
    text = f.read()

details_panel = """
            {/* Details Panel */}
            <div className="flex-1 min-w-0 w-full">
              {myCrops.map((crop, index) => {
                const cropKey = getCropKey(crop, index);
                if (cropKey !== selectedCropId) return null;
                const plant = allPlants.find((p) => p.id === crop.plantId);
                if (!plant) return null;

                const varietyName = crop.selectedVariety || plant?.top_varieties?.[0]?.name || plant?.varieties?.[0] || 'Standardowa';
                const potCount = crop.potCount || crop.pot?.quantity || 1;
                const isEditing = editingCropId === cropKey;

                return (
                  <div key={cropKey} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 sm:p-7 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-stone-100 dark:bg-stone-800 overflow-hidden shrink-0 border border-stone-200 dark:border-stone-700 flex items-center justify-center text-3xl">
                          {plant.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">{plant.name}</h2>
                            {potCount > 1 && (
                              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800">
                                {potCount} sztuki
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="font-semibold text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded-lg">
                              Odmiana: {varietyName}
                            </span>
                            {crop.customPotName && (
                              <span className="font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                                📍 {crop.customPotName}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setConfiguringCropPlant({ plant, crop })}
                          className="p-2 text-stone-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-stone-800 rounded-xl transition tooltip-trigger"
                          title="Skonfiguruj donicę i siew"
                        >
                          <Settings2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => isEditing ? saveEdit(crop) : startEdit(crop, cropKey)}
                          className={`p-2 rounded-xl transition ${isEditing ? 'text-white bg-emerald-600 hover:bg-emerald-700' : 'text-stone-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-stone-800'}`}
                          title={isEditing ? 'Zapisz notatki' : 'Edytuj notatki'}
                        >
                          {isEditing ? <Check className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
                        </button>
                        <button
                          onClick={() => onRemoveCrop(crop.id || crop.plantId)}
                          className="p-2 text-stone-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-stone-800 rounded-xl transition"
                          title="Usuń uprawę"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="mb-6 space-y-4 p-4 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-200 dark:border-stone-700">
                        <div>
                          <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5 uppercase tracking-wider">
                            Własna nazwa (np. "Barierka lewa")
                          </label>
                          <input
                            type="text"
                            value={editPotName}
                            onChange={(e) => setEditPotName(e.target.value)}
                            className="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500"
                            placeholder="Wpisz nazwę własną uprawy..."
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5 uppercase tracking-wider">
                            Prywatne notatki
                          </label>
                          <textarea
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            className="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 min-h-[80px] resize-none"
                            placeholder="Dodaj notatki (np. data wschodu, zaobserwowane szkodniki)..."
                          />
                        </div>
                      </div>
                    )}

                    {!isEditing && crop.notes && (
                      <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-2xl text-sm text-amber-900 dark:text-amber-200">
                        <div className="font-bold flex items-center gap-1 mb-1 text-xs uppercase tracking-wider">
                          <BookOpen className="w-3.5 h-3.5" /> Twoje notatki:
                        </div>
                        <p className="whitespace-pre-wrap leading-relaxed">{crop.notes}</p>
                      </div>
                    )}

                    <div className="mt-6 border-t border-stone-100 dark:border-stone-800 pt-6">
                      <CropGrowthPhaseTimeline
                        plant={plant}
                        crop={crop}
                        onOpenPotSowingModal={() => setConfiguringCropPlant({ plant, crop })}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
"""

target_str = "        ) : (\n      {/* 4. Indywidualny Kalendarz Moich Upraw */}"
text = text.replace(target_str, "        ) : (\n" + details_panel + "\n      {/* 4. Indywidualny Kalendarz Moich Upraw */}")

with open('src/components/MyCropsView.tsx', 'w') as f:
    f.write(text)

