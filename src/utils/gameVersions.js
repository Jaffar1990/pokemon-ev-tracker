export const DEFAULT_VERSION_GROUP = 'sword-shield';

export const GAME_VERSIONS = [
  { id: 'ruby-sapphire', generation: 3, name: { it: 'Rubino e Zaffiro', en: 'Ruby & Sapphire' } },
  { id: 'emerald', generation: 3, name: { it: 'Smeraldo', en: 'Emerald' } },
  { id: 'firered-leafgreen', generation: 3, name: { it: 'Rosso Fuoco e Verde Foglia', en: 'FireRed & LeafGreen' } },
  { id: 'diamond-pearl', generation: 4, name: { it: 'Diamante e Perla', en: 'Diamond & Pearl' } },
  { id: 'platinum', generation: 4, name: { it: 'Platino', en: 'Platinum' } },
  { id: 'heartgold-soulsilver', generation: 4, name: { it: 'Oro HeartGold e Argento SoulSilver', en: 'HeartGold & SoulSilver' } },
  { id: 'black-white', generation: 5, name: { it: 'Nero e Bianco', en: 'Black & White' } },
  { id: 'black-2-white-2', generation: 5, name: { it: 'Nero 2 e Bianco 2', en: 'Black 2 & White 2' } },
  { id: 'x-y', generation: 6, name: { it: 'X e Y', en: 'X & Y' } },
  { id: 'omega-ruby-alpha-sapphire', generation: 6, name: { it: 'Rubino Omega e Zaffiro Alpha', en: 'Omega Ruby & Alpha Sapphire' } },
  { id: 'sun-moon', generation: 7, name: { it: 'Sole e Luna', en: 'Sun & Moon' } },
  { id: 'ultra-sun-ultra-moon', generation: 7, name: { it: 'Ultrasole e Ultraluna', en: 'Ultra Sun & Ultra Moon' } },
  { id: 'sword-shield', generation: 8, name: { it: 'Spada e Scudo', en: 'Sword & Shield' } },
  { id: 'brilliant-diamond-shining-pearl', generation: 8, name: { it: 'Diamante Lucente e Perla Splendente', en: 'Brilliant Diamond & Shining Pearl' } },
  { id: 'scarlet-violet', generation: 9, name: { it: 'Scarlatto e Violetto', en: 'Scarlet & Violet' } }
];

const VERSION_GROUP_BY_ID = new Map(GAME_VERSIONS.map(game => [game.id, game]));

const LEGACY_GENERATION_VERSION_GROUP = {
  3: 'ruby-sapphire',
  4: 'diamond-pearl',
  5: 'black-2-white-2',
  6: 'x-y',
  7: 'sun-moon',
  8: 'sword-shield',
  9: 'scarlet-violet'
};

export function normalizeVersionGroup(versionGroup, fallback = DEFAULT_VERSION_GROUP) {
  return VERSION_GROUP_BY_ID.has(versionGroup) ? versionGroup : fallback;
}

export function getGenerationForVersionGroup(versionGroup) {
  return VERSION_GROUP_BY_ID.get(normalizeVersionGroup(versionGroup))?.generation ?? 8;
}

export function getVersionGroupForGeneration(generation) {
  const normalizedGeneration = Math.min(9, Math.max(3, Number(generation) || 8));
  return LEGACY_GENERATION_VERSION_GROUP[normalizedGeneration] || DEFAULT_VERSION_GROUP;
}

export function getGameVersionName(versionGroup, language = 'it') {
  const game = VERSION_GROUP_BY_ID.get(normalizeVersionGroup(versionGroup));
  return game.name[language] || game.name.it;
}

export function migrateStoredTrackings(trackings) {
  if (!Array.isArray(trackings)) return [];

  return trackings.map(tracking => {
    const versionGroup = normalizeVersionGroup(
      tracking.versionGroup,
      getVersionGroupForGeneration(tracking.generation)
    );
    const migratedTracking = { ...tracking, versionGroup };
    delete migratedTracking.generation;
    return migratedTracking;
  });
}