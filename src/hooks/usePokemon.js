import { useState, useEffect } from 'react';
import { fetchPokemonDetails } from '../utils/pokemonApi';

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

export function usePokemon(pokemonNameOrId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    if (!pokemonNameOrId) {
      return () => controller.abort();
    }

    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;

      setLoading(true);
      setError(null);

      fetchPokemonDetails(pokemonNameOrId, controller.signal)
        .then(pokemon => {
          if (!cancelled) setData(pokemon);
        })
        .catch(err => {
          if (!cancelled && err.name !== 'AbortError') setError(err.message);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [pokemonNameOrId]);

  return { data, loading, error };
}