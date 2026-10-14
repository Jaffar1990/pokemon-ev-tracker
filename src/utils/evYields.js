const GENERATION_THREE_GROUPS = ['ruby-sapphire', 'emerald', 'firered-leafgreen'];

const generationThreeYield = (stats) => Object.fromEntries(
  GENERATION_THREE_GROUPS.map(versionGroup => [versionGroup, stats])
);

export const EV_YIELD_OVERRIDES = {
  blissey: generationThreeYield({ hp: 2 }),
  duskull: generationThreeYield({ defense: 1, 'special-defense': 1 }),
  dusclops: generationThreeYield({ defense: 1, 'special-defense': 2 }),
  misdreavus: generationThreeYield({ 'special-attack': 1, 'special-defense': 1 }),
  roselia: generationThreeYield({ 'special-attack': 1 }),
  slowking: {
    'ruby-sapphire': { 'special-defense': 3 },
    emerald: { 'special-defense': 3 },
    'firered-leafgreen': { 'special-defense': 3 },
    'diamond-pearl': { 'special-defense': 3 },
    platinum: { 'special-defense': 3 },
    'heartgold-soulsilver': { 'special-defense': 3 },
    'black-white': { 'special-defense': 3 },
    'black-2-white-2': { 'special-defense': 3 },
    'x-y': { 'special-defense': 3 },
    'omega-ruby-alpha-sapphire': { 'special-defense': 3 },
    'sun-moon': { 'special-defense': 3 },
    'ultra-sun-ultra-moon': { 'special-defense': 3 }
  },
  yanma: generationThreeYield({ speed: 2 }),
  watchog: {
    'black-white': { attack: 1 },
    'black-2-white-2': { attack: 2 }
  },
  'aegislash-blade': {
    'sun-moon': { attack: 2, 'special-attack': 1 },
    'ultra-sun-ultra-moon': { attack: 2, 'special-attack': 1 }
  },
  'shaymin-sky': {
    platinum: { hp: 3 }
  }
};

export function getEffortYields(pokemonName, versionGroup, apiYields = []) {
  const override = EV_YIELD_OVERRIDES[pokemonName?.toLowerCase()]?.[versionGroup];
  if (!override) return apiYields;

  return Object.entries(override)
    .filter(([, amount]) => amount > 0)
    .map(([stat, amount]) => ({ stat, amount }));
}