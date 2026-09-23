const memoryCache = new Map();

function getCachedPokemon(cacheKey) {
  if (memoryCache.has(cacheKey)) return memoryCache.get(cacheKey);

  try {
    const cached = localStorage.getItem(`poke_cache_${cacheKey}`);
    if (!cached) return null;

    const parsed = JSON.parse(cached);
    memoryCache.set(cacheKey, parsed);
    return parsed;
  } catch {
    localStorage.removeItem(`poke_cache_${cacheKey}`);
    return null;
  }
}

function buildEvolutionChain(chain) {
  const chainNames = [];
  let current = chain;

  while (current) {
    chainNames.push(current.species.name);
    current = current.evolves_to[0];
  }

  return chainNames;
}

export async function fetchPokemonDetails(pokemonNameOrId, signal) {
  const cacheKey = pokemonNameOrId.toString().toLowerCase().trim();
  const cached = getCachedPokemon(cacheKey);
  if (cached) return cached;

  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${cacheKey}`, { signal });
  if (!response.ok) throw new Error('Pokemon not found');

  const rawData = await response.json();
  const speciesResponse = await fetch(rawData.species.url, { signal });
  if (!speciesResponse.ok) throw new Error('Pokemon species not found');
  const speciesData = await speciesResponse.json();

  const evolutionResponse = await fetch(speciesData.evolution_chain.url, { signal });
  if (!evolutionResponse.ok) throw new Error('Pokemon evolution chain not found');
  const evolutionData = await evolutionResponse.json();

  const parsedData = {
    id: rawData.id,
    name: rawData.name,
    sprite: rawData.sprites.front_default,
    evolutionChain: buildEvolutionChain(evolutionData.chain),
    yields: rawData.stats
      .filter(stat => stat.effort > 0)
      .map(stat => ({
        stat: stat.stat.name,
        amount: stat.effort
      }))
  };

  memoryCache.set(cacheKey, parsedData);
  localStorage.setItem(`poke_cache_${cacheKey}`, JSON.stringify(parsedData));
  return parsedData;
}
