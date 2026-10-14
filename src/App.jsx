import { useState, useRef, useCallback } from 'react';
import { DndContext, PointerSensor, TouchSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import { usePokemon, usePokemonList } from './hooks/usePokemon';
import { useLocalStorage } from './hooks/useLocalStorage';
import { usePokemonSuggestions } from './hooks/usePokemonSuggestions';
import { SortablePokemonCard } from './components/SortablePokemonCard';
import { AppHeader } from './components/AppHeader';
import { AppFooter } from './components/AppFooter';
import { TrackerManager } from './components/TrackerManager';
import { addEvs } from './utils/evCalculations';
import { fetchPokemonDetails } from './utils/pokemonApi';
import { DEFAULT_VERSION_GROUP, getGenerationForVersionGroup, getVersionGroupForGeneration, migrateStoredTrackings, normalizeVersionGroup } from './utils/gameVersions';
import { getTranslations } from './i18n/translations';

import './App.css'

const EMPTY_LIST = [];

export default function App() {
  const [trackings, setTrackings] = useLocalStorage('poke_app_trackings', () => {
    const legacyTeam = JSON.parse(localStorage.getItem('poke_app_team') || '[]');
    if (!Array.isArray(legacyTeam) || legacyTeam.length === 0) return [];

    return [{
      id: 'legacy-tracking',
      name: 'Il mio primo tracking',
      versionGroup: getVersionGroupForGeneration(Number(localStorage.getItem('poke_app_generation') || 8)),
      team: legacyTeam,
      recentWilds: JSON.parse(localStorage.getItem('poke_app_recent_wilds') || '[]')
    }];
  }, migrateStoredTrackings);
  const [activeTrackingId, setActiveTrackingId] = useLocalStorage('poke_app_active_tracking', null);
  const activeTracking = trackings.find(tracking => tracking.id === activeTrackingId);

  const updateActiveTracking = useCallback((updater) => {
    if (!activeTrackingId) return;
    setTrackings(current => current.map(tracking => {
      if (tracking.id !== activeTrackingId) return tracking;
      const changes = typeof updater === 'function' ? updater(tracking) : updater;
      return { ...tracking, ...changes };
    }));
  }, [activeTrackingId, setTrackings]);

  // Ricerca selvatico
  const [targetQuery, setTargetQuery] = useState(''); // Pokémon selvatico affrontato
  const [searchInput, setSearchInput] = useState('');

  // Ricerca per aggiungere un Pokémon al Team
  const [teamSearchInput, setTeamSearchInput] = useState('');

  const team = activeTracking?.team || EMPTY_LIST;
  const setTeam = useCallback((updater) => {
    updateActiveTracking(tracking => ({
      team: typeof updater === 'function' ? updater(tracking.team) : updater
    }));
  }, [updateActiveTracking]);

  // Stato per salvare l'ultimo snapshot della squadra prima di un attacco
  const [previousTeam, setPreviousTeam] = useState(null);

  // Lista degli ultimi Pokémon selvatici sconfitti (max 10) con caricamento iniziale dallo Storage Locale
  const recentWilds = activeTracking?.recentWilds || EMPTY_LIST;
  const setRecentWilds = useCallback((updater) => {
    updateActiveTracking(tracking => ({
      recentWilds: typeof updater === 'function' ? updater(tracking.recentWilds) : updater
    }));
  }, [updateActiveTracking]);

  const handleSaveStateForUndo = () => setPreviousTeam(team);

  const versionGroup = normalizeVersionGroup(activeTracking?.versionGroup);
  const generation = getGenerationForVersionGroup(versionGroup);
  const setVersionGroup = useCallback((nextVersionGroup) => {
    updateActiveTracking({ versionGroup: normalizeVersionGroup(nextVersionGroup) });
  }, [updateActiveTracking]);

  const [language, setLanguage] = useLocalStorage('poke_app_language', 'it');
  const fileInputRef = useRef(null);
  const t = getTranslations(language);

  // Lista dei nomi di tutti i pokemon per la ricerca con debounce
  const allPokemonNames = usePokemonList();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 0, tolerance: 5 } })
  );

  const { data: wildPokemon, loading: wildLoading, error: wildError } = usePokemon(targetQuery, versionGroup);
  const wildSuggestions = usePokemonSuggestions(searchInput, allPokemonNames);
  const teamSuggestions = usePokemonSuggestions(teamSearchInput, allPokemonNames);

  const handleCreateTracking = useCallback((name) => {
    const id = `tracking-${Date.now()}`;
    setTrackings(current => [...current, { id, name, versionGroup: DEFAULT_VERSION_GROUP, team: [], recentWilds: [] }]);
    setActiveTrackingId(id);
    setPreviousTeam(null);
  }, [setActiveTrackingId, setPreviousTeam, setTrackings]);

  const handleOpenTracking = useCallback((id) => {
    setActiveTrackingId(id);
    setPreviousTeam(null);
    setTargetQuery('');
    setSearchInput('');
  }, [setActiveTrackingId, setPreviousTeam, setSearchInput, setTargetQuery]);

  const handleCloseTracking = useCallback(() => {
    setActiveTrackingId(null);
    setPreviousTeam(null);
  }, [setActiveTrackingId, setPreviousTeam]);

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
  }, [setTeam, setTeamSearchInput]);

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
        powerItemKey: member.powerItemKey || 'none',
        generation
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
  }, [generation, setPreviousTeam, setRecentWilds, setTeam, team, wildPokemon]);

  // Funzione di Undo per ripristinare la squadra a prima dell'ultima vittoria
  const handleUndo = useCallback(() => {
    if (previousTeam) {
      setTeam(previousTeam);
      setPreviousTeam(null); // Resetta l'undo fino alla prossima azione
    }
  }, [previousTeam, setPreviousTeam, setTeam]);

  // Funzione per Esportare i Dati in JSON
    const handleExportData = useCallback(() => {
      const dataToExport = {
        version: 2,
        exportedAt: new Date().toISOString(),
        versionGroup,
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
    }, [recentWilds, team, versionGroup]);

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
              const fallbackVersionGroup = Number.isInteger(parsed.generation) && parsed.generation >= 3 && parsed.generation <= 9
                ? getVersionGroupForGeneration(parsed.generation)
                : versionGroup;
              setVersionGroup(normalizeVersionGroup(parsed.versionGroup, fallbackVersionGroup));
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
    }, [setPreviousTeam, setRecentWilds, setTeam, setVersionGroup, t.app.importError, t.app.importSuccess, t.app.invalidFile, versionGroup]);

  const handleDragEnd = useCallback(({ active, over }) => {
    if (!over || active.id === over.id) return;

    setPreviousTeam(team);
    setTeam(currentTeam => {
      const oldIndex = currentTeam.findIndex(member => member.instanceId === active.id);
      const newIndex = currentTeam.findIndex(member => member.instanceId === over.id);
      return oldIndex === -1 || newIndex === -1
        ? currentTeam
        : arrayMove(currentTeam, oldIndex, newIndex);
    });
  }, [setPreviousTeam, setTeam, team]);

  if (!activeTracking) {
    return (
      <div className="app-root manager-root">
        <TrackerManager
          trackings={trackings}
          setTrackings={setTrackings}
          language={language}
          onCreate={handleCreateTracking}
          onOpen={handleOpenTracking}
        />
        <AppFooter language={language} setLanguage={setLanguage} />
      </div>
    );
  }

  return (
      <div className="app-root">

        <AppHeader
          trackingName={activeTracking.name}
          onBack={handleCloseTracking}
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
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={team.map(member => member.instanceId)} strategy={rectSortingStrategy}>
              <div className="team-grid">
                {team.map(member => (
                  <SortablePokemonCard
                    key={member.instanceId}
                    pokemon={member}
                    generation={generation}
                    language={language}
                    onUpdate={handleUpdateMember}
                    onDelete={handleDeleteMember}
                    onSaveStateForUndo={handleSaveStateForUndo}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        <AppFooter
          versionGroup={versionGroup}
          setVersionGroup={setVersionGroup}
          language={language}
          setLanguage={setLanguage}
          onExportData={handleExportData}
          onImportData={handleImportData}
          fileInputRef={fileInputRef}
        />

      </div>
    );
}
