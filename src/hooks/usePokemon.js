import { useState, useEffect } from 'react';
import { fetchPokemonDetails } from '../utils/pokemonApi';
import { getEffortYields } from '../utils/evYields';

// Hook per recuperare tutti i nomi (per il suggerimento autocomplete)
export function usePokemonList() {
  const [list, setList] = useState(() => {
    try {
      const cached = localStorage.getItem('poke_names_list');
      return cached ? JSON.parse(cached) : [];
    } catch {
      localStorage.removeItem('poke_names_list');
      return [];
    }
  });

  useEffect(() => {
    if (list.length > 0) return;

    async function fetchAllNames() {
      try {
        // Recupera i primi 1025 Pokémon (fino alla Gen 9)
        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025');
        const data = await res.json();
        const names = data.results.map(p => p.name);

        localStorage.setItem('poke_names_list', JSON.stringify(names));
        setList(names);
      } catch (err) {
        console.error('Failed to fetch Pokemon list:', err);
      }
    }

    fetchAllNames();
  }, [list.length]);

  return list;
}

export function usePokemon(pokemonNameOrId, versionGroup = 'sword-shield') {
  const [result, setResult] = useState({ key: null, data: null, loading: false, error: null });
  const resultKey = `${pokemonNameOrId || ''}:${versionGroup}`;

  useEffect(() => {
    const controller = new AbortController();

    if (!pokemonNameOrId) {
      return () => controller.abort();
    }

    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;

      setResult({ key: resultKey, data: null, loading: true, error: null });

      fetchPokemonDetails(pokemonNameOrId, controller.signal)
        .then(pokemon => {
          const data = {
            ...pokemon,
            yields: getEffortYields(pokemon.name, versionGroup, pokemon.yields)
          };
          if (!cancelled) setResult({ key: resultKey, data, loading: false, error: null });
        })
        .catch(error => {
          if (!cancelled && error.name !== 'AbortError') {
            setResult({ key: resultKey, data: null, loading: false, error: error.message });
          }
        });
    });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [pokemonNameOrId, resultKey, versionGroup]);

  const isCurrentResult = result.key === resultKey;
  return {
    data: isCurrentResult ? result.data : null,
    loading: Boolean(pokemonNameOrId) && (!isCurrentResult || result.loading),
    error: isCurrentResult ? result.error : null
  };
}