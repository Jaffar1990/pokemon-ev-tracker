import { useDeferredValue, useMemo } from 'react';

export function usePokemonSuggestions(query, pokemonNames, limit = 5) {
  const deferredQuery = useDeferredValue(query);

  return useMemo(() => {
    const normalizedQuery = deferredQuery.toLowerCase().trim();
    if (normalizedQuery.length < 2) return [];

    return pokemonNames
      .filter(name => name.includes(normalizedQuery))
      .slice(0, limit);
  }, [deferredQuery, pokemonNames, limit]);
}
