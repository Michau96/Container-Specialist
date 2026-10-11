import { Plant, Language } from '../types';
import defaultPlantsData from '../data/plants.json';

const defaultPlantsList = defaultPlantsData as unknown as Array<{ id: string; name: string }>;
export const PLANT_NAMES_PL: Record<string, string> = {};
defaultPlantsList.forEach((p) => {
  if (p && p.id && p.name) {
    PLANT_NAMES_PL[p.id] = p.name;
  }
});

export interface PlantTranslation {
  name: string;
  summary: string;
  category?: string;
  difficulty_label?: string;
  detailed_guide?: string;
  pot_material?: string;
  pot_drainage?: string;
  fertilizer_what?: string;
  nutrition_benefits?: string;
}

export const PLANT_TRANSLATIONS_EN: Record<string, PlantTranslation> = {
  'pomidor-karlowy': {
    name: 'Dwarf Cherry Tomato',
    summary: 'Compact, heavy-yielding bush cherry tomatoes ideal for pots and sunny balconies.',
    category: 'Nightshades',
    difficulty_label: 'Moderate (requires regular watering & balanced nutrition)',
    detailed_guide: `
### 1. Sowing & Seedling Care (March)
Sow seeds in mid-March in small propagation cells on a sunny windowsill at 20–24°C. Once 2–3 true leaves appear, prick out into individual 0.5L nursery pots.

### 2. Hardening & Planting into Pots (May)
Begin hardening off seedlings in early May by placing them outside for a few hours on warm days. Transplant permanently into final pots (min. 10–15L per plant) after May 15th (post-frost). Plant deeper than the cup level to stimulate extra adventitious root growth.

### 3. Balcony Maintenance
- **Watering:** In hot summer months, water daily early in the morning or at dusk. Never wet the foliage to avoid fungal blight.
- **Support:** Although varieties are dwarf, bamboo stakes help support heavy fruit trusses.
- **Suckering:** Dwarf bush types don't need suckering, but prune yellowing bottom leaves touching the soil.

### Golden Rules for Container Tomatoes:
• **Drainage:** Pots must have drainage holes and a 3–5 cm layer of expanded clay (leca).
• **Substrate:** Use potting soil enriched with 20% perlite for maximum aeration.
• **Container:** Avoid black plastic pots in direct southern sun; terracotta or fabric smart pots prevent root overheating.
• **Feeding:** Feed with biohumus or potassium-rich organic tomato fertilizer every 7–10 days during flowering and fruiting.`,
    pot_material: 'Light-colored plastic or terracotta containers (avoid dark pots in hot sun)',
    pot_drainage: 'Drainage holes + 3–4 cm layer of expanded clay pebbles',
    fertilizer_what: 'Liquid tomato fertilizer rich in potassium and calcium to prevent blossom end rot',
    nutrition_benefits: 'Rich in lycopene – a potent antioxidant protecting heart health and cells.',
  },
  'papryka-chili': {
    name: 'Potted Chili & Hot Peppers',
    summary: 'Decorative hot chili peppers with fiery heat, thriving in warm, sunny container spots.',
    category: 'Nightshades',
    difficulty_label: 'Easy to moderate (loves heat and sunny balcony spots)',
    detailed_guide: `
### 1. Sowing (February – March)
Hot peppers require a long growing season. Sow early in warm soil (22–25°C). Keep moist with a humidity dome.

### 2. Transplanting to Patio Pots
Transfer to final 5–10L containers after mid-May. Chili peppers adore sheltered warm corners, heat reflected from balcony walls, and full southern sun.

### 3. Watering & Harvesting
Allow the top centimeter of soil to dry out between waterings. Harvest peppers once they turn vibrant red, orange, or yellow for maximum capsaicin and heat.`,
    pot_material: 'Ceramic, terracotta, or sturdy UV-stabilized plastic pots',
    pot_drainage: 'Holes + 3 cm drainage layer',
    fertilizer_what: 'Organic balanced tomato and pepper feed',
    nutrition_benefits: 'Abundant in capsaicin and Vitamin C, boosting metabolism and immunity.',
  },
  'rzodkiewka': {
    name: 'Balcony Radish',
    summary: 'Fast-growing crunchy radishes ready to harvest in 25–30 days from window boxes.',
    category: 'Cruciferous',
    difficulty_label: 'Very easy (ideal for beginners and kids)',
    detailed_guide: `
### 1. Direct Sowing (March – May & August – September)
Sow seeds directly 1.5 cm deep into balcony boxes, spaced 3–4 cm apart. Radishes dislike hot summer mid-days (they bolt to seed), so spring and autumn are ideal.

### 2. Watering & Soil
Maintain constant gentle moisture. Uneven watering causes cracked roots or overly pungent, woody texture.`,
    pot_material: 'Standard balcony railing boxes (depth 15 cm)',
    pot_drainage: 'Perforated bottom with small drainage layer',
    fertilizer_what: 'Light compost; avoid excess nitrogen which causes all leaf and no root',
    nutrition_benefits: 'Low in calories, rich in glucosinolates and refreshing crunchy hydration.',
  },
  'salata-listkowa': {
    name: 'Cut-and-Come-Again Leaf Lettuce',
    summary: 'Tender salad greens that regrow after harvesting outer leaves throughout spring and summer.',
    category: 'Asteraceae',
    difficulty_label: 'Very easy',
    detailed_guide: `
### 1. Sowing
Sow thinly on the surface in shallow balcony planters. Germinates quickly even in cool spring weather.

### 2. Harvest Method
Pick the outer leaves as needed for your daily lunch bowls. The central heart continues growing new tender leaves for weeks!`,
    pot_material: 'Shallow boxes and window planters (12–18 cm deep)',
    pot_drainage: 'Standard drainage holes',
    fertilizer_what: 'Mild organic biohumus worm castings',
    nutrition_benefits: 'High in folate, dietary fiber, beta-carotene, and natural antioxidants.',
  },
  'szpinak-balkonowy': {
    name: 'Balcony Spinach',
    summary: 'Cold-tolerant leafy green rich in iron, perfect for early spring and autumn container gardening.',
    category: 'Amaranthaceae',
    difficulty_label: 'Easy',
    detailed_guide: `
### Sowing & Growth
Thrives in cool temperatures (10–18°C). Great for spring and late summer/autumn crops. Pick young leaves for salads or mature leaves for sautéing.`,
    pot_material: 'Balcony boxes or 3–5L planters',
    pot_drainage: 'Good bottom drainage',
    fertilizer_what: 'Gentle organic fertilizer with trace minerals',
    nutrition_benefits: 'Rich in iron, lutein, vitamin K, and magnesium.',
  },
  'fasola-karlowa': {
    name: 'Dwarf Bush Green Beans',
    summary: 'Self-supporting dwarf green beans with tender, stringless pods and attractive white flowers.',
    category: 'Legumes',
    difficulty_label: 'Easy',
    detailed_guide: `
### Sowing (May – June)
Sow 2–3 seeds per hole directly in pots (depth 3 cm) after late spring frost risks. Dwarf bushes don't need tall trellises. Beans enrich the soil with atmospheric nitrogen.`,
    pot_material: 'Medium to large pots (min. 10L)',
    pot_drainage: 'Good drainage with gravel or leca',
    fertilizer_what: 'Phosphorus and potassium feed; nitrogen is self-fixed by root nodules',
    nutrition_benefits: 'High in vegetable protein, dietary fiber, and vitamin A.',
  },
  'ogorek-krzaczasty': {
    name: 'Bush Cucumber (Patio / Trellis)',
    summary: 'Crisp salad cucumbers with compact vines suitable for deep pots and balcony railings.',
    category: 'Cucurbits',
    difficulty_label: 'Moderate',
    detailed_guide: `
### Growth & Trellising
Plant in 15–20L pots. Train the short vines up a balcony railing or bamboo obelisk. Water generously in hot afternoons to keep cucumbers sweet and crunch-crisp.`,
    pot_material: 'Deep 15–25L pots or grow bags',
    pot_drainage: 'Generous drainage with 4 cm clay pebbles',
    fertilizer_what: 'High potassium vegetable liquid feed every week during fruiting',
    nutrition_benefits: 'Extremely hydrating (96% water) with silica for skin and joint health.',
  },
  'szczypiorek-ziola': {
    name: 'Garden Chives',
    summary: 'Perennial aromatic chives with edible purple pompom flowers and onion-like taste.',
    category: 'Amaryllidaceae',
    difficulty_label: 'Very easy',
    detailed_guide: `
### Evergreen Culinary Staple
Cut regularly with kitchen scissors to promote dense regrowth. Both stems and purple blossoms are edible and make stunning salad garnishes. Survives winter in pots with light mulching.`,
    pot_material: 'Small pots (2–5L) or edge of mixed window boxes',
    pot_drainage: 'Standard drainage',
    fertilizer_what: 'Compost tea or biohumus once a month',
    nutrition_benefits: 'Antibacterial sulfur compounds, vitamin C and iron.',
  },
  'marchew-mini': {
    name: 'Round Baby Carrot',
    summary: 'Short, spherical gourmet carrots that grow quickly without needing deep garden soil.',
    category: 'Apiaceae',
    difficulty_label: 'Easy',
    detailed_guide: `
### Sowing & Soil
Sow directly in light, sandy compost with perlite. Because roots are round like radishes, they don't deform in shallow container depths (15–20 cm).`,
    pot_material: 'Boxes and planters with min. 18 cm depth',
    pot_drainage: 'Well-draining bottom',
    fertilizer_what: 'Low-nitrogen organic fertilizer',
    nutrition_benefits: 'Abundant in beta-carotene for eye and skin health.',
  },
  'jarmuz-karlowy': {
    name: 'Dwarf Curly Kale',
    summary: 'Frost-hardy superfood with ruffled leaves, producing nutritious greens well into winter.',
    category: 'Cruciferous',
    difficulty_label: 'Easy',
    detailed_guide: `
### Resilient Autumn & Winter Crop
Tolerates frost down to -10°C; frost actually makes the leaves taste sweeter! Harvest outer leaves all winter long.`,
    pot_material: 'Pots 10–15L',
    pot_drainage: 'Standard drainage holes',
    fertilizer_what: 'Balanced organic feed during late summer',
    nutrition_benefits: 'Phenomenal source of vitamins K, A, C and calcium.',
  },
  'rukola-balkonowa': {
    name: 'Wild Rocket (Arugula)',
    summary: 'Peppery salad green that germinates in days and regrows repeatedly after cutting.',
    category: 'Brassicaceae',
    difficulty_label: 'Very easy',
    detailed_guide: `
### Quick Kitchen Greens
Seeds sprout in 3–5 days. Ready to clip within 20 days. Best grown in spring and early autumn to avoid premature flowering.`,
    pot_material: 'Shallow balcony boxes (10–15 cm)',
    pot_drainage: 'Good drainage',
    fertilizer_what: 'Light biohumus',
    nutrition_benefits: 'Potent glucosinolates, calcium, and peppery antioxidants.',
  },
  'roszponka': {
    name: "Corn Salad (Lamb's Lettuce)",
    summary: "Nutty winter green thriving in cool weather and balcony boxes when other crops fade.",
    category: 'Valerianaceae',
    difficulty_label: 'Very easy',
    detailed_guide: `
### Cold-Weather Champion
Sow from late summer through autumn. Survives cold balcony nights and yields tender velvety rosettes throughout winter.`,
    pot_material: 'Standard balcony planter box',
    pot_drainage: 'Good drainage',
    fertilizer_what: 'Light compost mulch',
    nutrition_benefits: 'High in iron, omega-3 fatty acids, and vitamin C.',
  },
  'cukinia-balkonowa': {
    name: 'Miniature Patio Zucchini',
    summary: 'Compact bushy zucchini yielding tender baby fruits and golden edible blossoms.',
    category: 'Cucurbits',
    difficulty_label: 'Moderate',
    detailed_guide: `
### Warm Patio Giant
Requires a large container (min. 20–30L) and lots of sunshine. Harvest baby zukes at 12–15 cm for optimal sweetness and continued flowering.`,
    pot_material: 'Large pots or tubs (20–35L)',
    pot_drainage: 'Drainage holes with 5 cm leca layer',
    fertilizer_what: 'Rich organic compost and tomato/squash liquid fertilizer',
    nutrition_benefits: 'Gentle dietary fiber, lutein, and potassium.',
  },
  'rozmaryn-lekarski': {
    name: 'Medicinal Rosemary',
    summary: 'Sun-loving Mediterranean woody herb with piney aroma, ideal for terracotta pots.',
    category: 'Lamiaceae',
    difficulty_label: 'Easy',
    detailed_guide: `
### Mediterranean Sun Lover
Place in the sunniest balcony spot. Water sparingly — rosemary hates "wet feet". Bring indoors or protect near an insulated wall during deep winter frost.`,
    pot_material: 'Terracotta or unglazed clay pot',
    pot_drainage: 'High-drainage grit mix (30% sand/perlite)',
    fertilizer_what: 'Minimal feeding; mild seaweed extract in spring',
    nutrition_benefits: 'Rosmarinic acid, memory enhancement, and antibacterial properties.',
  },
  'tymianek-wlasciwy': {
    name: 'Common Thyme',
    summary: 'Drought-tolerant creeping aromatic herb for sunny balcony sills and culinary seasoning.',
    category: 'Lamiaceae',
    difficulty_label: 'Very easy',
    detailed_guide: `
### Low-Maintenance Herbal Gem
Loves warmth and well-draining soil. Thrives in shallow pots and sunny corners with minimal watering.`,
    pot_material: 'Terracotta or stone planters',
    pot_drainage: 'Excellent drainage',
    fertilizer_what: 'Hardly needs fertilizer; a touch of compost in spring is plenty',
    nutrition_benefits: 'Thymol essential oil, soothing for throat and digestion.',
  },
  'oregano-lebiodka': {
    name: 'Greek Oregano',
    summary: 'Intensely scented pizza herb forming dense mounds of flavorful leaves on warm balconies.',
    category: 'Lamiaceae',
    difficulty_label: 'Very easy',
    detailed_guide: `
### Classic Kitchen Herb
Pinch shoot tips frequently to encourage bushy growth. Sun intensifies the essential oils and flavor.`,
    pot_material: '3–8L pot',
    pot_drainage: 'Standard drainage',
    fertilizer_what: 'Organic liquid herb feed once a month',
    nutrition_benefits: 'One of the highest antioxidant herbs in the world.',
  },
  'szalwia-lekarska': {
    name: 'Common Culinary Sage',
    summary: 'Velvety grey-green leaves with herbal aroma, highly resistant to summer balcony heat.',
    category: 'Lamiaceae',
    difficulty_label: 'Easy',
    detailed_guide: `
### Resilient Evergreen
Velvety leaves withstand wind and heat. Prune lightly in spring to prevent woody stems. Wonderful in butter sauces and teas.`,
    pot_material: 'Terracotta pot (min. 5L)',
    pot_drainage: 'Porous soil with perlite',
    fertilizer_what: 'Occasional biohumus in spring',
    nutrition_benefits: 'Digestive aid, anti-inflammatory and antiseptic.',
  },
  'burak-lisciowy': {
    name: 'Rainbow Swiss Chard',
    summary: 'Ornamental vegetable with vibrant ruby, gold, and pink stems and delicious tender greens.',
    category: 'Amaranthaceae',
    difficulty_label: 'Very easy',
    detailed_guide: `
### Edible Landscaping
Both visually stunning and delicious. Cut outer stalks for sautéing like spinach, and stems like asparagus.`,
    pot_material: 'Medium pots (8–15L) or deep boxes',
    pot_drainage: 'Good drainage',
    fertilizer_what: 'Balanced organic fertilizer',
    nutrition_benefits: 'Synergistic mix of antioxidants, vitamins A, C, and magnesium.',
  },
  'truskawka-wisząca': {
    name: 'Trailing Everbearing Strawberry',
    summary: 'Cascading strawberry producing sweet red berries from May until the first autumn frosts.',
    category: 'Rosaceae',
    difficulty_label: 'Easy to moderate',
    detailed_guide: `
### Sweet Hanging Garden
Ideal for hanging baskets and balcony railing planters. Produces continuous runners with sweet fruit from late spring to October.`,
    pot_material: 'Hanging baskets or railing planters',
    pot_drainage: 'Lightweight potting mix with drainage layer',
    fertilizer_what: 'Specialty berry/fruit organic feed',
    nutrition_benefits: 'High vitamin C, ellagic acid, and sweet natural hydration.',
  },
  'poziomka-caloroczna': {
    name: 'Alpine Wild Strawberry',
    summary: 'Perennial runnerless alpine strawberry with fragrant, intensely sweet berries all summer long.',
    category: 'Rosaceae',
    difficulty_label: 'Very easy',
    detailed_guide: `
### Woodland Flavor on the Balcony
Doesn't produce invasive runners, making it tidy for pots. Bears tiny, intensely fragrant berries continuously from June to frost.`,
    pot_material: '3–6L pots or box edges',
    pot_drainage: 'Good drainage',
    fertilizer_what: 'Mild organic berry food',
    nutrition_benefits: 'Packed with wild antioxidants and soothing natural aromas.',
  },
  'borowka-patio': {
    name: 'Patio Dwarf Blueberry',
    summary: 'Compact acid-loving blueberry bush with gorgeous spring flowers and abundant antioxidant berries.',
    category: 'Ericaceae',
    difficulty_label: 'Moderate (requires acidic soil pH 4.0–4.8)',
    detailed_guide: `
### Dedicated Acid-Loving Bush
Crucial: plant strictly in acidic ericaceous soil (pH 4.0–4.8) with pine bark. Water with rainwater or filtered water to maintain acidity.`,
    pot_material: 'Large wooden barrel or sturdy plastic pot (20–35L)',
    pot_drainage: 'Acidic peat/bark mix with good leca layer',
    fertilizer_what: 'Ericaceous fertilizer formulated for blueberries/azaleas',
    nutrition_benefits: 'World-renowned for anthocyanins and brain-protective antioxidants.',
  },
  'malina-karlowa': {
    name: 'Dwarf Patio Raspberry (Thornless)',
    summary: 'Compact thornless raspberry bush specifically bred for 15–20L patio planters.',
    category: 'Rosaceae',
    difficulty_label: 'Easy to moderate',
    detailed_guide: `
### Kid-Friendly Balcony Raspberry
Thornless dwarf canes grow to just 70–90 cm tall. Bears delicious classic raspberries on current year wood in late summer.`,
    pot_material: 'Large pot (15–25L)',
    pot_drainage: 'Generous drainage',
    fertilizer_what: 'Organic berry fertilizer in spring and early summer',
    nutrition_benefits: 'High dietary fiber, ketones, and protective flavonoids.',
  },
  'arbuz-mini': {
    name: 'Miniature Sugar Baby Watermelon',
    summary: 'Short-vine container watermelon yielding sweet, personal-sized 1.5–2 kg melons in full sun.',
    category: 'Cucurbits',
    difficulty_label: 'Challenging (needs hot sun and large pot)',
    detailed_guide: `
### Tropical Sweet Luxury
Requires southern sun, sheltered warm balcony microclimate, and a minimum 25–30L container. Support developing melons with small net slings.`,
    pot_material: 'Deep 25–35L container',
    pot_drainage: 'Excellent drainage',
    fertilizer_what: 'High potassium liquid fruit fertilizer',
    nutrition_benefits: 'Refreshing lycopene and citrulline.',
  },
  'bazylia-wlasciwa': {
    name: 'Sweet Italian & Lemon Basil',
    summary: 'Classic pesto basil with lush fragrant foliage, reveling in warm balcony afternoons.',
    category: 'Lamiaceae',
    difficulty_label: 'Easy',
    detailed_guide: `
### King of Balcony Herbs
Loves warm sunshine and sheltered conditions. Water from the base to keep foliage dry. Pinch flower buds as soon as they appear to preserve tender leaf flavor.`,
    pot_material: '3–5L pots or terracotta bowls',
    pot_drainage: 'Standard drainage with perlite',
    fertilizer_what: 'Liquid biohumus every 2 weeks',
    nutrition_benefits: 'Volatile essential oils (eugenol, linalool) with anti-stress benefits.',
  },
  'mieta-donica': {
    name: 'Peppermint in Container',
    summary: 'Vigorous, refreshing tea herb that must be grown in separate pots to contain its runners.',
    category: 'Lamiaceae',
    difficulty_label: 'Very easy',
    detailed_guide: `
### Invigorating Fresh Tea
Always grow in its own dedicated container; its underground runners will take over shared planters! Trim vigorously for iced summer drinks.`,
    pot_material: 'Dedicated 5–10L pot',
    pot_drainage: 'Good drainage',
    fertilizer_what: 'Mild organic fertilizer',
    nutrition_benefits: 'Menthol for digestion, respiratory clarity, and natural cooling.',
  },
  'pietruszka-naciowa': {
    name: 'Flat-Leaf Italian Parsley',
    summary: 'Vitamin C packed biennial culinary herb providing fresh greens continuously.',
    category: 'Apiaceae',
    difficulty_label: 'Very easy',
    detailed_guide: `
### Daily Kitchen Essential
Tolerates semi-shade and partial sun. Snip outer stems at ground level; new sprigs rapidly unfurl from the center.`,
    pot_material: 'Medium pot or window box',
    pot_drainage: 'Standard drainage',
    fertilizer_what: 'Compost tea or biohumus',
    nutrition_benefits: 'Extremely dense in vitamin C, vitamin K, and refreshing iron.',
  },
  'pelargonia-balkonowa': {
    name: 'Balcony Geranium (Pelargonium)',
    summary: 'The classic European balcony flower, endlessly blooming and withstanding wind and sun.',
    category: 'Geraniaceae',
    difficulty_label: 'Very easy',
    detailed_guide: `
### Time-Tested Balcony Royalty
Endures hot sun, brief dry spells, and blustery winds. Deadhead spent blossoms weekly to stimulate waves of new colorful clusters.`,
    pot_material: 'Balcony railing planters and window boxes',
    pot_drainage: 'Standard drainage',
    fertilizer_what: 'Flowering plant fertilizer with high potassium',
    nutrition_benefits: 'Ornamental, mosquito-deterrent scents.',
  },
  'surfinia-kaskadowa': {
    name: 'Cascading Surfinia Petunia',
    summary: 'Spectacular trailing flower waterfall with thousands of fragrant trumpet blossoms.',
    category: 'Nightshades',
    difficulty_label: 'Moderate (thirsty and hungry)',
    detailed_guide: `
### Spectacular Summer Waterfall
Water daily in hot weather and feed with iron-enriched petunia fertilizer every week to keep foliage lush green and blooms cascading.`,
    pot_material: 'Hanging baskets and elevated railing boxes',
    pot_drainage: 'Good drainage',
    fertilizer_what: 'Petunia fertilizer with chelated iron',
    nutrition_benefits: 'Stunning pollinator-attracting blooms.',
  },
  'lawenda-donica': {
    name: 'English Lavender in Pot',
    summary: 'Calming purple flower spikes beloved by bees and releasing relaxing Mediterranean scents.',
    category: 'Lamiaceae',
    difficulty_label: 'Easy',
    detailed_guide: `
### Provençal Elegance
Requires full southern or western sun and gritty, alkaline soil. Prune lightly after summer blooming to maintain a neat rounded mound.`,
    pot_material: 'Terracotta pot',
    pot_drainage: 'Gritty soil with coarse sand/leca',
    fertilizer_what: 'Minimal feeding; prefers lean soil',
    nutrition_benefits: 'Aromatherapy, sleep aid, and natural moth repellent.',
  },
  'aksamitka-niska': {
    name: 'Dwarf French Marigold',
    summary: 'Bright cheerful orange and yellow flowers that naturally repel pests from vegetable pots.',
    category: 'Asteraceae',
    difficulty_label: 'Very easy',
    detailed_guide: `
### Nature’s Companion Plant
Excellent partner plant beside tomatoes and peppers. Root exudates deter soil nematodes while bright blossoms attract beneficial insects.`,
    pot_material: 'Small pots or interplanted with vegetables',
    pot_drainage: 'Standard drainage',
    fertilizer_what: 'General flowering fertilizer',
    nutrition_benefits: 'High in lutein and natural pest-repellent phytoncides.',
  },
  'begonia-stale-kwitnaca': {
    name: 'Wax Begonia (Everblooming)',
    summary: 'Dependable shade-tolerant bloomer with glossy succulent foliage and red, pink, or white petals.',
    category: 'Begoniaceae',
    difficulty_label: 'Very easy',
    detailed_guide: `
### North & East Balcony Champion
Blooms nonstop in low-light and semi-shaded balconies. Glossy leaves store moisture, forgiving occasional forgotten waterings.`,
    pot_material: 'Shallow bowls and planter boxes',
    pot_drainage: 'Good drainage',
    fertilizer_what: 'Mild liquid flowering food',
    nutrition_benefits: 'Continuous shade-tolerant floral beauty.',
  },
  'fuksja-zwisajaca': {
    name: 'Trailing Fuchsia',
    summary: 'Exquisite pendant lantern blossoms thriving on shaded and semi-shaded north/east balconies.',
    category: 'Onagraceae',
    difficulty_label: 'Moderate',
    detailed_guide: `
### Shaded Balcony Jewel
Avoids scorching direct southern sun. Hang in sheltered shade or morning sun. Keep compost uniformly moist.`,
    pot_material: 'Hanging basket or wall planter',
    pot_drainage: 'Moist but well-draining soil',
    fertilizer_what: 'Balanced liquid flowering fertilizer',
    nutrition_benefits: 'Delicate hanging floral architecture.',
  },
  'rzezucha-siewna': {
    name: 'Garden Cress',
    summary: 'Super-fast spicy sprout crop ready to harvest on moist cotton or shallow soil in 5–7 days.',
    category: 'Brassicaceae',
    difficulty_label: 'Zero effort',
    detailed_guide: `
### 7-Day Superfood
Scatter densely on damp paper towels, cotton wool, or shallow potting compost. Keep damp and harvest with scissors in under a week.`,
    pot_material: 'Shallow saucer, tray, or microgreen box',
    pot_drainage: 'Non-draining shallow tray is fine',
    fertilizer_what: 'None needed (lives off seed energy)',
    nutrition_benefits: 'Explosive concentration of vitamin C and mustard sulfur oils.',
  },
  'slonecznik-mikrolistki': {
    name: 'Sunflower Microgreens',
    summary: 'Nutty, crunchy microgreens packed with plant protein and vitamins for morning sandwiches.',
    category: 'Microgreens',
    difficulty_label: 'Easy',
    detailed_guide: `
### Nutty Balcony Crunch
Soak raw unroasted black sunflower seeds for 8 hours, scatter over 3 cm of compost, and harvest delicious cotyledon greens in 10–12 days.`,
    pot_material: 'Microgreen shallow tray (5 cm deep)',
    pot_drainage: 'Drainage holes recommended',
    fertilizer_what: 'None needed',
    nutrition_benefits: 'Complete plant proteins, amino acids, and vitamin E.',
  },
  'rzodkiewka-kielki': {
    name: 'Radish Sprouts & Microgreens',
    summary: 'Zesty, colorful purple and green microgreens with a sharp radish punch.',
    category: 'Microgreens',
    difficulty_label: 'Zero effort',
    detailed_guide: `
### Spicy Gourmet Topping
Grow on windowsills year-round. Harvest at 8–10 days when the first true leaves begin to show.`,
    pot_material: 'Seed tray or sprouting jar',
    pot_drainage: 'Standard tray',
    fertilizer_what: 'None needed',
    nutrition_benefits: 'Enzymes, sulforaphane, and digestive stimulation.',
  },
  'gorczyca-kielki': {
    name: 'Mustard Greens & Sprouts',
    summary: 'Sharp Dijon-flavored spicy microgreens that elevate salads, cheeses, and cold cuts.',
    category: 'Microgreens',
    difficulty_label: 'Zero effort',
    detailed_guide: `
### Piquant Table Herb
Quick sprouting in 4–6 days. Adds gourmet restaurant flair and zesty warmth to simple dishes.`,
    pot_material: 'Shallow tray',
    pot_drainage: 'Standard',
    fertilizer_what: 'None',
    nutrition_benefits: 'Glucosinolates and antimicrobial bioactives.',
  },
  'pszenica-trawa': {
    name: 'Wheatgrass',
    summary: 'Emerald nutrient powerhouse grown in shallow trays for cold-pressed wellness shots.',
    category: 'Grasses',
    difficulty_label: 'Easy',
    detailed_guide: `
### Pure Chlorophyll Energy
Dense sowing in shallow trays. Snip the bright green blades at 15 cm height for juicing in cold-press juicers.`,
    pot_material: 'Flat seedling flat',
    pot_drainage: 'Perforated bottom',
    fertilizer_what: 'None needed',
    nutrition_benefits: 'Living enzymes, amino acids, and high chlorophyll content.',
  },
  'boczniak-ostrygowaty': {
    name: 'Oyster Mushroom Log',
    summary: 'Meaty gourmet mushrooms that fruit in flushes on pasteurized straw substrate in shaded balcony corners.',
    category: 'Gourmet Fungi',
    difficulty_label: 'Easy with ready substrate kit',
    detailed_guide: `
### Shaded Mycological Harvest
Thrives in damp, shaded balcony nooks out of direct sunlight. Mist daily with water; oyster mushrooms form dense clusters in 7–10 days.`,
    pot_material: 'Substrate bag or aerated container',
    pot_drainage: 'Moisture retention with ventilation',
    fertilizer_what: 'None (grows on straw/sawdust substrate)',
    nutrition_benefits: 'Beta-glucans, lovastatin for cholesterol, and savory umami protein.',
  },
  'pieczarka-dwuzarodnikowa': {
    name: 'White & Cremini Button Mushrooms',
    summary: 'Easy indoor/outdoor mushroom box producing delicious culinary mushrooms in 2–3 weeks.',
    category: 'Gourmet Fungi',
    difficulty_label: 'Easy',
    detailed_guide: `
### Home Button Mushroom Farm
Place box in a cool, dark or shaded balcony corner. Keep casing layer evenly moist like a damp sponge. Harvest plump mushrooms in waves.`,
    pot_material: 'Growing box or polystyrene container',
    pot_drainage: 'Moist casing peat layer',
    fertilizer_what: 'None',
    nutrition_benefits: 'Selenium, B vitamins, and high dietary satiety.',
  },
  'soplowka-jezowata': {
    name: "Lion's Mane Mushroom",
    summary: 'Remarkable icicle-shaped medicinal mushroom with delicate lobster-like texture and cognitive benefits.',
    category: 'Gourmet Fungi',
    difficulty_label: 'Moderate',
    detailed_guide: `
### Brain-Boosting Gourmet Delicacy
Requires high humidity and fresh air. Slice open the inoculated sawdust block and mist twice daily. Sauté in butter for a seafood-like treat.`,
    pot_material: 'Inoculated fruiting bag inside a humidity tent',
    pot_drainage: 'High humidity',
    fertilizer_what: 'None',
    nutrition_benefits: 'Hericenones and erinacines supporting neuroplasticity and nerve health.',
  },
  'shiitake-twardnik': {
    name: 'Shiitake Mushroom Block',
    summary: 'Rich umami wood-grown Japanese mushrooms that fruit easily on hardwood sawdust blocks.',
    category: 'Gourmet Fungi',
    difficulty_label: 'Moderate',
    detailed_guide: `
### Deep Umami Magic
Soak block in cold water for 12 hours to trigger fruiting, then place in a shaded balcony spot. Plump brown caps emerge within a week.`,
    pot_material: 'Substrate block on shallow tray',
    pot_drainage: 'Humid environment',
    fertilizer_what: 'None',
    nutrition_benefits: 'Lentinan, immune support, and deep culinary savory depth.',
  },
  'groszek-cukrowy': {
    name: 'Sugar Snap & Mangetout Peas',
    summary: 'Crisp, sweet edible-podded peas with delicate white flowers climbing balcony railings.',
    category: 'Legumes',
    difficulty_label: 'Very easy',
    detailed_guide: `
### Early Spring Sweet Treat
Sow in March or April. Enjoys cool weather. Provide small string or wire netting for delicate tendrils to climb. Eat raw straight from the vine.`,
    pot_material: 'Long balcony boxes or deep pots (min. 8L)',
    pot_drainage: 'Standard drainage',
    fertilizer_what: 'Low-nitrogen organic feed',
    nutrition_benefits: 'Natural sweetness, fiber, lutein, and vitamin C.',
  },
  'pak-choi': {
    name: 'Baby Pak Choi',
    summary: 'Crunchy Asian cabbage with juicy white stems and emerald leaves, ready in just 35 days.',
    category: 'Cruciferous',
    difficulty_label: 'Easy',
    detailed_guide: `
### Rapid Stir-Fry Greens
Best grown in early spring or late summer. Quick 30–40 day turnaround. Delicious steamed, grilled, or tossed in hot wok noodles.`,
    pot_material: 'Balcony planters with 15 cm depth',
    pot_drainage: 'Good drainage',
    fertilizer_what: 'Organic liquid biohumus',
    nutrition_benefits: 'Glucosinolates, beta-carotene, and bone-strengthening calcium.',
  },
  'kumkwat-cytrus': {
    name: 'Kumquat Citrus Tree',
    summary: 'Ornamental evergreen dwarf citrus with fragrant blossoms and sweet-rind edible oval fruits.',
    category: 'Rutaceae',
    difficulty_label: 'Moderate (overwinter indoors in bright cool room)',
    detailed_guide: `
### Potted Mediterranean Luxury
Bask in full sun and warmth all summer on the balcony. Move indoors before first frost into a bright room (10–15°C). Eat the entire fruit, rind and all!`,
    pot_material: 'Terracotta or glazed ceramic pot (15–25L)',
    pot_drainage: 'Citrus soil mix with 25% pumice/perlite and good drainage holes',
    fertilizer_what: 'Citrus fertilizer with iron, zinc, and magnesium',
    nutrition_benefits: 'Bioflavonoids, natural vitamin C, and sweet citrus essential oils.',
  },
  'figowiec': {
    name: 'Edible Common Fig (Patio)',
    summary: 'Architectural Mediterranean tree with lobed leaves, producing honey-sweet brown figs in warm pots.',
    category: 'Moraceae',
    difficulty_label: 'Moderate',
    detailed_guide: `
### Sweet Honey Harvest
Loves root restriction in pots, which actually encourages heavier fruiting! Place against a warm southern wall. Overwinter dormant in a cool basement or garage.`,
    pot_material: 'Large pot or tub (20–40L)',
    pot_drainage: 'Coarse drainage layer',
    fertilizer_what: 'Tomato or fruit fertilizer with high potassium',
    nutrition_benefits: 'High dietary fiber, potassium, calcium, and natural sweetness.',
  },
  'miechunka-peruwianska': {
    name: 'Physalis (Golden Inca Berry)',
    summary: 'Exotic nightshade bearing sweet-tart golden berries wrapped in delicate papery lanterns.',
    category: 'Nightshades',
    difficulty_label: 'Easy',
    detailed_guide: `
### Exotic Paper Lanterns
Fast-growing bushy plant yielding hundreds of golden berries enclosed in paper husks. Fruit drops when ripe. Sweet-tart exotic flavor.`,
    pot_material: 'Medium to large pot (12–20L)',
    pot_drainage: 'Standard drainage',
    fertilizer_what: 'Organic tomato food',
    nutrition_benefits: 'Rare withanolides, vitamins A, C, and bioactive antioxidants.',
  },
  'kiwano-balkonowe': {
    name: 'Kiwano (Horned Melon)',
    summary: 'Fascinating horned African fruit with jelly-like lime-banana interior, climbing along balcony nets.',
    category: 'Cucurbits',
    difficulty_label: 'Moderate',
    detailed_guide: `
### African Jungle Climber
Vigorous climbing vine with beautiful yellow flowers and spiky orange fruits. Train up strong balcony mesh or trellises in hot full sun.`,
    pot_material: 'Deep pot (15–25L)',
    pot_drainage: 'Excellent drainage',
    fertilizer_what: 'Potassium-rich liquid feed',
    nutrition_benefits: 'Hydrating magnesium, potassium, and vitamin C.',
  },
  'okra-balkonowa': {
    name: "Dwarf Okra (Lady's Finger)",
    summary: 'Tropical hibiscus relative with stunning cream flowers and tender, savory green pods.',
    category: 'Malvaceae',
    difficulty_label: 'Easy',
    detailed_guide: `
### Stunning Edible Flowers & Pods
Loves high summer heat. The hibiscus-like flowers with maroon centers are gorgeous. Harvest tender pods every 2–3 days when 7–10 cm long.`,
    pot_material: '10–15L pot',
    pot_drainage: 'Good drainage',
    fertilizer_what: 'Balanced organic plant food',
    nutrition_benefits: 'Soluble fiber (mucilage) soothing digestion, folate, and calcium.',
  },
  'batat-jadalny': {
    name: 'Sweet Potato Vine (Edible & Ornamental)',
    summary: 'Lush trailing foliage with deep purple leaves and sweet underground tubers in large tubs.',
    category: 'Convolvulaceae',
    difficulty_label: 'Easy',
    detailed_guide: `
### Gorgeous Foliage & Sweet Tubers
Fast-growing lush vines cascade over container edges. In autumn, unpot the large tub to discover sweet purple or orange sweet potatoes!`,
    pot_material: 'Large tub or grow bag (25–40L)',
    pot_drainage: 'Loose soil with good drainage',
    fertilizer_what: 'Potassium-rich organic fertilizer',
    nutrition_benefits: 'Complex slow carbs, carotenoids, and gentle gut fiber.',
  },
  'kapusta-pekinska': {
    name: 'Napa Cabbage (Autumn Harvest)',
    summary: 'Tender, barrel-shaped sweet cabbage ideal for late summer sowing and crisp home kimchi.',
    category: 'Cruciferous',
    difficulty_label: 'Easy',
    detailed_guide: `
### Late Season Kimchi Harvest
Sow in mid-summer (July–August) for crisp autumn heads. Thrives in cooler autumn temperatures without bolting to seed.`,
    pot_material: 'Boxes or 8–12L pots',
    pot_drainage: 'Good moisture retention with drainage',
    fertilizer_what: 'Organic biohumus',
    nutrition_benefits: 'Probiotic-friendly prebiotic fiber, vitamins C and K.',
  },
  'trawa-cytrynowa': {
    name: 'Lemongrass',
    summary: 'Tall aromatic tropical grass with citrus perfume for Thai curries and revitalizing teas.',
    category: 'Poaceae',
    difficulty_label: 'Easy',
    detailed_guide: `
### Citrus Fragrance Haven
Forms dense clumping architectural grass stalks. Brush against leaves for a burst of pure lemon scent. Overwinter indoors before cold frost.`,
    pot_material: '7–15L pot',
    pot_drainage: 'Good drainage with regular summer watering',
    fertilizer_what: 'Organic balanced liquid feed',
    nutrition_benefits: 'Citral, calming tea infusion, and natural insect repellent.',
  },
};

export function getTranslatedPlant(plant: Plant, lang: Language): Plant {
  if (lang === 'pl') return plant;
  const trans = PLANT_TRANSLATIONS_EN[plant.id];
  if (!trans) return plant;

  return {
    ...plant,
    name: trans.name || plant.name,
    summary: trans.summary || plant.summary,
    category: trans.category || plant.category,
    difficulty_label: trans.difficulty_label || plant.difficulty_label,
    detailed_guide: trans.detailed_guide || plant.detailed_guide,
    pot: {
      ...plant.pot,
      material: trans.pot_material || plant.pot.material,
      drainage: trans.pot_drainage || plant.pot.drainage,
    },
    fertilizer_guide: plant.fertilizer_guide
      ? {
          ...plant.fertilizer_guide,
          what: trans.fertilizer_what || plant.fertilizer_guide.what,
        }
      : plant.fertilizer_guide,
    nutrition: plant.nutrition
      ? {
          ...plant.nutrition,
          key_benefits: trans.nutrition_benefits || plant.nutrition.key_benefits,
        }
      : plant.nutrition,
  };
}

export const VARIETY_BADGES_EN: Record<string, string> = {
  '100% bez kolców (60-80 cm)': '100% Thornless (60–80 cm)',
  'Aksamitka wąskolistna cytrynowa': 'Lemon Signet Marigold',
  'Antocyjanowa bordowa': 'Anthocyanin Burgundy',
  'Aromat After Eight': 'After Eight Chocolate Mint Aroma',
  'Aromat leśnych poziomek': 'Wild Strawberry Aroma',
  'Aromatyczna bezrozłogowa': 'Aromatic Runnerless',
  'Balkonowy wspinacz': 'Balcony Climber',
  'Bardzo plenna': 'High Yielding',
  'Bardzo wczesna i plenna': 'Very Early & High Yielding',
  'Bez kłujących włosków': 'No Prickly Hairs',
  'Bezwłóknista żółta': 'Stringless Yellow',
  'Biało-czerwona': 'Bicolor Red & White',
  'Biało-złoty maślany': 'White-Gold Buttery',
  'Błyskawiczny odrost': 'Rapid Regrowth',
  'Błyskawiczny zbiór (25 dni)': 'Lightning harvest (25 days)',
  'Błyszczące liście': 'Glossy Leaves',
  'Bogate Umami': 'Rich Umami',
  'Całoroczna wieloletnia': 'Year-Round Perennial',
  'Ciemnobordowa ozdoba': 'Dark Burgundy Ornamental',
  'Ciemnozielona drobna': 'Dark Green Fine-Leaved',
  'Ciemny fiolet i biel': 'Deep Purple & White',
  'Cieniusieńka skórka': 'Ultra-Thin Skin',
  'Cieniutka zielona (filet)': 'Thin Green French Filet',
  'Cięta liść po liściu': 'Cut-and-Come-Again',
  'Cytrusowy aromat': 'Citrus Aroma',
  'Cytrynowo-żółta': 'Lemon Yellow',
  'Cytrynowy': 'Lemon Citrus',
  'Czekoladowe liście': 'Chocolate Leaves',
  'Czysta perłowa biel': 'Pure Pearl White',
  'Dekoracyjna': 'Ornamental',
  'Do 700 owoców z krzaka': 'Up to 700 fruits per bush',
  'Do donic': 'Ideal for Containers',
  'Duża masa zielona': 'High Leaf Mass',
  'Duże owoce': 'Large Fruits',
  'Dwubarwna malownicza': 'Picturesque Bicolor',
  'Ekstremalna ostrość': 'Extreme Heat',
  'Gładka aromatyczna': 'Smooth & Aromatic',
  'Głęboki fiolet i zwartość': 'Deep Violet & Compact',
  'Głęboko ząbkowana': 'Deeply Serrated',
  'Gruby i soczysty': 'Thick & Juicy',
  'Grzyb nootropowy': 'Nootropic Mushroom',
  'Hiszpańska papryka tapas': 'Spanish Tapas Pepper',
  'Intensywny aromat': 'Intense Aroma',
  'Jadalne fioletowe kwiaty': 'Edible Violet Flowers',
  'Jak zielony bukszpan': 'Boxwood-like Green Mound',
  'Jarmuż palmowy toskański': 'Tuscan Lacinato Kale',
  'Jędrna i trwała': 'Crisp & Long-Lasting',
  'Karłowa wczesna': 'Dwarf Early',
  'Karłowe': 'Dwarf',
  'Klasyczna baletnica': 'Classic Ballerina',
  'Klasyczna do pesto': 'Classic Pesto Basil',
  'Klasyczna ostra': 'Classic Hot',
  'Klasyk soków': 'Classic Juice Carrot',
  'Kompaktowa do amplii': 'Compact for Hanging Baskets',
  'Kompaktowa i zwarta': 'Compact & Dense',
  'Kompaktowa krzaczasta': 'Compact Bush',
  'Kompaktowy': 'Compact',
  'Kompaktowy plon': 'Compact Yield',
  'Korzenny posmak': 'Spicy Herbal Flavor',
  'Kremowo-żółta': 'Creamy Yellow',
  'Królewski smak': 'Royal Flavor',
  'Królowa trwałości': 'Queen of Freshness',
  'Krótka stożkowa': 'Short Conical',
  'Krwistoczerwone ogonki': 'Blood-Red Stems',
  'Kulista drobnolistna': 'Globe Fine-Leaved',
  'Łagodniejsza i chrupiąca': 'Mild & Crisp',
  'Legendarna zwisająca': 'Legendary Cascading',
  'Maksymalny mentol': 'Maximum Menthol',
  'Miniatura rzymska': 'Mini Romaine',
  'Miniaturowy': 'Miniature',
  'Mini ogórek meksykański': 'Mini Mexican Cucamelon',
  'Mistrz smaku': 'Master of Flavor',
  'Młode listki (baby spinach)': 'Baby Spinach Leaves',
  'Mocno kędzierzawa': 'Deeply Curled',
  'Mrozoodporny': 'Frost Hardy',
  'Najbardziej odporny': 'Most Resilient',
  'Najlepsza do naparów': 'Best for Herbal Teas',
  'Najniższa selekcja (50 cm)': 'Lowest Selection (50 cm)',
  'Najpopularniejszy': 'Most Popular',
  'Neonowy róż': 'Neon Pink',
  'Niezawodny klasyk': 'Reliable Classic',
  'Niska stale kwitnąca': 'Low Everblooming',
  'Odporna do -35°C': 'Hardy to -35°C',
  'Odporna na pleśń': 'Mold Resistant',
  'Odporna na upały': 'Heat Resistant',
  'Odporna na zarazę': 'Blight Resistant',
  'Odporna na żółknięcie': 'Yellowing Resistant',
  'Odporny na mączniaka': 'Mildew Resistant',
  'Odrasta co roku': 'Regrows Annually',
  'Okrągła jak piłeczka': 'Round Globe',
  'Okrągła pasiasta': 'Round Striped',
  'Olbrzymie pełne kwiaty': 'Giant Double Flowers',
  'Orzechowy aromat': 'Nutty Aroma',
  'Orzeźwienie z limonką': 'Lime Refreshment',
  'Owoce 1-2 kg': '1–2 kg Fruits',
  'Owoce 2x większe': '2x Larger Fruits',
  'Ozdobne': 'Ornamental',
  'Paluszkowa delikatesowa': 'Fingerling Gourmet',
  'Pasiasty klasyk': 'Striped Classic',
  'Pastelowy pudrowy róż': 'Pastel Powder Pink',
  'Pełna mrozoodporność': 'Fully Frost Hardy',
  'Pikantna musztarda': 'Spicy Mustard Green',
  'Pikantny chrzanowy posmak': 'Zesty Horseradish Flavor',
  'Płożący': 'Trailing',
  'Podłużna paluszkowa': 'Long Fingerling',
  'Polecana do donic': 'Recommended for Pots',
  'Polska niezawodna': 'Reliable Polish Selection',
  'Polska żółtoskóra': 'Polish Yellow-Skin',
  'Potężna kaskada (do 120 cm)': 'Huge Cascade (up to 120 cm)',
  'Powtarzająca owocowanie': 'Everbearing / Repeat Fruiting',
  'Prawdziwy smak': 'Authentic Heritage Flavor',
  'Przewieszająca się': 'Trailing / Cascading',
  'Pstra': 'Variegated',
  'Pstre biało-zielone liście': 'Variegated White-Green Foliage',
  'Pstre ozdobne liście': 'Variegated Ornamental Foliage',
  'Purpurowa ozdobna': 'Purple Ornamental',
  'Purpurowy kolor': 'Deep Purple',
  'Purpurowy mrozoodporny': 'Purple Frost-Hardy',
  'Rekordowo wielkie kwiaty': 'Record-Size Giant Blooms',
  'Różowe borówki': 'Pink Blueberries',
  'Różowe kwiaty': 'Pink Blossoms',
  'Samokończący krzaczasty': 'Determinate Bush',
  'Skrzydła smoka (do 50 cm)': 'Dragon Wings (up to 50 cm)',
  'Soczysty pomarańcz': 'Juicy Orange',
  'Średnio ostra i mięsista': 'Medium Hot & Fleshy',
  'Stworzona do donic': 'Bred for Containers',
  'Super karłowa (25 cm)': 'Super Dwarf (25 cm)',
  'Super karłowa (40-50 cm)': 'Super Dwarf (40–50 cm)',
  'Super karłowa (do 30 cm)': 'Super Dwarf (up to 30 cm)',
  'Super karłowy (40 cm)': 'Super Dwarf (40 cm)',
  'Super niska miniatura': 'Ultra-Low Miniature',
  'Super plenna': 'Prolific Heavy Yielder',
  'Super szybka (5 dni)': 'Super Fast (5 days)',
  'Super szybki plon (18 dni)': 'Super Fast Harvest (18 days)',
  'Szerokolistna': 'Broad-Leaved',
  'Sztywne grube rurki': 'Sturdy Thick Chives',
  'Szybkorosnący': 'Fast Growing',
  'Tęcza barw': 'Rainbow of Colors',
  'Tolerancja na mączniaka': 'Mildew Tolerant',
  'Tradycyjna wczesna': 'Traditional Early',
  'Trójbarwne pastele': 'Tricolor Pastels',
  'Typ baby carrot': 'Baby Carrot Type',
  'Wczesna i mrozoodporna': 'Early & Frost-Hardy',
  'Wczesna i słodka': 'Early & Sweet',
  'Wczesna i soczysta': 'Early & Juicy',
  'Wczesna masłowa': 'Early Butterhead',
  'Wielkie liście': 'Mammoth Leaves',
  'Włoska gigant': 'Italian Giant',
  'Wyrazisty ostry smak': 'Distinct Pungent Flavor',
  'Wysoce dekoracyjna': 'Highly Ornamental',
  'Wysoka odporność': 'High Disease Resistance',
  'Wysoka witamina C': 'High in Vitamin C',
  'Wzniesiona rabatowa': 'Upright Bedding',
  'Zimowy zbiór': 'Winter Harvest',
  'Zimozielone liście': 'Evergreen Foliage',
  'Zjawiskowy wzór galaktyki': 'Stunning Galaxy Pattern',
  'Złocistożółta polska': 'Golden Yellow Polish',
  'Złocistożółte liście': 'Golden Yellow Foliage',
  'Żółta czeska odmiana': 'Yellow Czech Variety',
  'Żółty miąższ': 'Yellow Flesh',
  'Zwarty sałatkowy': 'Compact Salad Type',
  'Zwisająca do koszy': 'Trailing for Hanging Baskets',
  'Zwisająca kaskada do cienia': 'Cascading for Shade',
};

export function getTranslatedVarietyBadge(badge: string | null | undefined, lang: Language): string {
  if (!badge) return '';
  if (lang !== 'en') return badge;
  if (VARIETY_BADGES_EN[badge]) return VARIETY_BADGES_EN[badge];
  // Fuzzy or partial checks
  const lower = badge.toLowerCase();
  if (lower.includes('zbiór') && lower.includes('25 dni')) return 'Lightning harvest (25 days)';
  if (lower.includes('błyskawiczny')) return 'Lightning fast';
  if (lower.includes('karłow')) return 'Dwarf';
  if (lower.includes('plenn')) return 'Heavy yielder';
  if (lower.includes('ostra') || lower.includes('ostry')) return 'Spicy / Hot';
  if (lower.includes('słodk')) return 'Sweet';
  if (lower.includes('zwisając')) return 'Cascading';
  return badge;
}

export function getTranslatedVitamins(vitamins: string | null | undefined, lang: Language): string {
  if (!vitamins) return '';
  if (lang !== 'en') return vitamins;
  return vitamins
    .replace(/Witamina C/gi, 'Vitamin C')
    .replace(/witamina A/gi, 'Vitamin A')
    .replace(/witamina K/gi, 'Vitamin K')
    .replace(/witaminy z grupy B/gi, 'B vitamins')
    .replace(/witamina B/gi, 'Vitamin B')
    .replace(/kwas foliowy/gi, 'folic acid')
    .replace(/żelazo/gi, 'iron')
    .replace(/potas/gi, 'potassium')
    .replace(/magnez/gi, 'magnesium')
    .replace(/wapń/gi, 'calcium')
    .replace(/cynk/gi, 'zinc')
    .replace(/likopen/gi, 'lycopene')
    .replace(/beta-karoten/gi, 'beta-carotene')
    .replace(/antocyjany/gi, 'anthocyanins')
    .replace(/błonnik/gi, 'dietary fiber')
    .replace(/olejki eteryczne/gi, 'essential oils')
    .replace(/przeciwutleniacze/gi, 'antioxidants');
}

export function getTranslatedPlantTip(
  plantId: string | null | undefined,
  polishTip: string | null | undefined,
  lang: Language
): string {
  if (lang !== 'en') return polishTip || '';
  if (plantId && PLANT_TRANSLATIONS_EN[plantId]?.summary) {
    return PLANT_TRANSLATIONS_EN[plantId].summary;
  }
  return polishTip || '';
}

export function getPlantName(plantOrId: Plant | string | null | undefined, lang: Language): string {
  if (!plantOrId) return '';
  if (typeof plantOrId === 'string') {
    const trimmed = plantOrId.trim();
    if (!trimmed) return '';

    if (lang === 'en') {
      if (PLANT_TRANSLATIONS_EN[trimmed]?.name) {
        return PLANT_TRANSLATIONS_EN[trimmed].name;
      }
      // Check if it matches a plant ID key by searching or partial match
      const entry = Object.entries(PLANT_TRANSLATIONS_EN).find(
        ([id, t]) => id === trimmed || t.name.toLowerCase() === trimmed.toLowerCase()
      );
      if (entry) return entry[1].name;
      // Also map known Polish plant names directly
      const polMap: Record<string, string> = {
        'Rzodkiewka balkonowa': 'Balcony Radish',
        'Rzodkiewka': 'Balcony Radish',
        'Pomidor karłowy': 'Dwarf Cherry Tomato',
        'Pomidor karłowy koktajlowy': 'Dwarf Cherry Tomato',
        'Papryka ostra / chili w doniczce': 'Potted Chili & Hot Peppers',
        'Papryka chili': 'Potted Chili & Hot Peppers',
        'Sałata liściowa': 'Cut-and-Come-Again Leaf Lettuce',
        'Szpinak zwyczajny i zimowy': 'Balcony Spinach',
        'Szpinak balkonowy': 'Balcony Spinach',
        'Bazylia właściwa i cytrynowa': 'Sweet Genovese Basil',
        'Bazylia właściwa': 'Sweet Genovese Basil',
        'Mięta pieprzowa (w donicy)': 'Peppermint & Spearmint',
        'Mięta pieprzowa': 'Peppermint & Spearmint',
        'Rozmaryn lekarski': 'Perennial Rosemary',
        'Tymianek właściwy': 'Culinary Thyme',
        'Szczypiorek ogrodowy': 'Common Balcony Chives',
        'Szczypiorek': 'Common Balcony Chives',
        'Pietruszka naciowa': 'Flat-Leaf Parsley',
        'Cukinia miniaturowa / patison': 'Patio Baby Zucchini',
        'Cukinia miniaturowa': 'Patio Baby Zucchini',
        'Ogórek krzaczasty / pnący na kratce': 'Balcony Bush Cucumber',
        'Ogórek balkonowy': 'Balcony Bush Cucumber',
        'Truskawka wisząca powtarzająca owocowanie': 'Trailing Everbearing Strawberry',
        'Truskawka zwisająca': 'Trailing Everbearing Strawberry',
        'Poziomka bezrozłogowa całoroczna': 'Alpine Bush Strawberry',
        'Poziomka bezrozłogowa': 'Alpine Bush Strawberry',
        'Boczniak ostrygowaty': 'Oyster Mushroom Home Block',
        'Pieczarka dwuzarodnikowa': 'White Button Mushroom',
        'Pieczarka biała': 'White Button Mushroom',
        'Kiełki i siewki rzodkiewki': 'Zesty Radish Sprouts',
        'Kiełki rzodkiewki': 'Zesty Radish Sprouts',
        'Młode siewki słonecznika': 'Sunflower Microgreens',
        'Rukola (rokietta siewna)': 'Arugula (Rocket)',
        'Rukola': 'Arugula (Rocket)',
        'Roszponka warzywna': 'Corn Salad (Mâche)',
        'Roszponka': 'Corn Salad (Mâche)',
      };
      if (polMap[trimmed]) return polMap[trimmed];

      // Check if it matches an ID in PLANT_NAMES_PL
      if (PLANT_NAMES_PL[trimmed]) {
        const id = trimmed;
        if (PLANT_TRANSLATIONS_EN[id]?.name) {
          return PLANT_TRANSLATIONS_EN[id].name;
        }
      }
      // Check if it matches a name in PLANT_NAMES_PL
      const matchPair = Object.entries(PLANT_NAMES_PL).find(
        ([, name]) => name.toLowerCase() === trimmed.toLowerCase()
      );
      if (matchPair && PLANT_TRANSLATIONS_EN[matchPair[0]]?.name) {
        return PLANT_TRANSLATIONS_EN[matchPair[0]].name;
      }

      return trimmed;
    }

    // Polish (lang !== 'en')
    // 1. If it's a known ID like 'pomidor-karlowy', return the Polish botanical name
    if (PLANT_NAMES_PL[trimmed]) {
      return PLANT_NAMES_PL[trimmed];
    }
    // 2. If it's already a Polish name in PLANT_NAMES_PL, return it
    const existingName = Object.values(PLANT_NAMES_PL).find(
      (n) => n.toLowerCase() === trimmed.toLowerCase()
    );
    if (existingName) {
      return existingName;
    }
    // 3. Fallback for any unknown hyphenated slug: replace '-' with space and capitalize
    if (trimmed.includes('-') && !trimmed.includes(' ')) {
      return trimmed
        .split('-')
        .map((w, idx) => (idx === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w))
        .join(' ');
    }
    return trimmed;
  }

  // Object case: Plant
  if (lang === 'en' && PLANT_TRANSLATIONS_EN[plantOrId.id]?.name) {
    return PLANT_TRANSLATIONS_EN[plantOrId.id].name;
  }
  return plantOrId.name || PLANT_NAMES_PL[plantOrId.id] || plantOrId.id;
}

export function getPlantGroupLabel(group: string, lang: Language): string {
  if (lang === 'pl') {
    switch (group) {
      case 'wszystkie': return 'Wszystkie';
      case 'warzywa': return 'Warzywa';
      case 'owoce': return 'Owoce';
      case 'ziola': return 'Zioła';
      case 'ozdobne': return 'Ozdobne';
      case 'kielki': return 'Kiełki';
      case 'grzyby': return 'Grzyby';
      default: return group;
    }
  }
  switch (group) {
    case 'wszystkie': return 'All';
    case 'warzywa': return 'Vegetables';
    case 'owoce': return 'Fruits';
    case 'ziola': return 'Herbs';
    case 'ozdobne': return 'Ornamentals';
    case 'kielki': return 'Sprouts';
    case 'grzyby': return 'Mushrooms';
    default: return group;
  }
}
