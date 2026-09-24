import { useState, useRef, useCallback } from 'react';
import { usePokemon, usePokemonList } from './hooks/usePokemon';
import { useLocalStorage } from './hooks/useLocalStorage';
import { usePokemonSuggestions } from './hooks/usePokemonSuggestions';
import { PokemonCard } from './components/PokemonCard';
import { AppHeader } from './components/AppHeader';
import { AppFooter } from './components/AppFooter';
import { addEvs } from './utils/evCalculations';
import { fetchPokemonDetails } from './utils/pokemonApi';
import { getTranslations } from './i18n/translations';

import './App.css'

export default function App() {
  // Ricerca selvatico
  const [targetQuery, setTargetQuery] = useState(''); // Pokémon selvatico affrontato
  const [searchInput, setSearchInput] = useState('');

  // Ricerca per aggiungere un Pokémon al Team
  const [teamSearchInput, setTeamSearchInput] = useState('');

  // Lista del Team di Pokémon con caricamento iniziale dallo Storage Locale
  const [team, setTeam] = useLocalStorage('poke_app_team', []);

  // Stato per salvare l'ultimo snapshot della squadra prima di un attacco
  const [previousTeam, setPreviousTeam] = useState(null);

  // Lista degli ultimi Pokémon selvatici sconfitti (max 10) con caricamento iniziale dallo Storage Locale
  const [recentWilds, setRecentWilds] = useLocalStorage('poke_app_recent_wilds', []);

  const handleSaveStateForUndo = useCallback(() => {
    setPreviousTeam(team);
  }, [team]);

  // Stato per la Generazione selezionata (default 8)
  const [generation, setGeneration] = useLocalStorage('poke_app_generation', 8);

  const [language, setLanguage] = useLocalStorage('poke_app_language', 'it');
  const fileInputRef = useRef(null);
  const t = getTranslations(language);

  // Lista dei nomi di tutti i pokemon per la ricerca con debounce
  const allPokemonNames = usePokemonList();

  const { data: wildPokemon, loading: wildLoading, error: wildError } = usePokemon(targetQuery);
  const wildSuggestions = usePokemonSuggestions(searchInput, allPokemonNames);
  const teamSuggestions = usePokemonSuggestions(teamSearchInput, allPokemonNames);

  // Aggiunge un Pokémon al Team
  const handleAddTeamMember = useCallback(async (name) => {
    setTeamSearchInput('');

    try {
      const data = await fetchPokemonDetails(name);

      const newMember = {
        instanceId: Date.now(), // ID unico per la scheda
        id: data.id,
        name: data.name,
        sprite: data.sprite,
        evolutionChain: data.evolutionChain,
        isActive: true, // Di default riceve EV
        hasMachoBrace: false,
        hasPokerus: false,
        evs: { hp: 0, attack: 0, defense: 0, 'special-attack': 0, 'special-defense': 0, speed: 0 }
      };

      setTeam(prev => [...prev, newMember]);
    } catch (err) {
      console.error('Failed to add Pokemon:', err);
    }
  }, [setTeam]);

  const handleUpdateMember = useCallback((updated) => {
    setTeam(prev => prev.map(p => p.instanceId === updated.instanceId ? updated : p));
  }, [setTeam]);

  const handleDeleteMember = useCallback((instanceId) => {
    setTeam(prev => prev.filter(p => p.instanceId !== instanceId));
  }, [setTeam]);

  const handleDefeatWildPokemon = useCallback(() => {
    if (!wildPokemon) return;

    // Salva lo stato prima dell'incremento
    setPreviousTeam(team);

    setTeam(prevTeam => prevTeam.map(member => {
      if (!member.isActive) return member;

      let multiplier = 1;
      if (member.hasMachoBrace) multiplier *= 2;
      if (member.hasPokerus) multiplier *= 2;

      const updatedEvs = addEvs(member.evs, wildPokemon.yields, {
        multiplier,
        powerItemKey: member.powerItemKey || 'none'
      });
      return { ...member, evs: updatedEvs };
    }));

    // Aggiungi agli ultimi sconfitti (evitando duplicati consecutivi e mantenendo max 10)
    setRecentWilds((prev) => {
      const filtered = prev.filter((p) => p.name !== wildPokemon.name);
      return [
        { name: wildPokemon.name, sprite: wildPokemon.sprite },
        ...filtered
      ].slice(0, 10);
    });
  }, [setRecentWilds, setTeam, team, wildPokemon]);

  // Funzione di Undo per ripristinare la squadra a prima dell'ultima vittoria
  const handleUndo = useCallback(() => {
    if (previousTeam) {
      setTeam(previousTeam);
      setPreviousTeam(null); // Resetta l'undo fino alla prossima azione
    }
  }, [previousTeam, setTeam]);

  // Funzione per Esportare i Dati in JSON
    const handleExportData = useCallback(() => {
      const dataToExport = {
        version: 1,
        exportedAt: new Date().toISOString(),
        team,
        recentWilds
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToExport, null, 2));
      const downloadAnchor = document.createElement('a');
      const today = new Date().toISOString().slice(0, 10);
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `ev-tracker-backup-${today}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    }, [recentWilds, team]);

    // Funzione per Importare i Dati da JSON
    const handleImportData = useCallback((e) => {
      const fileReader = new FileReader();
      if (e.target.files && e.target.files[0]) {
        fileReader.readAsText(e.target.files[0], "UTF-8");
        fileReader.onload = (event) => {
          try {
            const parsed = JSON.parse(event.target.result);
            if (parsed && Array.isArray(parsed.team)) {
              setTeam(parsed.team);
              if (Array.isArray(parsed.recentWilds)) {
                setRecentWilds(parsed.recentWilds);
              }
              setPreviousTeam(null);
              alert(t.app.importSuccess);
            } else {
              alert(t.app.invalidFile);
            }
          } catch (err) {
            alert(t.app.importError);
            console.error(err);
          }
        };
      }
    }, [setRecentWilds, setTeam, t.app.importError, t.app.importSuccess, t.app.invalidFile]);

  return (
      <div className="app-root">

        <AppHeader
          team={team}
          language={language}
          teamSearchInput={teamSearchInput}
          setTeamSearchInput={setTeamSearchInput}
          teamSuggestions={teamSuggestions}
          onAddTeamMember={handleAddTeamMember}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          wildSuggestions={wildSuggestions}
          setTargetQuery={setTargetQuery}
          wildLoading={wildLoading}
          wildError={wildError}
          wildPokemon={wildPokemon}
          onDefeatWildPokemon={handleDefeatWildPokemon}
          previousTeam={previousTeam}
          onUndo={handleUndo}
          recentWilds={recentWilds}
        />

        {/* Griglia Squadra a 3 Colonne Full-Width */}
        {team.length === 0 ? (
          <p className="empty-team-msg">{t.app.emptyTeam}</p>
        ) : (
          <div className="team-grid">
            {team.map(member => (
              <PokemonCard
                key={member.instanceId}
                pokemon={member}
                generation={generation}
                language={language}
                onUpdate={handleUpdateMember}
                onDelete={handleDeleteMember}
                onSaveStateForUndo={handleSaveStateForUndo} // Passiamo la callback per l'Undo
              />
            ))}
          </div>
        )}

        <AppFooter
          generation={generation}
          setGeneration={setGeneration}
          language={language}
          setLanguage={setLanguage}
          onExportData={handleExportData}
          onImportData={handleImportData}
          fileInputRef={fileInputRef}
        />

      </div>
    );
}
